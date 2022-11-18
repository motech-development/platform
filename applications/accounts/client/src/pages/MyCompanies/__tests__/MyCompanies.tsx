import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { render, RenderResult, act } from '@testing-library/react';
import GET_COMPANIES from '../../../graphql/company/GET_COMPANIES';
import TestProvider from '../../../utils/TestProvider';
import MyCompanies from '../MyCompanies';

describe('MyCompanies', () => {
  let component: RenderResult;
  let mocks: MockedResponse[];

  beforeEach(async () => {
    mocks = [
      {
        request: {
          query: GET_COMPANIES,
          variables: {
            id: 'user-id',
          },
        },
        result: {
          data: {
            getCompanies: {
              id: 'user-id',
              items: [
                {
                  address: {
                    line1: '',
                    line2: '',
                    line3: '',
                    line4: '',
                    line5: '',
                  },
                  bank: {
                    accountNumber: '',
                    sortCode: '',
                  },
                  companyNumber: '12345678',
                  contact: {
                    email: '',
                    telephone: '',
                  },
                  id: '1',
                  name: 'Company with VAT',
                },
                {
                  address: {
                    line1: '',
                    line2: '',
                    line3: '',
                    line4: '',
                    line5: '',
                  },
                  bank: {
                    accountNumber: '',
                    sortCode: '',
                  },
                  companyNumber: '87654321',
                  contact: {
                    email: '',
                    telephone: '',
                  },
                  id: '2',
                  name: 'Company without VAT',
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
            <MyCompanies />
          </MockedProvider>
        </TestProvider>,
      );

      await Promise.resolve();
    });
  });

  it('should show the company name', async () => {
    const { findByText } = component;

    await expect(findByText('Company with VAT')).resolves.toBeInTheDocument();
  });

  it('should show the company number', async () => {
    const { findByText } = component;

    await expect(findByText('87654321')).resolves.toBeInTheDocument();
  });

  it('should show a link to the dashboard location', async () => {
    const { findAllByText } = component;

    const link = await findAllByText('my-companies.select-company');

    expect(link[0]).toHaveAttribute('href', '/my-companies/dashboard/1');
  });
});
