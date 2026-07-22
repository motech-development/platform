import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  checkGeneratedWorkflows,
  createPreviewImpact,
  createPreviewPlan,
  createReconciliationPlan,
  createReleasePlan,
  createJobGraph,
  generateWorkflows,
  loadCatalog,
  loadWorkspaceManifests,
  validateCatalog,
} from './generate.mjs';

const previewFixtures = JSON.parse(
  await readFile(
    new URL('./fixtures/preview-plans.json', import.meta.url),
    'utf8',
  ),
);
const previewImpactFixtures = JSON.parse(
  await readFile(
    new URL('./fixtures/preview-impact.json', import.meta.url),
    'utf8',
  ),
);
const releaseFixture = JSON.parse(
  await readFile(
    new URL('./fixtures/release-plan.json', import.meta.url),
    'utf8',
  ),
);
const reconciliationFixture = JSON.parse(
  await readFile(
    new URL('./fixtures/reconciliation-plan.json', import.meta.url),
    'utf8',
  ),
);
const planningCatalog = JSON.parse(
  await readFile(new URL('./fixtures/catalog.json', import.meta.url), 'utf8'),
);
const planningManifests = JSON.parse(
  await readFile(
    new URL('./fixtures/workspace-manifests.json', import.meta.url),
    'utf8',
  ),
);

const workspaceManifests = [
  {
    name: '@accounts/data',
    relativePath: 'applications/accounts/data',
    dependencies: {
      '@core/runtime': 'workspace:*',
    },
  },
  {
    name: '@core/runtime',
    relativePath: 'packages/runtime',
    dependencies: {},
  },
];

const validCatalog = {
  units: [
    {
      id: 'core-runtime',
      workspace: '@core/runtime',
      path: 'packages/runtime',
      targets: ['preview', 'develop', 'production'],
      dependsOn: [],
      expectedStacks: ['core-{stage}-runtime'],
    },
    {
      id: 'accounts-data',
      workspace: '@accounts/data',
      path: 'applications/accounts/data',
      targets: ['preview', 'develop', 'production'],
      dependsOn: [],
      expectedStacks: ['accounts-{stage}-data'],
    },
  ],
};

test('catalog validation rejects unknown fields', () => {
  const catalog = {
    units: [
      {
        id: 'accounts-data',
        workspace: '@accounts/data',
        targets: ['preview'],
        dependsOn: [],
        expectedStacks: ['accounts-{stage}-data'],
        speculativeOption: true,
      },
    ],
  };

  assert.throws(
    () => validateCatalog(catalog, workspaceManifests),
    /unknown field "speculativeOption"/,
  );
});

test('catalog validation rejects invalid identifiers, references, targets, stacks, and graphs', async (t) => {
  const scenarios = [
    {
      name: 'duplicate identifiers',
      mutate(catalog) {
        catalog.units[1].id = catalog.units[0].id;
      },
      expected: /duplicate deployment unit identifier "core-runtime"/,
    },
    {
      name: 'unstable identifiers',
      mutate(catalog) {
        catalog.units[0].id = 'Core_Runtime';
      },
      expected: /invalid deployment unit identifier "Core_Runtime"/,
    },
    {
      name: 'missing workspaces',
      mutate(catalog) {
        catalog.units[0].workspace = '@core/missing';
      },
      expected: /unknown workspace "@core\/missing"/,
    },
    {
      name: 'invalid workspace paths',
      mutate(catalog) {
        catalog.units[0].path = 'packages/missing';
      },
      expected: /invalid workspace path "packages\/missing"/,
    },
    {
      name: 'unsupported targets',
      mutate(catalog) {
        catalog.units[0].targets.push('staging');
      },
      expected: /unsupported target "staging"/,
    },
    {
      name: 'invalid expected stacks',
      mutate(catalog) {
        catalog.units[0].expectedStacks = ['core production runtime'];
      },
      expected: /invalid expected stack "core production runtime"/,
    },
    {
      name: 'unknown dependencies',
      mutate(catalog) {
        catalog.units[0].dependsOn = ['missing-unit'];
      },
      expected: /unknown dependency "missing-unit"/,
    },
    {
      name: 'duplicate dependencies',
      mutate(catalog) {
        catalog.units[0].dependsOn = ['accounts-data', 'accounts-data'];
      },
      expected: /duplicate dependency "accounts-data"/,
    },
    {
      name: 'cycles',
      mutate(catalog) {
        catalog.units[0].dependsOn = ['accounts-data'];
      },
      expected:
        /dependency cycle: core-runtime -> accounts-data -> core-runtime/,
    },
    {
      name: 'manifest relationships duplicated in the catalog',
      mutate(catalog) {
        catalog.units[1].dependsOn = ['core-runtime'];
      },
      expected:
        /dependency "core-runtime" is already inferred from workspace manifests/,
    },
  ];

  for (const scenario of scenarios) {
    await t.test(scenario.name, () => {
      const catalog = structuredClone(validCatalog);
      scenario.mutate(catalog);
      assert.throws(
        () => validateCatalog(catalog, workspaceManifests),
        scenario.expected,
      );
    });
  }
});

