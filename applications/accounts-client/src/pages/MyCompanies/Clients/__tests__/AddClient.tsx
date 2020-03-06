import { MockedProvider, MockedResponse, wait } from '@apollo/react-testing';
import {
  act,
  fireEvent,
  render,
  RenderResult,
  waitForElement,
} from '@testing-library/react';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createMemoryHistory, MemoryHistory } from 'history';
import React from 'react';
import ADD_CLIENT from '../../../../graphql/ADD_CLIENT';
import GET_CLIENTS from '../../../../graphql/GET_CLIENTS';
import TestProvider from '../../../../utils/TestProvider';
import AddClient from '../AddClient';

describe('AddClient', () => {
  let cache: InMemoryCache;
  let component: RenderResult;
  let history: MemoryHistory;
  let mocks: MockedResponse[];

  beforeEach(() => {
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

    history.push = jest.fn();

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

    component = render(
      <TestProvider path="/clients/:companyId/add-client" history={history}>
        <MockedProvider mocks={mocks} cache={cache}>
          <AddClient />
        </MockedProvider>
      </TestProvider>,
    );
  });

  it('should redirect you back to clients page on complete', async () => {
    const { findAllByRole, findByLabelText, findByTestId } = component;
    const line1 = await findByLabelText('client-form.address.line1.label');
    const line3 = await findByLabelText('client-form.address.line3.label');
    const line4 = await findByLabelText('client-form.address.line4.label');
    const line5 = await findByLabelText('client-form.address.line5.label');
    const email = await findByLabelText('client-form.contact.email.label');
    const telephone = await findByLabelText(
      'client-form.contact.telephone.label',
    );
    const name = await findByLabelText('client-form.client-details.name.label');

    fireEvent.change(line1, { target: { focus: () => {}, value: '1 Street' } });
    fireEvent.change(line3, { target: { focus: () => {}, value: 'Town' } });
    fireEvent.change(line4, { target: { focus: () => {}, value: 'County' } });
    fireEvent.change(line5, { target: { focus: () => {}, value: 'KT1 1NE' } });
    fireEvent.change(email, {
      target: { focus: () => {}, value: 'info@contact.com' },
    });
    fireEvent.change(telephone, {
      target: { focus: () => {}, value: '07712345678' },
    });
    fireEvent.change(name, {
      target: { focus: () => {}, value: 'New company' },
    });

    const [, button] = await findAllByRole('button');

    fireEvent.click(button);

    await act(async () => {
      await wait(0);

      await waitForElement(() => findByTestId('next-page'));
    });

    expect(history.push).toHaveBeenCalledWith(
      '/my-companies/clients/company-id',
    );
  });
});
