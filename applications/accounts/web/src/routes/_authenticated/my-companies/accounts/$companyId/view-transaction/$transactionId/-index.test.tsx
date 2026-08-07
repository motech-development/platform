import { BreezeProvider } from '@motech-development/breeze-ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ComponentType, createElement } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Route } from './index';

const mocks = vi.hoisted(() => ({
  apolloQuery: vi.fn(),
  capturePresignedTransferFailure: vi.fn(),
  navigate: vi.fn(),
  refetch: vi.fn(),
  toast: { show: vi.fn() },
  transactionQuery: vi.fn(),
}));

vi.mock('@apollo/client/react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@apollo/client/react')>()),
  useApolloClient: () => ({ query: mocks.apolloQuery }),
  useQuery: mocks.transactionQuery,
}));

vi.mock('../../../../../../../observability', async (importOriginal) => ({
  ...(await importOriginal<
    typeof import('../../../../../../../observability')
  >()),
  capturePresignedTransferFailure: mocks.capturePresignedTransferFailure,
}));

vi.mock('@motech-development/breeze-ui', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@motech-development/breeze-ui')>()),
  useToast: () => mocks.toast,
}));

vi.mock('@tanstack/react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-router')>()),
  useNavigate: () => mocks.navigate,
}));

vi.mock(
  '../../../../../../../features/transactions/TransactionsPageContent',
  () => ({
    TransactionsPageContent: () => <main>Transactions</main>,
  }),
);

vi.mock('../../../../../../../pwa/connectivity', () => ({
  useOnlineStatus: () => true,
}));

describe('view Transaction route', () => {
  beforeEach(() => {
    mocks.navigate.mockReset();
    mocks.apolloQuery.mockReset();
    mocks.capturePresignedTransferFailure.mockReset();
    mocks.refetch.mockReset();
    mocks.toast.show.mockReset();
    mocks.transactionQuery.mockReset().mockReturnValue({
      data: undefined,
      error: new Error('Query failed'),
      loading: false,
      refetch: mocks.refetch,
    });
    vi.spyOn(Route, 'useParams').mockReturnValue({
      companyId: 'company-id',
      transactionId: 'transaction-id',
    });
  });

  it('retries loading the authoritative transaction after its query fails', async () => {
    const user = userEvent.setup();
    const TransactionPage = Route.options.component as ComponentType;

    mocks.refetch.mockResolvedValue(undefined);

    render(
      <BreezeProvider locale="en-GB">
        {createElement(TransactionPage)}
      </BreezeProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Try again' }));

    expect(mocks.refetch).toHaveBeenCalledOnce();
  });

  it('reports a missing presigned download destination', async () => {
    const user = userEvent.setup();
    const TransactionPage = Route.options.component as ComponentType;

    mocks.transactionQuery.mockReturnValue({
      data: {
        getTransaction: {
          amount: 120,
          attachment: 'company-id/invoice.pdf',
          category: 'Sale',
          date: '2026-08-07T00:00:00.000Z',
          description: 'Consulting',
          id: 'transaction-id',
          name: 'Client',
          vat: 20,
        },
      },
      error: undefined,
      loading: false,
      refetch: mocks.refetch,
    });
    mocks.apolloQuery.mockResolvedValue({
      data: { requestDownload: { url: null } },
    });

    render(
      <BreezeProvider locale="en-GB">
        {createElement(TransactionPage)}
      </BreezeProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Open PDF' }));

    expect(mocks.capturePresignedTransferFailure).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'No download destination was returned',
      }),
      'Download',
    );
    expect(mocks.toast.show).toHaveBeenCalledWith({
      description: 'The PDF could not be opened. Try again.',
      title: 'Attachment unavailable',
      variant: 'danger',
    });
  });
});
