import { MockedProvider } from '@apollo/client/testing/react';
import { BreezeProvider } from '@motech-development/breeze-ui';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentProps } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { AccountsOwnerId } from '../../auth/owner';
import {
  GET_NOTIFICATIONS,
  MARK_NOTIFICATIONS_READ,
} from '../../data/operations';
import type { NotificationsQuery } from '../../graphql/graphql';
import {
  OwnerNotificationMenu,
  OwnerNotificationProvider,
} from './OwnerNotificationMenu';

const owner = 'auth0|owner' as AccountsOwnerId;
type OwnerNotification = NonNullable<
  NonNullable<NotificationsQuery['getNotifications']['items']>[number]
>;

const subscription = vi.hoisted<{
  client?: ReturnType<
    (typeof import('@apollo/client/react'))['useApolloClient']
  >;
  options?: {
    onData?: (value: unknown) => void;
  };
  mutationResult?: readonly [ReturnType<typeof vi.fn>, { loading: boolean }];
  queryResult?: unknown;
  result?: {
    error?: Error;
    loading: boolean;
    restart: ReturnType<typeof vi.fn>;
  };
}>(() => ({}));

vi.mock('@apollo/client/react', async (importOriginal) => {
  const original =
    await importOriginal<typeof import('@apollo/client/react')>();

  return {
    ...original,
    useMutation: (...args: Parameters<typeof original.useMutation>) =>
      subscription.mutationResult ?? original.useMutation(...args),
    useQuery: (...args: Parameters<typeof original.useQuery>) =>
      subscription.queryResult ?? original.useQuery(...args),
    useSubscription: (
      _query: unknown,
      options: typeof subscription.options,
    ) => {
      subscription.client = original.useApolloClient();
      subscription.options = options;

      return (
        subscription.result ?? {
          error: undefined,
          loading: true,
          restart: vi.fn(),
        }
      );
    },
  };
});

function notification(
  id: string,
  createdAt: string,
  message = 'REPORT_READY_TO_DOWNLOAD',
  read = false,
): OwnerNotification {
  return { createdAt, id, message, owner, read };
}

function notificationQueryMock(items: readonly OwnerNotification[]) {
  return {
    maxUsageCount: Number.POSITIVE_INFINITY,
    request: {
      query: GET_NOTIFICATIONS,
      variables: { count: 5, id: owner },
    },
    result: {
      data: {
        getNotifications: {
          __typename: 'Notifications' as const,
          id: owner,
          items: [...items],
        },
      },
    },
  };
}

function successfulMarkReadMock(ids: readonly string[]) {
  return {
    request: {
      query: MARK_NOTIFICATIONS_READ,
      variables: { id: owner, input: { ids: [...ids] } },
    },
    result: {
      data: {
        markAsRead: {
          __typename: 'Notifications' as const,
          items: ids.map((id) => ({
            __typename: 'Notification' as const,
            id,
            read: true,
          })),
        },
      },
    },
  };
}

function pendingMutation() {
  let resolve!: (value: unknown) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<unknown>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });

  return { promise, reject, resolve };
}

function setNotificationQueryResult({
  error,
  hasData = true,
  items = [],
  loading = false,
  previousItems,
  refetch = vi.fn().mockResolvedValue(undefined),
}: Readonly<{
  error?: Error;
  hasData?: boolean;
  items?: readonly OwnerNotification[];
  loading?: boolean;
  previousItems?: readonly OwnerNotification[];
  refetch?: ReturnType<typeof vi.fn>;
}> = {}) {
  subscription.queryResult = {
    data:
      error || !hasData
        ? undefined
        : { getNotifications: { id: owner, items: [...items] } },
    error,
    loading,
    previousData: previousItems
      ? { getNotifications: { id: owner, items: [...previousItems] } }
      : undefined,
    refetch,
  };

  return refetch;
}

interface NotificationTestHarnessProps {
  mocks?: ComponentProps<typeof MockedProvider>['mocks'];
  timeZone?: string;
}

function NotificationTestHarness({
  mocks,
  timeZone,
}: Readonly<NotificationTestHarnessProps>) {
  return (
    <BreezeProvider locale="en-GB" timeZone={timeZone}>
      <MockedProvider mocks={mocks}>
        <OwnerNotificationProvider owner={owner}>
          <OwnerNotificationMenu onSignOut={vi.fn()} userName="Morgan Green" />
        </OwnerNotificationProvider>
      </MockedProvider>
    </BreezeProvider>
  );
}

