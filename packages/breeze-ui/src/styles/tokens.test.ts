// @vitest-environment node
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const tokens = readFileSync(resolve(import.meta.dirname, 'tokens.css'), 'utf8');

function declarations(pattern: RegExp) {
  const body = pattern.exec(tokens)?.[1];

  if (body === undefined) {
    throw new Error(`tokens.css has no block matching ${pattern.source}`);
  }

  return body
    .split(';')
    .map((declaration) => declaration.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

describe('tokens.css', () => {
  it('declares the same dark palette for the system preference and the explicit theme', () => {
    const systemDark = declarations(
      /@media \(prefers-color-scheme: dark\) \{\s*:root:not\(\[data-theme='light'\]\) \{([^}]*)\}/,
    );
    const explicitDark = declarations(/:root\[data-theme='dark'\] \{([^}]*)\}/);

    expect(systemDark.length).toBeGreaterThan(0);
    expect(explicitDark).toEqual(systemDark);
  });
});
