import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  checkGeneratedWorkflows,
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
      targets: ['preview', 'develop', 'production'],
      dependsOn: [],
      expectedStacks: ['core-{stage}-runtime'],
    },
    {
      id: 'accounts-data',
      workspace: '@accounts/data',
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

test('recorded Preview Plan fixtures expose complete creation, selective repair, and non-runtime skips', async () => {
  const [catalog, manifests] = await Promise.all([
    loadCatalog(),
    loadWorkspaceManifests(),
  ]);

  for (const { input, expected } of Object.values(previewFixtures)) {
    assert.deepEqual(createPreviewPlan(catalog, manifests, input), expected);
  }
});

test('recorded Release Plan expands delivery dependants and preserves exact owning-workspace tags', async () => {
  const [catalog, manifests] = await Promise.all([
    loadCatalog(),
    loadWorkspaceManifests(),
  ]);

  assert.deepEqual(
    createReleasePlan(catalog, manifests, releaseFixture.input),
    releaseFixture.expected,
  );
});

test('Release Plan rejects a selected application without its own Release', async () => {
  const [catalog, manifests] = await Promise.all([
    loadCatalog(),
    loadWorkspaceManifests(),
  ]);
  const input = structuredClone(releaseFixture.input);
  delete input.releaseTags['@accounts/client'];

  assert.throws(
    () => createReleasePlan(catalog, manifests, input),
    /accounts-client.*requires Release "@accounts\/client@<version>"/,
  );
});

test('recorded reconciliation selects stale units and every delivery dependant', async () => {
  const [catalog, manifests] = await Promise.all([
    loadCatalog(),
    loadWorkspaceManifests(),
  ]);

  assert.deepEqual(
    createReconciliationPlan(catalog, manifests, reconciliationFixture.input),
    reconciliationFixture.expected,
  );
});

test('job graphs filter targets and reverse direct dependencies for teardown', async () => {
  const [catalog, manifests] = await Promise.all([
    loadCatalog(),
    loadWorkspaceManifests(),
  ]);

  const develop = createJobGraph(catalog, manifests, 'develop');
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

  const teardown = createJobGraph(catalog, manifests, 'preview', {
    reverse: true,
  });
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
