import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('reports semantic checked state through pointer and keyboard activation', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    renderBreeze(
      <Checkbox.Root onChange={onChange}>
        <Checkbox.Control>
          <Checkbox.Indicator />
          <Checkbox.Label>Accept terms</Checkbox.Label>
        </Checkbox.Control>
      </Checkbox.Root>,
    );

    const checkbox = screen.getByRole('checkbox', { name: 'Accept terms' });

    await user.click(checkbox);
    expect(onChange).toHaveBeenLastCalledWith(true);
    expect(checkbox).toBeChecked();

    checkbox.focus();
    await user.keyboard(' ');
    expect(onChange).toHaveBeenLastCalledWith(false);
  });

  it('associates descriptions and errors with required invalid state', () => {
    renderBreeze(
      <Checkbox.Root invalid required>
        <Checkbox.Control>
          <Checkbox.Indicator />
          <Checkbox.Label>Confirm accuracy</Checkbox.Label>
        </Checkbox.Control>
        <Checkbox.Description>Review the details first.</Checkbox.Description>
        <Checkbox.Error>Confirmation is required.</Checkbox.Error>
      </Checkbox.Root>,
    );

    const checkbox = screen.getByRole('checkbox', { name: 'Confirm accuracy' });

    expect(checkbox).toBeInvalid();
    expect(checkbox).toBeRequired();
    expect(checkbox).toHaveAccessibleDescription(
      'Review the details first. Confirmation is required.',
    );
  });

  it('supports indeterminate, disabled, and explicit read-only states', async () => {
    const user = userEvent.setup();

    renderBreeze(
      <div>
        <Checkbox.Root indeterminate>
          <Checkbox.Control>
            <Checkbox.Indicator />
            <Checkbox.Label>Mixed</Checkbox.Label>
          </Checkbox.Control>
        </Checkbox.Root>
        <Checkbox.Root disabled defaultSelected>
          <Checkbox.Control>
            <Checkbox.Indicator />
            <Checkbox.Label>Disabled</Checkbox.Label>
          </Checkbox.Control>
        </Checkbox.Root>
        <Checkbox.Root readOnly selected>
          <Checkbox.Control>
            <Checkbox.Indicator />
            <Checkbox.Label>Read only</Checkbox.Label>
          </Checkbox.Control>
        </Checkbox.Root>
      </div>,
    );

    expect(
      screen.getByRole('checkbox', { name: 'Mixed' }),
    ).toBePartiallyChecked();
    expect(screen.getByRole('checkbox', { name: 'Disabled' })).toBeDisabled();
    const readOnly = screen.getByRole('checkbox', { name: 'Read only' });

    await user.click(readOnly);
    expect(readOnly).toBeChecked();
  });

  it('forwards field and input refs into native form participation', () => {
    const rootRef = createRef<HTMLDivElement>();
    const inputRef = createRef<HTMLInputElement>();

    renderBreeze(
      <Checkbox.Root
        defaultSelected
        form="settings"
        inputRef={inputRef}
        name="alerts"
        ref={rootRef}
        value="email"
      >
        <Checkbox.Control>
          <Checkbox.Indicator />
          <Checkbox.Label>Email alerts</Checkbox.Label>
        </Checkbox.Control>
      </Checkbox.Root>,
    );

    expect(rootRef.current).toBeInTheDocument();
    expect(inputRef.current).toBe(
      screen.getByRole('checkbox', { name: 'Email alerts' }),
    );
    expect(inputRef.current).toHaveAttribute('form', 'settings');
    expect(inputRef.current).toHaveAttribute('name', 'alerts');
    expect(inputRef.current).toHaveAttribute('value', 'email');
  });
});
