/* eslint-disable no-underscore-dangle */
import { gql, Reference, StoreObject } from '@apollo/client';
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
          if (!incoming) return existing;

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
          const read = readField<boolean>('read', notificationRef);

          if (!id || !createdAt || !message || !owner) {
            return existing; // Can't process without required fields
          }

          const notificationData = {
            createdAt,
            id,
            message,
            owner,
            payload,
            read: read ?? false,
          };

          // If we already have this notification, don't process it again
          if (existing && existing.id === notificationData.id) {
            return existing;
          }

          // Parse the payload to extract report data
          try {
            let parsedPayload: unknown = null;

            if (notificationData.payload) {
              // Try to parse as JSON first
              try {
                parsedPayload = JSON.parse(notificationData.payload);
              } catch {
                // If JSON parsing fails, try to parse as query string
                const urlParams = new URLSearchParams(notificationData.payload);
                const reportId = urlParams.get('id');
                const reportCreatedAt = urlParams.get('createdAt');
                const downloadUrl = urlParams.get('downloadUrl');
                const ttl = urlParams.get('ttl');

                if (reportId && reportCreatedAt && downloadUrl) {
                  parsedPayload = {
                    createdAt: reportCreatedAt,
                    downloadUrl,
                    id: reportId,
                    ttl: ttl ? parseInt(ttl, 10) : undefined,
                  };
                }
              }
            }

            // If this is a report notification, update the getReports cache
            if (
              parsedPayload &&
              typeof parsedPayload === 'object' &&
              'id' in parsedPayload &&
              'downloadUrl' in parsedPayload
            ) {
              const reportData = parsedPayload as Report;

              // Write the report to the cache first
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

              // Update all getReports queries in the cache
              cache.modify({
                fields: {
                  getReports(existingReports: unknown, { readField: rf }) {
                    if (!existingReports) return existingReports;

                    // If existingReports is a reference, we need to modify the referenced object
                    if (
                      typeof existingReports === 'object' &&
                      existingReports !== null &&
                      '__ref' in existingReports
                    ) {
                      const reportsRef = existingReports as Reference;
                      const reportsId = rf('id', reportsRef);

                      if (reportsId) {
                        // Modify the Reports object directly
                        cache.modify({
                          fields: {
                            items(existingItems, { readField: rf2 }) {
                              const items =
                                (existingItems as Reference[]) || [];

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

                    return existingReports;
                  },
                },
              });
            }
          } catch (error) {
            // If payload parsing fails, ignore the notification
            // eslint-disable-next-line no-console
            console.warn('Failed to parse notification payload:', error);
          }

          // Also handle notifications for getNotifications queries
          // Write the notification to the cache first
          cache.writeFragment({
            data: {
              ...notificationData,
              __typename: 'Notification',
              read: false, // New notifications should always be unread
            },
            fragment: gql`
              fragment NewNotification on Notification {
                id
                createdAt
                message
                owner
                payload
                read
              }
            `,
          });

          // Update all getNotifications queries in the cache
          cache.modify({
            fields: {
              getNotifications(
                existingNotifications: unknown,
                { readField: rf },
              ) {
                if (!existingNotifications) return existingNotifications;

                // If existingNotifications is a reference, we need to modify the referenced object
                if (
                  typeof existingNotifications === 'object' &&
                  existingNotifications !== null &&
                  '__ref' in existingNotifications
                ) {
                  const notificationsRef = existingNotifications as Reference;
                  const notificationsId = rf('id', notificationsRef);

                  if (notificationsId) {
                    // Modify the Notifications object directly
                    cache.modify({
                      fields: {
                        items(existingItems, { readField: rf2 }) {
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

                return existingNotifications;
              },
            },
          });

          return notificationData;
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
