import { useSubscription } from '@apollo/client/react';
import { CONTROL_EVENTS_KEY } from 'aws-appsync-subscription-link';
import type { ReactNode } from 'react';
import type { AccountsOwnerId } from '../../auth/owner';
import { ON_TRANSACTION } from '../../data/operations';
import { useAppSyncSubscriptionConnection } from '../subscriptions';

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
  useSubscription(ON_TRANSACTION, {
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

  return children;
}
