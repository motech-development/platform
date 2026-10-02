import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { gzipSync } from 'node:zlib';
import optimizeLocales from '@react-aria/optimize-locales-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import type { Plugin, UserConfig } from 'vite';
import { defineConfig, esmExternalRequirePlugin } from 'vite';
import packageJson from './package.json' with { type: 'json' };

const require = createRequire(import.meta.url);
const fontPackageDirectory = dirname(
  require.resolve('@fontsource-variable/public-sans/package.json'),
);
const distributionDirectory = resolve(import.meta.dirname, 'lib');
const externalPackages = Object.keys({
  ...packageJson.dependencies,
  ...packageJson.peerDependencies,
});
const esmExternalRequirePackages = ['react'];
const bundledReactAriaPackages = ['react-aria', 'react-aria-components'];
const bundledDependencyLicenses = [
  { fileName: 'LICENSE', packageName: '@internationalized/number' },
  { fileName: 'LICENSE', packageName: '@internationalized/string' },
  { fileName: 'license', packageName: 'clsx' },
  { fileName: 'LICENSE', packageName: 'react-aria' },
  { fileName: 'LICENSE', packageName: 'react-aria-components' },
  { fileName: 'LICENSE', packageName: 'react-stately' },
  { fileName: 'LICENSE', packageName: 'use-sync-external-store' },
];
const appliesToLibraryBuild = (config: UserConfig) =>
  Boolean(config.build?.lib);
const maximumLibraryGzipBytes = 140 * 1024;
const reactAriaLocaleSource =
  /[/\\](?:react-aria|react-aria-components|react-stately|@react-aria|@react-stately)[/\\].*[/\\]([a-z]{2})-[A-Z]{2}\.[cm]?js$/;

const esmExternalRequire = Object.assign(
  esmExternalRequirePlugin({ external: esmExternalRequirePackages }),
  { apply: appliesToLibraryBuild },
);

function distributionAssetsPlugin(): Plugin {
  return {
    name: 'breeze-distribution-assets',
    writeBundle(outputOptions) {
      if (
        !outputOptions.dir ||
        resolve(import.meta.dirname, outputOptions.dir) !==
          distributionDirectory
      ) {
        return;
      }

      copyFileSync(
        resolve(fontPackageDirectory, 'LICENSE'),
        resolve(distributionDirectory, 'Public-Sans-LICENSE.txt'),
      );

      bundledDependencyLicenses.forEach(({ fileName, packageName }) => {
        let packageDirectory = dirname(require.resolve(packageName));

        while (packageDirectory !== dirname(packageDirectory)) {
          const packageJsonPath = resolve(packageDirectory, 'package.json');

          if (existsSync(packageJsonPath)) {
            const installedPackage = JSON.parse(
              readFileSync(packageJsonPath, 'utf8'),
            ) as { name?: string };

            if (installedPackage.name === packageName) {
              const outputDirectory = resolve(
                distributionDirectory,
                'licenses',
                packageName,
              );
              mkdirSync(outputDirectory, { recursive: true });
              copyFileSync(
                resolve(packageDirectory, fileName),
                resolve(outputDirectory, fileName),
              );

              return;
            }
          }

          packageDirectory = dirname(packageDirectory);
        }

        throw new Error(`Unable to locate package root for ${packageName}`);
      });
    },
  };
}