test('repository catalog represents the active delivery inventory only', async () => {
  const [catalog, manifests] = await Promise.all([
    loadCatalog(),
    loadWorkspaceManifests(),
  ]);

  validateCatalog(catalog, manifests);
  assert.deepEqual(
    catalog.units.map(({ id }) => id),
    [
      'component-library',
      'core-anti-virus',
      'core-infrastructure',
      'core-communications',
      'accounts-infrastructure',
      'accounts-storage',
      'accounts-data',
      'accounts-warm-up',
      'accounts-notifications',
      'accounts-queue',
      'accounts-reports',
      'accounts-api',
      'accounts-client',
    ],
  );
  assert.equal(
    catalog.units.some(({ workspace }) => workspace.startsWith('@id/')),
    false,
  );
  assert.equal(
    catalog.units.some(
      ({ workspace }) => workspace === '@accounts/data-restore',
    ),
    false,
  );
});

test('recorded Preview Plan fixtures expose complete creation, selective repair, missing-stack repair, and non-runtime skips', () => {
  for (const { input, expected } of Object.values(previewFixtures)) {
    assert.deepEqual(
      createPreviewPlan(planningCatalog, planningManifests, input),
      expected,
    );
  }
});

test('recorded preview impact fixtures distinguish runtime workspaces from non-runtime changes', () => {
  for (const { changedFiles, expected } of Object.values(
    previewImpactFixtures,
  )) {
    assert.deepEqual(
      createPreviewImpact(planningCatalog, planningManifests, changedFiles),
      expected,
    );
  }
});

test('recorded Release Plan expands delivery dependants and preserves exact owning-workspace tags', () => {
  assert.deepEqual(
    createReleasePlan(planningCatalog, planningManifests, releaseFixture.input),
    releaseFixture.expected,
  );
});

test('Release Plan rejects a selected application without its own Release', () => {
  const input = structuredClone(releaseFixture.input);
  delete input.releaseTags['@accounts/client'];

  assert.throws(
    () => createReleasePlan(planningCatalog, planningManifests, input),
    /accounts-client.*requires Release "@accounts\/client@<version>"/,
  );
});

test('recorded reconciliation selects stale units and every delivery dependant', () => {
  assert.deepEqual(
    createReconciliationPlan(
      planningCatalog,
      planningManifests,
      reconciliationFixture.input,
    ),
    reconciliationFixture.expected,
  );
});

test('recorded job graphs filter targets and reverse direct dependencies for teardown', () => {
  const develop = createJobGraph(planningCatalog, planningManifests, 'develop');
  assert.deepEqual(
    develop.map(({ id }) => id),
    [
      'core-anti-virus',
      'accounts-storage',
      'accounts-data',
      'accounts-notifications',
      'accounts-queue',
      'accounts-reports',
      'accounts-api',
    ],
  );
  assert.deepEqual(develop.find(({ id }) => id === 'accounts-api').needs, [
    'accounts-data',
    'accounts-queue',
    'accounts-reports',
    'accounts-storage',
  ]);

  const teardown = createJobGraph(
    planningCatalog,
    planningManifests,
    'preview',
    {
      reverse: true,
    },
  );
  assert.deepEqual(teardown.at(0), { id: 'accounts-api', needs: [] });
  assert.deepEqual(teardown.find(({ id }) => id === 'accounts-data').needs, [
    'accounts-warm-up',
    'accounts-notifications',
    'accounts-queue',
    'accounts-reports',
    'accounts-api',
  ]);
  assert.deepEqual(teardown.at(-1), {
    id: 'core-anti-virus',
    needs: ['accounts-storage', 'accounts-data'],
  });
});

