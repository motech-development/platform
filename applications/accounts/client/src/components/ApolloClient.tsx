/* eslint-disable no-underscore-dangle */
import {
  type ApolloCache,
  type FieldFunctionOptions,
  gql,
  Reference,
  StoreObject,
} from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import { Apollo } from '@motech-development/appsync-apollo';
import { Loader } from '@motech-development/breeze-ui';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  OnNotificationSubscription,
  Report,
  StrictTypedTypePolicies,
} from '../graphql/graphql';
import Container from './Container';
import ErrorCard from './ErrorCard';

export interface IApolloClientProps {
  children: ReactNode;
}

function filterRefs(incoming: Reference[], existing: Reference[] = []) {
  return [...existing, ...incoming].filter(
    ({ __ref }, index, self) =>
      index === self.findIndex((item) => item.__ref === __ref),
  );
}

function parseNotificationPayload(payload: string | null): unknown {
  if (!payload) {
    return null;
  }

  try {
    return JSON.parse(payload);
  } catch {
    // If JSON parsing fails, try to parse as query string
    const urlParams = new URLSearchParams(payload);
    const reportId = urlParams.get('id');
    const reportCreatedAt = urlParams.get('createdAt');
    const downloadUrl = urlParams.get('downloadUrl');
    const ttl = urlParams.get('ttl');

    if (reportId && reportCreatedAt && downloadUrl) {
      return {
        createdAt: reportCreatedAt,
        downloadUrl,
        id: reportId,
        ttl: ttl ? Number.parseInt(ttl, 10) : undefined,
      };
    }
  }

  return null;
}

function updateReportsCache<TSerialized>(
  cache: ApolloCache<TSerialized>,
  reportData: Report,
  existingReports: unknown,
  readField: FieldFunctionOptions['readField'],
) {
  if (
    existingReports &&
    typeof existingReports === 'object' &&
    existingReports !== null &&
    '__ref' in existingReports
  ) {
    const reportsRef = existingReports as Reference;
    const reportsId = readField('id', reportsRef);

    if (reportsId) {
      cache.modify({
        fields: {
          items: (existingItems, { readField: rf2 }) => {
            const items = (existingItems as Reference[]) || [];

            // Check if item already exists
            const itemExists = items.some(
              (item) => rf2('id', item) === reportData.id,
            );

            if (itemExists) {
              return items;
            }

            // Add the new report to the items array
            const newItemRef = {
              __ref: cache.identify({
                __typename: 'Report',
                id: reportData.id,
              }),
            };

            return [...items, newItemRef];
          },
        },
        id: reportsRef.__ref,
      });
    }
  }
}

function updateNotificationsCache<TSerialized>(
  cache: ApolloCache<TSerialized>,
  notificationData: { id: string },
  existingNotifications: unknown,
  readField: FieldFunctionOptions['readField'],
) {
  if (
    existingNotifications &&
    typeof existingNotifications === 'object' &&
    existingNotifications !== null &&
    '__ref' in existingNotifications
  ) {
    const notificationsRef = existingNotifications as Reference;
    const notificationsId = readField('id', notificationsRef);

    if (notificationsId) {
      cache.modify({
        fields: {
          items: (existingItems, { readField: rf2 }) => {
            const items = (existingItems as Reference[]) || [];

            // Check if notification already exists
            const notificationExists = items.some(
              (item) => rf2('id', item) === notificationData.id,
            );

            if (notificationExists) {
              return items;
            }

            // Add the new notification to the items array
            const newNotificationRef = {
              __ref: cache.identify({
                __typename: 'Notification',
                id: notificationData.id,
              }),
            };

            return [newNotificationRef, ...items]; // Add to beginning for notifications
          },
        },
        id: notificationsRef.__ref,
      });
    }
  }
}

const notificationFragment = gql`
  fragment NewNotification on Notification {
    id
    createdAt
    message
    owner
    payload
    read
  }
`;

const notificationReadFragment = gql`
  fragment ExistingNotificationRead on Notification {
    read
  }
`;

export function writeNotificationToCache<TSerialized>(
  cache: ApolloCache<TSerialized>,
  notificationData: NonNullable<OnNotificationSubscription['onNotification']>,
): boolean {
  const cacheId = cache.identify({
    __typename: 'Notification',
    id: notificationData.id,
  });
  const existingNotification = cacheId
    ? cache.readFragment<Pick<typeof notificationData, 'read'>>({
        fragment: notificationReadFragment,
        id: cacheId,
      })
    : null;
  const read = existingNotification?.read ?? false;

  cache.writeFragment({
    data: {
      ...notificationData,
      __typename: 'Notification',
      // A replay carries the original unread value; retain a local read update.
      read,
    },
    fragment: notificationFragment,
  });

  return read;
}

