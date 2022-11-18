import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { render, RenderResult, act } from '@testing-library/react';
import { createMemoryHistory, MemoryHistory } from 'history';
import GET_CLIENTS from '../../../../graphql/client/GET_CLIENTS';
import TestProvider from '../../../../utils/TestProvider';
import Clients from '../Clients';

describe('Clients', () => {
  let component: RenderResult;
  let history: MemoryHistory;
  let mocks: MockedResponse[];

  beforeEach(async () => {
    history = createMemoryHistory({
      initialEntries: ['/clients/company-id'],
    });

    mocks = [
      {
        request: {
          query: GET_CLIENTS,
          variables: {
            id: 'company-id',
          },
        },
        result: {
          data: {
            getClients: {
              id: 'company-id',
              items: [
                {
                  address: {
                    line1: '',
                    line2: '',
                    line3: '',
                    line4: '',
                    line5: '',
                  },
                  companyId: 'company-id',
                  contact: {
                    email: 'test-1@example.com',
                    telephone: '01911234567',
                  },
                  id: 'client-id-1',
                  name: 'Test client 1',
                },
                {
                  address: {
                    line1: '',
                    line2: '',
                    line3: '',
                    line4: '',
                    line5: '',
                  },
                  contact: {
                    email: 'test-2@example.com',
                    telephone: '02089876543',
                  },
                  id: 'client-id-2',
                  name: 'Test client 2',
                },
              ],
            },
            getCompany: {
              id: 'company-id',
              name: 'Test Company',
            },
          },
        },
      },
    ];

    await act(async () => {
      component = render(
        <TestProvider path="/clients/:companyId" history={history}>
          <MockedProvider mocks={mocks} addTypename={false}>
            <Clients />
          </MockedProvider>
        </TestProvider>,
      );

      await Promise.resolve();
    });
  });

  it('should show company name', async () => {
    const { findByText } = component;

    await expect(findByText('Test Company')).resolves.toBeInTheDocument();
  });

  it('should display the correct number of clients', async () => {
    const { findAllByText } = component;

    const links = await findAllByText('clients.update-details');

    expect(links.length).toEqual(2);
  });

  it('should show the client name', async () => {
    const { findByText } = component;

    await expect(findByText('Test client 1')).resolves.toBeInTheDocument();
  });

  it('should show the client email address', async () => {
    const { findByText } = component;

    await expect(findByText('test-2@example.com')).resolves.toBeInTheDocument();
  });

  it('should show the client telephone number', async () => {
    const { findByText } = component;

    await expect(findByText('01911234567')).resolves.toBeInTheDocument();
  });

  it('should show a link to edit the client', async () => {
    const { findAllByText } = component;

    const links = await findAllByText('clients.update-details');

    expect(links[1]).toHaveAttribute(
      'href',
      '/my-companies/clients/company-id/update-details/client-id-2',
    );
  });
});
