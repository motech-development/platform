import { BreezeProvider } from '@motech-development/breeze-ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { AccountsOwnerId } from '../../auth/owner';
import {
  CompanyTransactionSubscription,
  TransactionSubscriptionAlert,
} from './CompanyTransactionSubscription';

const ownerId = 'owner-id' as AccountsOwnerId;

const mocks = vi.hoisted(() => ({
  error: undefined as Error | undefined,
  options: undefined as
    | {
        onData?: (value: unknown) => void;
      }
    | undefined,
  restart: vi.fn(),
}));

vi.mock('@apollo/client/react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@apollo/client/react')>()),
  useSubscription: (_query: unknown, options: typeof mocks.options) => {
    mocks.options = options;
    return { error: mocks.error, restart: mocks.restart };
  },
}));

describe('CompanyTransactionSubscription', () => {
  beforeEach(() => {
    mocks.error = undefined;
    mocks.options = undefined;
    mocks.restart.mockReset();
  });

  it('shows a retry when live Transaction updates fail', async () => {
    mocks.error = new Error('Subscription unavailable');

    render(
      <BreezeProvider locale="en-GB">
        <CompanyTransactionSubscription companyId="company-id" owner={ownerId}>
          <TransactionSubscriptionAlert />
        </CompanyTransactionSubscription>
      </BreezeProvider>,
    );

    expect(
      screen.getByText(
        'Live transaction updates are unavailable. Try again to keep this page current.',
      ),
    ).toBeVisible();
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(mocks.restart).toHaveBeenCalledOnce();
  });

  it('refetches active queries when AppSync connects and reconnects', () => {
    const refetchQueries = vi.fn().mockResolvedValue(undefined);

    render(
      <CompanyTransactionSubscription companyId="company-id" owner={ownerId}>
        <p>Transactions</p>
      </CompanyTransactionSubscription>,
    );

    const connected = {
      client: { refetchQueries },
      data: { extensions: { controlMsgType: 'CONNECTED' } },
    };

    mocks.options?.onData?.(connected);
    expect(refetchQueries).toHaveBeenCalledExactlyOnceWith({
      include: 'active',
    });

    mocks.options?.onData?.(connected);
    expect(refetchQueries).toHaveBeenCalledTimes(2);
  });

  it('recognizes an extensionless AppSync reconnect acknowledgement', () => {
    const refetchQueries = vi.fn().mockResolvedValue(undefined);

    render(
      <CompanyTransactionSubscription companyId="company-id" owner={ownerId}>
        <p>Transactions</p>
      </CompanyTransactionSubscription>,
    );

    mocks.options?.onData?.({
      client: { refetchQueries },
      data: { extensions: { controlMsgType: 'CONNECTED' } },
    });
    mocks.options?.onData?.({
      client: { refetchQueries },
      data: { data: {} },
    });

    expect(refetchQueries).toHaveBeenCalledTimes(2);
    expect(refetchQueries).toHaveBeenLastCalledWith({
      include: 'active',
    });
  });

  it('refreshes active collections after an ordinary Transaction event', () => {
    const modify = vi.fn();
    const refetchQueries = vi.fn().mockResolvedValue(undefined);

    render(
      <CompanyTransactionSubscription companyId="company-id" owner={ownerId}>
        <p>Transactions</p>
      </CompanyTransactionSubscription>,
    );

    mocks.options?.onData?.({
      client: {
        cache: {
          identify: vi.fn().mockReturnValue('Balance:company-id'),
          modify,
        },
        refetchQueries,
      },
      data: {
        data: {
          onTransaction: {
            balance: 120,
            id: 'company-id',
            vat: { owed: 20, paid: 0 },
          },
        },
      },
    });

    expect(modify).toHaveBeenCalledOnce();
    expect(refetchQueries).toHaveBeenCalledWith({ include: 'active' });
  });
});