function workflowJob(workflow, jobId) {
  const match = workflow.match(
    new RegExp(
      String.raw`^  ${jobId}:\n[\s\S]*?(?=^  [a-zA-Z0-9_-]+:|(?![\s\S]))`,
      'm',
    ),
  );
  assert.ok(match, `expected workflow job ${jobId}`);
  return match[0];
}

test('generator emits deterministic static workflow graphs with one job per Deployment Unit', async () => {
  const [catalog, manifests] = await Promise.all([
    loadCatalog(),
    loadWorkspaceManifests(),
  ]);
  const first = await generateWorkflows({ write: false });
  const second = await generateWorkflows({ write: false });
  assert.deepEqual(first, second);

  for (const workflow of Object.values(first)) {
    assert.ok(
      workflow.startsWith(
        '# GENERATED FILE — DO NOT EDIT. Run `node .github/delivery/generate.mjs`.',
      ),
    );
  }

  const production = first['deploy-to-production.yml'];
  assert.doesNotMatch(production, /\n\n\n/);
  for (const id of [
    'component-library',
    'core-anti-virus',
    'core-infrastructure',
    'core-communications',
    'accounts-infrastructure',
    'accounts-storage',
    'accounts-data',
    'accounts-warm-up',
    'accounts-notifications',
    'accounts-queue',
    'accounts-reports',
    'accounts-api',
    'accounts-client',
  ]) {
    assert.ok(production.includes(`\n  ${id}:\n`));
  }
  assert.match(
    workflowJob(production, 'core-communications'),
    /needs:\n      - core-infrastructure[\s\S]*Deploy comms infrastructure/,
  );
  assert.doesNotMatch(
    workflowJob(production, 'core-infrastructure'),
    /Deploy comms infrastructure/,
  );

  for (const [filename, target] of [
    ['deploy-to-environment.yml', 'preview'],
    ['deploy-to-develop.yml', 'develop'],
    ['deploy-to-production.yml', 'production'],
    ['teardown-environment.yml', 'preview'],
  ]) {
    for (const { id } of createJobGraph(catalog, manifests, target)) {
      assert.match(workflowJob(first[filename], id), /^    permissions:/m);
    }
  }

  assert.match(
    workflowJob(first['teardown-environment.yml'], 'accounts-data'),
    /needs:\n      - setup\n      - accounts-warm-up\n      - accounts-notifications\n      - accounts-queue\n      - accounts-reports\n      - accounts-api/,
  );
});

