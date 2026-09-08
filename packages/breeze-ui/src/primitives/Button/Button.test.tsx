import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { FormEvent } from 'react';
import { createRef } from 'react';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { BreezeProvider } from '../../provider/BreezeProvider';
import { Button, type ButtonProps } from './Button';

// Public prop contracts are verified by the package typecheck.
expectTypeOf<ButtonProps>().not.toHaveProperty('className');
expectTypeOf<ButtonProps>().not.toHaveProperty('style');
expectTypeOf<ButtonProps>().not.toHaveProperty('slot');
expectTypeOf<ButtonProps>().not.toHaveProperty('onClick');
expectTypeOf<ButtonProps>().not.toHaveProperty('render');

describe('Button', () => {
  it('reports an action without exposing a DOM event', async () => {
    const onAction = vi.fn();

    renderBreeze(<Button onAction={onAction}>Save changes</Button>);

    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(onAction).toHaveBeenCalledExactlyOnceWith();
  });

  it('prevents repeat actions while loading and restores activation afterwards', async () => {
    const onAction = vi.fn();
    const { rerender } = renderBreeze(
      <Button onAction={onAction}>Save changes</Button>,
    );
    const button = screen.getByRole('button', { name: 'Save changes' });

    await userEvent.click(button);
    onAction.mockClear();
    rerender(
      <BreezeProvider locale="en-GB">
        <Button loading onAction={onAction}>
          Save changes
        </Button>
      </BreezeProvider>,
    );

    expect(button).toHaveFocus();
    expect(button).toHaveAccessibleName('Save changes');
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(button.querySelector('[data-breeze-skeleton]')).toHaveAttribute(
      'aria-hidden',
      'true',
    );

    await userEvent.click(button);

    expect(onAction).not.toHaveBeenCalled();

    rerender(
      <BreezeProvider locale="en-GB">
        <Button onAction={onAction}>Save changes</Button>
      </BreezeProvider>,
    );
    await userEvent.click(button);

    expect(onAction).toHaveBeenCalledExactlyOnceWith();
    expect(button).not.toHaveAttribute('aria-busy');
    expect(
      button.querySelector('[data-breeze-skeleton]'),
    ).not.toBeInTheDocument();
  });

  it('does not submit its containing form unless requested', async () => {
    const onSubmit = vi.fn((event: FormEvent) => event.preventDefault());

    renderBreeze(
      <form onSubmit={onSubmit}>
        <Button>Preview</Button>
        <Button type="submit">Save</Button>
      </form>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Preview' }));

    expect(onSubmit).not.toHaveBeenCalled();

    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it('associates an external submit button with its form and submitted value', async () => {
    const submitted = vi.fn();

    renderBreeze(
      <>
        <form
          id="editor"
          onSubmit={(event) => {
            event.preventDefault();
            const { submitter } = event.nativeEvent;

            submitted(
              new FormData(event.currentTarget, submitter).get('intent'),
            );
          }}
        />
        <Button form="editor" name="intent" type="submit" value="save">
          Save
        </Button>
      </>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(submitted).toHaveBeenCalledExactlyOnceWith('save');
  });

  it.each(['disabled', 'loading'] as const)(
    'prevents actions and form submission when %s',
    async (state) => {
      const onAction = vi.fn();
      const onSubmit = vi.fn((event: FormEvent) => event.preventDefault());

      renderBreeze(
        <form onSubmit={onSubmit}>
          <Button
            disabled={state === 'disabled'}
            loading={state === 'loading'}
            onAction={onAction}
            type="submit"
          >
            Save
          </Button>
        </form>,
      );

      await userEvent.click(screen.getByRole('button', { name: 'Save' }));

      expect(onAction).not.toHaveBeenCalled();
      expect(onSubmit).not.toHaveBeenCalled();
    },
  );

  it('preserves accessible relationships and exposes its native focus target', () => {
    const ref = createRef<HTMLButtonElement>();

    renderBreeze(
      <>
        <span id="action-label">Save draft</span>
        <span id="action-help">You can publish later.</span>
        <Button
          aria-describedby="action-help"
          aria-labelledby="action-label"
          ref={ref}
        >
          Save
        </Button>
      </>,
    );
    const button = screen.getByRole('button', { name: 'Save draft' });

    ref.current?.focus();

    expect(button).toHaveFocus();
    expect(button).toHaveAccessibleDescription('You can publish later.');
  });
});
