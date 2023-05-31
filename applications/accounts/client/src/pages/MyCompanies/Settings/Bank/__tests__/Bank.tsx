import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { waitForApollo } from '@motech-development/appsync-apollo';
import { act, fireEvent, render, RenderResult } from '@testing-library/react';
import CREATE_BANK_CONNECTION from '../../../../../graphql/bank/CREATE_BANK_CONNECTION';
import GET_BANKS from '../../../../../graphql/bank/GET_BANKS';
import ON_BANK_CALLBACK from '../../../../../graphql/bank/ON_BANK_CALLBACK';
import TestProvider from '../../../../../utils/TestProvider';
import Bank from '../Bank';

describe('Bank', () => {
  let component: RenderResult;
  let history: string[];
  let mocks: MockedResponse[];

  beforeEach(() => {
    history = ['/settings/company-id/banks'];
  });

  describe('before connecting to a bank', () => {
    beforeEach(async () => {
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
              onBankCallback: null,
            },
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

      await act(async () => {
        component = render(
          <TestProvider path="/settings/:companyId/banks" history={history}>
            <MockedProvider mocks={mocks} addTypename={false}>
              <Bank />
            </MockedProvider>
          </TestProvider>,
        );

        await Promise.resolve();
      });
    });

    it('should display the banks', async () => {
      const { findByText } = component;

      await findByText('select-bank.title');

      await expect(findByText('Bank name')).resolves.toBeInTheDocument();
    });

    it('should have a cancel link button', async () => {
      const { findByText } = component;

      await findByText('select-bank.title');

      await expect(findByText('select-bank.cancel')).resolves.toHaveAttribute(
        'href',
        '/my-companies/settings/company-id',
      );
    });

    it('should disable the connect buttons after selecting a bank', async () => {
      const { findAllByRole, findByText } = component;

      await findByText('select-bank.title');

      await act(async () => {
        const [button] = await findAllByRole('button');

        fireEvent.click(button);

        await waitForApollo(0);
      });

      const [button, other] = await findAllByRole('button');

      expect(button).toBeDisabled();
      expect(other).toBeDisabled();
    });
  });

  describe('after connecting to a bank', () => {
    beforeEach(async () => {
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

      Object.defineProperty(window, 'location', {
        value: {
          assign: jest.fn(),
        },
        writable: true,
      });

      await act(async () => {
        component = render(
          <TestProvider path="/settings/:companyId/banks" history={history}>
            <MockedProvider mocks={mocks} addTypename={false}>
              <Bank />
            </MockedProvider>
          </TestProvider>,
        );

        await Promise.resolve();
      });
    });

    it('should redirect to the auth URL', async () => {
      const { findByText } = component;

      await findByText('select-bank.title');

      await act(async () => {
        await waitForApollo(0);
      });

      expect(window.location.assign).toHaveBeenCalledWith('https://auth.url');
    });
  });
});
