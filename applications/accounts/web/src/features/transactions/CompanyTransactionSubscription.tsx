import { useSubscription } from '@apollo/client/react';
import { CONTROL_EVENTS_KEY } from 'aws-appsync-subscription-link';
import { createContext, type ReactNode, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { AccountsOwnerId } from '../../auth/owner';
import { ON_TRANSACTION } from '../../data/operations';
import { QueryRefreshAlert } from '../QueryRefreshAlert';
import { useAppSyncSubscriptionConnection } from '../subscriptions';

interface TransactionSubscriptionStatus {
  error: boolean;
  retry: () => void;
}

const TransactionSubscriptionContext =
  createContext<TransactionSubscriptionStatus | null>(null);

export function TransactionSubscriptionAlert() {
  const subscription = useContext(TransactionSubscriptionContext);
  const { t } = useTranslation(['transactions', 'routing']);

  if (!subscription?.error) return null;

  return (
    <QueryRefreshAlert
      onRetry={subscription.retry}
      retryLabel={t('Try again', { ns: 'routing' })}
    >
      {t(
        'Live transaction updates are unavailable. Try again to keep this page current.',
      )}
    </QueryRefreshAlert>
  );
}

export function CompanyTransactionSubscription({
  children,
  companyId,
  owner,
}: Readonly<{
  children: ReactNode;
  companyId: string;
  owner: AccountsOwnerId;
}>) {
  const handleSubscriptionConnection = useAppSyncSubscriptionConnection();
  const { error, restart } = useSubscription(ON_TRANSACTION, {
    context: {
      controlMessages: { [CONTROL_EVENTS_KEY]: true },
    },
    onData: ({ client, data }) => {
      const incoming = data.data?.onTransaction;

      if (
        handleSubscriptionConnection(
          data,
          () => {
            client.refetchQueries({ include: 'active' }).catch(() => undefined);
          },
          {
            reconcileInitialConnection: true,
            subscriptionPayloadPresent: incoming !== undefined,
          },
        )
      ) {
        return;
      }

      if (!incoming) {
        return;
      }

      client.cache.modify({
        fields: {
          balance: () => incoming.balance,
          vat: (existing) => ({
            ...(typeof existing === 'object' && existing !== null
              ? existing
              : {}),
            ...incoming.vat,
          }),
        },
        id: client.cache.identify({
          __typename: 'Balance',
          id: companyId,
        }),
      });
      client.refetchQueries({ include: 'active' }).catch(() => undefined);
    },
    variables: { id: companyId, owner },
  });
  const subscription = useMemo<TransactionSubscriptionStatus>(
    () => ({ error: Boolean(error), retry: restart }),
    [error, restart],
  );

  return (
    <TransactionSubscriptionContext.Provider value={subscription}>
      {children}
    </TransactionSubscriptionContext.Provider>
  );
}
