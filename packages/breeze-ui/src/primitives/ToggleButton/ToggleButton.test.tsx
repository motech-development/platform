import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { ToggleButton } from './ToggleButton';

describe('ToggleButton', () => {
  it('supports uncontrolled semantic state changes', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    renderBreeze(<ToggleButton onChange={onChange}>Bold</ToggleButton>);
    const toggle = screen.getByRole('button', { name: 'Bold' });

    await user.click(toggle);

    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('obeys controlled state', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    renderBreeze(
      <ToggleButton onChange={onChange} selected={false}>
        Bold
      </ToggleButton>,
    );
    const toggle = screen.getByRole('button', { name: 'Bold' });

    await user.click(toggle);

    expect(onChange).toHaveBeenCalledWith(true);
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
  });

  it('keeps read-only controlled state focusable and unchanged', async () => {
    const user = userEvent.setup();

    renderBreeze(
      <ToggleButton readOnly selected>
        Bold
      </ToggleButton>,
    );
    const toggle = screen.getByRole('button', { name: 'Bold' });

    toggle.focus();
    await user.keyboard('{Enter}');

    expect(toggle).toHaveFocus();
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    expect(toggle).not.toHaveAttribute('aria-disabled');
  });

  it('forwards relevant native button attributes', () => {
    renderBreeze(
      <ToggleButton
        aria-controls="formatting"
        aria-labelledby="bold-label"
        id="bold-button"
      >
        Bold
      </ToggleButton>,
    );

    const toggle = screen.getByRole('button');

    expect(toggle).toHaveAttribute('id', 'bold-button');
    expect(toggle).toHaveAttribute('aria-controls', 'formatting');
    expect(toggle).toHaveAttribute('aria-labelledby', 'bold-label');
  });
});
