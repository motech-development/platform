import { MockedProvider, MockedResponse, wait } from '@apollo/react-testing';
import {
  act,
  fireEvent,
  render,
  RenderResult,
  waitForElement,
} from '@testing-library/react';
import { createMemoryHistory, MemoryHistory } from 'history';
import React from 'react';
import GET_CLIENT from '../../../../graphql/client/GET_CLIENT';
import UPDATE_CLIENT from '../../../../graphql/client/UPDATE_CLIENT';
import TestProvider from '../../../../utils/TestProvider';
import UpdateDetails from '../UpdateDetails';

describe('UpdateDetails', () => {
  let component: RenderResult;
  let history: MemoryHistory;
  let mocks: MockedResponse[];

  beforeEach(() => {
    history = createMemoryHistory({
      initialEntries: ['/clients/company-id/update-details/client-id'],
    });

    history.push = jest.fn();

    mocks = [
      {
        request: {
          query: GET_CLIENT,
          variables: {
            id: 'client-id',
          },
        },
        result: {
          data: {
            getClient: {
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
              id: 'client-id',
              name: 'New client',
            },
          },
        },
      },
      {
        request: {
          query: UPDATE_CLIENT,
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
              id: 'client-id',
              name: 'New client',
            },
          },
        },
        result: {
          data: {
            updateClient: {
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
              id: 'client-id',
              name: 'New client',
            },
          },
        },
      },
    ];
    component = render(
      <TestProvider
        path="/clients/:companyId/update-details/:clientId"
        history={history}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <UpdateDetails />
        </MockedProvider>
      </TestProvider>,
    );
  });

  it('should redirect you back to clients page on complete', async () => {
    const { findAllByRole, findByTestId, findByText } = component;

    await waitForElement(() => findByText('New client'));

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
