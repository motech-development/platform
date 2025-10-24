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
import { findUnique, setItems } from '../utils/transactions';
import Container from './Container';
import ErrorCard from './ErrorCard';

// Common cache modification patterns
function updateTypeaheadField(
  items: string[] | Reference,
  transaction: Pick<Transaction, 'category' | 'description' | 'name'>,
  fieldType: 'purchases' | 'sales' | 'suppliers',
) {
  const itemList = setItems(items);
  const isSales = transaction.category === 'Sales';
  const isPurchases = transaction.category !== 'Sales';

  let shouldAdd = false;
  let valueToAdd = '';

  if (fieldType === 'purchases' && isPurchases) {
    shouldAdd = !itemList.some(findUnique(transaction, 'description'));
    valueToAdd = transaction.description;
  } else if (fieldType === 'sales' && isSales) {
    shouldAdd = !itemList.some(findUnique(transaction, 'description'));
    valueToAdd = transaction.description;
  } else if (fieldType === 'suppliers' && isPurchases) {
    shouldAdd = !itemList.some(findUnique(transaction, 'name'));
    valueToAdd = transaction.name;
  }

  if (shouldAdd) {
    return [...itemList, valueToAdd].sort((a, b) => a.localeCompare(b));
  }

  return itemList;
}

// Common field extraction helpers
function extractTransactionFields(
  ref: Reference,
  readField: FieldFunctionOptions['readField'],
) {
  return {
    category: readField<string>('category', ref),
    companyId: readField<string>('companyId', ref),
    description: readField<string>('description', ref),
    id: readField<string>('id', ref),
    name: readField<string>('name', ref),
    status: readField<string>('status', ref),
  };
}

function extractClientFields(
  ref: Reference,
  readField: FieldFunctionOptions['readField'],
) {
  return {
    address: readField('address', ref),
    companyId: readField<string>('companyId', ref),
    contact: readField('contact', ref),
    id: readField<string>('id', ref),
    name: readField<string>('name', ref),
  };
}

function extractCompanyFields(
  ref: Reference,
  readField: FieldFunctionOptions['readField'],
) {
  return {
    address: readField('address', ref),
    bank: readField('bank', ref),
    companyNumber: readField<string>('companyNumber', ref),
    contact: readField('contact', ref),
    id: readField<string>('id', ref),
    name: readField<string>('name', ref),
  };
}

function extractDeleteFields(
  ref: Reference,
  readField: FieldFunctionOptions['readField'],
) {
  return {
    companyId: readField<string>('companyId', ref),
    id: readField<string>('id', ref),
  };
}

function extractDeleteTransactionFields(
  ref: Reference,
  readField: FieldFunctionOptions['readField'],
) {
  return {
    companyId: readField<string>('companyId', ref),
    id: readField<string>('id', ref),
    status: readField<string>('status', ref),
  };
}

// Common cache identification helper
function getCacheListId(
  cache: InMemoryCache,
  typename: string,
  id: string,
  additionalFields?: Record<string, string>,
) {
  return cache.identify({
    __typename: typename,
    id,
    ...additionalFields,
  });
}

function updateTypeaheadCache(
  cache: InMemoryCache,
  transaction: Pick<
    Transaction,
    'category' | 'companyId' | 'description' | 'name'
  >,
) {
  cache.modify({
    fields: {
      purchases: (items: string[] | Reference) =>
        updateTypeaheadField(items, transaction, 'purchases'),
      sales: (items: string[] | Reference) =>
        updateTypeaheadField(items, transaction, 'sales'),
      suppliers: (items: string[] | Reference) =>
        updateTypeaheadField(items, transaction, 'suppliers'),
    },
    id: cache.identify({
      __typename: 'Typeahead',
      id: transaction.companyId,
    }),
  });
}

function createTransactionFragment() {
  return gql(/* GraphQL */ `
    fragment NewTransaction on Transaction {
      amount
      attachment
      date
      description
      id
      name
      scheduled
    }
  `);
}

function createClientFragment() {
  return gql(/* GraphQL */ `
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
  `);
}

function createCompanyFragment() {
  return gql(/* GraphQL */ `
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
  `);
}

