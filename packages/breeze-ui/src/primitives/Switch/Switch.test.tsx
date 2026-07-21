import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { Switch } from './Switch';

describe('Switch', () => {
  it('reports semantic selected state through pointer and keyboard activation', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    renderBreeze(
      <Switch.Root onChange={onChange}>
        <Switch.Control>
          <Switch.Track>
            <Switch.Thumb />
          </Switch.Track>
          <Switch.Label>Email alerts</Switch.Label>
        </Switch.Control>
      </Switch.Root>,
    );

    const control = screen.getByRole('switch', { name: 'Email alerts' });

    await user.click(control);
    expect(onChange).toHaveBeenLastCalledWith(true);
    expect(control).toBeChecked();

    control.focus();
    await user.keyboard(' ');
    expect(onChange).toHaveBeenLastCalledWith(false);
  });

  it('associates required invalid guidance and forwards native form refs', () => {
    const inputRef = createRef<HTMLInputElement>();

    renderBreeze(
      <Switch.Root
        form="preferences"
        inputRef={inputRef}
        invalid
        name="alerts"
        required
        value="enabled"
      >
        <Switch.Control>
          <Switch.Track>
            <Switch.Thumb />
          </Switch.Track>
          <Switch.Label>Security alerts</Switch.Label>
        </Switch.Control>
        <Switch.Description>Recommended for all accounts.</Switch.Description>
        <Switch.Error>Security alerts are required.</Switch.Error>
      </Switch.Root>,
    );

    const control = screen.getByRole('switch', { name: 'Security alerts' });

    expect(inputRef.current).toBe(control);
    expect(control).toBeInvalid();
    expect(control).toBeRequired();
    expect(control).toHaveAttribute('form', 'preferences');
    expect(control).toHaveAttribute('name', 'alerts');
    expect(control).toHaveAccessibleDescription(
      'Recommended for all accounts. Security alerts are required.',
    );
  });

  it('supports controlled, read-only, and disabled states', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    renderBreeze(
      <div>
        <Switch.Root onChange={onChange} selected>
          <Switch.Control>
            <Switch.Track>
              <Switch.Thumb />
            </Switch.Track>
            <Switch.Label>Controlled</Switch.Label>
          </Switch.Control>
        </Switch.Root>
        <Switch.Root readOnly selected>
          <Switch.Control>
            <Switch.Track>
              <Switch.Thumb />
            </Switch.Track>
            <Switch.Label>Read only</Switch.Label>
          </Switch.Control>
        </Switch.Root>
        <Switch.Root disabled>
          <Switch.Control>
            <Switch.Track>
              <Switch.Thumb />
            </Switch.Track>
            <Switch.Label>Disabled</Switch.Label>
          </Switch.Control>
        </Switch.Root>
      </div>,
    );

    await user.click(screen.getByRole('switch', { name: 'Controlled' }));
    expect(onChange).toHaveBeenCalledWith(false);
    expect(screen.getByRole('switch', { name: 'Controlled' })).toBeChecked();

    await user.click(screen.getByRole('switch', { name: 'Read only' }));
    expect(screen.getByRole('switch', { name: 'Read only' })).toBeChecked();
    expect(screen.getByRole('switch', { name: 'Disabled' })).toBeDisabled();
  });
});
