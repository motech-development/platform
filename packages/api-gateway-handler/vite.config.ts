import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      fileName: (format) => (format === 'es' ? 'index.esm.js' : 'index.cjs.js'),
      formats: ['es', 'cjs'],
    },
    outDir: 'lib',
    rolldownOptions: {
      external: [],
    },
    sourcemap: true,
  },
});
