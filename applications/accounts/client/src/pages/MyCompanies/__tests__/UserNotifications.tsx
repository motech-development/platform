import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import {
  act,
  fireEvent,
  render,
  RenderResult,
  waitFor,
} from '@testing-library/react';
import ON_NOTIFICATION from '../../../graphql/notifications/ON_NOTIFICATION';
import TestProvider from '../../../utils/TestProvider';
import UserNotifications, {
  GET_NOTIFICATIONS,
  MARK_AS_READ,
} from '../UserNotifications';

describe('UserNotifications', () => {
  let component: RenderResult;
  let mocks: MockedResponse[];

  describe('when there is no data', () => {
    beforeEach(async () => {
      mocks = [
        {
          request: {
            query: GET_NOTIFICATIONS,
            variables: {
              count: 5,
              id: 'user-id',
            },
          },
          result: {
            data: {
              getNotifications: null,
            },
          },
        },
        {
          request: {
            query: ON_NOTIFICATION,
            variables: {
              owner: 'user-id',
            },
          },
          result: {
            data: {
              onNotification: null,
            },
          },
        },
      ];

      await act(async () => {
        component = render(
          <TestProvider>
            <MockedProvider mocks={mocks} addTypename={false}>
              <UserNotifications id="user-id" />
            </MockedProvider>
          </TestProvider>,
        );

        await Promise.resolve();
      });
    });

    it('should display nothing', async () => {
      const { queryByRole } = component;

      await waitFor(() =>
        expect(queryByRole('button')).not.toBeInTheDocument(),
      );
    });
  });

  describe('when there is data', () => {
    beforeEach(async () => {
      mocks = [
        {
          request: {
            query: GET_NOTIFICATIONS,
            variables: {
              count: 5,
              id: 'user-id',
            },
          },
          result: {
            data: {
              getNotifications: {
                id: 'user-id',
                items: [
                  {
                    createdAt: '2020-07-01T00:00:00.000Z',
                    id: 'notification-1',
                    message: 'Notification_1',
                    payload: null,
                    read: true,
                  },
                ],
              },
            },
          },
        },
        {
          request: {
            query: ON_NOTIFICATION,
            variables: {
              owner: 'user-id',
            },
          },
          result: {
            data: {
              onNotification: {
                createdAt: '2020-07-01T00:00:00.000Z',
                id: 'notification-2',
                message: 'Notification_2',
                owner: 'user-id',
                payload: null,
                read: true,
              },
            },
          },
        },
      ];

      await act(async () => {
        component = render(
          <TestProvider>
            <MockedProvider mocks={mocks} addTypename={false}>
              <UserNotifications id="user-id" />
            </MockedProvider>
          </TestProvider>,
        );

        await Promise.resolve();
      });
    });

    it('should display the notifications', async () => {
      const { findByRole, findByText } = component;
      const button = await findByRole('button');

      fireEvent.click(button);

      await waitFor(() =>
        expect(
          findByText('messages.Notification_1'),
        ).resolves.toBeInTheDocument(),
      );
    });

    it('should not mark any messages as read', async () => {
      const { container, findByRole } = component;
      const button = await findByRole('button');

      fireEvent.click(button);

      fireEvent.click(button);

      await waitFor(() => expect(container).toBeInTheDocument());
    });
  });

  describe('when new notifications comes in', () => {
    beforeEach(async () => {
      mocks = [
        {
          request: {
            query: GET_NOTIFICATIONS,
            variables: {
              count: 5,
              id: 'user-id',
            },
          },
          result: {
            data: {
              getNotifications: {
                id: 'user-id',
                items: [
                  {
                    createdAt: '2020-07-01T00:00:00.000Z',
                    id: 'notification-1',
                    message: 'Notification_1',
                    payload: null,
                    read: true,
                  },
                ],
              },
            },
          },
        },
        {
          request: {
            query: ON_NOTIFICATION,
            variables: {
              owner: 'user-id',
            },
          },
          result: {
            data: {
              onNotification: {
                createdAt: '2020-07-01T00:00:00.000Z',
                id: 'notification-2',
                message: 'Notification_2',
                owner: 'user-id',
                payload: null,
                read: false,
              },
            },
          },
        },
        {
          request: {
            query: MARK_AS_READ,
            variables: {
              id: 'user-id',
              input: {
                ids: ['notification-2'],
              },
            },
          },
          result: {
            data: {
              markAsRead: {
                items: [
                  {
                    id: 'notification-2',
                    read: true,
                  },
                ],
              },
            },
          },
        },
      ];

      await act(async () => {
        component = render(
          <TestProvider>
            <MockedProvider mocks={mocks} addTypename={false}>
              <UserNotifications id="user-id" />
            </MockedProvider>
          </TestProvider>,
        );

        await Promise.resolve();
      });
    });

    it('should display a the new notification flag', async () => {
      const { container } = component;

      await waitFor(() => {
        const icon = container.querySelector('svg[data-icon="asterisk"]');

        return expect(icon).toBeInTheDocument();
      });
    });

    it('should mark notification as read', async () => {
      const { container, findByRole } = component;

      await act(async () => {
        const button = await findByRole('button');

        fireEvent.click(button);

        fireEvent.click(button);
      });

      await waitFor(() => expect(container).toBeInTheDocument());
    });
  });
});
