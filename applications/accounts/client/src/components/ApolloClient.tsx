/* eslint-disable no-underscore-dangle */
import {
  type FieldFunctionOptions,
  gql,
  InMemoryCache,
  Reference,
  StoreObject,
} from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import { Apollo } from '@motech-development/appsync-apollo';
import { Loader } from '@motech-development/breeze-ui';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Notification,
  OnNotificationSubscription,
  Report,
  StrictTypedTypePolicies,
  Transaction,
  TransactionStatus,
} from '../graphql/graphql';
import { findUnique, setItems, spread } from '../utils/transactions';
import Container from './Container';
import ErrorCard from './ErrorCard';

// Common cache modification patterns
function updateTypeaheadCache(
  cache: InMemoryCache,
  transaction: Pick<
    Transaction,
    'category' | 'companyId' | 'description' | 'name'
  >,
) {
  cache.modify({
    fields: {
      purchases: (items: string[] | Reference) => {
        const descriptions = setItems(items);
        const unique = !descriptions.some(
          findUnique(transaction, 'description'),
        );

        if (spread(transaction.category !== 'Sales', unique)) {
          return [...descriptions, transaction.description].sort((a, b) =>
            a.localeCompare(b),
          );
        }

        return descriptions;
      },
      sales: (items: string[] | Reference) => {
        const descriptions = setItems(items);
        const unique = !descriptions.some(
          findUnique(transaction, 'description'),
        );

        if (spread(transaction.category === 'Sales', unique)) {
          return [...descriptions, transaction.description].sort((a, b) =>
            a.localeCompare(b),
          );
        }

        return descriptions;
      },
      suppliers: (items: string[] | Reference) => {
        const suppliers = setItems(items);
        const unique = !suppliers.some(findUnique(transaction, 'name'));

        if (spread(transaction.category !== 'Sales', unique)) {
          return [...suppliers, transaction.name].sort((a, b) =>
            a.localeCompare(b),
          );
        }

        return suppliers;
      },
    },
    id: cache.identify({
      __typename: 'Typeahead',
      id: transaction.companyId,
    }),
  });
}

function addTransactionToCache(
  cache: InMemoryCache,
  transaction: Pick<Transaction, 'companyId' | 'id' | 'status'> & {
    __typename: string;
  },
) {
  cache.modify({
    fields: {
      items: (refs: readonly Reference[], { readField: rf }) => {
        if (refs.some((ref) => rf('id', ref) === transaction.id)) {
          return [...refs];
        }

        const newRef = cache.writeFragment({
          data: transaction,
          fragment: gql(/* GraphQL */ `
            fragment NewTransaction on Transaction {
              amount
              attachment
              date
              description
              id
              name
              scheduled
            }
          `),
        });

        if (!newRef) {
          return [...refs];
        }

        return [...refs, newRef].sort((a, b) => {
          const readA = rf<string>('date', a);
          const readB = rf<string>('date', b);

          if (readA && readB) {
            return readA.localeCompare(readB);
          }

          return 0;
        });
      },
    },
    id: cache.identify({
      __typename: 'Transactions',
      id: transaction.companyId,
      status: transaction.status,
    }),
  });
}

function removeTransactionFromCache(
  cache: InMemoryCache,
  transaction: Pick<Transaction, 'companyId' | 'id' | 'status'>,
) {
  cache.modify({
    fields: {
      items: (refs: readonly Reference[], { readField: rf }) =>
        refs.filter((ref) => rf('id', ref) !== transaction.id),
    },
    id: cache.identify({
      __typename: 'Transactions',
      id: transaction.companyId,
      status: transaction.status,
    }),
  });
}

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

