import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { BreezeProvider } from '../../provider/BreezeProvider';
import type { ButtonVariant } from '../Button/Button';
import type { IconName } from '../Icon/Icon';
import {
  IconButton,
  type IconButtonProps,
  type IconButtonVariant,
} from './IconButton';

// Public prop contracts are verified by the package typecheck.
expectTypeOf<IconButtonProps>().not.toHaveProperty('className');
expectTypeOf<IconButtonProps>().not.toHaveProperty('style');
expectTypeOf<IconButtonProps>().not.toHaveProperty('slot');
expectTypeOf<IconButtonProps>().not.toHaveProperty('children');
expectTypeOf<IconButtonProps>().not.toHaveProperty('onClick');
expectTypeOf<IconButtonProps>().not.toHaveProperty('render');
expectTypeOf<IconButtonVariant>().toEqualTypeOf<ButtonVariant>();
expectTypeOf<IconButtonProps['label']>().toEqualTypeOf<string>();
expectTypeOf<IconButtonProps['name']>().toEqualTypeOf<IconName>();
expectTypeOf<{ name: 'close' }>().not.toExtend<IconButtonProps>();
expectTypeOf<{ label: 'Close'; name: 'close' }>().toExtend<IconButtonProps>();

describe('IconButton', () => {
  it('requires a BreezeProvider', () => {
    expect(() => render(<IconButton label="Close" name="close" />)).toThrow(
      'Breeze components must be rendered within BreezeProvider.',
    );
  });

  it('rejects a blank accessible label', () => {
    expect(() => renderBreeze(<IconButton label="  " name="close" />)).toThrow(
      'IconButton label must be non-empty.',
    );
  });

  it('names the action from its label and hides the artwork', () => {
    renderBreeze(<IconButton label="Close" name="close" />);

    const button = screen.getByRole('button', { name: 'Close' });

    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveTextContent('');
    expect(button.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('reports an action without exposing a DOM event', async () => {
    const onAction = vi.fn();

    renderBreeze(
      <IconButton label="More actions" name="more" onAction={onAction} />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'More actions' }));

    expect(onAction).toHaveBeenCalledExactlyOnceWith();
  });

  it('keeps its name and focus while loading and blocks repeat actions', async () => {
    const onAction = vi.fn();
    const button = (loading: boolean) => (
      <BreezeProvider locale="fr-FR" messages={{ loading: 'Chargement' }}>
        <IconButton
          label="Fermer"
          loading={loading}
          name="close"
          onAction={onAction}
        />
      </BreezeProvider>
    );
    const { rerender } = render(button(false));
    const element = screen.getByRole('button', { name: 'Fermer' });

    element.focus();
    rerender(button(true));

    expect(element).toHaveFocus();
    expect(element).toHaveAttribute('aria-busy', 'true');
    expect(element).toHaveAttribute('aria-disabled', 'true');
    expect(
      screen.getByRole('progressbar', { name: 'Chargement' }),
    ).toHaveAttribute('lang', 'fr-FR');
    expect(element.querySelector('[data-breeze-skeleton]')).toHaveAttribute(
      'aria-hidden',
      'true',
    );

    await userEvent.click(element);

    expect(onAction).not.toHaveBeenCalled();

    rerender(button(false));
    await userEvent.click(element);

    expect(onAction).toHaveBeenCalledExactlyOnceWith();
    expect(element).not.toHaveAttribute('aria-busy');
    expect(
      element.querySelector('[data-breeze-skeleton]'),
    ).not.toBeInTheDocument();
  });

  it('prevents activation when disabled', async () => {
    const onAction = vi.fn();

    renderBreeze(
      <IconButton disabled label="Delete" name="delete" onAction={onAction} />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(onAction).not.toHaveBeenCalled();
  });

  it('preserves accessible relationships and exposes its native focus target', () => {
    const ref = createRef<HTMLButtonElement>();

    renderBreeze(
      <>
        <span id="close-help">Unsaved changes are kept.</span>
        <IconButton
          aria-controls="details"
          aria-describedby="close-help"
          aria-expanded
          aria-haspopup="menu"
          id="close-details"
          label="Close details"
          name="close"
          ref={ref}
        />
      </>,
    );
    const button = screen.getByRole('button', { name: 'Close details' });

    ref.current?.focus();

    expect(button).toHaveFocus();
    expect(button).toHaveAttribute('id', 'close-details');
    expect(button).toHaveAttribute('aria-controls', 'details');
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(button).toHaveAttribute('aria-haspopup', 'menu');
    expect(button).toHaveAccessibleDescription('Unsaved changes are kept.');
  });
});
