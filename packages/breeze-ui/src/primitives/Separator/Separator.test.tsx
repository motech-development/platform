import { screen } from '@testing-library/react';
import { describe, expect, expectTypeOf, it } from 'vitest';
import renderBreeze from '../../../test/render';
import { Separator, type SeparatorProps } from './Separator';

expectTypeOf<SeparatorProps>().not.toHaveProperty('className');
expectTypeOf<SeparatorProps>().not.toHaveProperty('loading');
expectTypeOf<SeparatorProps>().not.toHaveProperty('style');

describe('Separator', () => {
  it('exposes its orientation to assistive technology', () => {
    renderBreeze(<Separator orientation="vertical" />);

    expect(screen.getByRole('separator')).toHaveAttribute(
      'aria-orientation',
      'vertical',
    );
    expect(screen.getByRole('separator')).toHaveClass(
      'breeze:m-0',
      'breeze:block-size-full',
      'breeze:forced-colors:bg-[CanvasText]',
    );
  });
});
