import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { AccountsOwnerId } from '../../auth/owner';
import { CompanyTransactionSubscription } from './CompanyTransactionSubscription';

const ownerId = 'owner-id' as AccountsOwnerId;

const mocks = vi.hoisted(() => ({
  options: undefined as
    | {
        onData?: (value: unknown) => void;
      }
    | undefined,
}));

vi.mock('@apollo/client/react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@apollo/client/react')>()),
  useSubscription: (_query: unknown, options: typeof mocks.options) => {
    mocks.options = options;
    return {};
  },
}));

describe('CompanyTransactionSubscription', () => {
  beforeEach(() => {
    mocks.options = undefined;
  });

  it('refetches active queries after an established AppSync subscription reconnects', () => {
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
    expect(refetchQueries).not.toHaveBeenCalled();

    mocks.options?.onData?.(connected);
    expect(refetchQueries).toHaveBeenCalledWith({ include: 'active' });
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

    expect(refetchQueries).toHaveBeenCalledExactlyOnceWith({
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
