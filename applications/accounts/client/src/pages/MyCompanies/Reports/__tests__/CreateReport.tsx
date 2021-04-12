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

  beforeAll(() => {
    advanceTo('2021-04-12T11:58:17+01:00');
  });

  beforeEach(async () => {
    history = createMemoryHistory({
      initialEntries: ['/reports/company-id/create-report'],
    });

    jest.spyOn(history, 'push');

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
    });
  });

  afterAll(clear);

  it('should output the page title', () => {
    const [title] = screen.getAllByRole('heading');
    const subTitle = screen.getByText('create-report.sub-title');

    expect(title).toHaveTextContent('create-report.title');
    expect(subTitle).toBeInTheDocument();
  });

  it('should redirect you back to the reports page on complete', async () => {
    await act(async () => {
      const financialYear = screen.getByLabelText('export-form.year.label');
      const status = screen.getByLabelText(
        'export-form.status.options.confirmed',
      );

      userEvent.selectOptions(financialYear, '2020');
      userEvent.click(status);

      await waitForApollo(0);

      const button = screen.getByRole('button');

      userEvent.click(button);
    });

    await waitFor(() =>
      expect(history.push).toHaveBeenCalledWith(
        '/my-companies/reports/company-id',
      ),
    );
  });

  it('should display a success toast on complete', async () => {
    await act(async () => {
      const financialYear = screen.getByLabelText('export-form.year.label');
      const status = screen.getByLabelText(
        'export-form.status.options.confirmed',
      );

      userEvent.selectOptions(financialYear, '2020');
      userEvent.click(status);

      await waitForApollo(0);

      const button = screen.getByRole('button');

      userEvent.click(button);
    });

    await waitFor(() =>
      expect(add).toHaveBeenCalledWith({
        colour: 'success',
        message: 'create-report.requested',
      }),
    );
  });

  it('should redirect you back to the reports page if you cancel', async () => {
    const link = screen.getByRole('link');

    userEvent.click(link);

    await waitFor(() =>
      expect(history.push).toHaveBeenCalledWith(
        '/my-companies/reports/company-id',
      ),
    );
  });
});
