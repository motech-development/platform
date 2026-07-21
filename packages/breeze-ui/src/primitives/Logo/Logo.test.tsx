import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import renderBreeze from '../../../test/render';
import { Logo } from './Logo';

describe('Logo', () => {
  it('renders only the canonical mark with its accessible brand name', () => {
    renderBreeze(<Logo />);

    const logo = screen.getByRole('img', { name: 'Motech Development' });

    expect(logo).toContainHTML('<svg');
    expect(logo).not.toHaveTextContent('MOTECH');
  });

  it.each([
    ['sm', 'text-base'],
    ['lg', 'text-2xl'],
  ] as const)('renders the canonical %s mark', (size, className) => {
    renderBreeze(<Logo size={size} />);

    const logo = screen.getByRole('img', { name: 'Motech Development' });

    expect(logo).toContainHTML('<svg');
    expect(logo).toHaveClass(className);
    expect(logo).not.toHaveTextContent('MOTECH');
  });
});