const pdfWorkerUrl = /new URL\(\s*(['"])pdfjs-dist\/build\/pdf\.worker\.mjs\1/g;
const ignoredPdfWorkerUrl =
  /\/\* @vite-ignore \*\/\s*(['"]pdfjs-dist\/build\/pdf\.worker\.mjs['"])/g;
const preservedPdfWorkerUrl =
  /new URL\(\s*(['"])pdfjs-dist\/build\/pdf\.worker\.mjs\1,\s*import\.meta\.url\s*\)/;

/**
 * Leaves the PDF.js worker URL for the consuming application's bundler.
 *
 * Vite resolves `new URL(<bare specifier>, import.meta.url)` and, in library
 * mode, inlines the result as base64 — here the entire 1.27 MB worker. Marking
 * the call `@vite-ignore` while the library builds stops that, and the marker is
 * stripped from the emitted chunk so the consumer's Vite or webpack still
 * resolves and emits the worker. The output guard below fails the build if the
 * published URL is not exactly the portable form.
 */
function preservePdfWorkerUrlPlugin(): Plugin {
  return {
    apply: appliesToLibraryBuild,
    enforce: 'pre',
    name: 'breeze-preserve-pdf-worker-url',
    renderChunk(code) {
      return code.includes('pdf.worker.mjs')
        ? { code: code.replace(ignoredPdfWorkerUrl, '$1'), map: null }
        : null;
    },
    transform(code, id) {
      return id.endsWith('/pdf-renderer.ts')
        ? {
            code: code.replace(
              pdfWorkerUrl,
              'new URL(/* @vite-ignore */ $1pdfjs-dist/build/pdf.worker.mjs$1',
            ),
            map: null,
          }
        : null;
    },
  };
}

/** Fails the library build when locale stripping or the size budget regresses. */
function libraryOutputGuardPlugin(): Plugin {
  return {
    apply: appliesToLibraryBuild,
    generateBundle(_options, bundle) {
      // CSS entries leave empty JavaScript chunks that Vite drops after this hook.
      const chunks = Object.values(bundle).flatMap((output) =>
        output.type === 'chunk' && output.code.length > 0 ? [output] : [],
      );
      const errors: string[] = [];
      const gzipBytes = chunks.reduce(
        (total, chunk) => total + gzipSync(chunk.code, { level: 9 }).length,
        0,
      );
      const localeSources = chunks.flatMap((chunk) => {
        if (!chunk.map) {
          errors.push(`${chunk.fileName} has no source map to audit locales`);

          return [];
        }

        return chunk.map.sources.flatMap((source) => {
          const language = reactAriaLocaleSource.exec(source)?.[1];

          return language ? [{ language, source }] : [];
        });
      });

      localeSources
        .filter(({ language }) => language !== 'en')
        .forEach(({ source }) => {
          errors.push(`Non-English React Aria locale remains: ${source}`);
        });

      if (!localeSources.some(({ language }) => language === 'en')) {
        errors.push(
          'No English React Aria locale modules were found; update the locale audit pattern',
        );
      }

      const libraryCode = chunks.map((chunk) => chunk.code).join('\n');

      if (!preservedPdfWorkerUrl.test(libraryCode)) {
        errors.push(
          'The PDF.js worker URL is not the portable new URL("pdfjs-dist/build/pdf.worker.mjs", import.meta.url) form',
        );
      }

      if (libraryCode.includes('pdf.worker.mjs?url')) {
        errors.push(
          'The Vite-only PDF.js worker ?url import is back in the output',
        );
      }

      if (libraryCode.includes('@vite-ignore')) {
        errors.push('A @vite-ignore marker leaked into the published output');
      }

      if (gzipBytes > maximumLibraryGzipBytes) {
        errors.push(
          `Library JavaScript is ${gzipBytes} B gzip-9, over the ${maximumLibraryGzipBytes} B budget`,
        );
      }

      this.info(
        `Library JavaScript: ${gzipBytes} B gzip-9 (budget ${maximumLibraryGzipBytes} B)`,
      );

      if (errors.length > 0) {
        this.error(errors.join('\n'));
      }
    },
    name: 'breeze-library-output-guard',
  };
}

export default defineConfig({
  base: './',
  build: {
    cssCodeSplit: true,
    lib: {
      entry: {
        index: './src/index.ts',
        reset: './src/styles/reset.css',
        styles: './src/styles/styles.css',
      },
      formats: ['es'],
    },
    outDir: 'lib',
    rolldownOptions: {
      external: (id) =>
        !esmExternalRequirePackages.includes(id) &&
        !bundledReactAriaPackages.some(
          (packageName) =>
            id === packageName || id.startsWith(`${packageName}/`),
        ) &&
        externalPackages.some(
          (packageName) =>
            id === packageName || id.startsWith(`${packageName}/`),
        ),
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.names.includes('reset.css')) {
            return 'reset.css';
          }

          if (assetInfo.names.includes('styles.css')) {
            return 'styles.css';
          }

          return 'assets/[name]-[hash][extname]';
        },
        entryFileNames: '[name].js',
      },
    },
    sourcemap: true,
  },
  plugins: [
    tailwindcss(),
    react(),
    distributionAssetsPlugin(),
    {
      ...optimizeLocales.vite({ locales: ['en'] }),
      apply: appliesToLibraryBuild,
      enforce: 'pre' as const,
    },
    esmExternalRequire,
    preservePdfWorkerUrlPlugin(),
    libraryOutputGuardPlugin(),
  ],
});
