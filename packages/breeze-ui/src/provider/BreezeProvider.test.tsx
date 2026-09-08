import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from '../primitives/Button/Button';
import { BreezeProvider } from './BreezeProvider';

describe('BreezeProvider', () => {
  it('rejects a component outside the required provider', () => {
    expect(() => render(<Button>Save</Button>)).toThrow(
      'Breeze components must be rendered within BreezeProvider.',
    );
  });

  it('updates the language inherited by its content when the locale changes', () => {
    const { rerender } = render(
      <BreezeProvider locale="en-GB">
        <Button>Save</Button>
      </BreezeProvider>,
    );

    expect(screen.getByRole('button').closest('[lang]')).toHaveAttribute(
      'lang',
      'en-GB',
    );

    rerender(
      <BreezeProvider locale="fr-FR">
        <Button>Enregistrer</Button>
      </BreezeProvider>,
    );

    expect(
      screen.getByRole('button', { name: 'Enregistrer' }).closest('[lang]'),
    ).toHaveAttribute('lang', 'fr-FR');
  });
});
