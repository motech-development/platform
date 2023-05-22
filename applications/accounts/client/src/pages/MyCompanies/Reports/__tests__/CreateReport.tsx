import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { waitForApollo } from '@motech-development/appsync-apollo';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory, MemoryHistory } from 'history';
import { advanceTo, clear } from 'jest-date-mock';
import GET_SETTINGS from '../../../../graphql/settings/GET_SETTINGS';
import TestProvider, { add } from '../../../../utils/TestProvider';
import CreateReport, { CREATE_REPORT } from '../CreateReport';

describe('CreateReport', () => {
  let history: MemoryHistory;
  let mocks: MockedResponse[];

  beforeEach(() => {
    history = createMemoryHistory({
      initialEntries: ['/reports/company-id/create-report'],
    });

    jest.spyOn(history, 'push');
  });

  afterAll(clear);

  describe('after year end', () => {
    beforeAll(() => {
      advanceTo('2021-04-12T00:00:00.000Z');
    });

    beforeEach(async () => {
      mocks = [
        {
          request: {
            query: CREATE_REPORT,
            variables: {
              input: {
                companyId: 'company-id',
                currency: 'create-report.currency',
                status: 'confirmed',
                year: '2020',
                yearEnd: {
                  day: 5,
                  month: 3,
                },
              },
            },
          },
          result: {
            data: {
              createReport: {
                status: 'CONFIRMED',
              },
            },
          },
        },
        {
          request: {
            query: GET_SETTINGS,
            variables: {
              id: 'company-id',
            },
          },
          result: {
            data: {
              getBankSettings: {
                account: 'account-name',
                bank: 'My bank',
                id: 'company-id',
                user: 'bank-uuid',
              },
              getCompany: {
                id: 'company-id',
                name: 'Company name',
              },
              getSettings: {
                categories: [],
                id: 'company-id',
                vat: {
                  charge: 20,
                  pay: 20,
                  registration: 'GB123456789',
                  scheme: 'standard',
                },
                yearEnd: {
                  day: 5,
                  month: 3,
                },
              },
            },
          },
        },
      ];

      await act(async () => {
        render(
          <TestProvider
            path="/reports/:companyId/create-report"
            history={history}
          >
            <MockedProvider mocks={mocks} addTypename={false}>
              <CreateReport />
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

      const [title] = await screen.findAllByRole('heading');
      const subTitle = await screen.findByText('create-report.sub-title');

      await waitFor(() =>
        expect(title).toHaveTextContent('create-report.title'),
      );
      await waitFor(() => expect(subTitle).toBeInTheDocument());
    });

    it('should redirect you back to the reports page on complete', async () => {
      await act(async () => {
        await waitForApollo(0);
      });

      const status = await screen.findByLabelText(
        'export-form.status.options.confirmed',
      );

      await userEvent.click(status);

      await act(async () => {
        await waitForApollo(0);

        await waitForApollo(0);
      });

      const button = await screen.findByRole('button');

      await waitFor(() => expect(button).not.toBeDisabled());

      await userEvent.click(button);

      await act(async () => {
        await waitForApollo(0);

        await waitForApollo(0);
      });

      await waitFor(() =>
        expect(history.push).toHaveBeenCalledWith(
          '/my-companies/reports/company-id',
        ),
      );
    });

    it('should display a success toast on complete', async () => {
      await act(async () => {
        await waitForApollo(0);
      });

      const status = await screen.findByLabelText(
        'export-form.status.options.confirmed',
      );

      await userEvent.click(status);

      await act(async () => {
        await waitForApollo(0);
      });

      const button = await screen.findByRole('button');

      await waitFor(() => expect(button).not.toBeDisabled());

      await userEvent.click(button);

      await act(async () => {
        await waitForApollo(0);
      });

      await act(async () => {
        await waitForApollo(0);
      });

      await waitFor(() =>
        expect(add).toHaveBeenCalledWith({
          colour: 'success',
          message: 'create-report.requested',
        }),
      );
    });

    it('should redirect you back to the reports page if you cancel', async () => {
      await act(async () => {
        await waitForApollo(0);
      });

      const link = await screen.findByRole('link');

      await userEvent.click(link);

      await waitFor(() =>
        expect(history.push).toHaveBeenCalledWith(
          '/my-companies/reports/company-id',
        ),
      );
    });
  });

  describe('before year end', () => {
    beforeAll(() => {
      advanceTo('2021-04-03T00:00:00.000Z');
    });

    beforeEach(async () => {
      mocks = [
        {
          request: {
            query: CREATE_REPORT,
            variables: {
              input: {
                companyId: 'company-id',
                currency: 'create-report.currency',
                status: 'confirmed',
                year: '2019',
                yearEnd: {
                  day: 5,
                  month: 3,
                },
              },
            },
          },
          result: {
            data: {
              createReport: {
                status: 'CONFIRMED',
              },
            },
          },
        },
        {
          request: {
            query: GET_SETTINGS,
            variables: {
              id: 'company-id',
            },
          },
          result: {
            data: {
              getBankSettings: {
                account: 'account-name',
                bank: 'My bank',
                id: 'company-id',
                user: 'bank-uuid',
              },
              getCompany: {
                id: 'company-id',
                name: 'Company name',
              },
              getSettings: {
                categories: [],
                id: 'company-id',
                vat: {
                  charge: 20,
                  pay: 20,
                  registration: 'GB123456789',
                  scheme: 'standard',
                },
                yearEnd: {
                  day: 5,
                  month: 3,
                },
              },
            },
          },
        },
      ];

      await act(async () => {
        render(
          <TestProvider
            path="/reports/:companyId/create-report"
            history={history}
          >
            <MockedProvider mocks={mocks} addTypename={false}>
              <CreateReport />
            </MockedProvider>
          </TestProvider>,
        );

        await waitForApollo(0);

        await waitForApollo(0);
      });
    });

    it('should redirect you back to the reports page on complete', async () => {
      await act(async () => {
        await waitForApollo(0);
      });

      const status = await screen.findByLabelText(
        'export-form.status.options.confirmed',
      );

      await userEvent.click(status);

      await act(async () => {
        await waitForApollo(0);
      });

      const button = await screen.findByRole('button');

      await waitFor(() => expect(button).not.toBeDisabled());

      await userEvent.click(button);

      await act(async () => {
        await waitForApollo(0);

        await waitForApollo(0);
      });

      await waitFor(() =>
        expect(history.push).toHaveBeenCalledWith(
          '/my-companies/reports/company-id',
        ),
      );
    });

    it('should display a success toast on complete', async () => {
      await act(async () => {
        await waitForApollo(0);
      });

      const status = await screen.findByLabelText(
        'export-form.status.options.confirmed',
      );

      await userEvent.click(status);

      await act(async () => {
        await waitForApollo(0);
      });

      const button = await screen.findByRole('button');

      await waitFor(() => expect(button).not.toBeDisabled());

      await userEvent.click(button);

      await act(async () => {
        await waitForApollo(0);

        await waitForApollo(0);
      });

      await waitFor(() =>
        expect(add).toHaveBeenCalledWith({
          colour: 'success',
          message: 'create-report.requested',
        }),
      );
    });
  });
});
