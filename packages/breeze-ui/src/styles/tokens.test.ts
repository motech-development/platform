import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const tokens = readFileSync(resolve('src/styles/tokens.css'), 'utf8');

describe('theme-reactive shadow utilities', () => {
  it.each(['panel', 'overlay'])(
    'keeps the %s shadow in an @utility wrapper',
    (shadow) => {
      expect(tokens).toMatch(
        new RegExp(
          `@utility shadow-breeze-${shadow} \\{\\s+box-shadow: var\\(--breeze-shadow-${shadow}\\);\\s+\\}`,
        ),
      );
    },
  );
});
