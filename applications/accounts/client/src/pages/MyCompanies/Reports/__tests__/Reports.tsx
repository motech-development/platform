import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { waitForApollo } from '@motech-development/appsync-apollo';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { createMemoryHistory, MemoryHistory } from 'history';
import ON_NOTIFICATION from '../../../../graphql/notifications/ON_NOTIFICATION';
import TestProvider, { add } from '../../../../utils/TestProvider';
import Reports, { GET_REPORTS } from '../Reports';

describe('Reports', () => {
  let history: MemoryHistory;
  let mocks: MockedResponse[];

  beforeEach(() => {
    history = createMemoryHistory({
      initialEntries: ['/reports/company-id'],
    });

    jest.spyOn(history, 'push');

    axios.request = jest.fn().mockResolvedValue({
      data: 'success',
    });
  });

  describe('when there are reports returned', () => {
    beforeEach(async () => {
      mocks = [
        {
          request: {
            query: GET_REPORTS,
            variables: {
              id: 'company-id',
            },
          },
          result: {
            data: {
              getReports: {
                id: 'company-id',
                items: [
                  {
                    createdAt: '2021-04-11T21:05:33.303Z',
                    downloadUrl: 'https://download.url/report-1.zip',
                    id: 'report-1',
                    ttl: 1618205610,
                  },
                  {
                    createdAt: '2021-04-11T21:05:33.303Z',
                    downloadUrl: 'https://download.url/report-2.zip',
                    id: 'report-2',
                    ttl: 1618205610,
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
                payload:
                  'createdAt=2021-04-11T19%3A45%3A00.000Z&downloadUrl=https%3A%2F%2Fdownload.url%2Freport.zip&id=test-uuid&ttl=1618256700',
                read: false,
              },
            },
          },
        },
      ];

      await act(async () => {
        render(
          <TestProvider path="/reports/:companyId" history={history}>
            <MockedProvider mocks={mocks} addTypename={false}>
              <Reports />
            </MockedProvider>
          </TestProvider>,
        );

        await waitForApollo(0);

        await waitForApollo(0);
      });
    });

    it('should output the page title', async () => {
      await act(async () => {
        await waitForApollo(0);
      });

      const title = screen.getByRole('heading');
      const subTitle = screen.getByText('reports.sub-title');

      await waitFor(() => expect(title).toHaveTextContent('reports.title'));
      await waitFor(() => expect(subTitle).toBeInTheDocument());
    });

    it('should output the 24 hour alert', async () => {
      await act(async () => {
        await waitForApollo(0);
      });

      const title = screen.getByRole('heading');

      await waitFor(() => expect(title).toHaveTextContent('reports.title'));

      const alert = screen.getByRole('alert');

      await waitFor(() =>
        expect(alert).toHaveTextContent('reports.expiry-message'),
      );
    });

    it('should download a report', async () => {
      const title = screen.getByRole('heading');

      await waitFor(() => expect(title).toHaveTextContent('reports.title'));

      await act(async () => {
        const [button] = screen.getAllByRole('button');

        userEvent.click(button);

        await waitForApollo(0);
      });

      await waitFor(() =>
        expect(saveAs).toHaveBeenCalledWith('success', 'report.zip'),
      );
    });

    it('should display an alert if the report cannot be downloaded', async () => {
      (axios.request as jest.Mock).mockRejectedValueOnce({
        data: 'fail',
        isAxiosError: true,
      });

      await act(async () => {
        await waitForApollo(0);
      });

      const title = screen.getByRole('heading');

      await waitFor(() => expect(title).toHaveTextContent('reports.title'));

      const [button] = screen.getAllByRole('button');

      userEvent.click(button);

      await waitFor(() =>
        expect(add).toHaveBeenCalledWith({
          colour: 'danger',
          message: 'download.error',
        }),
      );
    });

    it('should go back to the dashboard', async () => {
      await act(async () => {
        await waitForApollo(0);
      });

      const title = screen.getByRole('heading');

      await waitFor(() => expect(title).toHaveTextContent('reports.title'));

      await act(async () => {
        const [, link] = screen.getAllByRole('link');

        userEvent.click(link);

        await waitForApollo(0);
      });

      await waitFor(() =>
        expect(history.push).toHaveBeenCalledWith(
          '/my-companies/dashboard/company-id',
        ),
      );
    });

    it('should go to the create report page', async () => {
      await act(async () => {
        await waitForApollo(0);
      });

      const title = screen.getByRole('heading');

      await waitFor(() => expect(title).toHaveTextContent('reports.title'));

      const [link] = screen.getAllByRole('link');

      userEvent.click(link);

      expect(history.push).toHaveBeenCalledWith(
        '/my-companies/reports/company-id/create-report',
      );
    });

    it('should display the correct number of reports', async () => {
      await act(async () => {
        await waitForApollo(0);
      });

      const title = screen.getByRole('heading');

      await waitFor(() => expect(title).toHaveTextContent('reports.title'));

      const buttons = screen.getAllByRole('button');

      await waitFor(() => expect(buttons).toHaveLength(3));
    });
  });

  describe('when a duplicate report is sent', () => {
    beforeEach(async () => {
      mocks = [
        {
          request: {
            query: GET_REPORTS,
            variables: {
              id: 'company-id',
            },
          },
          result: {
            data: {
              getReports: {
                id: 'company-id',
                items: [
                  {
                    createdAt: '2021-04-11T21:05:33.303Z',
                    downloadUrl: 'https://download.url/report-1.zip',
                    id: 'report-1',
                    ttl: 1618205610,
                  },
                  {
                    createdAt: '2021-04-11T21:05:33.303Z',
                    downloadUrl: 'https://download.url/report-2.zip',
                    id: 'report-2',
                    ttl: 1618205610,
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
                payload:
                  'createdAt=2021-04-11T19%3A45%3A00.000Z&downloadUrl=https%3A%2F%2Fdownload.url%2Freport.zip&id=report-2&ttl=1618256700',
                read: false,
              },
            },
          },
        },
      ];

      await act(async () => {
        render(
          <TestProvider path="/reports/:companyId" history={history}>
            <MockedProvider mocks={mocks} addTypename={false}>
              <Reports />
            </MockedProvider>
          </TestProvider>,
        );

        await waitForApollo(0);

        await waitForApollo(0);
      });
    });

    it('should display the correct number of reports', async () => {
      await act(async () => {
        await waitForApollo(0);
      });

      const title = screen.getByRole('heading');

      await waitFor(() => expect(title).toHaveTextContent('reports.title'));

      const buttons = screen.getAllByRole('button');

      await waitFor(() => expect(buttons).toHaveLength(2));
    });
  });

  describe('when there are no reports returned', () => {
    beforeEach(async () => {
      mocks = [
        {
          request: {
            query: GET_REPORTS,
            variables: {
              id: 'company-id',
            },
          },
          result: {
            data: {
              getReports: {
                id: 'company-id',
                items: [],
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
              onNotification: null,
            },
          },
        },
      ];

      await act(async () => {
        render(
          <TestProvider path="/reports/:companyId" history={history}>
            <MockedProvider mocks={mocks} addTypename={false}>
              <Reports />
            </MockedProvider>
          </TestProvider>,
        );

        await waitForApollo(0);

        await waitForApollo(0);
      });
    });

    it('should display an alert telling the user there are no reports available', async () => {
      await act(async () => {
        await waitForApollo(0);
      });

      const [, alert] = screen.getAllByRole('alert');

      await waitFor(() =>
        expect(alert).toHaveTextContent('reports.no-reports-found'),
      );
    });
  });
});