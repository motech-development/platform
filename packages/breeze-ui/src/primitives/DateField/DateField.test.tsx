import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { DateField } from './DateField';

describe('DateField', () => {
  it('reports stable date strings from locale-aware segment keyboard entry', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    renderBreeze(
      <DateField.Root defaultValue="2026-07-13" onChange={onChange}>
        <DateField.Label>Appointment date</DateField.Label>
        <DateField.Input />
      </DateField.Root>,
    );

    const day = screen.getByRole('spinbutton', { name: /day/i });

    day.focus();
    await user.keyboard('{ArrowUp}');
    expect(onChange).toHaveBeenLastCalledWith('2026-07-14');
  });
});
