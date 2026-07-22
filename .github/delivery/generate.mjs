import { execFile } from 'node:child_process';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { promisify } from 'node:util';

const deliveryDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(deliveryDirectory, '../..');
const execFileAsync = promisify(execFile);

const catalogUnitFields = new Set([
  'id',
  'workspace',
  'path',
  'targets',
  'dependsOn',
  'expectedStacks',
  'exception',
]);
const supportedTargets = new Set(['preview', 'develop', 'production']);
const stableIdentifier = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const expectedStackName = /^[A-Za-z][A-Za-z0-9-]*\{stage\}[A-Za-z0-9-]*$/;

function duplicateValue(values) {
  const seen = new Set();
  return values.find((value) => {
    if (seen.has(value)) {
      return true;
    }
    seen.add(value);
    return false;
  });
}

function workspaceDependencies(manifest, knownWorkspaces) {
  const declared = {
    ...(manifest.dependencies ?? {}),
    ...(manifest.devDependencies ?? {}),
    ...(manifest.peerDependencies ?? {}),
    ...(manifest.optionalDependencies ?? {}),
  };

  return Object.entries(declared)
    .filter(
      ([name, version]) =>
        knownWorkspaces.has(name) &&
        typeof version === 'string' &&
        version.startsWith('workspace:'),
    )
    .map(([name]) => name);
}

function assertAcyclic(graph) {
  const visited = new Set();
  const visiting = new Set();

  function visit(id, path) {
    if (visiting.has(id)) {
      const cycleStart = path.indexOf(id);
      throw new Error(
        `dependency cycle: ${[...path.slice(cycleStart), id].join(' -> ')}`,
      );
    }
    if (visited.has(id)) {
      return;
    }

    visiting.add(id);
    for (const dependency of graph.get(id) ?? []) {
      visit(dependency, [...path, id]);
    }
    visiting.delete(id);
    visited.add(id);
  }

  for (const id of graph.keys()) {
    visit(id, []);
  }
}

