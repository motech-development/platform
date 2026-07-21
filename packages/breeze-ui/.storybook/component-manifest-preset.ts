const packageName = '@motech-development/breeze-ui';

interface ManifestEntry extends Record<string, unknown> {
  import?: string;
  path?: string;
  subcomponents?: Record<string, ManifestEntry>;
}

interface ComponentsManifest extends Record<string, unknown> {
  components?: Record<string, ManifestEntry>;
}

interface StorybookManifests extends Record<string, unknown> {
  components?: ComponentsManifest;
}

function getPublicImport(storyPath: string): string | undefined {
  const storyFileName = storyPath.match(/\/([^/]+)\.stories\.[^/]+$/)?.[1];

  if (storyFileName === 'index') {
    return `import * as Icons from "${packageName}/icons";`;
  }

  if (!storyFileName?.match(/^[A-Z][A-Za-z0-9]*$/)) {
    return undefined;
  }

  return `import { ${storyFileName} } from "${packageName}";`;
}

function normaliseEntry(entry: ManifestEntry): ManifestEntry {
  const publicImport = entry.path ? getPublicImport(entry.path) : undefined;

  if (!publicImport) {
    return entry;
  }

  return {
    ...entry,
    import: publicImport,
    ...(entry.subcomponents
      ? {
          subcomponents: Object.fromEntries(
            Object.entries(entry.subcomponents).map(([name, subcomponent]) => [
              name,
              {
                ...subcomponent,
                import: publicImport,
              },
            ]),
          ),
        }
      : {}),
  };
}

/**
 * Storybook 10.4 rewrites local story imports to the package root, including
 * internal helpers and compound parts that are only public through a namespace.
 * Keep the generated manifest aligned with Breeze's existing package exports.
 */
export default function normaliseComponentManifests(
  manifests: StorybookManifests = {},
): StorybookManifests {
  if (!manifests.components?.components) {
    return manifests;
  }

  return {
    ...manifests,
    components: {
      ...manifests.components,
      components: Object.fromEntries(
        Object.entries(manifests.components.components).map(([id, entry]) => [
          id,
          normaliseEntry(entry),
        ]),
      ),
    },
  };
}