function renderNotificationMenu(props: NotificationTestHarnessProps = {}) {
  return render(
    <NotificationTestHarness mocks={props.mocks} timeZone={props.timeZone} />,
  );
}

describe('OwnerNotificationMenu', () => {
  beforeEach(() => {
    subscription.client = undefined;
    subscription.mutationResult = undefined;
    subscription.options = undefined;
    subscription.queryResult = undefined;
    subscription.result = undefined;
  });

  it('shows the latest notifications and marks displayed unread items read when dismissed', async () => {
    const user = userEvent.setup();

    renderNotificationMenu({
      mocks: [
        notificationQueryMock([
          notification('notification-1', '2026-08-12T09:30:00.000Z'),
        ]),
        successfulMarkReadMock(['notification-1']),
      ],
      timeZone: 'Europe/London',
    });

    const trigger = await screen.findByRole('button', {
      name: 'Notifications (1 unread)',
    });

    await user.click(trigger);
    expect(screen.getByText('Your report is ready to download')).toBeVisible();
    expect(screen.getByText(/^Unread:/u)).toBeInTheDocument();
    expect(screen.getByText(/Created/u)).toContainElement(
      screen.getByText('12 Aug 2026, 10:30'),
    );

    await user.click(trigger);
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: 'Notifications (0 unread)' }),
      ).toBeVisible(),
    );
    await user.click(
      screen.getByRole('button', { name: 'Notifications (0 unread)' }),
    );
    expect(screen.queryByText(/^Unread:/u)).not.toBeInTheDocument();
  });

  it('prepends each live notification once and retains only the latest five', async () => {
    const user = userEvent.setup();
    const notifications = [
      [
        'notification-1',
        '2026-08-12T05:00:00.000Z',
        'REPORT_READY_TO_DOWNLOAD',
      ],
      ['notification-2', '2026-08-12T06:00:00.000Z', 'UNKNOWN_MESSAGE'],
      ['notification-3', '2026-08-12T07:00:00.000Z', 'VIRUS_SCAN_FAIL'],
      [
        'notification-4',
        '2026-08-12T08:00:00.000Z',
        'REPORT_READY_TO_DOWNLOAD',
      ],
      [
        'notification-5',
        '2026-08-12T11:30:00.000+02:00',
        'TRANSACTION_PUBLISHED',
      ],
    ].map(([id, createdAt, message]) =>
      notification(id, createdAt, message, true),
    );
    setNotificationQueryResult({ items: notifications });

    renderNotificationMenu({ timeZone: 'Europe/London' });

    await screen.findByRole('button', { name: 'Notifications (0 unread)' });
    const incoming = notification(
      'notification-6',
      '2026-08-12T10:00:00.000Z',
      'VIRUS_SCAN_FAIL',
    );
    const event = {
      client: subscription.client,
      data: { data: { onNotification: incoming } },
    };

    await act(async () => {
      subscription.options?.onData?.(event);
      subscription.options?.onData?.(event);
      await Promise.resolve();
    });
    const trigger = await screen.findByRole('button', {
      name: 'Notifications (1 unread)',
    });

    await user.click(trigger);
    expect(
      screen
        .getAllByText(/^12 Aug 2026/u)
        .map((createdAt) => createdAt.textContent),
    ).toEqual([
      '12 Aug 2026, 11:00',
      '12 Aug 2026, 10:30',
      '12 Aug 2026, 09:00',
      '12 Aug 2026, 08:00',
      '12 Aug 2026, 07:00',
    ]);
    expect(screen.queryByText('12 Aug 2026, 06:00')).not.toBeInTheDocument();
    expect(screen.getAllByText('12 Aug 2026, 11:00')).toHaveLength(1);
    expect(screen.getByText('You have a new notification')).toBeVisible();
  });

  it('keeps account actions available while a failed query is retried and recovers', async () => {
    const user = userEvent.setup();
    const refetch = setNotificationQueryResult({
      error: new Error('Query failed'),
    });
    const view = renderNotificationMenu();
    const trigger = screen.getByRole('button', {
      name: 'Notifications (0 unread)',
    });

    await user.click(trigger);
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Notifications could not be loaded',
    );
    expect(screen.getByRole('menuitem', { name: 'Sign out' })).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(refetch).toHaveBeenCalledOnce();

    setNotificationQueryResult({ refetch });
    view.rerender(<NotificationTestHarness />);

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByText('No notifications yet')).toBeVisible();
  });

  it('presents initial and background notification progress without hiding safe actions', async () => {
    const user = userEvent.setup();
    const mutationState = { loading: false };
    subscription.mutationResult = [vi.fn(), mutationState];
    setNotificationQueryResult({ hasData: false, loading: true });
    const view = renderNotificationMenu();

    await user.click(
      screen.getByRole('button', { name: 'Notifications (0 unread)' }),
    );
    expect(screen.getByText('Loading notifications')).toBeVisible();
    expect(screen.getByRole('menuitem', { name: 'Sign out' })).toBeVisible();

    const retainedNotification = notification(
      'notification-1',
      '2026-08-12T09:00:00.000Z',
    );
    setNotificationQueryResult({
      items: [retainedNotification],
      loading: true,
    });
    subscription.result = {
      error: undefined,
      loading: true,
      restart: vi.fn(),
    };
    mutationState.loading = true;
    view.rerender(<NotificationTestHarness />);

    expect(screen.getByText('Refreshing notifications')).toBeVisible();
    expect(screen.getByText('Connecting live updates')).toBeVisible();
    expect(screen.getByText('Updating notifications')).toBeVisible();
    expect(screen.getByText('Your report is ready to download')).toBeVisible();
    expect(screen.getByRole('menuitem', { name: 'Sign out' })).toBeVisible();
  });

  it('retains notifications and safe actions through refresh failure and recovery', async () => {
    const user = userEvent.setup();
    const retainedNotification = notification(
      'notification-1',
      '2026-08-12T09:00:00.000Z',
    );
    setNotificationQueryResult({
      error: new Error('Refresh failed'),
      previousItems: [retainedNotification],
    });
    const view = renderNotificationMenu();

    await user.click(
      screen.getByRole('button', { name: 'Notifications (1 unread)' }),
    );
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Notifications could not be refreshed',
    );
    expect(screen.getByText('Your report is ready to download')).toBeVisible();
    expect(screen.getByRole('menuitem', { name: 'Sign out' })).toBeVisible();

    setNotificationQueryResult({ items: [retainedNotification] });
    view.rerender(<NotificationTestHarness />);

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByText('Your report is ready to download')).toBeVisible();
  });

  it('reports a failed live connection and lets the user retry it', async () => {
    const user = userEvent.setup();
    const restart = vi.fn();
    setNotificationQueryResult();
    subscription.result = {
      error: new Error('Subscription failed'),
      loading: false,
      restart,
    };
    const view = renderNotificationMenu();

    await user.click(
      screen.getByRole('button', { name: 'Notifications (0 unread)' }),
    );
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Live notification updates are unavailable',
    );
    await user.click(screen.getByRole('button', { name: 'Try reconnecting' }));
    expect(restart).toHaveBeenCalledOnce();

    subscription.result = {
      error: undefined,
      loading: true,
      restart,
    };
    view.rerender(<NotificationTestHarness />);

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByText('No notifications yet')).toBeVisible();
  });

  it('refetches the authoritative list after the live connection reconnects', async () => {
    setNotificationQueryResult();
    const view = renderNotificationMenu();
    const notificationBeforeReconnect = notification(
      'notification-before-reconnect',
      '2026-08-12T10:00:00.000Z',
    );

    await act(async () => {
      subscription.options?.onData?.({
        client: subscription.client,
        data: {
          data: { onNotification: notificationBeforeReconnect },
        },
      });
      await Promise.resolve();
    });
    expect(
      screen.getByRole('button', { name: 'Notifications (1 unread)' }),
    ).toBeVisible();
    const notificationAfterReconnect = notification(
      'notification-after-reconnect',
      '2026-08-12T11:00:00.000Z',
      'TRANSACTION_PUBLISHED',
    );
    const refetchQueries = vi.fn().mockImplementation(() => {
      setNotificationQueryResult({
        items: [notificationAfterReconnect, notificationBeforeReconnect],
      });

      return Promise.resolve(undefined);
    });
    const event = {
      client: { ...subscription.client, refetchQueries },
      data: { extensions: { controlMsgType: 'CONNECTED' } },
    };

    await act(async () => {
      subscription.options?.onData?.(event);
      subscription.options?.onData?.(event);
      await Promise.resolve();
    });
    view.rerender(<NotificationTestHarness />);

    const user = userEvent.setup();
    await user.click(
      screen.getByRole('button', { name: 'Notifications (2 unread)' }),
    );
    expect(
      screen.getAllByText('Your report is ready to download'),
    ).toHaveLength(1);
    expect(
      screen.getByText('A scheduled transaction has been published'),
    ).toBeVisible();
  });

  it('retries every unread notification after overlapping dismissals fail', async () => {
    const user = userEvent.setup();
    const firstMutation = pendingMutation();
    const secondMutation = pendingMutation();
    const markNotificationsRead = vi
      .fn()
      .mockReturnValueOnce(firstMutation.promise)
      .mockReturnValueOnce(secondMutation.promise)
      .mockResolvedValueOnce(undefined);
    subscription.mutationResult = [markNotificationsRead, { loading: false }];
    setNotificationQueryResult({
      items: [notification('notification-1', '2026-08-12T09:00:00.000Z')],
    });
    renderNotificationMenu();

    await user.click(
      screen.getByRole('button', { name: 'Notifications (1 unread)' }),
    );
    await user.click(
      screen.getByRole('button', { name: 'Notifications (1 unread)' }),
    );
    await act(async () => {
      subscription.options?.onData?.({
        client: subscription.client,
        data: {
          data: {
            onNotification: notification(
              'notification-2',
              '2026-08-12T10:00:00.000Z',
            ),
          },
        },
      });
      await Promise.resolve();
    });
    await user.click(
      screen.getByRole('button', { name: 'Notifications (1 unread)' }),
    );
    await user.click(
      screen.getByRole('button', { name: 'Notifications (1 unread)' }),
    );

    await act(async () => {
      secondMutation.reject(new Error('Second mutation failed'));
      await Promise.resolve();
      firstMutation.reject(new Error('First mutation failed'));
      await Promise.resolve();
    });
    await user.click(
      await screen.findByRole('button', {
        name: 'Notifications (2 unread)',
      }),
    );
    await user.click(screen.getByRole('button', { name: 'Try again' }));

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Notifications (0 unread)' }),
      ).toBeVisible();
    });
  });

  it('retains successful read state when overlapping retries settle out of order', async () => {
    const user = userEvent.setup();
    const failedRetry = pendingMutation();
    const successfulRetry = pendingMutation();
    const markNotificationsRead = vi
      .fn()
      .mockRejectedValueOnce(new Error('Initial mutation failed'))
      .mockReturnValueOnce(failedRetry.promise)
      .mockReturnValueOnce(successfulRetry.promise);
    subscription.mutationResult = [markNotificationsRead, { loading: false }];
    setNotificationQueryResult({
      items: [notification('notification-1', '2026-08-12T09:00:00.000Z')],
    });
    renderNotificationMenu();

    const trigger = screen.getByRole('button', {
      name: 'Notifications (1 unread)',
    });
    await user.click(trigger);
    await user.click(trigger);
    await user.click(
      await screen.findByRole('button', {
        name: 'Notifications (1 unread)',
      }),
    );
    const retry = screen.getByRole('button', { name: 'Try again' });
    await user.click(retry);
    await user.click(retry);

    await act(async () => {
      successfulRetry.resolve(undefined);
      await Promise.resolve();
      failedRetry.reject(new Error('Overlapping retry failed'));
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Notifications (0 unread)' }),
      ).toBeVisible();
    });
  });

  it('restores the unread state after a failed dismissal and retries the mutation', async () => {
    const user = userEvent.setup();
    const queryMock = notificationQueryMock([
      notification('notification-1', '2026-08-12T09:30:00.000Z'),
    ]);
    const successfulMutation = successfulMarkReadMock(['notification-1']);

    renderNotificationMenu({
      mocks: [
        queryMock,
        {
          error: new Error('Mutation failed'),
          request: successfulMutation.request,
        },
        successfulMutation,
      ],
    });

    await user.click(
      await screen.findByRole('button', {
        name: 'Notifications (1 unread)',
      }),
    );
    await user.click(
      screen.getByRole('button', { name: 'Notifications (1 unread)' }),
    );
    const restoredTrigger = await screen.findByRole('button', {
      name: 'Notifications (1 unread)',
    });
    await user.click(restoredTrigger);

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Notifications could not be marked as read',
    );
    await user.click(screen.getByRole('button', { name: 'Try again' }));

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Notifications (0 unread)' }),
      ).toBeVisible();
    });
  });
});
