import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { render, RenderResult, act } from '@testing-library/react';
import { Route } from 'react-router-dom';
import GET_COMPANY from '../../../graphql/company/GET_COMPANY';
import TestProvider from '../../../utils/TestProvider';
import Dashboard from '../Dashboard';

describe('Dashboard', () => {
  let component: RenderResult;
  let mocks: MockedResponse[];

  beforeEach(async () => {
    mocks = [
      {
        request: {
          query: GET_COMPANY,
          variables: {
            id: 'Test',
          },
        },
        result: {
          data: {
            getCompany: {
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
              companyNumber: '',
              contact: {
                email: '',
                telephone: '',
              },
              id: '',
              name: 'Test company',
              vatRegistration: '',
            },
          },
        },
      },
    ];

    await act(async () => {
      component = render(
        <TestProvider path="/dashboard/Test">
          <MockedProvider mocks={mocks} addTypename={false}>
            <Route exact path="/dashboard/:companyId" component={Dashboard} />
          </MockedProvider>
        </TestProvider>,
      );
    });
  });

  it('should display the company name', async () => {
    const { findByText } = component;

    await expect(findByText('Test company')).resolves.toBeInTheDocument();
  });

  it('should display the accounts card', async () => {
    const { findByText } = component;

    await expect(findByText('accounts.title')).resolves.toBeInTheDocument();
  });

  it('should display the clients card', async () => {
    const { findByText } = component;

    await expect(findByText('clients.title')).resolves.toBeInTheDocument();
  });

  it('should display the company details card', async () => {
    const { findByText } = component;

    await expect(
      findByText('company-details.title'),
    ).resolves.toBeInTheDocument();
  });

  it('should display the settings card', async () => {
    const { findByText } = component;

    await expect(findByText('settings.title')).resolves.toBeInTheDocument();
  });

  it('should display the my companies card', async () => {
    const { findByText } = component;

    await expect(findByText('my-companies.title')).resolves.toBeInTheDocument();
  });
});
