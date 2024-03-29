import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { waitForApollo } from '@motech-development/appsync-apollo';
import {
  act,
  fireEvent,
  render,
  RenderResult,
  waitFor,
} from '@testing-library/react';
import GET_BANK_ACCOUNTS from '../../../../../graphql/bank/GET_BANK_ACCOUNTS';
import UPDATE_BANK_SETTINGS from '../../../../../graphql/bank/UPDATE_BANK_SETTINGS';
import TestProvider, { add } from '../../../../../utils/TestProvider';
import SelectAccount from '../SelectAccount';

describe('SelectAccount', () => {
  let component: RenderResult;
  let history: string[];
  let mocks: MockedResponse[];

  beforeEach(() => {
    history = ['/settings/company-id/bank/select-account'];
  });

  describe('when accounts are loaded', () => {
    describe('when data is returned', () => {
      beforeEach(async () => {
        mocks = [
          {
            request: {
              query: GET_BANK_ACCOUNTS,
              variables: {
                id: 'company-id',
              },
            },
            result: {
              data: {
                getBankAccounts: {
                  items: [
                    {
                      accountIdentifications: [],
                      balance: 1000,
                      currency: 'GBP',
                      id: 'account-id-1',
                      type: 'Account 1',
                    },
                    {
                      accountIdentifications: [],
                      balance: null,
                      currency: 'GBP',
                      id: 'account-id-2',
                      type: 'Account 2',
                    },
                  ],
                },
              },
            },
          },
          {
            request: {
              query: UPDATE_BANK_SETTINGS,
              variables: {
                input: {
                  account: 'account-id-1',
                  id: 'company-id',
                },
              },
            },
            result: {
              data: {
                updateBankSettings: {
                  account: 'account-id-1',
                  id: 'company-id',
                  user: 'user-id',
                },
              },
            },
          },
        ];

        await act(async () => {
          component = render(
            <TestProvider
              path="/settings/:companyId/bank/select-account"
              history={history}
            >
              <MockedProvider mocks={mocks} addTypename={false}>
                <SelectAccount />
              </MockedProvider>
            </TestProvider>,
          );

          await Promise.resolve();
        });
      });

      it('should display accounts', async () => {
        const { findByText } = component;

        await findByText('select-account.title');

        await expect(findByText('Account 1')).resolves.toBeInTheDocument();
      });

      it('should redirect to settings page when account is linked', async () => {
        const { findAllByRole, findByTestId, findByText } = component;

        await findByText('select-account.title');

        await act(async () => {
          const [button] = await findAllByRole('button');

          fireEvent.click(button);

          await waitForApollo(0);
        });

        await expect(
          findByTestId('/my-companies/settings/company-id'),
        ).resolves.toBeInTheDocument();
      });

      it('should show a success toast', async () => {
        const { findAllByRole, findByText } = component;

        await findByText('select-account.title');

        await act(async () => {
          const [button] = await findAllByRole('button');

          fireEvent.click(button);

          await waitForApollo(0);
        });

        await waitFor(() =>
          expect(add).toHaveBeenCalledWith({
            colour: 'success',
            message: 'select-account.success',
          }),
        );
      });
    });

    describe('when data is not returned', () => {
      beforeEach(async () => {
        mocks = [
          {
            request: {
              query: GET_BANK_ACCOUNTS,
              variables: {
                id: 'company-id',
              },
            },
            result: {
              data: {
                getBankAccounts: {
                  items: [
                    {
                      accountIdentifications: [],
                      balance: 1000,
                      currency: 'GBP',
                      id: 'account-id-1',
                      type: 'Account 1',
                    },
                    {
                      accountIdentifications: [],
                      balance: null,
                      currency: 'GBP',
                      id: 'account-id-2',
                      type: 'Account 2',
                    },
                  ],
                },
              },
            },
          },
          {
            request: {
              query: UPDATE_BANK_SETTINGS,
              variables: {
                input: {
                  account: 'account-id-1',
                  id: 'company-id',
                },
              },
            },
            result: {
              data: {
                updateBankSettings: null,
              },
            },
          },
        ];

        await act(async () => {
          component = render(
            <TestProvider
              path="/settings/:companyId/bank/select-account"
              history={history}
            >
              <MockedProvider mocks={mocks} addTypename={false}>
                <SelectAccount />
              </MockedProvider>
            </TestProvider>,
          );

          await Promise.resolve();
        });
      });

      it('should redirect to settings page', async () => {
        const { findAllByRole, findByTestId, findByText } = component;

        await findByText('select-account.title');

        await act(async () => {
          const [button] = await findAllByRole('button');

          fireEvent.click(button);

          await waitForApollo(0);
        });

        await expect(
          findByTestId('/my-companies/settings/company-id'),
        ).resolves.toBeInTheDocument();
      });

      it('should show a danger toast', async () => {
        const { findAllByRole, findByText } = component;

        await findByText('select-account.title');

        await act(async () => {
          const [button] = await findAllByRole('button');

          fireEvent.click(button);

          await waitForApollo(0);
        });

        await waitFor(() =>
          expect(add).toHaveBeenCalledWith({
            colour: 'danger',
            message: 'select-account.retry',
          }),
        );
      });
    });
  });

  describe('when accounts are not loaded', () => {
    beforeEach(async () => {
      mocks = [
        {
          error: new Error(),
          request: {
            query: GET_BANK_ACCOUNTS,
            variables: {
              id: 'company-id',
            },
          },
        },
      ];

      await act(async () => {
        component = render(
          <TestProvider
            path="/settings/:companyId/bank/select-account"
            history={history}
          >
            <MockedProvider mocks={mocks} addTypename={false}>
              <SelectAccount />
            </MockedProvider>
          </TestProvider>,
        );

        await waitForApollo(0);
      });
    });

    it('should display an error card', async () => {
      const { findByText } = component;

      await expect(
        findByText('select-account.errors.failure.title'),
      ).resolves.toBeInTheDocument();
    });

    it('should have the correct back link', async () => {
      const { findByText } = component;

      await expect(findByText('go-back')).resolves.toHaveAttribute(
        'href',
        '/my-companies/settings/company-id',
      );
    });
  });
});
