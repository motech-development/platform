import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { act, render, RenderResult } from '@testing-library/react';
import { createMemoryHistory, MemoryHistory } from 'history';
import React from 'react';
import UPDATE_BANK_SETTINGS from '../../../../../graphql/bank/UPDATE_BANK_SETTINGS';
import TestProvider from '../../../../../utils/TestProvider';
import Callback from '../Callback';

describe('Callback', () => {
  let component: RenderResult;
  let history: MemoryHistory;
  let mocks: MockedResponse[];

  describe('with a successful response', () => {
    beforeEach(async () => {
      history = createMemoryHistory({
        initialEntries: [
          '/settings/company-id/bank/callback?institution=bank-name&consent=consent-token&user-uuid=user-id',
        ],
      });

      jest.spyOn(history, 'push');

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
      });
    });

    it('should redirect to the account selection', async () => {
      const { findByTestId } = component;

      await findByTestId('next-page');

      expect(history.push).toHaveBeenCalledWith(
        '/my-companies/settings/company-id/bank/select-account',
      );
    });
  });

  describe('with an unsuccessful response', () => {
    beforeEach(async () => {
      history = createMemoryHistory({
        initialEntries: [
          '/settings/company-id/bank/callback?institution=bank-name&consent=consent-token',
        ],
      });

      jest.spyOn(history, 'push');

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
      });
    });

    it('should show the error card', async () => {
      const { findByText } = component;

      await expect(findByText('callback.error')).resolves.toBeInTheDocument();
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
