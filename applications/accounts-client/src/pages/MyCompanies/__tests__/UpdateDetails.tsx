import { MockedProvider, MockedResponse, wait } from '@apollo/react-testing';
import {
  act,
  fireEvent,
  render,
  RenderResult,
  waitForElement,
} from '@testing-library/react';
import { createMemoryHistory, MemoryHistory } from 'history';
import React from 'react';
import GET_COMPANY from '../../../graphql/company/GET_COMPANY';
import UPDATE_COMPANY from '../../../graphql/company/UPDATE_COMPANY';
import TestProvider from '../../../utils/TestProvider';
import UpdateDetails from '../UpdateDetails';

describe('UpdateDetails', () => {
  let component: RenderResult;
  let history: MemoryHistory;
  let mocks: MockedResponse[];

  beforeEach(() => {
    history = createMemoryHistory({
      initialEntries: ['/update-company/company-uuid'],
    });

    history.push = jest.fn();

    mocks = [
      {
        request: {
          query: GET_COMPANY,
          variables: {
            id: 'company-uuid',
          },
        },
        result: {
          data: {
            getCompany: {
              address: {
                line1: '1 Street',
                line2: '',
                line3: 'Town',
                line4: 'County',
                line5: 'KT1 1NE',
              },
              bank: {
                accountNumber: '12345678',
                sortCode: '12-34-56',
              },
              companyNumber: '12345678',
              contact: {
                email: 'info@contact.com',
                telephone: '07712345678',
              },
              id: 'company-uuid',
              name: 'New company',
              vatRegistration: 'GB123456789',
            },
          },
        },
      },
      {
        request: {
          query: UPDATE_COMPANY,
          variables: {
            input: {
              address: {
                line1: '1 Street',
                line2: '',
                line3: 'Town',
                line4: 'County',
                line5: 'KT1 1NE',
              },
              bank: {
                accountNumber: '12345678',
                sortCode: '12-34-56',
              },
              companyNumber: '12345678',
              contact: {
                email: 'info@contact.com',
                telephone: '07712345678',
              },
              id: 'company-uuid',
              name: 'New company',
              vatRegistration: 'GB123456789',
            },
          },
        },
        result: {
          data: {
            updateCompany: {
              address: {
                line1: '1 Street',
                line2: '',
                line3: 'Town',
                line4: 'County',
                line5: 'KT1 1NE',
              },
              bank: {
                accountNumber: '12345678',
                sortCode: '12-34-56',
              },
              companyNumber: '12345678',
              contact: {
                email: 'info@contact.com',
                telephone: '07712345678',
              },
              id: 'company-uuid',
              name: 'New company',
              vatRegistration: 'GB123456789',
            },
          },
        },
      },
    ];
    component = render(
      <TestProvider path="/update-company/:companyId" history={history}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <UpdateDetails />
        </MockedProvider>
      </TestProvider>,
    );
  });

  it('should redirect you to the dashboard on complete', async () => {
    const { findAllByRole, findByTestId, findByText } = component;

    await act(async () => {
      await waitForElement(() => findByText('New company'));

      const [, button] = await findAllByRole('button');

      fireEvent.click(button);

      wait(0);

      await waitForElement(() => findByTestId('next-page'));
    });

    expect(history.push).toHaveBeenCalledWith(
      '/my-companies/dashboard/company-uuid',
    );
  });
});
