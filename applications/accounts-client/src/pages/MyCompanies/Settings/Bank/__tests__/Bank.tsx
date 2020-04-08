import { MockedProvider, MockedResponse, wait } from '@apollo/react-testing';
import { act, fireEvent, render, RenderResult } from '@testing-library/react';
import { createMemoryHistory, MemoryHistory } from 'history';
import React from 'react';
import CREATE_BANK_CONNECTION from '../../../../../graphql/bank/CREATE_BANK_CONNECTION';
import GET_BANKS from '../../../../../graphql/bank/GET_BANKS';
import ON_BANK_CALLBACK from '../../../../../graphql/bank/ON_BANK_CALLBACK';
import TestProvider from '../../../../../utils/TestProvider';
import Bank from '../Bank';

describe('Bank', () => {
  let component: RenderResult;
  let history: MemoryHistory;
  let mocks: MockedResponse[];

  beforeEach(() => {
    history = createMemoryHistory({
      initialEntries: ['/settings/company-id/banks'],
    });
  });

  describe('before connecting to a bank', () => {
    beforeEach(() => {
      mocks = [
        {
          request: {
            query: GET_BANKS,
            variables: {
              id: 'company-id',
            },
          },
          result: {
            data: {
              getBankSettings: {
                id: 'company-id',
                user: 'user-id',
              },
              getBanks: {
                items: [
                  {
                    id: 'bank-id-1',
                    name: 'Bank name',
                  },
                  {
                    id: 'bank-id-2',
                    name: 'Bank name 2',
                  },
                ],
              },
            },
          },
        },
        {
          request: {
            query: ON_BANK_CALLBACK,
          },
          result: {
            data: null,
          },
        },
        {
          request: {
            query: CREATE_BANK_CONNECTION,
            variables: {
              input: {
                bank: 'bank-id-1',
                callback:
                  'http://localhost/my-companies/settings/company-id/bank/callback',
                companyId: 'company-id',
                user: 'user-id',
              },
            },
          },
          result: {
            data: {
              createBankConnection: {
                status: 'PENDING',
              },
            },
          },
        },
      ];

      component = render(
        <TestProvider path="/settings/:companyId/banks" history={history}>
          <MockedProvider mocks={mocks} addTypename={false}>
            <Bank />
          </MockedProvider>
        </TestProvider>,
      );
    });

    it('should display the banks', async () => {
      const { findByText } = component;

      await act(async () => {
        await findByText('select-bank.title');
      });

      await expect(findByText('Bank name')).resolves.toBeInTheDocument();
    });

    it('should have a cancel link button', async () => {
      const { findByText } = component;

      await act(async () => {
        await findByText('select-bank.title');
      });

      await expect(findByText('select-bank.cancel')).resolves.toHaveAttribute(
        'href',
        '/my-companies/settings/company-id',
      );
    });

    it('should disable the connect buttons after selecting a bank', async () => {
      const { findAllByRole, findByText } = component;

      await act(async () => {
        await findByText('select-bank.title');

        const [, button] = await findAllByRole('button');

        fireEvent.click(button);

        await wait(0);
      });

      const [, button, other] = await findAllByRole('button');

      expect(button).toBeDisabled();
      expect(other).toBeDisabled();
    });
  });

  describe('after connecting to a bank', () => {
    beforeEach(() => {
      mocks = [
        {
          request: {
            query: GET_BANKS,
            variables: {
              id: 'company-id',
            },
          },
          result: {
            data: {
              getBankSettings: {
                id: 'company-id',
                user: 'user-id',
              },
              getBanks: {
                items: [
                  {
                    id: 'bank-id-1',
                    name: 'Bank name',
                  },
                  {
                    id: 'bank-id-2',
                    name: 'Bank name 2',
                  },
                ],
              },
            },
          },
        },
        {
          request: {
            query: ON_BANK_CALLBACK,
          },
          result: {
            data: {
              onBankCallback: {
                authorisationUrl: 'https://auth.url',
              },
            },
          },
        },
      ];

      window.location.assign = jest.fn();

      component = render(
        <TestProvider path="/settings/:companyId/banks" history={history}>
          <MockedProvider mocks={mocks} addTypename={false}>
            <Bank />
          </MockedProvider>
        </TestProvider>,
      );
    });

    it('should redirect to the auth URL', async () => {
      const { findByText } = component;

      await act(async () => {
        await findByText('select-bank.title');

        await wait(0);
      });

      expect(window.location.assign).toHaveBeenCalledWith('https://auth.url');
    });
  });
});
