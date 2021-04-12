import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { waitForApollo } from '@motech-development/appsync-apollo';
import { createMemoryHistory, MemoryHistory } from 'history';
import TestProvider from '../../../../utils/TestProvider';
import Reports, { GET_REPORTS } from '../Reports';

describe('Reports', () => {
  let history: MemoryHistory;
  let mocks: MockedResponse[];

  beforeEach(() => {
    history = createMemoryHistory({
      initialEntries: ['/reports/company-id'],
    });

    jest.spyOn(history, 'push');
  });

  describe('when there are are reports returned', () => {
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
                    id: 'report-1',
                    ttl: '2021-04-12T21:05:33.303Z',
                  },
                  {
                    createdAt: '2021-04-11T21:05:33.303Z',
                    id: 'report-1',
                    ttl: '2021-04-12T21:05:33.303Z',
                  },
                ],
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
      });
    });

    it('should output the page title', () => {
      const title = screen.getByRole('heading');
      const subTitle = screen.getByText('reports.sub-title');

      expect(title).toHaveTextContent('reports.title');
      expect(subTitle).toBeInTheDocument();
    });

    it('should output the 24 hour alert', () => {
      const alert = screen.getByRole('alert');

      expect(alert).toHaveTextContent('reports.expiry-message');
    });

    it.todo('should download a report');

    it('should go back to the dashboard', () => {
      const [, link] = screen.getAllByRole('link');

      userEvent.click(link);

      expect(history.push).toHaveBeenCalledWith(
        '/my-companies/dashboard/company-id',
      );
    });

    it('should go to the create report page', () => {
      const [link] = screen.getAllByRole('link');

      userEvent.click(link);

      expect(history.push).toHaveBeenCalledWith(
        '/my-companies/reports/company-id/create-report',
      );
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
      });
    });

    it('should display an alert telling the user there are no reports available', () => {
      const [, alert] = screen.getAllByRole('alert');

      expect(alert).toHaveTextContent('reports.no-reports-found');
    });
  });
});
