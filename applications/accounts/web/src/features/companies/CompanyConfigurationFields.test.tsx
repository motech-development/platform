import { BreezeProvider } from '@motech-development/breeze-ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { YearEndFields } from './CompanyConfigurationFields';

describe('YearEndFields', () => {
  it('reports selected day and month values', async () => {
    const user = userEvent.setup();
    const onDayChange = vi.fn();
    const onMonthChange = vi.fn();

    render(
      <BreezeProvider locale="en-GB">
        <YearEndFields
          day={31}
          dayLabel="Day"
          month={2}
          monthLabel="Month"
          months={['January', 'February', 'March', 'April']}
          onDayChange={onDayChange}
          onMonthChange={onMonthChange}
        />
      </BreezeProvider>,
    );

    await user.click(screen.getByRole('button', { name: /Day/ }));
    await user.click(screen.getByRole('option', { name: '1' }));
    expect(onDayChange).toHaveBeenCalledWith(1);

    await user.click(screen.getByRole('button', { name: /Month/ }));
    await user.click(screen.getByRole('option', { name: 'April' }));
    expect(onMonthChange).toHaveBeenCalledWith(3);
  });
});