test('generated preview workflow plans per pull request and selectively deploys without weakening Playwright', async () => {
  const generated = await generateWorkflows({ write: false });
  const preview = generated['deploy-to-environment.yml'];
  const setup = workflowJob(preview, 'setup');
  const deployment = workflowJob(preview, 'accounts-data');
  const playwright = workflowJob(preview, 'accounts-client');
  const playwrightStatus = workflowJob(preview, 'playwright-status');

  assert.match(
    preview,
    /concurrency:\n  group: preview-pr-\$\{\{ github\.event\.pull_request\.number \}\}\n  cancel-in-progress: false/,
  );
  assert.match(setup, /name: Preview plan/);
  assert.match(
    setup,
    /git diff --name-only '\$\{\{ github\.event\.pull_request\.base\.sha \}\}\.\.\.\$\{\{ github\.event\.pull_request\.head\.sha \}\}'/,
  );
  assert.match(setup, /aws cloudformation describe-stacks/);
  assert.match(setup, /node \.github\/delivery\/generate\.mjs --preview-plan/);
  assert.match(
    setup,
    /name: Install dependencies\n        if: steps\.plan\.outputs\.runtime-affected == 'true'[^\n]*\n        run: yarn/,
  );
  assert.match(setup, /^    outputs:\n      runtime-affected:/m);
  assert.match(setup, /^      units:/m);
  assert.match(
    deployment,
    /if: always\(\) && contains\(fromJSON\(needs\.setup\.outputs\.units \|\| '\[\]'\), 'accounts-data'\)/,
  );
  assert.match(
    deployment,
    /!contains\(fromJSON\(needs\.setup\.outputs\.units \|\| '\[\]'\), 'accounts-storage'\) \|\| needs\.accounts-storage\.result == 'success'/,
  );
  assert.match(
    deployment,
    /uses: actions\/checkout@v6\n        with:\n          ref: \$\{\{ github\.event\.pull_request\.head\.sha \}\}/,
  );
  assert.match(
    preview,
    /name: Preview[\s\S]*Preview deployment is not applicable/,
  );
  assert.match(
    workflowJob(preview, 'preview-status'),
    /needs:\n      - setup\n      - core-anti-virus[\s\S]*      - accounts-api/,
  );
  assert.match(
    playwright,
    /if: always\(\) && needs\.setup\.outputs\.runtime-affected == 'true'/,
  );
  assert.match(
    playwright,
    /matrix:\n        containers:\n          - 1\n          - 2/,
  );
  assert.match(
    playwright,
    /run: yarn workspace @accounts\/client e2e-ci --shard=\$\{\{ matrix\.containers \}\}\/2/,
  );
  assert.match(
    playwright,
    /uses: actions\/checkout@v6\n        with:\n          ref: \$\{\{ github\.event\.pull_request\.head\.sha \}\}/,
  );
  assert.match(playwrightStatus, /Playwright is not applicable/);
  assert.doesNotMatch(preview, /\n  core-infrastructure:\n/);
  assert.doesNotMatch(preview, /\n  accounts-infrastructure:\n/);
});

test('generated teardown checks for missing resources and blocks dependencies after genuine failures', async () => {
  const generated = await generateWorkflows({ write: false });
  const teardown = generated['teardown-environment.yml'];
  const storage = workflowJob(teardown, 'accounts-storage');

  assert.match(
    teardown,
    /concurrency:\n  group: preview-\$\{\{ github\.event\.inputs\.stage \|\| format\('pr-\{0\}', github\.event\.pull_request\.number\) \}\}\n  cancel-in-progress: false/,
  );
  assert.match(storage, /name: Check for resources/);
  assert.match(storage, /aws cloudformation describe-stacks/);
  assert.match(storage, /does not exist/);
  assert.match(
    storage,
    /if: steps\.resources\.outputs\.found == 'true'[\s\S]*name: Teardown/,
  );
  assert.match(
    storage,
    /if: always\(\) && github\.actor != 'dependabot\[bot\]' && !contains\(needs\.\*\.result, 'failure'\) && !contains\(needs\.\*\.result, 'cancelled'\) && !contains\(needs\.\*\.result, 'skipped'\)/,
  );
  assert.match(
    storage,
    /\.github\/delivery\/empty-s3-bucket\.sh "\$DOWNLOAD_BUCKET"[\s\S]*\.github\/delivery\/empty-s3-bucket\.sh "\$UPLOAD_BUCKET"/,
  );
  assert.doesNotMatch(storage, /continue-on-error: true/);
});

test('catalog target removal removes the Deployment Unit from generated workflows', async () => {
  const [catalog, manifests] = await Promise.all([
    loadCatalog(),
    loadWorkspaceManifests(),
  ]);
  const retargetedCatalog = structuredClone(catalog);
  retargetedCatalog.units.find(({ id }) => id === 'accounts-warm-up').targets =
    ['production'];

  const generated = await generateWorkflows({
    write: false,
    catalog: retargetedCatalog,
    workspaceManifests: manifests,
  });
  assert.equal(
    generated['deploy-to-environment.yml'].includes('\n  accounts-warm-up:\n'),
    false,
  );
  assert.equal(
    generated['deploy-to-environment.yml'].includes(
      '\n      - accounts-warm-up\n',
    ),
    false,
  );
  assert.equal(
    generated['teardown-environment.yml'].includes('\n  accounts-warm-up:\n'),
    false,
  );
  assert.equal(
    generated['deploy-to-production.yml'].includes('\n  accounts-warm-up:\n'),
    true,
  );
});

