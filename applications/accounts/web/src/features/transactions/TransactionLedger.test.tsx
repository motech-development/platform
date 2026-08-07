import { BreezeProvider } from '@motech-development/breeze-ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TransactionLedger } from './TransactionLedger';

const mocks = vi.hoisted(() => ({
  navigate: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@tanstack/react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-router')>()),
  useNavigate: () => mocks.navigate,
}));

vi.mock('@motech-development/breeze-ui/icons', async (importOriginal) => ({
  ...(await importOriginal<
    typeof import('@motech-development/breeze-ui/icons')
  >()),
  ArrowLeftIcon: () => <svg aria-hidden="true" />,
  ArrowRightIcon: () => <svg aria-hidden="true" />,
  WarningIcon: () => <svg aria-hidden="true" />,
}));

describe('TransactionLedger', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('opens a transaction when any part of its row is clicked', async () => {
    const user = userEvent.setup();

    render(
      <BreezeProvider locale="en-GB">
        <TransactionLedger
          companyId="company-id"
          currencyCode="GBP"
          transactions={[
            {
              amount: 2500,
              attachment: 'invoice.pdf',
              category: 'Sales',
              date: '2024-12-24T00:00:00.000Z',
              description: 'Some work',
              id: 'transaction-id',
              name: 'Example client',
            },
          ]}
        />
      </BreezeProvider>,
    );

    await user.click(
      screen.getByRole('gridcell', {
        name: '+£2,500.00',
      }),
    );

    expect(
      screen.queryByRole('button', { name: 'Load older transactions' }),
    ).not.toBeInTheDocument();
    expect(mocks.navigate).toHaveBeenCalledWith({
      params: {
        companyId: 'company-id',
        transactionId: 'transaction-id',
      },
      to: '/my-companies/accounts/$companyId/view-transaction/$transactionId',
    });
  });
});
