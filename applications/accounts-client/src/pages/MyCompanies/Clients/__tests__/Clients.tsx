import {
  MockedProvider,
  MockedResponse,
  wait as apolloWait,
} from '@apollo/react-testing';
import {
  act,
  fireEvent,
  render,
  RenderResult,
  wait,
} from '@testing-library/react';
import { createMemoryHistory, MemoryHistory } from 'history';
import React from 'react';
import DELETE_CLIENT from '../../../../graphql/client/DELETE_CLIENT';
import GET_CLIENTS from '../../../../graphql/client/GET_CLIENTS';
import TestProvider from '../../../../utils/TestProvider';
import Clients from '../Clients';

describe('Clients', () => {
  let component: RenderResult;
  let history: MemoryHistory;
  let mocks: MockedResponse[];

  beforeEach(() => {
    history = createMemoryHistory({
      initialEntries: ['/clients/company-id'],
    });

    mocks = [
      {
        request: {
          query: DELETE_CLIENT,
          variables: {
            id: 'client-id-1',
          },
        },
        result: {
          data: {
            deleteClient: {
              companyId: 'company-id',
              id: 'client-id-2',
              name: 'Test client 2',
            },
          },
        },
      },
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

    component = render(
      <TestProvider path="/clients/:companyId" history={history}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <Clients />
        </MockedProvider>
      </TestProvider>,
    );
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

  it('should display delete confirmation modal', async () => {
    const { findAllByText, findByRole } = component;
    const [button] = await findAllByText('clients.delete-client');

    fireEvent.click(button);

    await expect(findByRole('dialog')).resolves.toBeInTheDocument();
  });

  it('should delete a client', async () => {
    const {
      findAllByRole,
      findAllByText,
      findByLabelText,
      findByText,
    } = component;

    await act(async () => {
      await findByText('Test client 1');

      const [, button] = await findAllByRole('button');

      fireEvent.click(button);

      const input = await findByLabelText('confirm-delete');

      fireEvent.change(input, {
        target: { focus: () => {}, value: 'Test client 1' },
      });

      await wait();

      const [, , , , deleteButton] = await findAllByRole('button');

      fireEvent.click(deleteButton);

      await apolloWait(0);

      await wait();
    });

    const modal = document.querySelector(
      'div[role="document"] > div',
    ) as Element;

    const clients = await findAllByText('clients.email-address');

    expect(clients.length).toEqual(1);

    expect(modal).not.toBeInTheDocument();
  });
});
