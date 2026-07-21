import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { TextField } from './TextField';

describe('TextField', () => {
  it('associates its anatomy and reports semantic value changes', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    renderBreeze(
      <TextField.Root onChange={onChange}>
        <TextField.Label>Email address</TextField.Label>
        <TextField.Input />
        <TextField.Description>Used for account notices.</TextField.Description>
      </TextField.Root>,
    );

    const input = screen.getByRole('textbox', { name: 'Email address' });

    expect(input).toHaveClass(
      'min-h-11',
      'px-3',
      'py-2.5',
      'font-[family-name:var(--breeze-font-body)]',
      'text-base',
      'font-normal',
      'leading-[1.4]',
      'data-[hovered]:border-[var(--breeze-primary)]',
      'data-[focus-visible]:outline-2',
    );
    expect(screen.getByText('Email address')).toHaveClass('text-base');
    await user.type(input, 'dev@example.com');

    expect(onChange).toHaveBeenLastCalledWith('dev@example.com');
    expect(input).toHaveAccessibleDescription('Used for account notices.');
  });

  it('associates validation errors and native required state', () => {
    renderBreeze(
      <TextField.Root invalid required>
        <TextField.Label>Reference</TextField.Label>
        <TextField.Input />
        <TextField.Error>A reference is required.</TextField.Error>
      </TextField.Root>,
    );

    const input = screen.getByRole('textbox', { name: 'Reference' });

    expect(input).toBeInvalid();
    expect(input).toBeRequired();
    expect(input).toHaveClass('aria-invalid:border-[var(--breeze-danger)]');
    expect(input).toHaveAccessibleDescription('A reference is required.');
  });

  it('preserves controlled values and makes read-only intent observable', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { unmount } = renderBreeze(
      <TextField.Root onChange={onChange} value="fixed">
        <TextField.Label>Controlled</TextField.Label>
        <TextField.Input />
      </TextField.Root>,
    );

    const input = screen.getByRole('textbox', { name: 'Controlled' });

    await user.type(input, ' value');
    expect(onChange).toHaveBeenCalled();
    expect(input).toHaveValue('fixed');

    unmount();
    renderBreeze(
      <TextField.Root readOnly value="immutable">
        <TextField.Label>Controlled</TextField.Label>
        <TextField.Input />
      </TextField.Root>,
    );
    const readOnlyInput = screen.getByRole('textbox', { name: 'Controlled' });

    expect(readOnlyInput).toHaveAttribute('readonly');
    expect(readOnlyInput).toHaveClass(
      'read-only:cursor-default',
      'read-only:bg-[var(--breeze-surface-subtle)]',
    );
  });

  it('forwards refs and native input attributes for form participation', () => {
    const inputRef = createRef<HTMLInputElement>();

    renderBreeze(
      <form data-testid="form">
        <TextField.Root defaultValue="AB-12">
          <TextField.Label>Code</TextField.Label>
          <TextField.Input
            autoComplete="off"
            form="external-form"
            id="code"
            name="code"
            ref={inputRef}
          />
        </TextField.Root>
      </form>,
    );

    expect(inputRef.current).toBe(
      screen.getByRole('textbox', { name: 'Code' }),
    );
    expect(inputRef.current).toHaveAttribute('name', 'code');
    expect(inputRef.current).toHaveAttribute('form', 'external-form');
    expect(inputRef.current).toHaveAttribute('autocomplete', 'off');
  });
});
