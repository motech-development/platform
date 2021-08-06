import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { waitForApollo } from '@motech-development/appsync-apollo';
import {
  act,
  fireEvent,
  render,
  RenderResult,
  waitFor,
} from '@testing-library/react';
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
      });
    });

    it('should redirect you back to clients page on complete', async () => {
      const { findAllByRole, findByLabelText } = component;

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
      });

      await act(async () => {
        const [button] = await findAllByRole('button');

        fireEvent.click(button);
      });

      await waitFor(() =>
        expect(history.push).toHaveBeenCalledWith(
          '/my-companies/clients/company-id',
        ),
      );
    });

    it('should display a success toast', async () => {
      const { findAllByRole, findByLabelText } = component;

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
      });

      await act(async () => {
        const [button] = await findAllByRole('button');

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
      });
    });

    it('should display a warning toast', async () => {
      const { findAllByRole, findByLabelText } = component;

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
      });

      await act(async () => {
        const [button] = await findAllByRole('button');

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
      });

      await act(async () => {
        const [button] = await findAllByRole('button');

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
