import { useMutation, useQuery, useSubscription } from '@apollo/client/react';
import {
  Alert,
  Button,
  FormattedDateTime,
  Inline,
  Spinner,
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
  useMemo,
  useRef,
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
import { useAppSyncSubscriptionConnection } from '../subscriptions';

const LATEST_NOTIFICATION_COUNT = 5;

type OwnerNotification = NonNullable<
  NonNullable<NotificationsQuery['getNotifications']['items']>[number]
>;

interface ReadAttemptState {
  pendingAttempts: Set<symbol>;
  succeeded: boolean;
}

function startReadAttempt(
  attempts: Map<string, ReadAttemptState>,
  ids: readonly string[],
) {
  const attempt = Symbol('read-attempt');

  ids.forEach((id) => {
    const state = attempts.get(id) ?? {
      pendingAttempts: new Set<symbol>(),
      succeeded: false,
    };

    state.pendingAttempts.add(attempt);
    attempts.set(id, state);
  });

  return attempt;
}

function settleReadAttempt(
  attempts: Map<string, ReadAttemptState>,
  ids: readonly string[],
  attempt: symbol,
  succeeded: boolean,
) {
  const failedIds: string[] = [];

  ids.forEach((id) => {
    const state = attempts.get(id);

    if (!state) {
      return;
    }

    state.pendingAttempts.delete(attempt);
    state.succeeded ||= succeeded;

    if (state.pendingAttempts.size > 0) {
      return;
    }

    attempts.delete(id);

    if (!state.succeeded) {
      failedIds.push(id);
    }
  });

  return failedIds;
}

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
    .sort(newestNotificationFirst)
    .slice(0, LATEST_NOTIFICATION_COUNT);
}

function NotificationItems({
  items,
}: Readonly<{ items: readonly OwnerNotification[] }>) {
  const { t } = useTranslation('notifications');

  if (items.length === 0) {
    return <Typography>{t('No notifications yet')}</Typography>;
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
              defaultValue: t('messages.fallback'),
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

function NotificationStatus({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <Inline gap="sm" role="status" wrap={false}>
      <Spinner size="sm" />
      <Typography as="span">{children}</Typography>
    </Inline>
  );
}

function NotificationFailure({
  children,
  loading = false,
  onRetry,
  retryLabel,
  variant = 'warning',
}: Readonly<{
  children: ReactNode;
  loading?: boolean;
  onRetry: () => void;
  retryLabel: string;
  variant?: 'danger' | 'warning';
}>) {
  return (
    <Alert variant={variant}>
      <Stack align="start" gap="sm">
        <Typography>{children}</Typography>
        <Button appearance="text" loading={loading} onAction={onRetry}>
          {retryLabel}
        </Button>
      </Stack>
    </Alert>
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
  const readAttempts = useRef(new Map<string, ReadAttemptState>());
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

      if (incoming?.owner !== owner) {
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
            ...(current?.getNotifications ?? {
              __typename: 'Notifications',
              id: owner,
            }),
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

      const attempt = startReadAttempt(readAttempts.current, ids);

      setOptimisticallyReadIds((current) => new Set([...current, ...ids]));
      markNotificationsRead({
        variables: { id: owner, input: { ids: [...ids] } },
      })
        .then(() => {
          settleReadAttempt(readAttempts.current, ids, attempt, true);
          const completedIds = new Set(ids);

          setOptimisticallyReadIds(
            (current) => new Set([...current, ...completedIds]),
          );
          setFailedReadIds((current) =>
            current.filter((id) => !completedIds.has(id)),
          );
        })
        .catch(() => {
          const failedIds = settleReadAttempt(
            readAttempts.current,
            ids,
            attempt,
            false,
          );

          if (failedIds.length === 0) {
            return;
          }

          const failedIdSet = new Set(failedIds);

          setOptimisticallyReadIds(
            (current) =>
              new Set([...current].filter((id) => !failedIdSet.has(id))),
          );
          setFailedReadIds((current) => [
            ...new Set([...current, ...failedIds]),
          ]);
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

function OwnerNotificationContent({
  notifications,
}: Readonly<{ notifications: OwnerNotificationContextValue }>) {
  const { t } = useTranslation(['notifications', 'routing']);
  const {
    failedToMarkRead,
    initialLoading,
    items,
    markingNotificationsRead,
    queryFailed,
    queryRefreshFailed,
    queryRefreshing,
    retryMarkRead,
    retryQuery,
    retrySubscription,
    subscriptionConnecting,
    subscriptionFailed,
  } = notifications;

  if (initialLoading) {
    return (
      <NotificationStatus>{t('Loading notifications')}</NotificationStatus>
    );
  }

  if (queryFailed) {
    return (
      <NotificationFailure
        onRetry={retryQuery}
        retryLabel={t('Try again', { ns: 'routing' })}
        variant="danger"
      >
        {t('Notifications could not be loaded')}
      </NotificationFailure>
    );
  }

  return (
    <Stack gap="md">
      {queryRefreshing ? (
        <NotificationStatus>{t('Refreshing notifications')}</NotificationStatus>
      ) : null}
      {subscriptionConnecting ? (
        <NotificationStatus>{t('Connecting live updates')}</NotificationStatus>
      ) : null}
      {markingNotificationsRead && !failedToMarkRead ? (
        <NotificationStatus>{t('Updating notifications')}</NotificationStatus>
      ) : null}
      {queryRefreshFailed ? (
        <NotificationFailure
          onRetry={retryQuery}
          retryLabel={t('Try again', { ns: 'routing' })}
        >
          {t('Notifications could not be refreshed')}
        </NotificationFailure>
      ) : null}
      {subscriptionFailed ? (
        <NotificationFailure
          onRetry={retrySubscription}
          retryLabel={t('Try reconnecting')}
        >
          {t('Live notification updates are unavailable')}
        </NotificationFailure>
      ) : null}
      {failedToMarkRead ? (
        <NotificationFailure
          loading={markingNotificationsRead}
          onRetry={retryMarkRead}
          retryLabel={t('Try again', { ns: 'routing' })}
          variant="danger"
        >
          {t('Notifications could not be marked as read')}
        </NotificationFailure>
      ) : null}
      <NotificationItems items={items} />
    </Stack>
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

  const { markDisplayedNotificationsRead, unreadCount } = notifications;
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
      notifications={<OwnerNotificationContent notifications={notifications} />}
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
