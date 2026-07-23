import { defineConfig } from 'vite';
import packageJson from './package.json' with { type: 'json' };

const externalPackages = Object.keys(packageJson.peerDependencies);

export default defineConfig({
  build: {
    lib: {
      entry: 'src/webpack-conditional-plugin.ts',
      fileName: (format) =>
        format === 'es'
          ? 'webpack-conditional-plugin.esm.js'
          : 'webpack-conditional-plugin.cjs.js',
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
