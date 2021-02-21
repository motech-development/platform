import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { waitForApollo } from '@motech-development/appsync-apollo';
import {
  act,
  fireEvent,
  render,
  RenderResult,
  wait,
} from '@testing-library/react';
import { createMemoryHistory, MemoryHistory } from 'history';
import React from 'react';
import DELETE_BANK_CONNECTION from '../../../../graphql/bank/DELETE_BANK_CONNECTION';
import GET_SETTINGS from '../../../../graphql/settings/GET_SETTINGS';
import UPDATE_SETTINGS from '../../../../graphql/settings/UPDATE_SETTINGS';
import TestProvider, { add } from '../../../../utils/TestProvider';
import Settings from '../Settings';

describe('Settings', () => {
  let component: RenderResult;
  let history: MemoryHistory;
  let mocks: MockedResponse[];

  beforeEach(() => {
    history = createMemoryHistory({
      initialEntries: ['/settings/company-uuid'],
    });

    jest.spyOn(history, 'push');
  });

  describe('when unlinking is successful', () => {
    beforeEach(async () => {
      mocks = [
        {
          request: {
            query: DELETE_BANK_CONNECTION,
            variables: {
              id: 'company-uuid',
            },
          },
          result: {
            data: {
              deleteBankConnection: {
                account: 'account-name',
                bank: 'My bank',
                id: 'company-uuid',
                user: 'bank-uuid',
              },
            },
          },
        },
        {
          request: {
            query: GET_SETTINGS,
            variables: {
              id: 'company-uuid',
            },
          },
          result: {
            data: {
              getBankSettings: {
                account: 'account-name',
                bank: 'My bank',
                id: 'company-uuid',
                user: 'bank-uuid',
              },
              getCompany: {
                id: 'company-uuid',
                name: 'Company name',
              },
              getSettings: {
                categories: [],
                id: 'company-uuid',
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
        {
          request: {
            query: UPDATE_SETTINGS,
            variables: {
              input: {
                categories: [],
                id: 'company-uuid',
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
          result: {
            data: {
              updateSettings: {
                categories: [],
                id: 'company-uuid',
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
        component = render(
          <TestProvider path="/settings/:companyId" history={history}>
            <MockedProvider mocks={mocks} addTypename={false}>
              <Settings />
            </MockedProvider>
          </TestProvider>,
        );
      });
    });

    it('should redirect you to the dashboard on complete', async () => {
      const { findAllByRole, findByTestId, findByText } = component;

      await act(async () => {
        await findByText('Company name');

        const [, , button] = await findAllByRole('button');

        fireEvent.click(button);

        await waitForApollo(0);

        await findByTestId('next-page');
      });

      expect(history.push).toHaveBeenCalledWith(
        '/my-companies/dashboard/company-uuid',
      );
    });

    it('should display a success toast', async () => {
      const { findAllByRole, findByTestId, findByText } = component;

      await act(async () => {
        await findByText('Company name');

        const [, , button] = await findAllByRole('button');

        fireEvent.click(button);

        await waitForApollo(0);

        await findByTestId('next-page');
      });

      await wait(() =>
        expect(add).toHaveBeenCalledWith({
          colour: 'success',
          message: 'settings.success',
        }),
      );
    });

    it('should display success toast when bank account is unlinked', async () => {
      const { findAllByRole, findByText } = component;

      await act(async () => {
        await findByText('Company name');

        const [, button] = await findAllByRole('button');

        fireEvent.click(button);

        await waitForApollo(0);
      });

      await wait(() =>
        expect(add).toHaveBeenCalledWith({
          colour: 'success',
          message: 'settings.bank-disconnected',
        }),
      );
    });
  });

  describe('when unlinking is unsuccessful', () => {
    beforeEach(async () => {
      mocks = [
        {
          error: new Error(),
          request: {
            query: DELETE_BANK_CONNECTION,
            variables: {
              id: 'company-uuid',
            },
          },
        },
        {
          request: {
            query: GET_SETTINGS,
            variables: {
              id: 'company-uuid',
            },
          },
          result: {
            data: {
              getBankSettings: {
                account: 'account-name',
                bank: 'My bank',
                id: 'company-uuid',
                user: 'bank-uuid',
              },
              getCompany: {
                id: 'company-uuid',
                name: 'Company name',
              },
              getSettings: {
                categories: [],
                id: 'company-uuid',
                vat: {
                  charge: 0,
                  pay: 0,
                  registration: null,
                  scheme: 'none',
                },
                yearEnd: {
                  day: 5,
                  month: 3,
                },
              },
            },
          },
        },
        {
          request: {
            query: UPDATE_SETTINGS,
            variables: {
              input: {
                categories: [],
                id: 'company-uuid',
                vat: {
                  charge: 0,
                  pay: 0,
                  registration: null,
                  scheme: 'none',
                },
                yearEnd: {
                  day: 5,
                  month: 3,
                },
              },
            },
          },
          result: {
            data: {
              updateSettings: {
                categories: [],
                id: 'company-uuid',
                vat: {
                  charge: 0,
                  pay: 0,
                  registration: null,
                  scheme: 'none',
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
        component = render(
          <TestProvider path="/settings/:companyId" history={history}>
            <MockedProvider mocks={mocks} addTypename={false}>
              <Settings />
            </MockedProvider>
          </TestProvider>,
        );
      });
    });

    it('should display the correct toast when unable to unlink bank', async () => {
      const { findAllByRole, findByText } = component;

      await act(async () => {
        await findByText('Company name');

        const [, button] = await findAllByRole('button');

        fireEvent.click(button);

        await waitForApollo(0);
      });

      await wait(() =>
        expect(add).toHaveBeenCalledWith({
          colour: 'danger',
          message: 'settings.bank-disconnected-error',
        }),
      );
    });
  });

  describe('when data is not returned', () => {
    beforeEach(async () => {
      mocks = [
        {
          request: {
            query: GET_SETTINGS,
            variables: {
              id: 'company-uuid',
            },
          },
          result: {
            data: {
              getBankSettings: {
                account: 'account-name',
                bank: 'My bank',
                id: 'company-uuid',
                user: 'bank-uuid',
              },
              getCompany: {
                id: 'company-uuid',
                name: 'Company name',
              },
              getSettings: {
                categories: [],
                id: 'company-uuid',
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
        {
          request: {
            query: UPDATE_SETTINGS,
            variables: {
              input: {
                categories: [],
                id: 'company-uuid',
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
          result: {
            data: {},
          },
        },
      ];

      await act(async () => {
        component = render(
          <TestProvider path="/settings/:companyId" history={history}>
            <MockedProvider mocks={mocks} addTypename={false}>
              <Settings />
            </MockedProvider>
          </TestProvider>,
        );
      });
    });

    it('should redirect you to the dashboard on complete', async () => {
      const { findAllByRole, findByTestId, findByText } = component;

      await act(async () => {
        await findByText('Company name');

        const [, , button] = await findAllByRole('button');

        fireEvent.click(button);

        await waitForApollo(0);

        await findByTestId('next-page');
      });

      expect(history.push).toHaveBeenCalledWith(
        '/my-companies/dashboard/company-uuid',
      );
    });

    it('should display a danger toast', async () => {
      const { findAllByRole, findByTestId, findByText } = component;

      await act(async () => {
        await findByText('Company name');

        const [, , button] = await findAllByRole('button');

        fireEvent.click(button);

        await waitForApollo(0);

        await findByTestId('next-page');
      });

      await wait(() =>
        expect(add).toHaveBeenCalledWith({
          colour: 'danger',
          message: 'settings.retry',
        }),
      );
    });
  });
});
