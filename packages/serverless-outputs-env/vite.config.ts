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
      entry: 'src/outputs-env-plugin.ts',
      fileName: (format) =>
        format === 'es'
          ? 'outputs-env-plugin.esm.js'
          : 'outputs-env-plugin.cjs.js',
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
      output: {
        exports: 'default',
      },
    },
    sourcemap: true,
  },
});
