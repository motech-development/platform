import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { waitForApollo } from '@motech-development/appsync-apollo';
import {
  act,
  fireEvent,
  render,
  RenderResult,
  waitFor,
} from '@testing-library/react';
import TestProvider, { add } from '../../../../utils/TestProvider';
import Settings, { GET_SETTINGS, UPDATE_SETTINGS } from '../Settings';

describe('Settings', () => {
  let component: RenderResult;
  let history: string[];
  let mocks: MockedResponse[];

  beforeEach(() => {
    history = ['/settings/company-uuid'];
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
              updateSettings: null,
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

        await Promise.resolve();
      });
    });

    it('should redirect you to the dashboard on complete', async () => {
      const { findAllByRole, findByTestId, findByText } = component;

      await findByText('Company name');

      await act(async () => {
        const [, button] = await findAllByRole('button');

        fireEvent.click(button);

        await waitForApollo(0);
      });

      await expect(
        findByTestId('/my-companies/dashboard/company-uuid'),
      ).resolves.toBeInTheDocument();
    });

    it('should display a danger toast', async () => {
      const { findAllByRole, findByText } = component;

      await findByText('Company name');

      await act(async () => {
        const [, button] = await findAllByRole('button');

        fireEvent.click(button);

        await waitForApollo(0);
      });

      await waitFor(() =>
        expect(add).toHaveBeenCalledWith({
          colour: 'danger',
          message: 'settings.retry',
        }),
      );
    });
  });
});