export function processNotification<TSerialized>(
  cache: ApolloCache<TSerialized>,
  notificationData: NonNullable<OnNotificationSubscription['onNotification']>,
): NonNullable<OnNotificationSubscription['onNotification']> {
  try {
    const parsedPayload = parseNotificationPayload(
      notificationData.payload ?? null,
    );

    if (
      parsedPayload &&
      typeof parsedPayload === 'object' &&
      'id' in parsedPayload &&
      'downloadUrl' in parsedPayload
    ) {
      const reportData = parsedPayload as Report;

      cache.writeFragment({
        data: {
          ...reportData,
          __typename: 'Report',
        },
        fragment: gql`
          fragment NewReport on Report {
            id
            createdAt
            downloadUrl
            ttl
          }
        `,
      });

      cache.modify({
        fields: {
          getReports(existingReports: unknown, { readField }) {
            updateReportsCache(cache, reportData, existingReports, readField);

            return existingReports;
          },
        },
      });
    }
  } catch (error) {
    // If payload processing fails, ignore the report update.
    // eslint-disable-next-line no-console
    console.warn('Failed to parse notification payload:', error);
  }

  const read = writeNotificationToCache(cache, notificationData);

  cache.modify({
    fields: {
      getNotifications(existingNotifications: unknown, { readField }) {
        updateNotificationsCache(
          cache,
          notificationData,
          existingNotifications,
          readField,
        );

        return existingNotifications;
      },
    },
  });

  return {
    ...notificationData,
    read,
  };
}

export const typePolicies: StrictTypedTypePolicies = {
  Mutation: {
    fields: {
      deleteTransaction: {
        // Ensure we can act on the returned entity by evicting it from the cache.
        // This centralizes deletion behavior so components don't need update functions.
        merge: (
          _existing: StoreObject | null,
          incoming: StoreObject | null,
          { cache, readField },
        ) => {
          if (incoming && typeof incoming === 'object' && '__ref' in incoming) {
            // incoming is a reference, we need to read the actual data
            const transactionRef = incoming as unknown as Reference;
            const deleteTransaction = {
              companyId: readField<string>('companyId', transactionRef),
              id: readField<string>('id', transactionRef),
              status: readField<string>('status', transactionRef),
            };

            // Remove from Transactions items
            cache.modify({
              fields: {
                items: (refs: readonly Reference[], { readField: rf }) =>
                  refs.filter((ref) => rf('id', ref) !== deleteTransaction.id),
              },
              id: cache.identify({
                __typename: 'Transactions',
                companyId: deleteTransaction.companyId,
                status: deleteTransaction.status,
              }),
            });

            // Remove from Balance transactions
            cache.modify({
              fields: {
                transactions: (refs: readonly Reference[], { readField: rf }) =>
                  refs.filter((ref) => rf('id', ref) !== deleteTransaction.id),
              },
              id: cache.identify({
                __typename: 'Balance',
                companyId: deleteTransaction.companyId,
              }),
            });

            // Evict the transaction entity itself
            cache.evict({
              id: cache.identify({
                __typename: 'Transaction',
                id: deleteTransaction.id,
              }),
            });
            cache.gc();
          }

          return incoming;
        },
      },
    },
  },
  Notification: {
    fields: {
      read: {
        // Subscription payloads normalize before their field merge can inspect cached state.
        merge: (
          existing: boolean | undefined,
          incoming: boolean | undefined,
        ) => {
          if (existing === true) return true;

          return incoming ?? existing;
        },
      },
    },
  },
  Query: {
    fields: {
      getNotifications: {
        merge: (existing: unknown, incoming: unknown) =>
          // Return the server result so callers still receive data
          incoming ?? existing ?? null,
      },
    },
  },
  Subscription: {
    fields: {
      onNotification: {
        merge: (
          existing: OnNotificationSubscription['onNotification'] | undefined,
          incoming: OnNotificationSubscription['onNotification'],
          { cache, readField },
        ) => {
          if (!incoming) {
            return existing;
          }

          // If incoming is a reference, read the actual data
          if (
            !incoming ||
            typeof incoming !== 'object' ||
            !('__ref' in incoming)
          ) {
            return existing; // Only handle references
          }

          const notificationRef = incoming as unknown as Reference;
          const id = readField<string>('id', notificationRef);
          const createdAt = readField<string>('createdAt', notificationRef);
          const message = readField<string>('message', notificationRef);
          const owner = readField<string>('owner', notificationRef);
          const payload = readField<string>('payload', notificationRef);
          const incomingRead = readField<boolean>('read', notificationRef);

          if (!id || !createdAt || !message || !owner) {
            return existing; // Can't process without required fields
          }

          const notificationData = {
            createdAt,
            id,
            message,
            owner,
            payload,
            read: incomingRead ?? false,
          };

          // If we already have this notification, don't process it again
          if (existing && existing.id === notificationData.id) {
            return existing;
          }

          return processNotification(cache, notificationData);
        },
      },
    },
  },
  Transactions: {
    fields: {
      items: {
        // Merge incoming items with existing while deduping
        merge: (existing: Reference[] | undefined, incoming: Reference[]) =>
          filterRefs(incoming, existing),
        // Filter out dangling references on read, so evicted items disappear from lists
        read: (existing: Reference[] | undefined, { canRead }) => {
          const list = existing ?? [];

          return list.filter((ref) => canRead(ref));
        },
      },
    },
    keyFields: ['id', 'status'],
  },
};

function ApolloClient({ children }: IApolloClientProps) {
  const { getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0();
  const { t } = useTranslation('apollo-client');

  return (
    <Apollo
      cacheConfig={{
        typePolicies,
      }}
      error={
        <Container>
          <ErrorCard
            title={t('error.title')}
            description={t('error.description')}
          />
        </Container>
      }
      fallback={<Loader />}
      getTokenSilently={getAccessTokenSilently}
      isAuthenticated={isAuthenticated}
      isLoading={isLoading}
      unauthorised={
        <Container>
          <ErrorCard
            title={t('unauthorised.title')}
            description={t('unauthorised.description')}
          />
        </Container>
      }
    >
      {children}
    </Apollo>
  );
}

export default ApolloClient;
