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
  CalendarIcon: () => <svg aria-hidden="true" />,
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

  it('excludes Pending Transactions from exact decimal daily totals and exposes their state', () => {
    render(
      <BreezeProvider locale="en-GB">
        <TransactionLedger
          companyId="company-id"
          currencyCode="GBP"
          transactions={[
            {
              amount: 0.1,
              attachment: 'invoice.pdf',
              category: 'Sales',
              date: '2026-08-15T00:00:00.000Z',
              description: 'First confirmed sale',
              id: 'confirmed-1',
              name: 'Alpha client',
              scheduled: false,
              status: 'confirmed',
            },
            {
              amount: 0.2,
              attachment: 'invoice.pdf',
              category: 'Sales',
              date: '2026-08-15T00:00:00.000Z',
              description: 'Second confirmed sale',
              id: 'confirmed-2',
              name: 'Beta client',
              scheduled: false,
              status: 'confirmed',
            },
            {
              amount: -120,
              attachment: null,
              category: 'Professional fees',
              date: '2026-08-15T00:00:00.000Z',
              description: 'Quarterly bookkeeping',
              id: 'pending-1',
              name: 'Oak & Co Accountants',
              scheduled: true,
              status: 'pending',
            },
          ]}
        />
      </BreezeProvider>,
    );

    expect(screen.getByText('£0.30')).toBeVisible();
    const pendingIdentity = screen.getByRole('rowheader', {
      name: 'Pending transaction: Oak & Co Accountants Quarterly bookkeeping. No invoice or receipt. Scheduled transaction',
    });

    expect(pendingIdentity).toBeVisible();
    expect(
      screen.getByRole('img', { name: 'Scheduled transaction' }),
    ).toBeVisible();
  });

  it('does not open a transaction when its scheduled indicator is activated', async () => {
    const user = userEvent.setup();

    render(
      <BreezeProvider locale="en-GB">
        <TransactionLedger
          companyId="company-id"
          currencyCode="GBP"
          transactions={[
            {
              amount: 100,
              attachment: 'invoice.pdf',
              category: 'Sales',
              date: '2026-08-15T00:00:00.000Z',
              description: 'Scheduled work',
              id: 'scheduled-id',
              name: 'Client',
              scheduled: true,
              status: 'confirmed',
            },
          ]}
        />
      </BreezeProvider>,
    );

    const indicator = screen.getByRole('img', {
      name: 'Scheduled transaction',
    });

    await user.click(indicator);
    indicator.focus();
    await user.keyboard('{Enter}');
    await user.keyboard('{Escape}');

    expect(mocks.navigate).not.toHaveBeenCalled();
  });

  it('opens a Pending Transaction through the Pending collection route', async () => {
    render(
      <BreezeProvider locale="en-GB">
        <TransactionLedger
          companyId="company-id"
          currencyCode="GBP"
          pending
          transactions={[
            {
              amount: -120,
              attachment: null,
              category: 'Professional fees',
              date: '2026-08-20T00:00:00.000Z',
              description: 'Quarterly bookkeeping',
              id: 'pending-id',
              name: 'Oak & Co Accountants',
              scheduled: true,
              status: 'pending',
            },
          ]}
        />
      </BreezeProvider>,
    );

    expect(
      screen.getAllByRole('img', { name: 'Scheduled transaction' }),
    ).toHaveLength(2);
    const pendingRow = screen.getByRole('row', {
      name: /Pending transaction: Oak & Co Accountants/u,
    });

    await userEvent.click(pendingRow);

    expect(mocks.navigate).toHaveBeenCalledWith({
      params: { companyId: 'company-id', transactionId: 'pending-id' },
      to: '/my-companies/accounts/$companyId/pending-transactions/view-transaction/$transactionId',
    });
  });

  it('keeps a Pending Transaction opened from the combined ledger on that route', async () => {
    render(
      <BreezeProvider locale="en-GB">
        <TransactionLedger
          companyId="company-id"
          currencyCode="GBP"
          transactions={[
            {
              amount: -120,
              attachment: null,
              category: 'Professional fees',
              date: '2026-08-20T00:00:00.000Z',
              description: 'Quarterly bookkeeping',
              id: 'pending-id',
              name: 'Oak & Co Accountants',
              status: 'pending',
            },
          ]}
        />
      </BreezeProvider>,
    );

    await userEvent.click(
      screen.getByRole('row', {
        name: /Pending transaction: Oak & Co Accountants/u,
      }),
    );

    expect(mocks.navigate).toHaveBeenCalledWith({
      params: { companyId: 'company-id', transactionId: 'pending-id' },
      to: '/my-companies/accounts/$companyId/view-transaction/$transactionId',
    });
  });

  it('keeps an Overview Pending transaction on the Overview route', async () => {
    render(
      <BreezeProvider locale="en-GB">
        <TransactionLedger
          compact
          companyId="company-id"
          currencyCode="GBP"
          origin="dashboard"
          transactions={[
            {
              amount: -120,
              attachment: null,
              category: 'Professional fees',
              date: '2026-08-20T00:00:00.000Z',
              description: 'Quarterly bookkeeping',
              id: 'pending-id',
              name: 'Oak & Co Accountants',
              status: 'pending',
            },
          ]}
        />
      </BreezeProvider>,
    );

    await userEvent.click(
      screen.getByRole('row', {
        name: /Pending transaction: Oak & Co Accountants/u,
      }),
    );

    expect(mocks.navigate).toHaveBeenCalledWith({
      params: { companyId: 'company-id', transactionId: 'pending-id' },
      to: '/my-companies/dashboard/$companyId/view-transaction/$transactionId',
    });
  });

  it('keeps exact decimal precision in large confirmed daily totals', () => {
    render(
      <BreezeProvider locale="en-GB">
        <TransactionLedger
          companyId="company-id"
          currencyCode="GBP"
          transactions={[
            {
              amount: 1_000_000_000_000_000,
              attachment: 'invoice.pdf',
              category: 'Sales',
              date: '2026-08-15T00:00:00.000Z',
              description: 'Large sale',
              id: 'large-sale',
              name: 'Large client',
            },
            {
              amount: 0.01,
              attachment: 'invoice.pdf',
              category: 'Sales',
              date: '2026-08-15T00:00:00.000Z',
              description: 'Adjustment',
              id: 'adjustment',
              name: 'Large client',
            },
          ]}
        />
      </BreezeProvider>,
    );

    expect(screen.getByText('£1,000,000,000,000,000.01')).toBeVisible();
  });

  it('keeps the Pending Transaction collection ungrouped', () => {
    render(
      <BreezeProvider locale="en-GB">
        <TransactionLedger
          companyId="company-id"
          currencyCode="GBP"
          pending
          transactions={[
            {
              amount: -120,
              attachment: null,
              category: 'Professional fees',
              date: '2026-08-20T00:00:00.000Z',
              description: 'Quarterly bookkeeping',
              id: 'pending-1',
              name: 'Oak & Co Accountants',
              status: 'pending',
            },
            {
              amount: -50,
              attachment: null,
              category: 'Travel',
              date: '2026-08-19T00:00:00.000Z',
              description: 'Train fare',
              id: 'pending-2',
              name: 'Rail supplier',
              status: 'pending',
            },
          ]}
        />
      </BreezeProvider>,
    );

    expect(
      screen.queryByRole('row', { name: '20 August 2026' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('row', { name: '19 August 2026' }),
    ).not.toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(3);
    expect(screen.queryByText('£0.00')).not.toBeInTheDocument();
  });

  it('labels a compact ledger as recent transactions', () => {
    render(
      <BreezeProvider locale="en-GB">
        <TransactionLedger
          compact
          companyId="company-id"
          currencyCode="GBP"
          transactions={[
            {
              amount: 100,
              attachment: null,
              category: 'Sales',
              date: '2026-08-15T00:00:00.000Z',
              description: 'Recent work',
              id: 'recent-id',
              name: 'Client',
            },
          ]}
        />
      </BreezeProvider>,
    );

    expect(
      screen.getByRole('grid', { name: 'Recent transactions' }),
    ).toBeVisible();
  });

  it('does not mark an unscheduled Pending Transaction as scheduled', () => {
    render(
      <BreezeProvider locale="en-GB">
        <TransactionLedger
          companyId="company-id"
          currencyCode="GBP"
          pending
          transactions={[
            {
              amount: -100,
              attachment: null,
              category: 'Professional fees',
              date: '2026-08-15T00:00:00.000Z',
              description: 'Unscheduled cost',
              id: 'pending-id',
              name: 'Supplier',
              scheduled: false,
              status: 'pending',
            },
          ]}
        />
      </BreezeProvider>,
    );

    expect(
      screen.queryByRole('img', { name: 'Scheduled transaction' }),
    ).not.toBeInTheDocument();
    expect(screen.getAllByText('15 August 2026')).toHaveLength(2);
    screen.getAllByText('15 August 2026').forEach((date) => {
      expect(date.parentElement?.querySelector('svg')).toBeInTheDocument();
    });
  });

  it('reveals and dismisses Transaction indicator explanations', async () => {
    const user = userEvent.setup();

    render(
      <BreezeProvider locale="en-GB">
        <TransactionLedger
          companyId="company-id"
          currencyCode="GBP"
          transactions={[
            {
              amount: 100,
              attachment: null,
              category: 'Sales',
              date: '2026-08-15T00:00:00.000Z',
              description: 'Scheduled work',
              id: 'scheduled-id',
              name: 'Client',
              scheduled: true,
              status: 'confirmed',
            },
          ]}
        />
      </BreezeProvider>,
    );

    const missingAttachment = screen.getByRole('img', {
      name: 'No invoice or receipt',
    });
    const scheduled = screen.getByRole('img', {
      name: 'Scheduled transaction',
    });

    await user.hover(missingAttachment);
    expect(screen.getByRole('tooltip')).toHaveTextContent(
      'No invoice or receipt',
    );
    await user.unhover(missingAttachment);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    await user.click(missingAttachment);
    expect(await screen.findByRole('tooltip')).toHaveTextContent(
      'No invoice or receipt',
    );
    await user.tab();
    expect(screen.getByRole('tooltip')).toHaveTextContent(
      'Scheduled transaction',
    );
    await user.tab();
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    await user.hover(scheduled);
    expect(await screen.findByRole('tooltip')).toHaveTextContent(
      'Scheduled transaction',
    );
    await user.unhover(scheduled);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('keeps the ledger usable when route navigation rejects', async () => {
    mocks.navigate.mockRejectedValueOnce(new Error('Navigation failed'));

    render(
      <BreezeProvider locale="en-GB">
        <TransactionLedger
          companyId="company-id"
          currencyCode="GBP"
          transactions={[
            {
              amount: 100,
              attachment: 'invoice.pdf',
              category: 'Sales',
              date: '2026-08-15T00:00:00.000Z',
              description: 'Client work',
              id: 'transaction-id',
              name: 'Client',
            },
          ]}
        />
      </BreezeProvider>,
    );

    await userEvent.click(
      screen.getByRole('row', { name: /Client Client work/u }),
    );

    expect(screen.getByRole('grid')).toBeVisible();
  });

  it.each([
    [false, 'No transactions yet'],
    [true, 'No pending transactions'],
  ])('presents the correct empty state when pending=%s', (pending, title) => {
    render(
      <BreezeProvider locale="en-GB">
        <TransactionLedger
          companyId="company-id"
          currencyCode="GBP"
          pending={pending}
          transactions={[]}
        />
      </BreezeProvider>,
    );

    expect(screen.getByText(title)).toBeVisible();
  });
});
