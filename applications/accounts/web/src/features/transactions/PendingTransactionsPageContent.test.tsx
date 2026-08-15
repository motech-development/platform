import { BreezeProvider } from '@motech-development/breeze-ui';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PendingTransactionsPageContent } from './PendingTransactionsPageContent';

const query = vi.hoisted(() => ({
  data: {
    getBalance: { currency: 'GBP', id: 'company-id' },
    getTransactions: {
      items: [
        {
          amount: -120,
          attachment: null,
          category: 'Professional fees',
          companyId: 'company-id',
          date: '2026-08-20T00:00:00.000Z',
          description: 'Quarterly bookkeeping',
          id: 'pending-id',
          name: 'Oak & Co Accountants',
          refund: false,
          scheduled: true,
          status: 'pending' as const,
          vat: 20,
        },
      ],
      nextToken: null,
    },
  },
  error: undefined,
  fetchMore: vi.fn(),
  loading: false,
  networkStatus: undefined,
  refetch: vi.fn(),
}));

vi.mock('@apollo/client/react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@apollo/client/react')>()),
  useQuery: () => query,
}));

vi.mock('@tanstack/react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-router')>()),
  useNavigate: () => vi.fn(),
}));

vi.mock('@motech-development/breeze-ui/icons', () => ({
  AddIcon: () => <svg aria-hidden="true" />,
  ArrowLeftIcon: () => <svg aria-hidden="true" />,
  ArrowRightIcon: () => <svg aria-hidden="true" />,
  CalendarIcon: () => <svg aria-hidden="true" />,
  WarningIcon: () => <svg aria-hidden="true" />,
}));

describe('PendingTransactionsPageContent', () => {
  it('presents the dedicated Pending Transaction collection', () => {
    render(
      <BreezeProvider locale="en-GB">
        <PendingTransactionsPageContent companyId="company-id" />
      </BreezeProvider>,
    );

    expect(
      screen.getByRole('heading', { level: 1, name: 'Pending Transactions' }),
    ).toBeVisible();
    expect(
      screen.getByRole('link', { name: 'Back to Transactions' }),
    ).toHaveAttribute('href', '/my-companies/accounts/company-id');
    expect(
      screen.getByRole('link', { name: 'Record transaction' }),
    ).toHaveAttribute(
      'href',
      '/my-companies/accounts/company-id/pending-transactions/record-transaction',
    );
    expect(
      screen.getByRole('img', { name: 'Scheduled transaction' }),
    ).toBeVisible();
  });
});
