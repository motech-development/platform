import { useSubscription } from '@apollo/client/react';
import { CONTROL_EVENTS_KEY } from 'aws-appsync-subscription-link';
import { type ReactNode, useRef } from 'react';
import type { AccountsOwnerId } from '../../auth/owner';
import { ON_TRANSACTION } from '../../data/operations';

function subscriptionControlMessage(result: unknown) {
  if (
    typeof result !== 'object' ||
    result === null ||
    !('extensions' in result) ||
    typeof result.extensions !== 'object' ||
    result.extensions === null ||
    !('controlMsgType' in result.extensions)
  ) {
    return undefined;
  }

  return result.extensions.controlMsgType;
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
  const hasEverConnected = useRef(false);
  useSubscription(ON_TRANSACTION, {
    context: {
      controlMessages: { [CONTROL_EVENTS_KEY]: true },
    },
    onData: ({ client, data }) => {
      if (subscriptionControlMessage(data) === 'CONNECTED') {
        if (hasEverConnected.current) {
          client.refetchQueries({ include: 'active' }).catch(() => undefined);
        } else {
          // The initial connection accompanies the route's initial query. Only
          // recovery after an established stream is lost is a reconnect.
          hasEverConnected.current = true;
        }

        return;
      }

      const incoming = data.data?.onTransaction;

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
    },
    variables: { id: companyId, owner },
  });

  return children;
}
