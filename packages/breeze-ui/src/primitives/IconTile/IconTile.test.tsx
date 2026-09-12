import { screen } from '@testing-library/react';
import { describe, expect, expectTypeOf, it } from 'vitest';
import renderBreeze from '../../../test/render';
import { IconTile, type IconTileProps } from './IconTile';

expectTypeOf<IconTileProps>().not.toHaveProperty('className');
expectTypeOf<IconTileProps>().not.toHaveProperty('loading');
expectTypeOf<IconTileProps>().not.toHaveProperty('style');

describe('IconTile', () => {
  it('carries an accessible name when used without accompanying text', () => {
    renderBreeze(
      <IconTile label="Money received" name="moneyIn" tone="positive" />,
    );

    expect(
      screen.getByRole('img', { name: 'Money received' }),
    ).toBeInTheDocument();
  });
});
