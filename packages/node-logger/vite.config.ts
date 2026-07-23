import { defineConfig } from 'vite';
import packageJson from './package.json' with { type: 'json' };

const externalPackages = Object.keys(packageJson.dependencies);

export default defineConfig({
  build: {
    lib: {
      entry: 'src/logger.ts',
      fileName: (format) => (format === 'es' ? 'index.esm.js' : 'index.cjs.js'),
      formats: ['es', 'cjs'],
    },
    outDir: 'lib',
    rolldownOptions: {
      external: (id) =>
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