async function childDirectories(directory) {
  return (await readdir(directory, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(directory, entry.name));
}

async function readWorkspaceManifest(directory) {
  try {
    const contents = await readFile(join(directory, 'package.json'), 'utf8');
    return {
      ...JSON.parse(contents),
      relativePath: relative(repositoryRoot, directory),
    };
  } catch (error) {
    if (error.code === 'ENOENT') {
      return undefined;
    }
    throw error;
  }
}

export async function loadWorkspaceManifests() {
  const applicationGroups = await childDirectories(
    join(repositoryRoot, 'applications'),
  );
  const applicationDirectories = (
    await Promise.all(applicationGroups.map(childDirectories))
  ).flat();
  const packageDirectories = await childDirectories(
    join(repositoryRoot, 'packages'),
  );

  return (
    await Promise.all(
      [...applicationDirectories, ...packageDirectories].map(
        readWorkspaceManifest,
      ),
    )
  ).filter(Boolean);
}

export async function loadCatalog() {
  return JSON.parse(
    await readFile(join(deliveryDirectory, 'catalog.json'), 'utf8'),
  );
}

function dependencyGraph(catalog, workspaceManifests, target) {
  validateCatalog(catalog, workspaceManifests);
  const manifestsByName = new Map(
    workspaceManifests.map((manifest) => [manifest.name, manifest]),
  );
  const knownWorkspaces = new Set(manifestsByName.keys());
  const unitsByWorkspace = new Map(
    catalog.units.map((unit) => [unit.workspace, unit]),
  );
  const targetUnits = catalog.units.filter((unit) =>
    unit.targets.includes(target),
  );
  const targetIdentifiers = new Set(targetUnits.map((unit) => unit.id));

  return new Map(
    targetUnits.map((unit) => {
      const inferred = workspaceDependencies(
        manifestsByName.get(unit.workspace),
        knownWorkspaces,
      )
        .map((workspace) => unitsByWorkspace.get(workspace)?.id)
        .filter(Boolean);
      return [
        unit.id,
        [...new Set([...unit.dependsOn, ...inferred])].filter((dependency) =>
          targetIdentifiers.has(dependency),
        ),
      ];
    }),
  );
}

function workspaceDependsOn(
  workspace,
  changedWorkspaces,
  manifestsByName,
  knownWorkspaces,
  visited = new Set(),
) {
  if (changedWorkspaces.has(workspace)) {
    return true;
  }
  if (visited.has(workspace)) {
    return false;
  }

  visited.add(workspace);
  const manifest = manifestsByName.get(workspace);
  return workspaceDependencies(manifest, knownWorkspaces).some((dependency) =>
    workspaceDependsOn(
      dependency,
      changedWorkspaces,
      manifestsByName,
      knownWorkspaces,
      visited,
    ),
  );
}

function affectedUnits(catalog, workspaceManifests, target, changedWorkspaces) {
  const manifestsByName = new Map(
    workspaceManifests.map((manifest) => [manifest.name, manifest]),
  );
  const knownWorkspaces = new Set(manifestsByName.keys());
  const changed = new Set(changedWorkspaces);

  return catalog.units
    .filter((unit) => unit.targets.includes(target))
    .filter((unit) =>
      workspaceDependsOn(
        unit.workspace,
        changed,
        manifestsByName,
        knownWorkspaces,
      ),
    )
    .map((unit) => unit.id);
}

function isDocumentationFile(filename) {
  return (
    filename.startsWith('docs/') ||
    filename.startsWith('.github/docs/') ||
    filename.startsWith('.agents/') ||
    /(?:^|\/)(?:README|CONTEXT|AGENTS)\.md$/i.test(filename) ||
    /\.(?:md|mdx)$/i.test(filename)
  );
}

function affectsEveryPreviewWorkspace(filename) {
  return (
    filename === 'package.json' ||
    filename === 'packages.txt' ||
    filename === 'tsconfig.json' ||
    filename === 'yarn.lock' ||
    filename === '.nvmrc' ||
    filename === '.yarnrc.yml' ||
    filename.startsWith('.github/delivery/') ||
    filename.startsWith('.yarn/patches/') ||
    filename.startsWith('applications/') ||
    filename.startsWith('packages/') ||
    filename.startsWith('scripts/')
  );
}

export function createPreviewImpact(catalog, workspaceManifests, changedFiles) {
  validateCatalog(catalog, workspaceManifests);
  const nonDocumentationFiles = changedFiles.filter(
    (filename) =>
      typeof filename === 'string' && !isDocumentationFile(filename),
  );

  if (nonDocumentationFiles.length === 0) {
    return { runtimeAffected: false, changedWorkspaces: [] };
  }

  const manifestsByPath = [...workspaceManifests].sort(
    (left, right) => right.relativePath.length - left.relativePath.length,
  );
  const changedWorkspaces = new Set();
  let affectsEveryWorkspace = false;

  for (const filename of nonDocumentationFiles) {
    const manifest = manifestsByPath.find(
      ({ relativePath }) =>
        filename === `${relativePath}/package.json` ||
        filename.startsWith(`${relativePath}/`),
    );
    if (manifest) {
      changedWorkspaces.add(manifest.name);
    } else if (affectsEveryPreviewWorkspace(filename)) {
      // Delivery, dependency, and newly added workspace files cannot be scoped
      // safely from an existing manifest, so they select the full workspace graph.
      affectsEveryWorkspace = true;
    }
  }

  if (!affectsEveryWorkspace && changedWorkspaces.size === 0) {
    return { runtimeAffected: false, changedWorkspaces: [] };
  }

  return {
    runtimeAffected: true,
    changedWorkspaces: affectsEveryWorkspace
      ? workspaceManifests.map(({ name }) => name)
      : [...changedWorkspaces],
  };
}

export function expandDependants(selectedIdentifiers, graph) {
  const selected = new Set(selectedIdentifiers);
  let changed = true;

  while (changed) {
    changed = false;
    for (const [id, dependencies] of graph) {
      if (
        !selected.has(id) &&
        dependencies.some((dependency) => selected.has(dependency))
      ) {
        selected.add(id);
        changed = true;
      }
    }
  }

  return selected;
}

export function dependencyOrder(graph, selectedIdentifiers = graph.keys()) {
  const selected = new Set(selectedIdentifiers);
  const ordered = [];
  const visited = new Set();

  function visit(id) {
    if (visited.has(id) || !selected.has(id)) {
      return;
    }
    for (const dependency of graph.get(id) ?? []) {
      visit(dependency);
    }
    visited.add(id);
    ordered.push(id);
  }

  for (const id of graph.keys()) {
    visit(id);
  }
  return ordered;
}

export function createJobGraph(
  catalog,
  workspaceManifests,
  target,
  { reverse = false } = {},
) {
  const graph = dependencyGraph(catalog, workspaceManifests, target);
  if (!reverse) {
    return dependencyOrder(graph).map((id) => ({
      id,
      needs: graph.get(id),
    }));
  }

  return dependencyOrder(graph)
    .reverse()
    .map((id) => ({
      id,
      needs: [...graph]
        .filter(([, dependencies]) => dependencies.includes(id))
        .map(([dependant]) => dependant),
    }));
}

export function createPreviewPlan(catalog, workspaceManifests, input) {
  const target = 'preview';
  const graph = dependencyGraph(catalog, workspaceManifests, target);
  const affected = affectedUnits(
    catalog,
    workspaceManifests,
    target,
    input.changedWorkspaces,
  );

  if (input.runtimeAffected === false) {
    return { target, units: [] };
  }

  const creationEvents = new Set(['opened', 'ready_for_review', 'reopened']);
  if (creationEvents.has(input.lifecycle)) {
    return { target, units: dependencyOrder(graph) };
  }

  const existingStacks = new Set(input.existingStacks);
  const missingStacks = catalog.units
    .filter((unit) => unit.targets.includes(target))
    .filter((unit) =>
      unit.expectedStacks.some(
        (stack) =>
          !existingStacks.has(stack.replaceAll('{stage}', input.stage)),
      ),
    )
    .map((unit) => unit.id);
  const selected = expandDependants([...affected, ...missingStacks], graph);

  return { target, units: dependencyOrder(graph, selected) };
}

function plannedUnits(catalog, orderedIdentifiers, releaseTags) {
  const unitsByIdentifier = new Map(
    catalog.units.map((unit) => [unit.id, unit]),
  );

  return orderedIdentifiers.map((id) => {
    const unit = unitsByIdentifier.get(id);
    const tag = releaseTags[unit.workspace];
    if (
      typeof tag !== 'string' ||
      !tag.startsWith(`${unit.workspace}@`) ||
      tag === `${unit.workspace}@`
    ) {
      throw new Error(
        `deployment unit "${id}" requires Release "${unit.workspace}@<version>"`,
      );
    }
    return { id, workspace: unit.workspace, tag };
  });
}

function successfulRelease(releases, workspace, boundary) {
  const prefix = `${workspace}@`;

  return releases
    .filter(
      (release) =>
        release?.published === true &&
        release.reachable === true &&
        typeof release.tag === 'string' &&
        release.tag.startsWith(prefix) &&
        release.tag.length > prefix.length &&
        (boundary === undefined || release.commit === boundary),
    )
    .sort(
      (left, right) =>
        (left.historyPosition ?? Number.MAX_SAFE_INTEGER) -
        (right.historyPosition ?? Number.MAX_SAFE_INTEGER),
    )[0];
}

function releasePlannedUnits(
  catalog,
  orderedIdentifiers,
  releases,
  boundary,
  requiredAtBoundary,
) {
  const unitsByIdentifier = new Map(
    catalog.units.map((unit) => [unit.id, unit]),
  );

  return orderedIdentifiers.map((id) => {
    const unit = unitsByIdentifier.get(id);
    const release = successfulRelease(
      releases,
      unit.workspace,
      requiredAtBoundary.has(id) ? boundary : undefined,
    );
    if (!release) {
      const boundaryRequirement = requiredAtBoundary.has(id)
        ? ` at boundary "${boundary}"`
        : ` reachable from boundary "${boundary}"`;
      throw new Error(
        `deployment unit "${id}" requires successful Release "${unit.workspace}@<version>"${boundaryRequirement}`,
      );
    }
    return { id, workspace: unit.workspace, tag: release.tag };
  });
}

export function createReleasePlan(catalog, workspaceManifests, input) {
  if (input.boundaryAccepted !== true) {
    throw new Error(
      `main commit boundary "${input.boundary}" has not completed Release successfully`,
    );
  }

  const graph = dependencyGraph(catalog, workspaceManifests, input.target);
  const initiallySelected = input.full
    ? [...graph.keys()]
    : affectedUnits(
        catalog,
        workspaceManifests,
        input.target,
        input.changedWorkspaces,
      );
  const selected = expandDependants(initiallySelected, graph);
  const ordered = dependencyOrder(graph, selected);
  const requiredAtBoundary = input.full
    ? new Set()
    : new Set(initiallySelected);
  const units = releasePlannedUnits(
    catalog,
    ordered,
    input.releases,
    input.boundary,
    requiredAtBoundary,
  );

  return {
    boundary: input.boundary,
    target: input.target,
    tags: Object.fromEntries(
      units.map(({ workspace, tag }) => [workspace, tag]),
    ),
    units,
  };
}

async function git(arguments_) {
  const { stdout } = await execFileAsync('git', arguments_, {
    cwd: repositoryRoot,
    maxBuffer: 10 * 1024 * 1024,
  });
  return stdout.trim();
}

async function isAncestor(ancestor, descendant) {
  try {
    await git(['merge-base', '--is-ancestor', ancestor, descendant]);
    return true;
  } catch (error) {
    if (error.code === 1) {
      return false;
    }
    throw error;
  }
}

function workspaceForReleaseTag(tag, workspaceManifests) {
  return workspaceManifests
    .map(({ name }) => name)
    .sort((left, right) => right.length - left.length)
    .find(
      (workspace) =>
        tag.startsWith(`${workspace}@`) && tag.length > `${workspace}@`.length,
    );
}

async function repositoryReleases(
  releaseMetadata,
  workspaceManifests,
  boundary,
) {
  const historyPositions = new Map(
    (await git(['rev-list', boundary]))
      .split('\n')
      .filter(Boolean)
      .map((commit, index) => [commit, index]),
  );
  const releases = [];

  for (const metadata of releaseMetadata) {
    if (
      metadata?.draft === true ||
      metadata?.prerelease === true ||
      typeof metadata?.publishedAt !== 'string' ||
      typeof metadata?.tag !== 'string'
    ) {
      continue;
    }
    const workspace = workspaceForReleaseTag(metadata.tag, workspaceManifests);
    if (!workspace) {
      continue;
    }

    let commit;
    try {
      commit = await git(['rev-list', '-n', '1', `${metadata.tag}^{}`]);
    } catch {
      continue;
    }
    releases.push({
      tag: metadata.tag,
      commit,
      historyPosition: historyPositions.get(commit),
      published: true,
      reachable: historyPositions.has(commit),
      workspace,
    });
  }

  return releases;
}

export async function createRepositoryReleasePlan({
  boundary,
  base,
  full,
  releaseMetadataPath,
}) {
  const [catalog, workspaceManifests, releaseMetadata] = await Promise.all([
    loadCatalog(),
    loadWorkspaceManifests(),
    readFile(releaseMetadataPath, 'utf8').then(JSON.parse),
  ]);
  const resolvedBoundary = await git([
    'rev-parse',
    '--verify',
    `${boundary}^{commit}`,
  ]);
  if (!(await isAncestor(resolvedBoundary, 'origin/main'))) {
    throw new Error(
      `Release boundary "${boundary}" is not reachable from origin/main`,
    );
  }

  const releases = await repositoryReleases(
    releaseMetadata,
    workspaceManifests,
    resolvedBoundary,
  );
  const boundaryReleaseWorkspaces = releases
    .filter(({ commit }) => commit === resolvedBoundary)
    .map(({ workspace }) => workspace);
  let changedWorkspaces = [];
  if (!full) {
    const resolvedBase = await git([
      'rev-parse',
      '--verify',
      `${base}^{commit}`,
    ]);
    const changedFiles = (
      await git([
        'diff',
        '--name-only',
        `${resolvedBase}...${resolvedBoundary}`,
      ])
    )
      .split('\n')
      .filter(Boolean);
    const impact = createPreviewImpact(
      catalog,
      workspaceManifests,
      changedFiles,
    );
    changedWorkspaces = [
      ...new Set([...impact.changedWorkspaces, ...boundaryReleaseWorkspaces]),
    ];
  }

  return createReleasePlan(catalog, workspaceManifests, {
    boundary: resolvedBoundary,
    boundaryAccepted: true,
    target: 'production',
    full,
    changedWorkspaces,
    releases,
  });
}

function successfulDeploymentRef(deployments, environment, unitId) {
  return deployments.find(
    (deployment) =>
      deployment &&
      deployment.environment === environment &&
      deployment.task === `deploy:${unitId}` &&
      deployment.status === 'success' &&
      typeof deployment.ref === 'string',
  )?.ref;
}

export function createReconciliationPlan(catalog, workspaceManifests, input) {
  const graph = dependencyGraph(catalog, workspaceManifests, input.target);
  const targetUnits = catalog.units.filter((unit) =>
    unit.targets.includes(input.target),
  );
  const existingStacks = new Set(input.existingStacks);
  const selected = targetUnits
    .filter((unit) => {
      const desiredTag = input.desiredTags[unit.workspace];
      const deployedTag = successfulDeploymentRef(
        input.deployments,
        input.environment,
        unit.id,
      );
      const stackMissing = unit.expectedStacks.some(
        (stack) =>
          !existingStacks.has(stack.replaceAll('{stage}', input.stage)),
      );
      return deployedTag !== desiredTag || stackMissing;
    })
    .map((unit) => unit.id);
  const expanded = expandDependants(selected, graph);
  const ordered = dependencyOrder(graph, expanded);

  return {
    target: input.target,
    environment: input.environment,
    units: plannedUnits(catalog, ordered, input.desiredTags),
  };
}

const workflowDefinitions = [
  {
    filename: 'deploy-to-environment.yml',
    target: 'preview',
    baseNeed: 'setup',
    selective: true,
    legacyJobIds: {
      'core-anti-virus': 'anti-virus',
      'accounts-storage': 'accounts-storage',
      'accounts-data': 'accounts-data',
      'accounts-warm-up': 'accounts-warm-up',
      'accounts-notifications': 'accounts-notifications',
      'accounts-queue': 'accounts-queue',
      'accounts-reports': 'accounts-reports',
      'accounts-api': 'accounts-api',
    },
  },
  {
    filename: 'deploy-to-develop.yml',
    target: 'develop',
    baseNeed: 'setup',
    legacyJobIds: {
      'core-anti-virus': 'anti-virus',
      'accounts-storage': 'accounts-storage',
      'accounts-data': 'accounts-data',
      'accounts-notifications': 'accounts-notifications',
      'accounts-queue': 'accounts-queue',
      'accounts-reports': 'accounts-reports',
      'accounts-api': 'accounts-api',
    },
  },
  {
    filename: 'deploy-to-production.yml',
    target: 'production',
    baseNeed: 'setup',
    splitCoreInfrastructure: true,
    legacyJobIds: {
      'component-library': 'deploy-storybook',
      'core-anti-virus': 'deploy-anti-virus',
      'core-infrastructure': 'deploy-infrastructure',
      'core-communications': 'deploy-core-communications',
      'accounts-infrastructure': 'deploy-accounts-infrastructure',
      'accounts-storage': 'deploy-accounts-storage',
      'accounts-data': 'deploy-accounts-data',
      'accounts-warm-up': 'deploy-accounts-warm-up',
      'accounts-notifications': 'deploy-accounts-notifications',
      'accounts-queue': 'deploy-accounts-queue',
      'accounts-reports': 'deploy-accounts-reports',
      'accounts-api': 'deploy-accounts-api',
      'accounts-client': 'build-accounts-client',
    },
  },
  {
    filename: 'teardown-environment.yml',
    target: 'preview',
    baseNeed: 'setup',
    reverse: true,
    teardown: true,
    legacyJobIds: {
      'core-anti-virus': 'anti-virus',
      'accounts-storage': 'accounts-storage',
      'accounts-data': 'accounts-data',
      'accounts-warm-up': 'accounts-warm-up',
      'accounts-notifications': 'accounts-notifications',
      'accounts-queue': 'accounts-queue',
      'accounts-reports': 'accounts-reports',
      'accounts-api': 'accounts-api',
    },
  },
];

function splitCoreInfrastructureJob(workflow) {
  const jobPattern =
    /^  deploy-infrastructure:\n[\s\S]*?(?=^  deploy-accounts-storage:)/m;
  const match = workflow.match(jobPattern);
  if (!match) {
    throw new Error('production template is missing deploy-infrastructure');
  }

  const original = match[0];
  const infrastructure = original
    .replace(
      '  deploy-infrastructure:\n',
      '  deploy-infrastructure:\n    name: Deploy core infrastructure\n\n',
    )
    .replace('            ./applications/core/comms/node_modules/.cache\n', '')
    .replace('            ./applications/core/comms/.serverless\n', '')
    .replace(
      /\n      - name: Deploy comms infrastructure\n        run: yarn workspace @core\/comms deploy --stage \$STAGE\n/,
      '',
    );
  const communications = original
    .replace(
      '  deploy-infrastructure:\n',
      '  deploy-core-communications:\n    name: Deploy core communications\n\n',
    )
    .replace('            ./applications/core/infrastructure/.serverless\n', '')
    .replaceAll('core-v4-', 'core-comms-v4-')
    .replace(
      /\n      - name: Deploy core infrastructure\n        run: yarn workspace @core\/infrastructure deploy --stage \$STAGE\n/,
      '',
    );

  return workflow.replace(
    jobPattern,
    `${infrastructure.trimEnd()}\n\n${communications.trimEnd()}\n\n`,
  );
}

function workflowJobPattern(jobId) {
  const escapedJobId = jobId.replaceAll('-', '\\-');
  return new RegExp(
    `^  ${escapedJobId}:\\n[\\s\\S]*?(?=^  [a-zA-Z0-9_-]+:|(?![\\s\\S]))`,
    'm',
  );
}

function removeJob(workflow, jobId) {
  const pattern = workflowJobPattern(jobId);
  if (!pattern.test(workflow)) {
    throw new Error(`template is missing job "${jobId}"`);
  }
  return workflow.replace(pattern, '');
}

function removeNeedsReference(workflow, jobId) {
  const escapedJobId = jobId.replaceAll('-', '\\-');
  return workflow
    .replace(new RegExp(`^      - ${escapedJobId}\\n`, 'gm'), '')
    .replace(new RegExp(`^    needs: ${escapedJobId}\\n`, 'gm'), '')
    .replace(/^    needs:\n(?=\n|    \S)/gm, '');
}

function validateWorkflowReferences(workflow, filename) {
  const jobsMarker = '\njobs:\n';
  const jobsStart = workflow.indexOf(jobsMarker);
  if (jobsStart === -1) {
    throw new Error(`${filename} is missing jobs`);
  }
  const jobs = workflow.slice(jobsStart + jobsMarker.length);
  const jobIds = new Set(
    [...jobs.matchAll(/^  ([a-zA-Z0-9_-]+):$/gm)].map(([, jobId]) => jobId),
  );

  for (const jobId of jobIds) {
    const [job] = jobs.match(workflowJobPattern(jobId));
    const scalarNeed = job.match(/^    needs: ([a-zA-Z0-9_-]+)$/m)?.[1];
    const listNeeds = [...job.matchAll(/^      - ([a-zA-Z0-9_-]+)$/gm)].map(
      ([, dependency]) => dependency,
    );
    for (const dependency of scalarNeed ? [scalarNeed] : listNeeds) {
      if (!jobIds.has(dependency)) {
        throw new Error(
          `${filename} job "${jobId}" needs unknown job "${dependency}"`,
        );
      }
    }
  }
}

function injectTeardownGuard(job, unit) {
  const firstCleanupStep = job.match(
    /^      - name: (?:Clear bucket|Teardown)$/m,
  );
  if (!firstCleanupStep) {
    throw new Error(`teardown job "${unit.id}" has no cleanup step`);
  }

  const stackNames = unit.expectedStacks
    .map((stack) => `"${stack.replaceAll('{stage}', '${STAGE}')}"`)
    .join(' ');
  const guard = `      - name: Check for resources
        id: resources
        shell: bash
        run: |
          found=false
          for stack in ${stackNames}; do
            if output="$(aws cloudformation describe-stacks --stack-name "$stack" 2>&1)"; then
              found=true
            elif [[ "$output" != *"does not exist"* ]]; then
              echo "$output" >&2
              exit 1
            fi
          done
          echo "found=$found" >> "$GITHUB_OUTPUT"

`;

  return job
    .replace(firstCleanupStep[0], `${guard}${firstCleanupStep[0]}`)
    .replace(/^        continue-on-error: true\n/gm, '')
    .replace(
      /^(      - name: (?:Clear bucket|Teardown)\n)/gm,
      `$1        if: steps.resources.outputs.found == 'true'\n`,
    );
}

function planSelectionCondition(
  planUnitIds,
  unitId,
  dependencies,
  requiredConditions = [],
) {
  const dependencyConditions = dependencies.map(
    (dependency) =>
      `(!contains(${planUnitIds}, '${dependency}') || needs.${dependency}.result == 'success')`,
  );

  return [
    'always()',
    `contains(${planUnitIds}, '${unitId}')`,
    ...requiredConditions,
    ...dependencyConditions,
  ].join(' && ');
}

function decoratePreviewJob(job, unit, dependencies) {
  const planUnits = "fromJSON(needs.setup.outputs.units || '[]')";
  const condition = planSelectionCondition(planUnits, unit.id, dependencies, [
    "needs.setup.result == 'success'",
  ]);

  return job
    .replace(/^(    name: [^\n]+\n)/m, `$1\n    if: ${condition}\n`)
    .replaceAll(
      '        uses: actions/checkout@v6\n',
      '        uses: actions/checkout@v6\n        with:\n          ref: ${{ github.event.pull_request.head.sha }}\n',
    );
}

function decorateReleaseJob(job, unit, dependencies) {
  const planUnitIds = 'fromJSON(inputs.release-plan).units.*.id';
  const condition = planSelectionCondition(planUnitIds, unit.id, dependencies);
  const releaseRef = `\${{ fromJSON(inputs.release-plan).tags['${unit.workspace}'] }}`;

  return job
    .replace(
      new RegExp(`^(  ${unit.id}:\\n(?:    name: [^\\n]+\\n)?)`, 'm'),
      (header) =>
        `${header}${header.includes('\n    name:') ? '\n' : ''}    if: ${condition}\n`,
    )
    .replace(
      /^        uses: actions\/checkout@v6\n(        with:\n)?/gm,
      (match, withBlock) =>
        withBlock
          ? `${match}          ref: ${releaseRef}\n`
          : `${match}        with:\n          ref: ${releaseRef}\n`,
    );
}

function decorateTeardownJob(job, unit) {
  return injectTeardownGuard(
    job.replace(
      /^    if: [^\n]+$/m,
      `    if: always() && github.actor != 'dependabot[bot]' && !contains(needs.*.result, 'failure') && !contains(needs.*.result, 'cancelled') && !contains(needs.*.result, 'skipped')`,
    ),
    unit,
  );
}

function rewriteJob(workflow, legacyJobId, unit, needs, definition) {
  const jobPattern = workflowJobPattern(legacyJobId);
  const match = workflow.match(jobPattern);
  if (!match) {
    throw new Error(`template is missing job "${legacyJobId}"`);
  }

  const needsBlock = `    needs:\n${needs.map((need) => `      - ${need}\n`).join('')}`;
  let rewritten = match[0]
    .replace(`  ${legacyJobId}:\n`, `  ${unit.id}:\n`)
    .replace(/^    needs:(?: [^\n]+)?\n(?:      (?:- |# ).*\n)*/m, needsBlock);

  if (definition.selective) {
    rewritten = decoratePreviewJob(
      rewritten,
      unit,
      needs.filter((need) => need !== definition.baseNeed),
    );
  }
  if (definition.target === 'develop' || definition.target === 'production') {
    rewritten = decorateReleaseJob(
      rewritten,
      unit,
      needs.filter((need) => need !== definition.baseNeed),
    );
  }
  if (definition.teardown) {
    rewritten = decorateTeardownJob(rewritten, unit);
  }

  return workflow.replace(jobPattern, rewritten);
}

function renderWorkflow(template, definition, catalog, workspaceManifests) {
  let workflow = definition.splitCoreInfrastructure
    ? splitCoreInfrastructureJob(template)
    : template;
  const graph = createJobGraph(catalog, workspaceManifests, definition.target, {
    reverse: definition.reverse,
  });
  const generatedUnitIds = new Set(graph.map(({ id }) => id));
  const unitsByIdentifier = new Map(
    catalog.units.map((unit) => [unit.id, unit]),
  );
  const excludedJobIds = [];

  for (const [id, legacyJobId] of Object.entries(definition.legacyJobIds)) {
    if (!generatedUnitIds.has(id)) {
      workflow = removeJob(workflow, legacyJobId);
      excludedJobIds.push(id, legacyJobId);
    }
  }
  for (const excludedJobId of new Set(excludedJobIds)) {
    workflow = removeNeedsReference(workflow, excludedJobId);
  }

  for (const { id, needs: unitNeeds } of graph) {
    const legacyJobId = definition.legacyJobIds[id];
    if (!legacyJobId) {
      throw new Error(
        `${definition.filename} has no job template for deployment unit "${id}"`,
      );
    }
    const needs =
      definition.target === 'production' && unitNeeds.length > 0
        ? unitNeeds
        : [definition.baseNeed, ...unitNeeds];
    workflow = rewriteJob(
      workflow,
      legacyJobId,
      unitsByIdentifier.get(id),
      needs,
      definition,
    );
  }

  validateWorkflowReferences(workflow, definition.filename);

  return `# GENERATED FILE — DO NOT EDIT. Run \`node .github/delivery/generate.mjs\`.\n${workflow}`;
}

export async function generateWorkflows({
  write = true,
  catalog: providedCatalog,
  workspaceManifests: providedWorkspaceManifests,
} = {}) {
  const [catalog, workspaceManifests] = await Promise.all([
    providedCatalog ?? loadCatalog(),
    providedWorkspaceManifests ?? loadWorkspaceManifests(),
  ]);
  validateCatalog(catalog, workspaceManifests);
  const generated = {};

  for (const definition of workflowDefinitions) {
    const template = await readFile(
      join(deliveryDirectory, 'templates', definition.filename),
      'utf8',
    );
    const workflow = renderWorkflow(
      template,
      definition,
      catalog,
      workspaceManifests,
    );
    generated[definition.filename] = workflow;
    if (write) {
      await writeFile(
        join(repositoryRoot, '.github', 'workflows', definition.filename),
        workflow,
      );
    }
  }

  return generated;
}

export async function checkGeneratedWorkflows() {
  const generated = await generateWorkflows({ write: false });
  const drifted = [];

  for (const [filename, expected] of Object.entries(generated)) {
    try {
      const actual = await readFile(
        join(repositoryRoot, '.github', 'workflows', filename),
        'utf8',
      );
      if (actual !== expected) {
        drifted.push(filename);
      }
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
      drifted.push(filename);
    }
  }

  return drifted;
}

async function main(arguments_) {
  if (arguments_.length === 0) {
    await generateWorkflows();
    console.log('Generated delivery workflows.');
    return;
  }

  if (arguments_.length === 1 && arguments_[0] === '--check') {
    const drifted = await checkGeneratedWorkflows();
    if (drifted.length > 0) {
      throw new Error(
        `generated delivery workflows have drifted: ${drifted.join(', ')}`,
      );
    }
    console.log('Generated delivery workflows are up to date.');
    return;
  }

  if (arguments_.length === 2 && arguments_[0] === '--preview-impact') {
    const [catalog, workspaceManifests, changedFiles] = await Promise.all([
      loadCatalog(),
      loadWorkspaceManifests(),
      readFile(arguments_[1], 'utf8').then((contents) =>
        contents.split('\n').filter(Boolean),
      ),
    ]);
    console.log(
      JSON.stringify(
        createPreviewImpact(catalog, workspaceManifests, changedFiles),
      ),
    );
    return;
  }

  if (arguments_.length === 2 && arguments_[0] === '--preview-plan') {
    const [catalog, workspaceManifests, input] = await Promise.all([
      loadCatalog(),
      loadWorkspaceManifests(),
      readFile(arguments_[1], 'utf8').then(JSON.parse),
    ]);
    console.log(
      JSON.stringify(createPreviewPlan(catalog, workspaceManifests, input)),
    );
    return;
  }

  if (
    arguments_[0] === '--release-plan' &&
    (arguments_.length === 4 || arguments_.length === 5)
  ) {
    const [, boundary, mode, releaseMetadataPath, base] = arguments_;
    if (
      !['full', 'selective'].includes(mode) ||
      (mode === 'selective' && !base)
    ) {
      throw new Error(
        'usage: --release-plan <boundary> <full|selective> <releases.json> [base]',
      );
    }
    console.log(
      JSON.stringify(
        await createRepositoryReleasePlan({
          boundary,
          base,
          full: mode === 'full',
          releaseMetadataPath,
        }),
      ),
    );
    return;
  }

  throw new Error(`unknown arguments: ${arguments_.join(' ')}`);
}

if (
  process.argv[1] &&
  pathToFileURL(resolve(process.argv[1])).href === import.meta.url
) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}

export function validateCatalog(catalog, workspaceManifests) {
  if (!catalog || typeof catalog !== 'object' || Array.isArray(catalog)) {
    throw new Error('catalog must be an object');
  }

  const rootFields = Object.keys(catalog);
  const unknownRootField = rootFields.find((field) => field !== 'units');
  if (unknownRootField) {
    throw new Error(`catalog has unknown field "${unknownRootField}"`);
  }

  if (!Array.isArray(catalog.units)) {
    throw new Error('catalog units must be an array');
  }

  const identifiers = catalog.units.map((unit) => unit.id);
  const duplicateIdentifier = duplicateValue(identifiers);
  if (duplicateIdentifier) {
    throw new Error(
      `duplicate deployment unit identifier "${duplicateIdentifier}"`,
    );
  }

  const knownIdentifiers = new Set(identifiers);
  const manifestsByName = new Map(
    workspaceManifests.map((manifest) => [manifest.name, manifest]),
  );
  const knownWorkspaces = new Set(manifestsByName.keys());
  const unitsByWorkspace = new Map(
    catalog.units.map((unit) => [unit.workspace, unit]),
  );
  const graph = new Map();

  for (const unit of catalog.units) {
    const unknownField = Object.keys(unit).find(
      (field) => !catalogUnitFields.has(field),
    );
    if (unknownField) {
      throw new Error(
        `deployment unit "${unit.id ?? '<unknown>'}" has unknown field "${unknownField}"`,
      );
    }

    if (typeof unit.id !== 'string' || !stableIdentifier.test(unit.id)) {
      throw new Error(`invalid deployment unit identifier "${unit.id}"`);
    }
    if (!manifestsByName.has(unit.workspace)) {
      throw new Error(
        `deployment unit "${unit.id}" references unknown workspace "${unit.workspace}"`,
      );
    }
    if (unit.path !== manifestsByName.get(unit.workspace).relativePath) {
      throw new Error(
        `deployment unit "${unit.id}" has invalid workspace path "${unit.path}"`,
      );
    }
    if (!Array.isArray(unit.targets) || unit.targets.length === 0) {
      throw new Error(`deployment unit "${unit.id}" must support a target`);
    }
    const duplicateTarget = duplicateValue(unit.targets);
    if (duplicateTarget) {
      throw new Error(
        `deployment unit "${unit.id}" has duplicate target "${duplicateTarget}"`,
      );
    }
    for (const target of unit.targets) {
      if (!supportedTargets.has(target)) {
        throw new Error(
          `deployment unit "${unit.id}" has unsupported target "${target}"`,
        );
      }
    }
    if (!Array.isArray(unit.dependsOn)) {
      throw new Error(
        `deployment unit "${unit.id}" dependencies must be an array`,
      );
    }
    const duplicateDependency = duplicateValue(unit.dependsOn);
    if (duplicateDependency) {
      throw new Error(
        `deployment unit "${unit.id}" has duplicate dependency "${duplicateDependency}"`,
      );
    }
    for (const dependency of unit.dependsOn) {
      if (!knownIdentifiers.has(dependency)) {
        throw new Error(
          `deployment unit "${unit.id}" references unknown dependency "${dependency}"`,
        );
      }
    }
    if (!Array.isArray(unit.expectedStacks)) {
      throw new Error(
        `deployment unit "${unit.id}" expected stacks must be an array`,
      );
    }
    const duplicateStack = duplicateValue(unit.expectedStacks);
    if (duplicateStack) {
      throw new Error(
        `deployment unit "${unit.id}" has duplicate expected stack "${duplicateStack}"`,
      );
    }
    for (const stack of unit.expectedStacks) {
      if (typeof stack !== 'string' || !expectedStackName.test(stack)) {
        throw new Error(
          `deployment unit "${unit.id}" has invalid expected stack "${stack}"`,
        );
      }
    }
    if (
      unit.exception !== undefined &&
      (typeof unit.exception !== 'string' || unit.exception.trim() === '')
    ) {
      throw new Error(
        `deployment unit "${unit.id}" exception must explain the non-standard behaviour`,
      );
    }

    const manifestDependencies = workspaceDependencies(
      manifestsByName.get(unit.workspace),
      knownWorkspaces,
    )
      .map((workspace) => unitsByWorkspace.get(workspace)?.id)
      .filter(Boolean);
    for (const dependency of unit.dependsOn) {
      if (manifestDependencies.includes(dependency)) {
        throw new Error(
          `deployment unit "${unit.id}" dependency "${dependency}" is already inferred from workspace manifests`,
        );
      }
    }
    graph.set(unit.id, [
      ...new Set([...unit.dependsOn, ...manifestDependencies]),
    ]);
  }

  assertAcyclic(graph);

  return catalog;
}
