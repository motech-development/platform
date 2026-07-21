import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { Button } from './Button';

describe('Button', () => {
  it('uses accessible standard control sizing and type', () => {
    renderBreeze(<Button>Save</Button>);

    const button = screen.getByRole('button', { name: 'Save' });

    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveClass(
      'gap-2',
      'leading-[1.4]',
      'min-h-11',
      'text-base',
    );
  });

  it('reports pointer and keyboard activation through onAction', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();

    renderBreeze(<Button onAction={onAction}>Save</Button>);

    await user.click(screen.getByRole('button', { name: 'Save' }));
    screen.getByRole('button').focus();
    await user.keyboard('{Enter}');

    expect(onAction).toHaveBeenCalledTimes(2);
  });

  it('announces loading and prevents activation without removing focusability', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();

    renderBreeze(
      <Button loading onAction={onAction}>
        Save
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Save' });

    await user.click(button);
    expect(onAction).not.toHaveBeenCalled();
    expect(button).not.toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
  });

  it('forwards relevant native attributes without changing activation semantics', () => {
    renderBreeze(
      <Button
        aria-controls="editor"
        aria-labelledby="save-label"
        formAction="/save"
        id="save-button"
        type="submit"
      >
        Save
      </Button>,
    );

    expect(screen.getByRole('button')).toHaveAttribute('id', 'save-button');
    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-controls',
      'editor',
    );
    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-labelledby',
      'save-label',
    );
    expect(screen.getByRole('button')).toHaveAttribute('formaction', '/save');
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('renders a text action without control chrome while retaining state styles', () => {
    renderBreeze(<Button appearance="text">Add category</Button>);

    expect(screen.getByRole('button', { name: 'Add category' })).toHaveClass(
      'breeze-action',
      'min-h-11',
      'border-0',
      'bg-transparent',
      'px-1',
      'py-0',
      'data-[hovered]:bg-transparent',
      'data-[pressed]:translate-y-px',
    );
  });

  it('uses canonical ink and strong border for secondary outline actions', () => {
    renderBreeze(
      <Button appearance="outline" variant="secondary">
        View file
      </Button>,
    );

    expect(screen.getByRole('button', { name: 'View file' })).toHaveClass(
      'border-[var(--breeze-border-strong)]',
      'bg-[var(--breeze-surface)]',
      'text-[var(--breeze-ink)]',
    );
  });
});
