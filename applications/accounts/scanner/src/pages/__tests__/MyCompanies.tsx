import { MockedProvider, MockedResponse } from '@apollo/react-testing';
import { render, RenderResult } from '@testing-library/react';
import { createMemoryHistory, MemoryHistory } from 'history';
import React from 'react';
import TestProvider from '../../utils/TestProvider';
import MyCompanies, { GET_COMPANIES } from '../MyCompanies';

describe('MyCompanies', () => {
  let component: RenderResult;
  let history: MemoryHistory;
  let mocks: MockedResponse[];

  beforeEach(() => {
    mocks = [
      {
        request: {
          query: GET_COMPANIES,
        },
        result: {
          data: {
            getCompanies: {
              id: 'user-id',
              items: [
                {
                  companyNumber: '12345678',
                  id: '1',
                  name: 'Company with VAT',
                },
                {
                  companyNumber: '87654321',
                  id: '2',
                  name: 'Company without VAT',
                },
              ],
            },
          },
        },
      },
    ];

    history = createMemoryHistory({
      initialEntries: ['/my-companies'],
    });

    component = render(
      <TestProvider history={history} path="/my-companies">
        <MockedProvider mocks={mocks} addTypename={false}>
          <MyCompanies />
        </MockedProvider>
      </TestProvider>,
    );
  });

  it('should display the correct number of items', async () => {
    const { findAllByTestId } = component;

    await expect(findAllByTestId('company-item')).resolves.toHaveLength(2);
  });
});
