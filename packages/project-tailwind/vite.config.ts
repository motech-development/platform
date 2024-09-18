import { resolve } from 'node:path';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      unfetch: resolve('../../node_modules/unfetch/dist/unfetch.mjs'),
    },
  },
});
