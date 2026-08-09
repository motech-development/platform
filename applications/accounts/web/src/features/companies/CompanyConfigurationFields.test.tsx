import { BreezeProvider } from '@motech-development/breeze-ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { YearEndFields } from './CompanyConfigurationFields';

describe('YearEndFields', () => {
  it('reports changed day and selected month values', async () => {
    const user = userEvent.setup();
    const onDayChange = vi.fn();
    const onMonthChange = vi.fn();

    render(
      <BreezeProvider locale="en-GB">
        <YearEndFields
          day={31}
          dayError={null}
          dayInvalid={false}
          dayLabel="Day"
          month={2}
          monthLabel="Month"
          months={['January', 'February', 'March', 'April']}
          onDayBlur={vi.fn()}
          onDayChange={onDayChange}
          onMonthChange={onMonthChange}
        />
      </BreezeProvider>,
    );

    screen.getByRole('textbox', { name: 'Day' }).focus();
    await user.keyboard('{ArrowDown}');
    expect(onDayChange).toHaveBeenCalledWith(30);

    await user.click(screen.getByRole('button', { name: /Month/ }));
    await user.click(screen.getByRole('option', { name: 'April' }));
    expect(onMonthChange).toHaveBeenCalledWith(3);
  });

  it('allows leap day while limiting February to 29 days', async () => {
    const user = userEvent.setup();

    render(
      <BreezeProvider locale="en-GB">
        <YearEndFields
          day={29}
          dayError={null}
          dayInvalid={false}
          dayLabel="Day"
          month={1}
          monthLabel="Month"
          months={['January', 'February']}
          onDayBlur={vi.fn()}
          onDayChange={vi.fn()}
          onMonthChange={vi.fn()}
        />
      </BreezeProvider>,
    );

    const dayInput = screen.getByRole('textbox', { name: 'Day' });

    dayInput.focus();
    await user.keyboard('{ArrowUp}');
    expect(dayInput).toHaveValue('29');
  });

  it('associates a month-aware validation error with the day input', () => {
    render(
      <BreezeProvider locale="en-GB">
        <YearEndFields
          day={30}
          dayError="Enter a valid day for the selected month"
          dayInvalid
          dayLabel="Day"
          month={1}
          monthLabel="Month"
          months={['January', 'February']}
          onDayBlur={vi.fn()}
          onDayChange={vi.fn()}
          onMonthChange={vi.fn()}
        />
      </BreezeProvider>,
    );

    expect(screen.getByRole('textbox', { name: 'Day' })).toBeInvalid();
    expect(
      screen.getByRole('textbox', { name: 'Day' }),
    ).toHaveAccessibleDescription('Enter a valid day for the selected month');
  });
});
