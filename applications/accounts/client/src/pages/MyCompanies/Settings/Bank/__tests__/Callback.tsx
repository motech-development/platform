import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { waitForApollo } from '@motech-development/appsync-apollo';
import { act, render, RenderResult } from '@testing-library/react';
import UPDATE_BANK_SETTINGS from '../../../../../graphql/bank/UPDATE_BANK_SETTINGS';
import TestProvider from '../../../../../utils/TestProvider';
import Callback from '../Callback';

describe('Callback', () => {
  let component: RenderResult;
  let history: string[];
  let mocks: MockedResponse[];

  describe('with a successful response', () => {
    beforeEach(async () => {
      history = [
        '/settings/company-id/bank/callback?institution=bank-name&consent=consent-token&user-uuid=user-id',
      ];

      mocks = [
        {
          request: {
            query: UPDATE_BANK_SETTINGS,
            variables: {
              input: {
                bank: 'bank-name',
                consent: 'consent-token',
                id: 'company-id',
                user: 'user-id',
              },
            },
          },
          result: {
            data: {
              updateBankSettings: {
                account: null,
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
            path="/settings/:companyId/bank/callback"
            history={history}
          >
            <MockedProvider mocks={mocks} addTypename={false}>
              <Callback />
            </MockedProvider>
          </TestProvider>,
        );

        await Promise.resolve();
      });
    });

    it('should redirect to the account selection', async () => {
      const { findByTestId } = component;

      await act(async () => {
        await waitForApollo(0);
      });

      await expect(
        findByTestId('/my-companies/settings/company-id/bank/select-account'),
      ).resolves.toBeInTheDocument();
    });
  });

  describe('with an unsuccessful response', () => {
    beforeEach(async () => {
      history = [
        '/settings/company-id/bank/callback?institution=bank-name&consent=consent-token',
      ];

      mocks = [
        {
          request: {
            query: UPDATE_BANK_SETTINGS,
            variables: {
              input: {
                bank: 'bank-name',
                consent: 'consent-token',
                id: 'company-id',
                user: null,
              },
            },
          },
          result: {
            data: {
              updateBankSettings: {
                account: null,
                id: 'company-id',
                user: null,
              },
            },
          },
        },
      ];

      await act(async () => {
        component = render(
          <TestProvider
            path="/settings/:companyId/bank/callback"
            history={history}
          >
            <MockedProvider mocks={mocks} addTypename={false}>
              <Callback />
            </MockedProvider>
          </TestProvider>,
        );

        await Promise.resolve();
      });
    });

    it('should show the error card', async () => {
      const { findByText } = component;

      await act(async () => {
        await waitForApollo(0);
      });

      await expect(findByText('callback.error')).resolves.toBeInTheDocument();
    });

    it('should have the correct back link', async () => {
      const { findByText } = component;

      await act(async () => {
        await waitForApollo(0);
      });

      await expect(findByText('go-back')).resolves.toHaveAttribute(
        'href',
        '/my-companies/settings/company-id',
      );
    });
  });

  describe('when no data is sent', () => {
    beforeEach(async () => {
      history = [
        '/settings/company-id/bank/callback?institution=bank-name&consent=consent-token&user-uuid=user-id',
      ];

      mocks = [
        {
          request: {
            query: UPDATE_BANK_SETTINGS,
            variables: {
              input: {
                bank: 'bank-name',
                consent: 'consent-token',
                id: 'company-id',
                user: 'user-id',
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
            path="/settings/:companyId/bank/callback"
            history={history}
          >
            <MockedProvider mocks={mocks} addTypename={false}>
              <Callback />
            </MockedProvider>
          </TestProvider>,
        );

        await Promise.resolve();
      });
    });

    it('should show the error card', async () => {
      const { findByText } = component;

      await act(async () => {
        await waitForApollo(0);
      });

      await expect(findByText('callback.error')).resolves.toBeInTheDocument();
    });

    it('should have the correct back link', async () => {
      const { findByText } = component;

      await act(async () => {
        await waitForApollo(0);
      });

      await expect(findByText('go-back')).resolves.toHaveAttribute(
        'href',
        '/my-companies/settings/company-id',
      );
    });
  });
});