// Common cache modification helpers
function addItemToCacheList(
  cache: InMemoryCache,
  data: Record<string, unknown> & { __typename: string },
  fragment: ReturnType<typeof gql>,
  listId: string,
  sortField: string,
) {
  return cache.modify({
    fields: {
      items: (refs: readonly Reference[], { readField: rf }) => {
        if (refs.some((ref) => rf('id', ref) === data.id)) {
          return [...refs];
        }

        const newRef = cache.writeFragment({
          data,
          fragment,
        });

        if (!newRef) {
          return [...refs];
        }

        return [...refs, newRef].sort((a, b) => {
          const readA = rf<string>(sortField, a);
          const readB = rf<string>(sortField, b);

          if (readA && readB) {
            return readA.localeCompare(readB);
          }

          return 0;
        });
      },
    },
    id: listId,
  });
}

function removeItemFromCacheList(
  cache: InMemoryCache,
  itemId: string,
  listId: string,
) {
  return cache.modify({
    fields: {
      items: (refs: readonly Reference[], { readField: rf }) =>
        refs.filter((ref) => rf('id', ref) !== itemId),
    },
    id: listId,
  });
}

function addTransactionToCache(
  cache: InMemoryCache,
  transaction: {
    __typename: string;
    companyId: string;
    id: string;
    status: string;
  },
): void {
  const listId = getCacheListId(cache, 'Transactions', transaction.companyId, {
    status: transaction.status,
  });

  if (listId) {
    addItemToCacheList(
      cache,
      transaction,
      createTransactionFragment(),
      listId,
      'date',
    );
  }
}

function removeTransactionFromCache(
  cache: InMemoryCache,
  transaction: {
    companyId: string;
    id: string;
    status: string;
  },
): void {
  const listId = getCacheListId(cache, 'Transactions', transaction.companyId, {
    status: transaction.status,
  });

  if (listId) {
    removeItemFromCacheList(cache, transaction.id, listId);
  }
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
            const fields = extractTransactionFields(transactionRef, readField);

            const addTransaction = {
              __typename: 'Transaction',
              category: fields.category!,
              companyId: fields.companyId!,
              description: fields.description!,
              id: fields.id!,
              name: fields.name!,
              status: fields.status as TransactionStatus,
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
            const fields = extractClientFields(clientRef, readField);

            const createClient = {
              __typename: 'Client',
              address: fields.address,
              companyId: fields.companyId!,
              contact: fields.contact,
              id: fields.id!,
              name: fields.name!,
            };

            // Add to clients list
            const listId = getCacheListId(
              cache,
              'Clients',
              createClient.companyId,
            );

            if (listId) {
              addItemToCacheList(
                cache,
                createClient,
                createClientFragment(),
                listId,
                'name',
              );
            }
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
            const fields = extractCompanyFields(companyRef, readField);

            const createCompany = {
              __typename: 'Company',
              address: fields.address,
              bank: fields.bank,
              companyNumber: fields.companyNumber,
              contact: fields.contact,
              id: fields.id!,
              name: fields.name!,
            };

            // Add to companies list
            const listId = getCacheListId(cache, 'Companies', createCompany.id);

            if (listId) {
              addItemToCacheList(
                cache,
                createCompany,
                createCompanyFragment(),
                listId,
                'name',
              );
            }
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
            const fields = extractDeleteFields(clientRef, readField);

            // Remove from clients list
            const listId = getCacheListId(cache, 'Clients', fields.companyId!);

            if (listId) {
              removeItemFromCacheList(cache, fields.id!, listId);
            }
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
            const fields = {
              id: readField<string>('id', companyRef),
              owner: readField<string>('owner', companyRef),
            };

            // Remove from companies list
            const listId = getCacheListId(cache, 'Companies', fields.owner!);

            if (listId) {
              removeItemFromCacheList(cache, fields.id!, listId);
            }
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
            const fields = extractDeleteTransactionFields(
              transactionRef,
              readField,
            );

            // Remove from Transactions items
            const transactionsListId = getCacheListId(
              cache,
              'Transactions',
              fields.companyId!,
              { status: fields.status! },
            );

            if (transactionsListId) {
              removeItemFromCacheList(cache, fields.id!, transactionsListId);
            }

            // Remove from Balance transactions
            cache.modify({
              fields: {
                transactions: (refs: readonly Reference[], { readField: rf }) =>
                  refs.filter((ref) => rf('id', ref) !== fields.id),
              },
              id: getCacheListId(cache, 'Balance', fields.companyId!),
            });

            // Evict the transaction entity itself
            cache.evict({
              id: getCacheListId(cache, 'Transaction', fields.id!),
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
            const fields = extractTransactionFields(transactionRef, readField);

            const updateTransaction = {
              __typename: 'Transaction',
              category: fields.category!,
              companyId: fields.companyId!,
              description: fields.description!,
              id: fields.id!,
              name: fields.name!,
              status: fields.status as TransactionStatus,
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
