// @vitest-environment node
import { globSync, readFileSync } from 'node:fs';
import { matchesGlob, resolve } from 'node:path';
import ts from 'typescript';
import { build, loadConfigFromFile, type Rolldown } from 'vite';
import { beforeAll, describe, expect, it } from 'vitest';

const packageDirectory = resolve(import.meta.dirname, '../..');
const stylesDirectory = import.meta.dirname;
const shippedSources = globSync('src/**/*.{ts,tsx}', {
  cwd: packageDirectory,
  exclude: ['**/*.test.*', '**/*.stories.*'],
})
  .sort()
  .map((file) => ({
    file,
    text: readFileSync(resolve(packageDirectory, file), 'utf8'),
  }));
const stylesheets = globSync('src/styles/*.css', { cwd: packageDirectory })
  .sort()
  .map((file) => ({
    file,
    text: readFileSync(resolve(packageDirectory, file), 'utf8'),
  }));

/** Builds the shipped stylesheet in memory; only the output guard is left to `yarn build`. */
async function buildShippedStylesheet() {
  const loaded = await loadConfigFromFile(
    { command: 'build', mode: 'production' },
    resolve(packageDirectory, 'vite.config.ts'),
    packageDirectory,
    'silent',
  );

  if (!loaded) {
    throw new Error('vite.config.ts could not be loaded');
  }

  const { config } = loaded;
  const plugins = config.plugins?.filter(
    (plugin) =>
      !(
        plugin &&
        'name' in plugin &&
        plugin.name === 'breeze-library-output-guard'
      ),
  );

  if (plugins?.length !== (config.plugins?.length ?? 0) - 1) {
    throw new Error('vite.config.ts has no breeze-library-output-guard plugin');
  }

  const previousNodeEnvironment = process.env.NODE_ENV;
  let result: Awaited<ReturnType<typeof build>>;

  // Vitest sets NODE_ENV to "test", which would make Vite and the React plugin build for development.
  process.env.NODE_ENV = 'production';

  try {
    result = await build({
      ...config,
      build: { ...config.build, write: false },
      configFile: false,
      logLevel: 'silent',
      mode: 'production',
      plugins,
      root: packageDirectory,
    });
  } finally {
    if (previousNodeEnvironment === undefined) {
      delete process.env.NODE_ENV;
    } else {
      process.env.NODE_ENV = previousNodeEnvironment;
    }
  }

  const outputs = Array.isArray(result) ? result : [result];
  const stylesheet = outputs
    .filter((output) => 'output' in output)
    .flatMap(({ output }) => output)
    .find(
      (file): file is Rolldown.OutputAsset =>
        file.type === 'asset' && file.fileName === 'styles.css',
    );

  if (!stylesheet) {
    throw new Error('The library build emitted no styles.css');
  }

  return typeof stylesheet.source === 'string'
    ? stylesheet.source
    : new TextDecoder().decode(stylesheet.source);
}

/** Splits outside brackets so arbitrary values stay whole. */
function breezeClassTokens(text: string) {
  const tokens: string[] = [];
  let depth = 0;
  let token = '';

  Array.from(text).forEach((character) => {
    if (character === '[' || character === '(') {
      depth += 1;
    } else if ((character === ']' || character === ')') && depth > 0) {
      depth -= 1;
    }

    if (depth === 0 && /\s/.test(character)) {
      tokens.push(token);
      token = '';
    } else {
      token += character;
    }
  });
  tokens.push(token);

  return tokens.filter((candidate) => candidate.startsWith('breeze:'));
}

function stringLiteralTexts(file: string, text: string) {
  const texts: string[] = [];
  const visit = (node: ts.Node) => {
    if (
      ts.isStringLiteral(node) ||
      ts.isNoSubstitutionTemplateLiteral(node) ||
      ts.isTemplateHead(node) ||
      ts.isTemplateMiddle(node) ||
      ts.isTemplateTail(node)
    ) {
      texts.push(node.text);
    }

    ts.forEachChild(node, visit);
  };

  visit(ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true));

  return texts;
}

/** Class selectors in the CSS, with escapes decoded. */
function emittedClassNames(css: string) {
  const selectors = css.matchAll(
    /\.((?:\\[\da-fA-F]{1,6}\s?|\\[^\da-fA-F\n]|[\w\u0080-￿-])+)/g,
  );

  return new Set(
    Array.from(selectors, ([, escaped]) =>
      escaped.replace(
        /\\(?:([\da-fA-F]{1,6})\s?|([^\da-fA-F\n]))/g,
        (_, hex: string | undefined, character: string | undefined) =>
          hex === undefined
            ? character ?? ''
            : String.fromCodePoint(Number.parseInt(hex, 16)),
      ),
    ),
  );
}

/** Mirrors the `@source` directives in styles.css. */
function isScannedByTailwind(file: string) {
  const sources = Array.from(
    readFileSync(resolve(stylesDirectory, 'styles.css'), 'utf8').matchAll(
      /@source (not )?'([^']+)';/g,
    ),
    ([, negated, pattern]) => ({
      negated: negated !== undefined,
      pattern: resolve(stylesDirectory, pattern),
    }),
  );
  const path = resolve(packageDirectory, file);

  return (
    sources.some(
      ({ negated, pattern }) => !negated && matchesGlob(path, pattern),
    ) &&
    !sources.some(
      ({ negated, pattern }) => negated && matchesGlob(path, pattern),
    )
  );
}

describe('shipped styles.css', () => {
  let css: string;

  beforeAll(async () => {
    css = await buildShippedStylesheet();
  }, 60_000);

  it('contains every Breeze class in shipped source', () => {
    const emitted = emittedClassNames(css);
    const missing = shippedSources.flatMap(({ file, text }) =>
      [...new Set(stringLiteralTexts(file, text).flatMap(breezeClassTokens))]
        .filter((className) => !emitted.has(className))
        .map(
          (className) =>
            `${file}: ${className}${isScannedByTailwind(file) ? '' : ' (file is not matched by an @source in styles.css)'}`,
        ),
    );

    expect(emitted.size).toBeGreaterThan(0);
    expect(missing).toEqual([]);
  });

  it('defines every Breeze custom property that shipped source references', () => {
    const defined = new Set([
      ...Array.from(css.matchAll(/(--breeze-[\w-]+)\s*:/g), ([, name]) => name),
      ...shippedSources.flatMap(({ text }) =>
        Array.from(
          text.matchAll(/setProperty\(\s*['"](--breeze-[\w-]+)['"]/g),
          ([, name]) => name,
        ),
      ),
    ]);
    const undefinedReferences = [...shippedSources, ...stylesheets].flatMap(
      ({ file, text }) =>
        [
          ...new Set(
            Array.from(
              text.matchAll(/(?:var\(\s*|\()(--breeze-[\w-]+)/g),
              ([, name]) => name,
            ),
          ),
        ]
          .filter((name) => !defined.has(name))
          .map((name) => `${file}: ${name}`),
    );

    expect(defined.size).toBeGreaterThan(0);
    expect(undefinedReferences).toEqual([]);
  });
});
