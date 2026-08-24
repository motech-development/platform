import { useMutation, useQuery, useSubscription } from '@apollo/client/react';
import {
  FormattedDateTime,
  Stack,
  Typography,
  UserMenu,
  VisuallyHidden,
} from '@motech-development/breeze-ui';
import { CONTROL_EVENTS_KEY } from 'aws-appsync-subscription-link';
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { useTranslation } from 'react-i18next';
import type { AccountsOwnerId } from '../../auth/owner';
import {
  GET_NOTIFICATIONS,
  MARK_NOTIFICATIONS_READ,
  ON_OWNER_NOTIFICATION,
} from '../../data/operations';
import type { NotificationsQuery } from '../../graphql/graphql';
import { useOnlineStatus } from '../../pwa/connectivity';
import { useAppSyncSubscriptionConnection } from '../subscriptions';

const LATEST_NOTIFICATION_COUNT = 5;

type OwnerNotification = NonNullable<
  NonNullable<NotificationsQuery['getNotifications']['items']>[number]
>;

function isOwnerNotification(
  notification: OwnerNotification | null,
): notification is OwnerNotification {
  return notification !== null;
}

function NotificationItems({
  items,
}: Readonly<{ items: readonly OwnerNotification[] }>) {
  const { t } = useTranslation('notifications');

  if (items.length === 0) {
    return <Typography>{t('You have no new notifications')}</Typography>;
  }

  return (
    <Stack gap="md">
      {items.map((notification) => (
        <Stack gap="xs" key={notification.id}>
          <Typography weight={notification.read ? 'regular' : 'bold'}>
            {notification.read ? null : (
              <VisuallyHidden>{t('Unread')}: </VisuallyHidden>
            )}
            {t(`messages.${notification.message}`, {
              defaultValue: notification.message,
            })}
          </Typography>
          <Typography colour="muted">
            {t('Created')}{' '}
            <FormattedDateTime
              options={{ dateStyle: 'medium', timeStyle: 'short' }}
              value={notification.createdAt}
            />
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}

interface OwnerNotificationContextValue {
  items: readonly OwnerNotification[] | null;
  markDisplayedNotificationsRead: () => void;
  unreadCount: number;
}

const OwnerNotificationContext =
  createContext<OwnerNotificationContextValue | null>(null);

export function OwnerNotificationProvider({
  children,
  owner,
}: Readonly<{
  children: ReactNode;
  owner: AccountsOwnerId;
}>) {
  const { data, previousData } = useQuery(GET_NOTIFICATIONS, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    refetchWritePolicy: 'overwrite',
    variables: { count: LATEST_NOTIFICATION_COUNT, id: owner },
  });
  const [markNotificationsRead] = useMutation(MARK_NOTIFICATIONS_READ);
  const handleSubscriptionConnection = useAppSyncSubscriptionConnection();
  const online = useOnlineStatus();
  const activeNotificationRefreshes = useRef(new Set<Set<string>>());
  const subscriptionRestartPending = useRef(false);
  const { error: subscriptionError, restart: restartSubscription } =
    useSubscription(ON_OWNER_NOTIFICATION, {
      context: {
        controlMessages: { [CONTROL_EVENTS_KEY]: true },
      },
      onData: ({ client, data: subscriptionData }) => {
        const incoming = subscriptionData.data?.onNotification;
        const reconcileNotifications = () => {
          const query = {
            query: GET_NOTIFICATIONS,
            variables: { count: LATEST_NOTIFICATION_COUNT, id: owner },
          };
          const deliveredNotificationIds = new Set<string>();
          activeNotificationRefreshes.current.add(deliveredNotificationIds);

          client
            .query({
              ...query,
              context: { queryDeduplication: false },
              fetchPolicy: 'no-cache',
            })
            .then(({ data: authoritativeData }) => {
              if (
                !authoritativeData ||
                !activeNotificationRefreshes.current.has(
                  deliveredNotificationIds,
                )
              ) {
                return;
              }

              const notificationsDeliveredDuringRefresh = (
                client.cache.readQuery<NotificationsQuery>(query)
                  ?.getNotifications.items ?? []
              ).filter(
                (notification): notification is OwnerNotification =>
                  isOwnerNotification(notification) &&
                  deliveredNotificationIds.has(notification.id),
              );

              client.cache.writeQuery({
                ...query,
                data: {
                  getNotifications: {
                    ...authoritativeData.getNotifications,
                    items: [
                      ...notificationsDeliveredDuringRefresh,
                      ...(authoritativeData.getNotifications.items ?? []),
                    ],
                  },
                },
                overwrite: true,
              });
            })
            .catch(() => undefined)
            .finally(() => {
              activeNotificationRefreshes.current.delete(
                deliveredNotificationIds,
              );
            });
        };
        const connected = handleSubscriptionConnection(
          subscriptionData,
          reconcileNotifications,
          {
            reconcileInitialConnection: true,
            subscriptionPayloadPresent: incoming !== undefined,
          },
        );

        if (connected) {
          subscriptionRestartPending.current = false;
          return;
        }

        if (incoming === undefined) return;

        if (incoming?.owner !== owner) {
          return;
        }

        activeNotificationRefreshes.current.forEach((notificationIds) => {
          notificationIds.add(incoming.id);
        });
        client.cache.updateQuery(
          {
            query: GET_NOTIFICATIONS,
            variables: { count: LATEST_NOTIFICATION_COUNT, id: owner },
          },
          (current) => ({
            getNotifications: {
              ...(current?.getNotifications ?? {
                __typename: 'Notifications',
                id: owner,
              }),
              items: [incoming],
            },
          }),
        );
      },
      variables: { owner },
    });

  useEffect(
    () => () => {
      activeNotificationRefreshes.current.clear();
      subscriptionRestartPending.current = false;
    },
    [owner],
  );
  useEffect(() => {
    if (!online) {
      subscriptionRestartPending.current = false;
      return;
    }

    if (subscriptionError && !subscriptionRestartPending.current) {
      subscriptionRestartPending.current = true;
      restartSubscription();
    }
  }, [online, restartSubscription, subscriptionError]);
  const notificationData = data ?? previousData;
  const items = useMemo(() => {
    if (!notificationData) {
      return null;
    }

    return (notificationData.getNotifications.items ?? []).filter(
      isOwnerNotification,
    );
  }, [notificationData]);
  const unreadItems = useMemo(
    () => items?.filter(({ read }) => !read) ?? [],
    [items],
  );
  const unreadCount = unreadItems.length;

  const markNotificationIdsRead = useCallback(
    (ids: readonly string[]) => {
      if (ids.length === 0) {
        return;
      }

      markNotificationsRead({
        optimisticResponse: {
          markAsRead: {
            items: ids.map((id) => ({
              id,
              read: true,
            })),
          },
        },
        update: (cache) => {
          ids.forEach((id) => {
            const notificationId = cache.identify({
              __typename: 'Notification',
              id,
            });

            if (notificationId) {
              cache.modify({
                fields: { read: () => true },
                id: notificationId,
              });
            }
          });
        },
        variables: { id: owner, input: { ids: [...ids] } },
      }).catch(() => undefined);
    },
    [markNotificationsRead, owner],
  );

  const markDisplayedNotificationsRead = useCallback(() => {
    markNotificationIdsRead(unreadItems.map(({ id }) => id));
  }, [markNotificationIdsRead, unreadItems]);

  const contextValue = useMemo<OwnerNotificationContextValue>(
    () => ({
      items,
      markDisplayedNotificationsRead,
      unreadCount,
    }),
    [items, markDisplayedNotificationsRead, unreadCount],
  );

  return (
    <OwnerNotificationContext.Provider value={contextValue}>
      {children}
    </OwnerNotificationContext.Provider>
  );
}

export function OwnerNotificationMenu({
  onSignOut,
  userName,
}: Readonly<{
  onSignOut: () => void;
  userName: string;
}>) {
  const { t } = useTranslation(['notifications', 'shell']);
  const notifications = useContext(OwnerNotificationContext);

  if (!notifications) {
    throw new Error(
      'OwnerNotificationMenu must be rendered inside OwnerNotificationProvider',
    );
  }

  const { items, markDisplayedNotificationsRead, unreadCount } = notifications;
  const notificationLabel = t('Notifications ({{count}} unread)', {
    count: unreadCount,
  });

  return (
    <UserMenu
      aria-label={notificationLabel}
      actions={[
        {
          id: 'logout',
          label: t('Sign out', { ns: 'shell' }),
          onAction: onSignOut,
          variant: 'danger',
        },
      ]}
      hasUnread={unreadCount > 0}
      notificationHeading={t('Notifications')}
      notificationState={
        unreadCount > 0 ? t('{{count}} new', { count: unreadCount }) : undefined
      }
      notifications={items ? <NotificationItems items={items} /> : undefined}
      onOpenChange={(open) => {
        if (!open) {
          markDisplayedNotificationsRead();
        }
      }}
      unreadLabel={notificationLabel}
      userName={userName}
    />
  );
}
