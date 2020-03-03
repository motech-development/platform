import { MockedProvider, MockedResponse, wait } from '@apollo/react-testing';
import {
  act,
  fireEvent,
  render,
  RenderResult,
  waitForElement,
} from '@testing-library/react';
import React from 'react';
import { Route } from 'react-router-dom';
import GET_COMPANY from '../../../graphql/GET_COMPANY';
import UPDATE_COMPANY from '../../../graphql/UPDATE_COMPANY';
import history from '../../../history';
import TestProvider from '../../../utils/TestProvider';
import UpdateDetails from '../UpdateDetails';

describe('UpdateDetails', () => {
  let component: RenderResult;
  let mocks: MockedResponse[];

  beforeEach(() => {
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
      <TestProvider path="/update-company/company-uuid">
        <MockedProvider mocks={mocks} addTypename={false}>
          <Route
            exact
            path="/update-company/:companyId"
            component={UpdateDetails}
          />
        </MockedProvider>
      </TestProvider>,
    );
  });

  it('should redirect you to the dashboard on complete', async () => {
    const { findByText, findAllByRole } = component;

    await act(async () => {
      await waitForElement(() => findByText('New company'));

      const [, button] = await findAllByRole('button');

      fireEvent.click(button);

      wait(100);
    });

    expect(history.push).toHaveBeenCalledWith('/dashboard/company-uuid');
  });
});
