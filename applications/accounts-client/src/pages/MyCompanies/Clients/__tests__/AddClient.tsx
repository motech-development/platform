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
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createMemoryHistory, MemoryHistory } from 'history';
import React from 'react';
import ADD_CLIENT from '../../../../graphql/client/ADD_CLIENT';
import GET_CLIENTS from '../../../../graphql/client/GET_CLIENTS';
import TestProvider, { add } from '../../../../utils/TestProvider';
import AddClient from '../AddClient';

describe('AddClient', () => {
  let cache: InMemoryCache;
  let component: RenderResult;
  let history: MemoryHistory;
  let mocks: MockedResponse[];

  beforeEach(async () => {
    cache = new InMemoryCache({});

    cache.writeQuery({
      data: {
        getClients: {
          __typename: 'Clients',
          items: [],
        },
        getCompany: {
          __typename: 'Company',
          id: 'company-id',
          name: 'Test company',
        },
      },
      query: GET_CLIENTS,
      variables: {
        id: 'company-id',
      },
    });

    history = createMemoryHistory({
      initialEntries: ['/clients/company-id/add-client'],
    });

    jest.spyOn(history, 'push');

    mocks = [
      {
        request: {
          query: ADD_CLIENT,
          variables: {
            input: {
              address: {
                line1: '1 Street',
                line2: '',
                line3: 'Town',
                line4: 'County',
                line5: 'KT1 1NE',
              },
              companyId: 'company-id',
              contact: {
                email: 'info@contact.com',
                telephone: '07712345678',
              },
              id: '',
              name: 'New company',
            },
          },
        },
        result: {
          data: {
            createClient: {
              __typename: 'Client',
              address: {
                __typename: 'Address',
                line1: '1 Street',
                line2: '',
                line3: 'Town',
                line4: 'County',
                line5: 'KT1 1NE',
              },
              companyId: 'company-id',
              contact: {
                __typename: 'Contact',
                email: 'info@contact.com',
                telephone: '07712345678',
              },
              id: 'client-id',
              name: 'New company',
            },
          },
        },
      },
    ];

    await act(async () => {
      component = render(
        <TestProvider path="/clients/:companyId/add-client" history={history}>
          <MockedProvider mocks={mocks} cache={cache}>
            <AddClient />
          </MockedProvider>
        </TestProvider>,
      );
    });
  });

  it('should redirect you back to clients page on complete', async () => {
    const { findAllByRole, findByLabelText, findByTestId } = component;

    await act(async () => {
      const line1 = await findByLabelText('address.line1');
      const line3 = await findByLabelText('address.line3');
      const line4 = await findByLabelText('address.line4');
      const line5 = await findByLabelText('address.line5');
      const email = await findByLabelText('contact-details.email');
      const telephone = await findByLabelText('contact-details.telephone');
      const name = await findByLabelText(
        'client-form.client-details.name.label',
      );

      fireEvent.change(line1, {
        target: {
          focus: () => {},
          value: '1 Street',
        },
      });

      fireEvent.change(line3, {
        target: {
          focus: () => {},
          value: 'Town',
        },
      });

      fireEvent.change(line4, {
        target: {
          focus: () => {},
          value: 'County',
        },
      });

      fireEvent.change(line5, {
        target: {
          focus: () => {},
          value: 'KT1 1NE',
        },
      });

      fireEvent.change(email, {
        target: {
          focus: () => {},
          value: 'info@contact.com',
        },
      });

      fireEvent.change(telephone, {
        target: {
          focus: () => {},
          value: '07712345678',
        },
      });

      fireEvent.change(name, {
        target: {
          focus: () => {},
          value: 'New company',
        },
      });

      await wait();

      const [button] = await findAllByRole('button');

      fireEvent.click(button);

      await apolloWait(0);

      await findByTestId('next-page');
    });

    expect(history.push).toHaveBeenCalledWith(
      '/my-companies/clients/company-id',
    );
  });

  it('should display a success toast', async () => {
    const { findAllByRole, findByLabelText, findByTestId } = component;

    await act(async () => {
      const line1 = await findByLabelText('address.line1');
      const line3 = await findByLabelText('address.line3');
      const line4 = await findByLabelText('address.line4');
      const line5 = await findByLabelText('address.line5');
      const email = await findByLabelText('contact-details.email');
      const telephone = await findByLabelText('contact-details.telephone');
      const name = await findByLabelText(
        'client-form.client-details.name.label',
      );

      fireEvent.change(line1, {
        target: {
          focus: () => {},
          value: '1 Street',
        },
      });

      fireEvent.change(line3, {
        target: {
          focus: () => {},
          value: 'Town',
        },
      });

      fireEvent.change(line4, {
        target: {
          focus: () => {},
          value: 'County',
        },
      });

      fireEvent.change(line5, {
        target: {
          focus: () => {},
          value: 'KT1 1NE',
        },
      });

      fireEvent.change(email, {
        target: {
          focus: () => {},
          value: 'info@contact.com',
        },
      });

      fireEvent.change(telephone, {
        target: {
          focus: () => {},
          value: '07712345678',
        },
      });

      fireEvent.change(name, {
        target: {
          focus: () => {},
          value: 'New company',
        },
      });

      await wait();

      const [button] = await findAllByRole('button');

      fireEvent.click(button);

      await apolloWait(0);

      await findByTestId('next-page');
    });

    await wait(() =>
      expect(add).toHaveBeenCalledWith({
        colour: 'success',
        message: 'add-client.success',
      }),
    );
  });
});
