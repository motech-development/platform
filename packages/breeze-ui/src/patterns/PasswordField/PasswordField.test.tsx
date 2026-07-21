import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { PasswordField } from './PasswordField';

describe('PasswordField', () => {
  it('supports semantic value changes and accessible visibility toggling', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    renderBreeze(
      <PasswordField
        defaultValue="secret"
        label="Password"
        onChange={onChange}
      />,
    );

    const input = screen.getByLabelText('Password');

    expect(input).toHaveAttribute('type', 'password');
    await user.click(screen.getByRole('button', { name: 'Show password' }));
    expect(input).toHaveAttribute('type', 'text');
    await user.click(screen.getByRole('button', { name: 'Hide password' }));
    expect(input).toHaveAttribute('type', 'password');
    await user.type(input, '!');
    expect(onChange).toHaveBeenLastCalledWith('secret!');
  });

  it('supports controlled values', async () => {
    const user = userEvent.setup();

    function ControlledPassword() {
      const [value, setValue] = useState('secret');

      return (
        <PasswordField
          label="Controlled password"
          onChange={setValue}
          value={value}
        />
      );
    }

    renderBreeze(<ControlledPassword />);

    await user.type(screen.getByLabelText('Controlled password'), '!');
    expect(screen.getByLabelText('Controlled password')).toHaveValue('secret!');
  });

  it('preserves read-only values', async () => {
    const user = userEvent.setup();

    renderBreeze(
      <PasswordField label="Read-only password" readOnly value="fixed" />,
    );

    const input = screen.getByLabelText('Read-only password');

    await user.type(input, '!');
    expect(input).toHaveValue('fixed');
    await user.click(screen.getByRole('button', { name: 'Show password' }));
    expect(input).toHaveAttribute('type', 'text');
  });

  it('prevents visibility changes while disabled', async () => {
    const user = userEvent.setup();

    renderBreeze(
      <PasswordField defaultValue="fixed" disabled label="Disabled password" />,
    );

    const input = screen.getByLabelText('Disabled password');
    const button = screen.getByRole('button', { name: 'Show password' });

    expect(button).toBeDisabled();
    await user.click(button);
    expect(input).toHaveAttribute('type', 'password');
  });
});
