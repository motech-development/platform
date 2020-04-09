import { MockedProvider, MockedResponse, wait } from '@apollo/react-testing';
import { act, fireEvent, render, RenderResult } from '@testing-library/react';
import { createMemoryHistory, MemoryHistory } from 'history';
import React from 'react';
import GET_BANK_ACCOUNTS from '../../../../../graphql/bank/GET_BANK_ACCOUNTS';
import UPDATE_BANK_SETTINGS from '../../../../../graphql/bank/UPDATE_BANK_SETTINGS';
import TestProvider, { add } from '../../../../../utils/TestProvider';
import SelectAccount from '../SelectAccount';

describe('SelectAccount', () => {
  let component: RenderResult;
  let history: MemoryHistory;
  let mocks: MockedResponse[];

  beforeEach(() => {
    history = createMemoryHistory({
      initialEntries: ['/settings/company-id/bank/select-account'],
    });

    jest.spyOn(history, 'push');
  });

  describe('when accounts are loaded', () => {
    beforeEach(() => {
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
                    balance: '1000.00',
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
    });

    it('should display accounts', async () => {
      const { findByText } = component;

      await act(async () => {
        await findByText('select-account.title');
      });

      await expect(findByText('Account 1')).resolves.toBeInTheDocument();
    });

    it('should redirect to settings page when account is linked', async () => {
      const { findAllByRole, findByTestId, findByText } = component;

      await act(async () => {
        await findByText('select-account.title');

        const [, button] = await findAllByRole('button');

        fireEvent.click(button);

        await wait(0);

        await findByTestId('next-page');
      });

      expect(history.push).toHaveBeenCalledWith(
        '/my-companies/settings/company-id',
      );
    });

    it('should show a success toast', async () => {
      const { findAllByRole, findByTestId, findByText } = component;

      await act(async () => {
        await findByText('select-account.title');

        const [, button] = await findAllByRole('button');

        fireEvent.click(button);

        await wait(0);

        await findByTestId('next-page');
      });

      expect(add).toHaveBeenCalledWith({
        colour: 'success',
        message: 'select-account.success',
      });
    });
  });

  describe('when accounts are not loaded', () => {
    beforeEach(() => {
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
    });

    it('should display an error card', async () => {
      const { findByText } = component;

      await act(async () => {
        await wait(0);
      });

      await expect(
        findByText('select-account.error'),
      ).resolves.toBeInTheDocument();
    });

    it('should have the correct back link', async () => {
      const { findByText } = component;

      await act(async () => {
        await wait(0);
      });

      await expect(findByText('go-back')).resolves.toHaveAttribute(
        'href',
        '/my-companies/settings/company-id',
      );
    });
  });
});
