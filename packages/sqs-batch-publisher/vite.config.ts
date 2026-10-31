import { builtinModules } from 'node:module';
import { defineConfig } from 'vite';
import packageJson from './package.json' with { type: 'json' };

const externalPackages = Object.keys(packageJson.dependencies);
const externalBuiltins = new Set([
  ...builtinModules,
  ...builtinModules.map((moduleName) => `node:${moduleName}`),
]);

export default defineConfig({
  build: {
    lib: {
      entry: 'src/sqs-batch-publisher.ts',
      fileName: (format) =>
        format === 'es'
          ? 'sqs-batch-publisher.esm.js'
          : 'sqs-batch-publisher.cjs.js',
      formats: ['es', 'cjs'],
    },
    outDir: 'lib',
    rolldownOptions: {
      external: (id) =>
        externalBuiltins.has(id) ||
        externalPackages.some(
          (packageName) =>
            id === packageName || id.startsWith(`${packageName}/`),
        ),
    },
    sourcemap: true,
  },
});
