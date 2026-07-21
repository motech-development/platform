import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { AddIcon, CloseIcon } from '../../icons';
import { IconButton } from './IconButton';

describe('IconButton', () => {
  it('keeps the standard icon target square', () => {
    renderBreeze(
      <IconButton aria-label="Add item">
        <AddIcon />
      </IconButton>,
    );

    expect(screen.getByRole('button', { name: 'Add item' })).toHaveClass(
      'size-11',
    );
  });

  it('uses its required label and semantic activation callback', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();

    renderBreeze(
      <IconButton aria-label="Add item" onAction={onAction}>
        <AddIcon />
      </IconButton>,
    );
    await user.click(screen.getByRole('button', { name: 'Add item' }));

    expect(onAction).toHaveBeenCalledOnce();
  });

  it('announces its loading state', () => {
    renderBreeze(
      <IconButton aria-label="Add item" loading>
        <AddIcon />
      </IconButton>,
    );

    expect(screen.getByRole('button', { name: 'Add item' })).toHaveAttribute(
      'aria-busy',
      'true',
    );
  });

  it('renders a borderless semantic subtle action', () => {
    renderBreeze(
      <IconButton
        appearance="subtle"
        aria-label="Remove category"
        variant="danger"
      >
        <CloseIcon />
      </IconButton>,
    );

    expect(screen.getByRole('button', { name: 'Remove category' })).toHaveClass(
      'breeze-action',
      'border-0',
      'bg-[var(--breeze-danger-soft)]',
      'text-[var(--breeze-danger)]',
    );
  });

  it('forwards relevant native button attributes', () => {
    renderBreeze(
      <IconButton
        aria-controls="menu"
        aria-label="Open menu"
        aria-labelledby="menu-label"
        formAction="/menu"
        id="menu-button"
        type="submit"
      >
        <AddIcon />
      </IconButton>,
    );

    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('id', 'menu-button');
    expect(button).toHaveAttribute('aria-controls', 'menu');
    expect(button).toHaveAttribute('aria-labelledby', 'menu-label');
    expect(button).toHaveAttribute('formaction', '/menu');
    expect(button).toHaveAttribute('type', 'submit');
  });
});
