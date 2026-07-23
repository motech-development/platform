import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import packageJson from './package.json' with { type: 'json' };

const externalPackages = Object.keys({
  ...packageJson.dependencies,
  ...packageJson.peerDependencies,
});

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      fileName: 'index',
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
  plugins: [react()],
});
