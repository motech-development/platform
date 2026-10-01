import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';

const packageRoot = resolve(import.meta.dirname, '..');

describe('built library artifact', () => {
  it('imports with peer React and renders English translation data across locales', () => {
    const outputDirectory = mkdtempSync(
      join(packageRoot, '.breeze-ui-artifact-'),
    );

    try {
      const libraryEntry = pathToFileURL(join(outputDirectory, 'index.js'));
      const script = `
        import { build } from 'vite';
        import { createElement } from 'react';
        import { renderToStaticMarkup } from 'react-dom/server';

        await build({
          configFile: 'vite.config.ts',
          root: ${JSON.stringify(packageRoot)},
          build: { emptyOutDir: true, outDir: ${JSON.stringify(outputDirectory)} },
        });
        const { BreezeProvider, Calendar, NumberField } = await import(${JSON.stringify(libraryEntry.href)});
        const render = (locale) => renderToStaticMarkup(
          createElement(
            BreezeProvider,
            { defaultAppearance: 'light', locale },
            createElement(Calendar, { defaultValue: '2026-10-01', label: 'Appointment' }),
            createElement(NumberField, { defaultValue: 1234.5, label: 'Amount' }),
          ),
        );
        const english = render('en-GB');
        const french = render('fr-FR');

        if (!english.includes('lang="en-GB"')) throw new Error('English locale was not applied');
        if (!french.includes('lang="fr-FR"')) throw new Error('French locale was not applied');
        if (!english.includes('October 2026')) throw new Error('English calendar month is missing');
        if (!french.includes('octobre 2026')) throw new Error('French calendar month is missing');
        if (!english.match(/aria-label="Next(?: month)?"/)) throw new Error('English React Aria navigation label is missing');
        if (!french.match(/aria-label="Next(?: month)?"/)) throw new Error('React Aria navigation label was not kept in English');
        if (!english.includes('value="1,234.5"')) throw new Error('English number formatting is missing');
        if (!french.includes('value="1\\u202f234,5"')) throw new Error('French number formatting is missing');

        console.log('artifact-smoke-passed');
      `;
      const result = spawnSync(
        process.execPath,
        ['--input-type=module', '--eval', script],
        {
          cwd: packageRoot,
          encoding: 'utf8',
          env: { ...process.env, NODE_ENV: 'production' },
        },
      );

      expect(result.status).toBe(0);
      expect(result.error).toBeUndefined();
      expect(result.stdout).toContain('artifact-smoke-passed');
    } finally {
      rmSync(outputDirectory, { force: true, recursive: true });
    }
  }, 30_000);
});