test('checked-in workflows do not drift from deterministic generation', async () => {
  assert.deepEqual(await checkGeneratedWorkflows(), []);
});

test('pull-request quality assurance validates the catalog and generated workflows', async () => {
  const qualityAssurance = await readFile(
    new URL('../workflows/quality-assurance.yml', import.meta.url),
    'utf8',
  );

  assert.match(
    qualityAssurance,
    /name: Validate delivery catalog[\s\S]*node --test \.github\/delivery\/\*\.test\.mjs[\s\S]*node \.github\/delivery\/generate\.mjs --check/,
  );
});

test('pull-request quality categories start independently with bounded workspace tests', async () => {
  const [qualityAssurance, manifests] = await Promise.all([
    readFile(
      new URL('../workflows/quality-assurance.yml', import.meta.url),
      'utf8',
    ),
    loadWorkspaceManifests(),
  ]);

  assert.doesNotMatch(qualityAssurance, /^  setup:$/m);
  for (const jobId of [
    'delivery-catalog',
    'lint',
    'type-check',
    'unit-tests',
    'chromatic',
  ]) {
    assert.doesNotMatch(workflowJob(qualityAssurance, jobId), /^    needs:/m);
  }

  assert.match(workflowJob(qualityAssurance, 'lint'), /run: yarn lint/);
  assert.match(
    workflowJob(qualityAssurance, 'type-check'),
    /run: yarn typecheck/,
  );
  assert.match(
    workflowJob(qualityAssurance, 'unit-tests'),
    /run: yarn workspaces foreach -Wp -j 3 run test-ci/,
  );
  assert.match(
    workflowJob(qualityAssurance, 'unit-tests'),
    /name: Build packages[\s\S]*run: yarn package[\s\S]*name: Unit test/,
  );
  assert.match(
    workflowJob(qualityAssurance, 'chromatic'),
    /exitOnceUploaded: true/,
  );

  const jestWorkspaces = manifests.filter(({ scripts }) =>
    scripts?.['test-ci']?.includes('jest'),
  );
  assert.ok(jestWorkspaces.length > 0);
  for (const { name, scripts } of jestWorkspaces) {
    assert.match(scripts['test-ci'], /--runInBand/, name);
  }
});

test('generated delivery workflows do not repeat pull-request quality gates', async () => {
  const generated = await generateWorkflows({ write: false });

  for (const [filename, workflow] of Object.entries(generated)) {
    assert.doesNotMatch(workflow, /run: yarn lint/, filename);
    assert.doesNotMatch(workflow, /run: yarn test(?:\s|$)/, filename);
    assert.doesNotMatch(workflow, /SonarCloud Scan/, filename);
    assert.doesNotMatch(workflow, /chromaui\/action/, filename);
  }

  const storybook = workflowJob(
    generated['deploy-to-production.yml'],
    'component-library',
  );
  assert.match(storybook, /uses: peaceiris\/actions-gh-pages@v4/);
});

test('required status checks match the pull-request quality job names', async () => {
  const [qualityAssurance, requiredStatusChecks] = await Promise.all([
    readFile(
      new URL('../workflows/quality-assurance.yml', import.meta.url),
      'utf8',
    ),
    readFile(
      new URL('../required-status-checks.json', import.meta.url),
      'utf8',
    ).then(JSON.parse),
  ]);

  assert.deepEqual(requiredStatusChecks, {
    contexts: [
      'CodeQL',
      'Lint',
      'Playwright',
      'Preview',
      'SonarCloud Code Analysis',
      'Type check',
      'UI Review',
      'UI Tests',
      'Unit tests',
      'Validate delivery catalog',
    ],
  });
  for (const [jobId, checkName] of [
    ['delivery-catalog', 'Validate delivery catalog'],
    ['lint', 'Lint'],
    ['type-check', 'Type check'],
    ['unit-tests', 'Unit tests'],
  ]) {
    assert.match(
      workflowJob(qualityAssurance, jobId),
      new RegExp(`name: ${checkName}`),
    );
  }
});
