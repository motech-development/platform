import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { RangeCalendar } from './RangeCalendar';

describe('RangeCalendar', () => {
  it('reports stable inclusive date ranges selected from the grid', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    renderBreeze(
      <RangeCalendar.Root
        defaultValue={{ end: '2026-07-14', start: '2026-07-13' }}
        onChange={onChange}
      >
        <RangeCalendar.Header>
          <RangeCalendar.PreviousButton />
          <RangeCalendar.Heading />
          <RangeCalendar.NextButton />
        </RangeCalendar.Header>
        <RangeCalendar.Grid />
      </RangeCalendar.Root>,
    );

    const calendar = within(screen.getByRole('application'));
    const calendarRoot = screen.getByRole('application');
    const grid = screen.getByRole('grid');
    const [previous] = calendar.getAllByRole('button', { name: 'Previous' });
    const [next] = calendar.getAllByRole('button', { name: 'Next' });

    expect(previous.querySelector('svg')).toHaveClass('lucide-arrow-left');
    expect(next.querySelector('svg')).toHaveClass('lucide-arrow-right');
    expect(calendarRoot).toHaveClass('w-full');
    expect(grid).toHaveClass('w-full', 'table-fixed');
    const selectedCells = screen.getAllByRole('button', {
      name: /13.*July.*2026/i,
    });

    expect(selectedCells).toHaveLength(2);
    selectedCells.forEach((cell) => {
      expect(cell).toHaveClass('w-full');
    });
    await user.click(screen.getByRole('button', { name: /15.*July.*2026/i }));
    await user.click(screen.getByRole('button', { name: /17.*July.*2026/i }));
    expect(onChange).toHaveBeenLastCalledWith({
      end: '2026-07-17',
      start: '2026-07-15',
    });
  });
});
