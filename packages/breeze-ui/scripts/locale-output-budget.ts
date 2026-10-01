import { gzipSync } from 'node:zlib';
import type { Plugin } from 'vite';

export const MAX_GZIP_BYTES = 140 * 1024;
export const REACT_ARIA_LOCALES = ['en'] as const;

export interface LocaleJavaScriptOutput {
  code: string;
  dynamicImports: readonly string[];
  fileName: string;
  imports: readonly string[];
  mapSources?: readonly string[];
}

export interface LocaleOutputFileMeasurement {
  fileName: string;
  gzipBytes: number;
  rawBytes: number;
}

export interface LocaleOutputReport {
  errors: string[];
  files: LocaleOutputFileMeasurement[];
  totalGzipBytes: number;
  totalRawBytes: number;
}

const reactAriaImportPattern = /^(?:react-aria|react-aria-components)(?:\/|$)/;
const reactAriaSourcePattern =
  /(?:^|[/\\])(?:react-aria|react-aria-components|react-stately|@react-aria|@react-stately)(?:[/\\]|$)/;
const localeSourcePattern = /(?:^|[/\\])([a-z]{2})-[A-Z]{2}\.[cm]?[jt]s$/;
const reactAriaLanguages = new Set(
  REACT_ARIA_LOCALES.map((locale) => locale.split('-')[0] ?? locale),
);

export function inspectLocaleOutput(
  outputs: readonly LocaleJavaScriptOutput[],
  maximumGzipBytes = MAX_GZIP_BYTES,
): LocaleOutputReport {
  const files = outputs.map(({ code, fileName }) => {
    const source = Buffer.from(code);

    return {
      fileName,
      gzipBytes: gzipSync(source, { level: 9 }).length,
      rawBytes: source.length,
    };
  });
  const totalRawBytes = files.reduce((total, file) => total + file.rawBytes, 0);
  const totalGzipBytes = files.reduce(
    (total, file) => total + file.gzipBytes,
    0,
  );
  const errors: string[] = [];

  if (files.length === 0) {
    errors.push('No library JavaScript chunks were emitted');
  }

  const localeSources = outputs.flatMap((output) => {
    if (output.mapSources === undefined) {
      errors.push(`Missing source map for locale audit: ${output.fileName}`);
    }

    return (output.mapSources ?? [])
      .filter(
        (source) =>
          reactAriaSourcePattern.test(source) &&
          localeSourcePattern.test(source),
      )
      .map((source) => ({ fileName: output.fileName, source }));
  });
  const approvedLocaleSources = localeSources.filter(({ source }) => {
    const locale = source.match(localeSourcePattern)?.[1];

    return locale !== undefined && reactAriaLanguages.has(locale);
  });
  const nonEnglishLocaleSources = localeSources.filter(
    ({ source }) =>
      !approvedLocaleSources.some(
        (approvedSource) => approvedSource.source === source,
      ),
  );

  nonEnglishLocaleSources.forEach(({ fileName, source }) => {
    errors.push(
      `Non-English React Aria locale module in ${fileName}: ${source}`,
    );
  });

  if (approvedLocaleSources.length === 0) {
    errors.push(
      `No React Aria locale modules remain for the approved languages: ${Array.from(reactAriaLanguages).join(', ')}`,
    );
  }

  outputs.forEach((output) => {
    const externalReactAriaImports = [
      ...output.imports,
      ...output.dynamicImports,
    ].filter((specifier) => reactAriaImportPattern.test(specifier));

    new Set(externalReactAriaImports).forEach((specifier) => {
      errors.push(`React Aria packages remain external: ${specifier}`);
    });
  });

  if (totalGzipBytes > maximumGzipBytes) {
    errors.push(
      `Breeze UI JavaScript gzip size ${totalGzipBytes} B exceeds the ${maximumGzipBytes} B budget`,
    );
  }

  return {
    errors,
    files,
    totalGzipBytes,
    totalRawBytes,
  };
}

export function createLocaleOutputBudgetPlugin(): Plugin {
  return {
    apply: 'build',
    generateBundle(_options, bundle) {
      const outputs = Object.values(bundle).flatMap((output) => {
        if (
          output.type !== 'chunk' ||
          !output.fileName.endsWith('.js') ||
          output.code.length === 0
        ) {
          return [];
        }

        return [
          {
            code: output.code,
            dynamicImports: output.dynamicImports,
            fileName: output.fileName,
            imports: output.imports,
            mapSources: output.map?.sources,
          },
        ];
      });
      const report = inspectLocaleOutput(outputs);

      report.files.forEach((file) => {
        this.info(
          `Breeze UI JavaScript ${file.fileName}: ${file.rawBytes} B raw, ${file.gzipBytes} B gzip-9`,
        );
      });

      this.info(
        `Breeze UI JavaScript total: ${report.totalRawBytes} B raw, ${report.totalGzipBytes} B gzip-9 (budget ${MAX_GZIP_BYTES} B)`,
      );

      if (report.errors.length > 0) {
        this.error(report.errors.join('\n'));
      }
    },
    name: 'breeze-locale-output-budget',
  };
}
