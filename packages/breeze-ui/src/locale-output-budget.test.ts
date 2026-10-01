import { randomBytes } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import {
  inspectLocaleOutput,
  type LocaleJavaScriptOutput,
  MAX_GZIP_BYTES,
} from '../scripts/locale-output-budget';

function createOutput(
  overrides: Partial<LocaleJavaScriptOutput> = {},
): LocaleJavaScriptOutput {
  return {
    code: 'export const value = "English";',
    dynamicImports: ['pdfjs-dist/build/pdf.mjs'],
    fileName: 'index.js',
    imports: [],
    mapSources: [
      '/node_modules/react-aria/i18n/en-US.mjs',
      '/node_modules/react-aria-components/i18n/en-GB.mjs',
    ],
    ...overrides,
  };
}

describe('inspectLocaleOutput', () => {
  it('measures every emitted JavaScript file and permits English locale data with lazy PDF imports', () => {
    const outputs = [
      createOutput(),
      createOutput({
        code: 'export const calendar = true;',
        fileName: 'chunks/calendar.js',
        mapSources: [],
      }),
    ];

    const report = inspectLocaleOutput(outputs);

    expect(report.errors).toEqual([]);
    expect(report.files.map(({ fileName }) => fileName)).toEqual([
      'index.js',
      'chunks/calendar.js',
    ]);
    expect(report.totalRawBytes).toBe(60);
    expect(report.totalGzipBytes).toBeLessThan(MAX_GZIP_BYTES);
  });

  it('applies the gzip budget to the sum of emitted JavaScript files', () => {
    const firstChunk = `// ${randomBytes(90_000).toString('base64')}`;
    const secondChunk = `// ${randomBytes(90_000).toString('base64')}`;

    const report = inspectLocaleOutput([
      createOutput({ code: firstChunk }),
      createOutput({
        code: secondChunk,
        fileName: 'chunks/calendar.js',
      }),
    ]);

    expect(report.files.every((file) => file.gzipBytes < MAX_GZIP_BYTES)).toBe(
      true,
    );
    expect(report.totalGzipBytes).toBeGreaterThan(MAX_GZIP_BYTES);
    expect(report.errors).toContain(
      `Breeze UI JavaScript gzip size ${report.totalGzipBytes} B exceeds the ${MAX_GZIP_BYTES} B budget`,
    );
  });

  it('reports non-English React Aria translation modules in source maps', () => {
    const report = inspectLocaleOutput([
      createOutput({
        mapSources: [
          '/node_modules/react-aria/i18n/en-US.mjs',
          '/node_modules/react-aria/i18n/fr-FR.mjs',
        ],
      }),
    ]);

    expect(report.errors).toContain(
      'Non-English React Aria locale module in index.js: /node_modules/react-aria/i18n/fr-FR.mjs',
    );
  });

  it('reports when no approved React Aria locale module survives', () => {
    const report = inspectLocaleOutput([
      createOutput({ mapSources: ['/src/index.ts'] }),
    ]);

    expect(report.errors).toContain(
      'No React Aria locale modules remain for the approved languages: en',
    );
  });

  it('reports React Aria packages that remain external', () => {
    const report = inspectLocaleOutput([
      createOutput({ imports: ['react-aria-components/I18nProvider'] }),
    ]);

    expect(report.errors).toContain(
      'React Aria packages remain external: react-aria-components/I18nProvider',
    );
  });

  it('requires source maps for every emitted JavaScript file', () => {
    const report = inspectLocaleOutput([
      createOutput({ mapSources: undefined }),
    ]);

    expect(report.errors).toContain(
      'Missing source map for locale audit: index.js',
    );
  });
});
