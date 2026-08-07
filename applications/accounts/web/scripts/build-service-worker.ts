import { unlink } from 'node:fs/promises';
import { resolve } from 'node:path';
import { build } from 'vite';
import { injectManifest } from 'workbox-build';

const workspace = resolve(import.meta.dirname, '..');
const clientOutput = resolve(workspace, 'dist/client');
const sourceOutput = resolve(clientOutput, 'service-worker-source.js');

await build({
  build: {
    emptyOutDir: false,
    lib: {
      entry: resolve(workspace, 'src/service-worker.ts'),
      formats: ['es'],
    },
    minify: true,
    outDir: clientOutput,
    rollupOptions: {
      output: {
        entryFileNames: 'service-worker-source.js',
      },
    },
    sourcemap: false,
  },
  configFile: false,
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  logLevel: 'warn',
});

try {
  const result = await injectManifest({
    globDirectory: clientOutput,
    globPatterns: [
      '_shell.html',
      'manifest.webmanifest',
      '*.{ico,png,txt}',
      'assets/**/*.{css,js,mjs,woff2}',
    ],
    swDest: resolve(clientOutput, 'service-worker.js'),
    swSrc: sourceOutput,
  });

  if (result.warnings.length > 0) {
    throw new Error(result.warnings.join('\n'));
  }

  process.stdout.write(
    `Generated service-worker.js with ${result.count} immutable build assets (${result.size} bytes).\n`,
  );
} finally {
  await unlink(sourceOutput);
}
