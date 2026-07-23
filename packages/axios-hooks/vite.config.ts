import { defineConfig } from 'vite';
import packageJson from './package.json' with { type: 'json' };

const externalPackages = Object.keys({
  ...packageJson.peerDependencies,
});

export default defineConfig({
  build: {
    lib: {
      entry: 'src/axios-hooks.ts',
      fileName: 'axios-hooks',
      formats: ['es'],
    },
    outDir: 'lib',
    rolldownOptions: {
      external: (id) =>
        externalPackages.some(
          (packageName) =>
            id === packageName || id.startsWith(`${packageName}/`),
        ),
    },
    sourcemap: true,
  },
});
