import { useMutation, useQuery, useSubscription } from '@apollo/client/react';
import {
  FormattedDateTime,
  Spinner,
  UserMenu,
} from '@motech-development/breeze-ui';
import { CONTROL_EVENTS_KEY } from 'aws-appsync-subscription-link';
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import type { AccountsOwnerId } from '../../auth/owner';
import {
  GET_NOTIFICATIONS,
  MARK_NOTIFICATIONS_READ,
  ON_OWNER_NOTIFICATION,
} from '../../data/operations';
import type { NotificationsQuery } from '../../graphql/graphql';
import { RetryAlert } from '../RetryAlert';
import { useAppSyncSubscriptionConnection } from '../subscriptions';

const LATEST_NOTIFICATION_COUNT = 5;

type OwnerNotification = NonNullable<
  NonNullable<NotificationsQuery['getNotifications']['items']>[number]
>;

function newestNotificationFirst(
  left: OwnerNotification,
  right: OwnerNotification,
) {
  return Date.parse(right.createdAt) - Date.parse(left.createdAt);
}

function latestNotifications(
  notifications: readonly (OwnerNotification | null)[],
) {
  const byId = notifications.reduce((current, notification) => {
    if (!notification || current.has(notification.id)) {
      return current;
    }

    current.set(notification.id, notification);

    return current;
  }, new Map<string, OwnerNotification>());

  return [...byId.values()]
    .toSorted(newestNotificationFirst)
    .slice(0, LATEST_NOTIFICATION_COUNT);
}

function NotificationItems({
  items,
}: Readonly<{ items: readonly OwnerNotification[] }>) {
  const { t } = useTranslation('notifications');

  if (items.length === 0) {
    return <p>{t('No notifications yet')}</p>;
  }

  return (
    <ul className="-m-4 divide-y divide-[var(--breeze-border)]">
      {items.map((notification) => (
        <li className="p-4" key={notification.id}>
          <p className={notification.read ? undefined : 'font-bold'}>
            {t(`messages.${notification.message}`, {
              defaultValue: t('messages.fallback'),
            })}
          </p>
          <p className="mt-1 text-[var(--breeze-ink-soft)]">
            {t('Created')}{' '}
            <FormattedDateTime
              options={{ dateStyle: 'medium', timeStyle: 'short' }}
              value={notification.createdAt}
            />
          </p>
        </li>
      ))}
    </ul>
  );
}

function NotificationStatus({
  children,
  withBottomMargin = true,
}: Readonly<{ children: ReactNode; withBottomMargin?: boolean }>) {
  return (
    <span
      className={
        withBottomMargin
          ? 'mb-4 flex items-center gap-2'
          : 'flex items-center gap-2'
      }
      role="status"
    >
      <Spinner size="sm" />
      {children}
    </span>
  );
}

interface OwnerNotificationContextValue {
  failedToMarkRead: boolean;
  initialLoading: boolean;
  items: readonly OwnerNotification[];
  markDisplayedNotificationsRead: () => void;
  markingNotificationsRead: boolean;
  queryFailed: boolean;
  queryRefreshFailed: boolean;
  queryRefreshing: boolean;
  retryMarkRead: () => void;
  retryQuery: () => void;
  retrySubscription: () => void;
  subscriptionConnecting: boolean;
  subscriptionFailed: boolean;
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
  const { data, error, loading, previousData, refetch } = useQuery(
    GET_NOTIFICATIONS,
    {
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
      variables: { count: LATEST_NOTIFICATION_COUNT, id: owner },
    },
  );
  const [markNotificationsRead, { loading: markingNotificationsRead }] =
    useMutation(MARK_NOTIFICATIONS_READ);
  const handleSubscriptionConnection = useAppSyncSubscriptionConnection();
  const [liveNotifications, setLiveNotifications] = useState<
    readonly OwnerNotification[]
  >([]);
  const [optimisticallyReadIds, setOptimisticallyReadIds] = useState(
    () => new Set<string>(),
  );
  const [failedReadIds, setFailedReadIds] = useState<readonly string[]>([]);
  const {
    error: subscriptionError,
    loading: subscriptionLoading,
    restart,
  } = useSubscription(ON_OWNER_NOTIFICATION, {
    context: {
      controlMessages: { [CONTROL_EVENTS_KEY]: true },
    },
    onData: ({ client, data: subscriptionData }) => {
      if (
        handleSubscriptionConnection(subscriptionData, () => {
          setLiveNotifications([]);
          client
            .refetchQueries({ include: [GET_NOTIFICATIONS] })
            .catch(() => undefined);
        })
      ) {
        return;
      }

      const incoming = subscriptionData.data?.onNotification;

      if (!incoming || incoming.owner !== owner) {
        return;
      }

      const unreadIncoming = { ...incoming, read: false };

      setLiveNotifications((current) =>
        latestNotifications([unreadIncoming, ...current]),
      );

      client.cache.updateQuery(
        {
          query: GET_NOTIFICATIONS,
          variables: { count: LATEST_NOTIFICATION_COUNT, id: owner },
        },
        (current) => ({
          getNotifications: {
            ...(current?.getNotifications ?? { id: owner }),
            items: latestNotifications([
              unreadIncoming,
              ...(current?.getNotifications.items ?? []),
            ]),
          },
        }),
      );
    },
    variables: { owner },
  });
  const notificationData = data ?? previousData;
  const items = useMemo(
    () =>
      latestNotifications([
        ...liveNotifications,
        ...(notificationData?.getNotifications.items ?? []),
      ]),
    [liveNotifications, notificationData],
  );
  const unreadItems = useMemo(
    () =>
      items.filter(({ id, read }) => !read && !optimisticallyReadIds.has(id)),
    [items, optimisticallyReadIds],
  );
  const displayedItems = useMemo(
    () =>
      items.map((notification) =>
        optimisticallyReadIds.has(notification.id)
          ? { ...notification, read: true }
          : notification,
      ),
    [items, optimisticallyReadIds],
  );
  const unreadCount = unreadItems.length;

