import { MockedProvider, MockedResponse, wait } from '@apollo/react-testing';
import { act, fireEvent, render, RenderResult } from '@testing-library/react';
import { createMemoryHistory, MemoryHistory } from 'history';
import React from 'react';
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
              },
            },
          },
        },
      },
    ];

    component = render(
      <TestProvider path="/settings/:companyId" history={history}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <Settings />
        </MockedProvider>
      </TestProvider>,
    );
  });

  it('should redirect you to the dashboard on complete', async () => {
    const { findAllByRole, findByTestId, findByText } = component;

    await act(async () => {
      await findByText('Company name');

      const [, , button] = await findAllByRole('button');

      fireEvent.click(button);

      await wait(0);

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

      await wait(0);

      await findByTestId('next-page');
    });

    expect(add).toHaveBeenCalledWith({
      colour: 'success',
      message: 'settings.success',
    });
  });
});
