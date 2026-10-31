import { gql, InMemoryCache } from '@apollo/client';
import { render } from '@testing-library/react';
import TestProvider from '../../utils/TestProvider';
import ApolloClient, {
  typePolicies,
  writeNotificationToCache,
} from '../ApolloClient';

describe('ApolloClient', () => {
  it('keeps an existing read state when a notification is replayed', () => {
    const cache = new InMemoryCache();
    const fragment = gql`
      fragment NotificationReadState on Notification {
        id
        read
      }
    `;
    const notificationId = 'notification-id';

    cache.writeFragment({
      data: {
        __typename: 'Notification',
        id: notificationId,
        read: true,
      },
      fragment,
    });

    const read = writeNotificationToCache(cache, {
      createdAt: 'today',
      id: notificationId,
      message: 'Notification message',
      owner: 'owner-id',
      payload: null,
      read: false,
    });

    expect(read).toBe(true);

    expect(
      cache.readFragment({
        fragment,
        id: cache.identify({
          __typename: 'Notification',
          id: notificationId,
        }),
      }),
    ).toEqual({
      __typename: 'Notification',
      id: notificationId,
      read: true,
    });
  });

  it('starts a new notification as unread', () => {
    const cache = new InMemoryCache();
    const fragment = gql`
      fragment NotificationReadState on Notification {
        id
        read
      }
    `;
    const notificationId = 'new-notification-id';

    const read = writeNotificationToCache(cache, {
      createdAt: 'today',
      id: notificationId,
      message: 'Notification message',
      owner: 'owner-id',
      payload: null,
      read: false,
    });

    expect(read).toBe(false);

    expect(
      cache.readFragment({
        fragment,
        id: cache.identify({
          __typename: 'Notification',
          id: notificationId,
        }),
      }),
    ).toEqual({
      __typename: 'Notification',
      id: notificationId,
      read: false,
    });
  });

  it('preserves read state when Apollo normalizes a replayed subscription result', () => {
    const cache = new InMemoryCache({ typePolicies });
    const notificationId = 'notification-id';
    const notificationFragment = gql`
      fragment NotificationReadState on Notification {
        id
        read
      }
    `;
    const subscription = gql`
      subscription OnNotification {
        onNotification {
          __typename
          createdAt
          id
          message
          owner
          payload
          read
        }
      }
    `;
    const writeSubscriptionResult = (read: boolean) =>
      cache.write({
        dataId: 'ROOT_SUBSCRIPTION',
        query: subscription,
        result: {
          onNotification: {
            __typename: 'Notification',
            createdAt: 'today',
            id: notificationId,
            message: 'Notification message',
            owner: 'owner-id',
            payload: null,
            read,
          },
        },
      });

    writeSubscriptionResult(false);
    cache.writeFragment({
      data: {
        __typename: 'Notification',
        id: notificationId,
        read: true,
      },
      fragment: notificationFragment,
    });

    writeSubscriptionResult(false);

    expect(
      cache.readFragment({
        fragment: notificationFragment,
        id: cache.identify({
          __typename: 'Notification',
          id: notificationId,
        }),
      }),
    ).toEqual({
      __typename: 'Notification',
      id: notificationId,
      read: true,
    });
  });

  it('should show error if no AppSync settings are set', async () => {
    const { findByText } = render(
      <TestProvider>
        <ApolloClient>
          <div data-testid="content" />
        </ApolloClient>
      </TestProvider>,
    );

    await expect(findByText('error.title')).resolves.toBeInTheDocument();
  });

  describe('when AppSync settings are set', () => {
    let env: NodeJS.ProcessEnv;

    beforeEach(() => {
      env = {
        ...process.env,
      };

      process.env.REACT_APP_APPSYNC_URL = 'https://appsync.endpoint';
      process.env.REACT_APP_AWS_REGION = 'eu-west-1';
    });

    afterEach(() => {
      process.env = env;
    });

    it('should show spinner if loading', () => {
      const { container } = render(
        <TestProvider isLoading>
          <ApolloClient>
            <div data-testid="content" />
          </ApolloClient>
        </TestProvider>,
      );
      const loader = container.querySelector('circle');

      expect(loader).toBeInTheDocument();
    });

    it('should show error if user is not authenticated', async () => {
      const { findByText } = render(
        <TestProvider isAuthenticated={false}>
          <ApolloClient>
            <div data-testid="content" />
          </ApolloClient>
        </TestProvider>,
      );

      await expect(
        findByText('unauthorised.title'),
      ).resolves.toBeInTheDocument();
    });

    it('should render child', async () => {
      const { findByTestId } = render(
        <TestProvider>
          <ApolloClient>
            <div data-testid="content" />
          </ApolloClient>
        </TestProvider>,
      );

      await expect(findByTestId('content')).resolves.toBeInTheDocument();
    });
  });
});
