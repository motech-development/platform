import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import renderBreeze from '../../../test/render';
import { Button } from '../../primitives/Button/Button';
import { FormActions } from './FormActions';

describe('FormActions', () => {
  it('separates leading and trailing desktop responsibilities in a named group', () => {
    renderBreeze(
      <FormActions
        aria-label="Form actions"
        cancel={<Button appearance="outline">Cancel</Button>}
        danger={<Button variant="danger">Delete record</Button>}
        primary={<Button type="submit">Save record</Button>}
      />,
    );

    const group = screen.getByRole('group', { name: 'Form actions' });

    expect(group).toBeVisible();
    expect(group).toHaveClass('mt-auto', 'gap-3', 'pt-0.5', 'sm:gap-2.5');
    expect(group).not.toHaveClass('border-t', 'pt-6');
    expect(
      screen.getAllByRole('button').map((button) => button.textContent),
    ).toEqual(['Delete record', 'Cancel', 'Save record']);
    expect(
      screen.getByRole('button', { name: 'Delete record' }).parentElement,
    ).toHaveAttribute('data-action-position', 'leading');
    expect(
      screen.getByRole('button', { name: 'Save record' }).parentElement,
    ).toHaveAttribute('data-action-position', 'trailing');
    expect(
      screen.getByRole('button', { name: 'Save record' }).parentElement,
    ).toHaveClass('order-1');
    expect(
      screen.getByRole('button', { name: 'Cancel' }).parentElement,
    ).toHaveClass(
      'order-3',
      '[&_button]:border-[var(--breeze-border-strong)]',
      '[&_button]:bg-[var(--breeze-surface)]',
      '[&_button]:text-[var(--breeze-ink)]',
    );
    expect(
      screen.getByRole('button', { name: 'Delete record' }).parentElement,
    ).toHaveClass('order-5');
  });

  it('adds the canonical separator and spacing only when divided', () => {
    const { container } = renderBreeze(
      <FormActions
        divided
        primary={<Button type="submit">Save changes</Button>}
      />,
    );

    expect(container.querySelector('[data-breeze-root] > div')).toHaveClass(
      'border-t',
      'border-[var(--breeze-border)]',
      'pt-6',
    );
  });
});
