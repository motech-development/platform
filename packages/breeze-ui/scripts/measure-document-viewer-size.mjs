import { readdirSync, readFileSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { gzipSync } from 'node:zlib';

const require = createRequire(import.meta.url);
const packageRoot = resolve(import.meta.dirname, '..');
const libraryDirectory = resolve(packageRoot, 'lib');
const pdfjsBuildDirectory = dirname(require.resolve('pdfjs-dist'));

function javascriptFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) return javascriptFiles(path);
    return entry.isFile() && path.endsWith('.js') ? [path] : [];
  });
}

function gzipBytes(path) {
  return gzipSync(readFileSync(path), { level: 9 }).byteLength;
}

function formatKiB(bytes) {
  return `${(bytes / 1024).toFixed(2)} KiB`;
}

if (!statSync(libraryDirectory).isDirectory()) {
  throw new Error('Build Breeze UI before measuring its generated library.');
}

const libraryBytes = javascriptFiles(libraryDirectory)
  .filter((path) => !path.includes('pdf.worker'))
  .reduce((total, path) => total + gzipBytes(path), 0);
const pdfEngineBytes =
  gzipBytes(resolve(pdfjsBuildDirectory, 'pdf.mjs')) +
  gzipBytes(resolve(pdfjsBuildDirectory, 'pdf.worker.mjs'));

console.log(`Breeze UI library JavaScript (gzip): ${formatKiB(libraryBytes)}`);
console.log(
  `PDF.js engine JavaScript, main and worker combined (gzip): ${formatKiB(pdfEngineBytes)}`,
);