  const markNotificationIdsRead = useCallback(
    (ids: readonly string[]) => {
      if (ids.length === 0) {
        return;
      }

      setOptimisticallyReadIds((current) => new Set([...current, ...ids]));
      markNotificationsRead({
        variables: { id: owner, input: { ids: [...ids] } },
      })
        .then(() => {
          const completedIds = new Set(ids);

          setFailedReadIds((current) =>
            current.filter((id) => !completedIds.has(id)),
          );
        })
        .catch(() => {
          const failedIds = new Set(ids);

          setOptimisticallyReadIds(
            (current) =>
              new Set([...current].filter((id) => !failedIds.has(id))),
          );
          setFailedReadIds((current) => [...new Set([...current, ...ids])]);
        });
    },
    [markNotificationsRead, owner],
  );

  const markDisplayedNotificationsRead = useCallback(() => {
    markNotificationIdsRead(unreadItems.map(({ id }) => id));
  }, [markNotificationIdsRead, unreadItems]);

  const noNotificationData =
    !notificationData && liveNotifications.length === 0;

  const retryQuery = useCallback(() => {
    refetch().catch(() => undefined);
  }, [refetch]);
  const contextValue = useMemo<OwnerNotificationContextValue>(
    () => ({
      failedToMarkRead: failedReadIds.length > 0,
      initialLoading: loading && noNotificationData,
      items: displayedItems,
      markDisplayedNotificationsRead,
      markingNotificationsRead,
      queryFailed: Boolean(error && noNotificationData),
      queryRefreshFailed: Boolean(error && !noNotificationData),
      queryRefreshing: loading && !noNotificationData,
      retryMarkRead: () => markNotificationIdsRead(failedReadIds),
      retryQuery,
      retrySubscription: restart,
      subscriptionConnecting: subscriptionLoading && !subscriptionError,
      subscriptionFailed: Boolean(subscriptionError),
      unreadCount,
    }),
    [
      error,
      failedReadIds,
      displayedItems,
      loading,
      markDisplayedNotificationsRead,
      markNotificationIdsRead,
      markingNotificationsRead,
      noNotificationData,
      restart,
      retryQuery,
      subscriptionError,
      subscriptionLoading,
      unreadCount,
    ],
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
  const { t } = useTranslation('notifications');
  const notifications = useContext(OwnerNotificationContext);

  if (!notifications) {
    throw new Error(
      'OwnerNotificationMenu must be rendered inside OwnerNotificationProvider',
    );
  }

  const {
    failedToMarkRead,
    initialLoading,
    items,
    markDisplayedNotificationsRead,
    markingNotificationsRead,
    queryFailed,
    queryRefreshFailed,
    queryRefreshing,
    retryMarkRead,
    retryQuery,
    retrySubscription,
    subscriptionConnecting,
    subscriptionFailed,
    unreadCount,
  } = notifications;
  const notificationLabel = t('Notifications ({{count}} unread)', {
    count: unreadCount,
  });
  let notificationContent: ReactNode;

  if (initialLoading) {
    notificationContent = (
      <NotificationStatus withBottomMargin={false}>
        {t('Loading notifications')}
      </NotificationStatus>
    );
  } else if (queryFailed) {
    notificationContent = (
      <RetryAlert
        className="mb-4 flex-wrap last:mb-0"
        onRetry={retryQuery}
        retryLabel={t('Try again', { ns: 'routing' })}
        variant="danger"
      >
        {t('Notifications could not be loaded')}
      </RetryAlert>
    );
  } else {
    notificationContent = (
      <div>
        {queryRefreshing ? (
          <NotificationStatus>
            {t('Refreshing notifications')}
          </NotificationStatus>
        ) : null}
        {subscriptionConnecting ? (
          <NotificationStatus>
            {t('Connecting live updates')}
          </NotificationStatus>
        ) : null}
        {markingNotificationsRead && !failedToMarkRead ? (
          <NotificationStatus>{t('Updating notifications')}</NotificationStatus>
        ) : null}
        {queryRefreshFailed ? (
          <RetryAlert
            className="mb-4 flex-wrap last:mb-0"
            onRetry={retryQuery}
            retryLabel={t('Try again', { ns: 'routing' })}
          >
            {t('Notifications could not be refreshed')}
          </RetryAlert>
        ) : null}
        {subscriptionFailed ? (
          <RetryAlert
            className="mb-4 flex-wrap last:mb-0"
            onRetry={retrySubscription}
            retryLabel={t('Try reconnecting')}
          >
            {t('Live notification updates are unavailable')}
          </RetryAlert>
        ) : null}
        {failedToMarkRead ? (
          <RetryAlert
            className="mb-4 flex-wrap last:mb-0"
            loading={markingNotificationsRead}
            onRetry={retryMarkRead}
            retryLabel={t('Try again', { ns: 'routing' })}
            variant="danger"
          >
            {t('Notifications could not be marked as read')}
          </RetryAlert>
        ) : null}
        <NotificationItems items={items} />
      </div>
    );
  }

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
      notifications={notificationContent}
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
