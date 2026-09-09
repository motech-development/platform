import { screen } from '@testing-library/react';
import { describe, expect, expectTypeOf, it } from 'vitest';
import renderBreeze from '../../../test/render';
import { Stack, type StackProps } from './Stack';

expectTypeOf<StackProps>().not.toHaveProperty('className');
expectTypeOf<StackProps>().not.toHaveProperty('style');
expectTypeOf<StackProps['gap']>().toEqualTypeOf<
  0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | undefined
>();

describe('Stack', () => {
  it('groups content in the requested semantic element', () => {
    renderBreeze(
      <Stack element="section" gap={4} aria-label="Summary">
        <span>Balance</span>
        <span>VAT owed</span>
      </Stack>,
    );

    expect(screen.getByRole('region', { name: 'Summary' })).toHaveTextContent(
      'BalanceVAT owed',
    );
  });

  it('replaces unavailable content with an accessible placeholder', () => {
    renderBreeze(<Stack loading>Stack content</Stack>);

    expect(screen.getByRole('progressbar', { name: 'Loading' })).toBeVisible();
    expect(screen.queryByText('Stack content')).not.toBeInTheDocument();
  });
});
