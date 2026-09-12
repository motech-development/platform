import { screen } from '@testing-library/react';
import { describe, expect, expectTypeOf, it } from 'vitest';
import renderBreeze from '../../../test/render';
import { Icon, type IconProps } from './Icon';

expectTypeOf<IconProps>().not.toHaveProperty('className');
expectTypeOf<IconProps>().not.toHaveProperty('style');

describe('Icon', () => {
  it('provides an accessible name when the artwork conveys meaning', () => {
    renderBreeze(<Icon label="Choose a date" name="calendar" />);

    expect(
      screen.getByRole('img', { name: 'Choose a date' }),
    ).toBeInTheDocument();
  });

  it('is hidden from assistive technology when it is decorative', () => {
    const { container } = renderBreeze(<Icon name="calendar" />);

    expect(container.querySelector('svg')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('treats a whitespace-only label as absent', () => {
    const { container } = renderBreeze(<Icon label="   " name="calendar" />);

    expect(container.querySelector('svg')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('marks logical navigation artwork for RTL mirroring', () => {
    const { container } = renderBreeze(<Icon name="back" />);

    expect(container.querySelector('svg')).toHaveClass('breeze:rtl:rotate-180');
  });

  it('renders an accessible placeholder while loading', () => {
    renderBreeze(<Icon loading name="calendar" />);

    expect(screen.getByRole('progressbar', { name: 'Loading' })).toBeVisible();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