function updateReportsCache(
  cache: InMemoryCache,
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

function updateNotificationsCache(
  cache: InMemoryCache,
  notificationData: Pick<Notification, 'id'>,
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

export const typePolicies: StrictTypedTypePolicies = {
  Mutation: {
    fields: {
      addTransaction: {
        merge: (
          _existing: StoreObject | null,
          incoming: StoreObject | null,
          { cache, readField },
        ) => {
          if (incoming && typeof incoming === 'object' && '__ref' in incoming) {
            const transactionRef = incoming as unknown as Reference;
            const category = readField<string>('category', transactionRef);
            const companyId = readField<string>('companyId', transactionRef);
            const description = readField<string>(
              'description',
              transactionRef,
            );
            const id = readField<string>('id', transactionRef);
            const name = readField<string>('name', transactionRef);
            const status = readField<string>('status', transactionRef);

            if (
              !category ||
              !companyId ||
              !description ||
              !id ||
              !name ||
              !status
            ) {
              return incoming;
            }

            const addTransaction = {
              __typename: 'Transaction',
              category,
              companyId,
              description,
              id,
              name,
              status: status as TransactionStatus,
            };

            // Update typeahead cache
            updateTypeaheadCache(cache, addTransaction);

            // Add to transactions list
            addTransactionToCache(cache, addTransaction);
          }

          return incoming;
        },
      },
      createClient: {
        merge: (
          _existing: StoreObject | null,
          incoming: StoreObject | null,
          { cache, readField },
        ) => {
          if (incoming && typeof incoming === 'object' && '__ref' in incoming) {
            const clientRef = incoming as unknown as Reference;
            const id = readField<string>('id', clientRef);
            const name = readField<string>('name', clientRef);
            const companyId = readField<string>('companyId', clientRef);
            const address = readField('address', clientRef);
            const contact = readField('contact', clientRef);

            if (!id || !name || !companyId) {
              return incoming;
            }

            const createClient = {
              __typename: 'Client',
              address,
              companyId,
              contact,
              id,
              name,
            };

            // Add to clients list
            cache.modify({
              fields: {
                items: (refs: readonly Reference[], { readField: rf }) => {
                  if (refs.some((ref) => rf('id', ref) === createClient.id)) {
                    return [...refs];
                  }

                  const newRef = cache.writeFragment({
                    data: createClient,
                    fragment: gql(/* GraphQL */ `
                      fragment NewClient on Client {
                        address {
                          line1
                          line2
                          line3
                          line4
                          line5
                        }
                        companyId
                        contact {
                          email
                          telephone
                        }
                        id
                        name
                      }
                    `),
                  });

                  if (!newRef) {
                    return [...refs];
                  }

                  return [...refs, newRef].sort((a, b) => {
                    const readA = rf<string>('name', a);
                    const readB = rf<string>('name', b);

                    if (readA && readB) {
                      return readA.localeCompare(readB);
                    }

                    return 0;
                  });
                },
              },
              id: cache.identify({
                __typename: 'Clients',
                id: createClient.companyId,
              }),
            });
          }

          return incoming;
        },
      },
      createCompany: {
        merge: (
          _existing: StoreObject | null,
          incoming: StoreObject | null,
          { cache, readField },
        ) => {
          if (incoming && typeof incoming === 'object' && '__ref' in incoming) {
            const companyRef = incoming as unknown as Reference;
            const id = readField<string>('id', companyRef);
            const name = readField<string>('name', companyRef);
            const address = readField('address', companyRef);
            const bank = readField('bank', companyRef);
            const companyNumber = readField<string>(
              'companyNumber',
              companyRef,
            );
            const contact = readField('contact', companyRef);

            if (!id || !name) {
              return incoming;
            }

            const createCompany = {
              __typename: 'Company',
              address,
              bank,
              companyNumber,
              contact,
              id,
              name,
            };

            // Add to companies list
            cache.modify({
              fields: {
                items: (refs: readonly Reference[], { readField: rf }) => {
                  if (refs.some((ref) => rf('id', ref) === createCompany.id)) {
                    return [...refs];
                  }

                  const newRef = cache.writeFragment({
                    data: createCompany,
                    fragment: gql(/* GraphQL */ `
                      fragment NewCompany on Company {
                        address {
                          line1
                          line2
                          line3
                          line4
                          line5
                        }
                        bank {
                          accountNumber
                          sortCode
                        }
                        companyNumber
                        contact {
                          email
                          telephone
                        }
                        id
                        name
                      }
                    `),
                  });

                  if (!newRef) {
                    return [...refs];
                  }

                  return [...refs, newRef].sort((a, b) => {
                    const readA = rf<string>('name', a);
                    const readB = rf<string>('name', b);

                    if (readA && readB) {
                      return readA.localeCompare(readB);
                    }

                    return 0;
                  });
                },
              },
              id: cache.identify({
                __typename: 'Companies',
                id: createCompany.id,
              }),
            });
          }

          return incoming;
        },
      },
      deleteClient: {
        merge: (
          _existing: StoreObject | null,
          incoming: StoreObject | null,
          { cache, readField },
        ) => {
          if (incoming && typeof incoming === 'object' && '__ref' in incoming) {
            const clientRef = incoming as unknown as Reference;
            const id = readField<string>('id', clientRef);
            const companyId = readField<string>('companyId', clientRef);

            if (!id || !companyId) {
              return incoming;
            }

            const deleteClient = {
              companyId,
              id,
            };

            // Remove from clients list
            cache.modify({
              fields: {
                items: (refs: readonly Reference[], { readField: rf }) =>
                  refs.filter((ref) => rf('id', ref) !== deleteClient.id),
              },
              id: cache.identify({
                __typename: 'Clients',
                id: deleteClient.companyId,
              }),
            });
          }

          return incoming;
        },
      },
      deleteCompany: {
        merge: (
          _existing: StoreObject | null,
          incoming: StoreObject | null,
          { cache, readField },
        ) => {
          if (incoming && typeof incoming === 'object' && '__ref' in incoming) {
            const companyRef = incoming as unknown as Reference;
            const id = readField<string>('id', companyRef);
            const owner = readField<string>('owner', companyRef);

            if (!id || !owner) {
              return incoming;
            }

            const deleteCompany = {
              id,
              owner,
            };

            // Remove from companies list
            cache.modify({
              fields: {
                items: (refs: readonly Reference[], { readField: rf }) =>
                  refs.filter((ref) => rf('id', ref) !== deleteCompany.id),
              },
              id: cache.identify({
                __typename: 'Companies',
                id: deleteCompany.owner,
              }),
            });
          }

          return incoming;
        },
      },
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
      updateTransaction: {
        merge: (
          _existing: StoreObject | null,
          incoming: StoreObject | null,
          { cache, readField },
        ) => {
          if (incoming && typeof incoming === 'object' && '__ref' in incoming) {
            const transactionRef = incoming as unknown as Reference;
            const category = readField<string>('category', transactionRef);
            const companyId = readField<string>('companyId', transactionRef);
            const description = readField<string>(
              'description',
              transactionRef,
            );
            const id = readField<string>('id', transactionRef);
            const name = readField<string>('name', transactionRef);
            const status = readField<string>('status', transactionRef);

            if (
              !category ||
              !companyId ||
              !description ||
              !id ||
              !name ||
              !status
            ) {
              return incoming;
            }

            const updateTransaction = {
              __typename: 'Transaction',
              category,
              companyId,
              description,
              id,
              name,
              status: status as TransactionStatus,
            };

            const getStatus = (transactionStatus: TransactionStatus) =>
              transactionStatus === TransactionStatus.Confirmed
                ? TransactionStatus.Pending
                : TransactionStatus.Confirmed;
            const otherStatus = getStatus(updateTransaction.status);

            // Add to new status list
            addTransactionToCache(cache, updateTransaction);

            // Remove from old status list
            removeTransactionFromCache(cache, {
              companyId: updateTransaction.companyId,
              id: updateTransaction.id,
              status: otherStatus,
            });

            // Update typeahead cache
            updateTypeaheadCache(cache, updateTransaction);
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
            const parsedPayload = parseNotificationPayload(
              notificationData.payload ?? null,
            );

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
                    updateReportsCache(cache, reportData, existingReports, rf);

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
                updateNotificationsCache(
                  cache,
                  notificationData,
                  existingNotifications,
                  rf,
                );

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
