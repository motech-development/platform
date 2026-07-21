import { readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const deliveryDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(deliveryDirectory, '../..');

const catalogUnitFields = new Set([
  'id',
  'workspace',
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

  if (affected.length === 0) {
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

export function createReleasePlan(catalog, workspaceManifests, input) {
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

  return {
    target: input.target,
    units: plannedUnits(catalog, ordered, input.releaseTags),
  };
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
    baseNeed: 'unit-test',
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

function rewriteJob(workflow, legacyJobId, unitId, needs) {
  const escapedJobId = legacyJobId.replaceAll('-', '\\-');
  const jobPattern = new RegExp(
    `^  ${escapedJobId}:\\n[\\s\\S]*?(?=^  [a-zA-Z0-9_-]+:|(?![\\s\\S]))`,
    'm',
  );
  const match = workflow.match(jobPattern);
  if (!match) {
    throw new Error(`template is missing job "${legacyJobId}"`);
  }

  const needsBlock = `    needs:\n${needs.map((need) => `      - ${need}\n`).join('')}`;
  const rewritten = match[0]
    .replace(`  ${legacyJobId}:\n`, `  ${unitId}:\n`)
    .replace(/^    needs:(?: [^\n]+)?\n(?:      (?:- |# ).*\n)*/m, needsBlock);

  return workflow.replace(jobPattern, rewritten);
}

function renderWorkflow(template, definition, catalog, workspaceManifests) {
  let workflow = definition.splitCoreInfrastructure
    ? splitCoreInfrastructureJob(template)
    : template;
  const graph = createJobGraph(catalog, workspaceManifests, definition.target, {
    reverse: definition.reverse,
  });

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
    workflow = rewriteJob(workflow, legacyJobId, id, needs);
  }

  return `# GENERATED FILE — DO NOT EDIT. Run \`node .github/delivery/generate.mjs\`.\n${workflow}`;
}

export async function generateWorkflows({ write = true } = {}) {
  const [catalog, workspaceManifests] = await Promise.all([
    loadCatalog(),
    loadWorkspaceManifests(),
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
