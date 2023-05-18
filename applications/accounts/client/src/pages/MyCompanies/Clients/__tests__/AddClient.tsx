import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { waitForApollo } from '@motech-development/appsync-apollo';
import {
  act,
  fireEvent,
  render,
  RenderResult,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory, MemoryHistory } from 'history';
import ADD_CLIENT from '../../../../graphql/client/ADD_CLIENT';
import TestProvider, { add } from '../../../../utils/TestProvider';
import AddClient from '../AddClient';

describe('AddClient', () => {
  let component: RenderResult;
  let history: MemoryHistory;
  let mocks: MockedResponse[];

  beforeEach(() => {
    history = createMemoryHistory({
      initialEntries: ['/clients/company-id/add-client'],
    });

    jest.spyOn(history, 'push');
  });

  describe('when data is returned', () => {
    beforeEach(async () => {
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
                name: 'New company',
              },
            },
          },
        },
      ];

      await act(async () => {
        component = render(
          <TestProvider path="/clients/:companyId/add-client" history={history}>
            <MockedProvider mocks={mocks}>
              <AddClient />
            </MockedProvider>
          </TestProvider>,
        );

        await Promise.resolve();
      });
    });

    it('should redirect you back to clients page on complete', async () => {
      const { findAllByRole, findByLabelText } = component;

      const line1 = await findByLabelText('address.line1');
      const line3 = await findByLabelText('address.line3');
      const line4 = await findByLabelText('address.line4');
      const line5 = await findByLabelText('address.line5');
      const email = await findByLabelText('contact-details.email');
      const telephone = await findByLabelText('contact-details.telephone');
      const name = await findByLabelText(
        'client-form.client-details.name.label',
      );

      await act(async () => {
        await userEvent.type(line1, '1 Street');

        await userEvent.type(line3, 'Town');

        await userEvent.type(line4, 'County');

        await userEvent.type(line5, 'KT1 1NE');
      });

      await act(async () => {
        await userEvent.type(email, 'info@contact.com');

        await userEvent.type(telephone, '07712345678');

        await userEvent.type(name, 'New company');
      });

      const [button] = await findAllByRole('button');

      await waitFor(() => expect(button).not.toBeDisabled());

      await act(async () => {
        fireEvent.click(button);

        await Promise.resolve();
      });

      await waitFor(() =>
        expect(history.push).toHaveBeenCalledWith(
          '/my-companies/clients/company-id',
        ),
      );
    });

    it('should display a success toast', async () => {
      const { findAllByRole, findByLabelText } = component;

      const line1 = await findByLabelText('address.line1');
      const line3 = await findByLabelText('address.line3');
      const line4 = await findByLabelText('address.line4');
      const line5 = await findByLabelText('address.line5');
      const email = await findByLabelText('contact-details.email');
      const telephone = await findByLabelText('contact-details.telephone');
      const name = await findByLabelText(
        'client-form.client-details.name.label',
      );

      await act(async () => {
        await userEvent.type(line1, '1 Street');

        await userEvent.type(line3, 'Town');

        await userEvent.type(line4, 'County');

        await userEvent.type(line5, 'KT1 1NE');
      });

      await act(async () => {
        await userEvent.type(email, 'info@contact.com');

        await userEvent.type(telephone, '07712345678');

        await userEvent.type(name, 'New company');
      });

      const [button] = await findAllByRole('button');

      await act(async () => {
        fireEvent.click(button);

        await waitForApollo(0);
      });

      await waitFor(() =>
        expect(add).toHaveBeenCalledWith({
          colour: 'success',
          message: 'add-client.success',
        }),
      );
    });
  });

  describe('when data is not returned', () => {
    beforeEach(async () => {
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
              createClient: null,
            },
          },
        },
      ];

      await act(async () => {
        component = render(
          <TestProvider path="/clients/:companyId/add-client" history={history}>
            <MockedProvider mocks={mocks}>
              <AddClient />
            </MockedProvider>
          </TestProvider>,
        );

        await Promise.resolve();
      });
    });

    it('should display a warning toast', async () => {
      const { findAllByRole, findByLabelText } = component;

      const line1 = await findByLabelText('address.line1');
      const line3 = await findByLabelText('address.line3');
      const line4 = await findByLabelText('address.line4');
      const line5 = await findByLabelText('address.line5');
      const email = await findByLabelText('contact-details.email');
      const telephone = await findByLabelText('contact-details.telephone');
      const name = await findByLabelText(
        'client-form.client-details.name.label',
      );

      await act(async () => {
        await userEvent.type(line1, '1 Street');

        await userEvent.type(line3, 'Town');

        await userEvent.type(line4, 'County');

        await userEvent.type(line5, 'KT1 1NE');
      });

      await act(async () => {
        await userEvent.type(email, 'info@contact.com');

        await userEvent.type(telephone, '07712345678');

        await userEvent.type(name, 'New company');
      });

      const [button] = await findAllByRole('button');

      await act(async () => {
        fireEvent.click(button);

        await waitForApollo(0);
      });

      await waitFor(() =>
        expect(add).toHaveBeenCalledWith({
          colour: 'danger',
          message: 'add-client.retry',
        }),
      );
    });

    it('should redirect you back to company page', async () => {
      const { findAllByRole, findByLabelText } = component;

      const line1 = await findByLabelText('address.line1');
      const line3 = await findByLabelText('address.line3');
      const line4 = await findByLabelText('address.line4');
      const line5 = await findByLabelText('address.line5');
      const email = await findByLabelText('contact-details.email');
      const telephone = await findByLabelText('contact-details.telephone');
      const name = await findByLabelText(
        'client-form.client-details.name.label',
      );

      await act(async () => {
        await userEvent.type(line1, '1 Street');

        await userEvent.type(line3, 'Town');

        await userEvent.type(line4, 'County');

        await userEvent.type(line5, 'KT1 1NE');
      });

      await act(async () => {
        await userEvent.type(email, 'info@contact.com');

        await userEvent.type(telephone, '07712345678');

        await userEvent.type(name, 'New company');
      });

      const [button] = await findAllByRole('button');

      await act(async () => {
        fireEvent.click(button);

        await waitForApollo(0);
      });

      await waitFor(() =>
        expect(history.push).toHaveBeenCalledWith(
          '/my-companies/clients/company-id',
        ),
      );
    });
  });
});
