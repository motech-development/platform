import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { TimeField } from './TimeField';

describe('TimeField', () => {
  it('reports stable time strings from locale-aware segment keyboard entry', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    renderBreeze(
      <TimeField.Root defaultValue="14:30" onChange={onChange}>
        <TimeField.Label>Appointment time</TimeField.Label>
        <TimeField.Input />
      </TimeField.Root>,
    );

    const minute = screen.getByRole('spinbutton', { name: /minute/i });

    minute.focus();
    await user.keyboard('{ArrowUp}');
    expect(onChange).toHaveBeenLastCalledWith('14:31');
  });
});
