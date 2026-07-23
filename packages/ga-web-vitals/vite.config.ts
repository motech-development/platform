import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/ga-web-vitals.ts',
      fileName: 'ga-web-vitals',
      formats: ['es'],
    },
    outDir: 'lib',
    rolldownOptions: {
      external: [],
    },
    sourcemap: true,
  },
});
