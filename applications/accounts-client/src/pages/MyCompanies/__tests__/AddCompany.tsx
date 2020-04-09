import {
  MockedProvider,
  MockedResponse,
  wait as apolloWait,
} from '@apollo/react-testing';
import {
  act,
  fireEvent,
  render,
  RenderResult,
  wait,
} from '@testing-library/react';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createMemoryHistory, MemoryHistory } from 'history';
import React from 'react';
import ADD_COMPANY from '../../../graphql/company/ADD_COMPANY';
import TestProvider, { add } from '../../../utils/TestProvider';
import AddCompany from '../AddCompany';

describe('AddCompany', () => {
  let cache: InMemoryCache;
  let component: RenderResult;
  let history: MemoryHistory;
  let mocks: MockedResponse[];

  beforeEach(() => {
    cache = new InMemoryCache();

    cache.writeData({
      data: {
        getCompanies: {
          __typename: 'Companies',
          items: [],
        },
      },
    });

    history = createMemoryHistory({
      initialEntries: ['/add-company'],
    });

    jest.spyOn(history, 'push');

    mocks = [
      {
        request: {
          query: ADD_COMPANY,
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
              id: '',
              name: 'New company',
              vatRegistration: 'GB123456789',
            },
          },
        },
        result: {
          data: {
            createCompany: {
              __typename: 'Company',
              address: {
                __typename: 'Address',
                line1: '1 Street',
                line2: '',
                line3: 'Town',
                line4: 'County',
                line5: 'KT1 1NE',
              },
              bank: {
                __typename: 'BankDetails',
                accountNumber: '12345678',
                sortCode: '12-34-56',
              },
              companyNumber: '12345678',
              contact: {
                __typename: 'Contact',
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
      <TestProvider path="/add-company" history={history}>
        <MockedProvider mocks={mocks} cache={cache}>
          <AddCompany />
        </MockedProvider>
      </TestProvider>,
    );
  });

  it('should redirect you to the dashboard on complete', async () => {
    const { findAllByRole, findByLabelText, findByTestId } = component;

    await act(async () => {
      const line1 = await findByLabelText('line1');
      const line3 = await findByLabelText('line3');
      const line4 = await findByLabelText('line4');
      const line5 = await findByLabelText('line5');
      const accountNumber = await findByLabelText(
        'company-form.bank.account-number.label',
      );
      const sortCode = await findByLabelText(
        'company-form.bank.sort-code.label',
      );
      const companyNumber = await findByLabelText(
        'company-form.company-details.company-number.label',
      );
      const email = await findByLabelText('email');
      const telephone = await findByLabelText('telephone');
      const name = await findByLabelText(
        'company-form.company-details.name.label',
      );
      const vatRegistration = await findByLabelText(
        'company-form.company-details.vat-registration.label',
      );

      fireEvent.change(line1, {
        target: { focus: () => {}, value: '1 Street' },
      });
      fireEvent.change(line3, { target: { focus: () => {}, value: 'Town' } });
      fireEvent.change(line4, {
        target: { focus: () => {}, value: 'County' },
      });
      fireEvent.change(line5, {
        target: { focus: () => {}, value: 'KT1 1NE' },
      });
      fireEvent.change(accountNumber, {
        target: { focus: () => {}, value: '12345678' },
      });
      fireEvent.change(sortCode, {
        target: { focus: () => {}, value: '12-34-56' },
      });
      fireEvent.change(companyNumber, {
        target: { focus: () => {}, value: '12345678' },
      });
      fireEvent.change(email, {
        target: { focus: () => {}, value: 'info@contact.com' },
      });
      fireEvent.change(telephone, {
        target: { focus: () => {}, value: '07712345678' },
      });
      fireEvent.change(name, {
        target: { focus: () => {}, value: 'New company' },
      });
      fireEvent.change(vatRegistration, {
        target: { focus: () => {}, value: 'GB123456789' },
      });

      await wait();

      const [, button] = await findAllByRole('button');

      fireEvent.click(button);

      await apolloWait(0);

      await findByTestId('next-page');
    });

    expect(history.push).toHaveBeenCalledWith(
      '/my-companies/dashboard/company-uuid',
    );
  });

  it('should display a success toast', async () => {
    const { findAllByRole, findByLabelText, findByTestId } = component;

    await act(async () => {
      const line1 = await findByLabelText('line1');
      const line3 = await findByLabelText('line3');
      const line4 = await findByLabelText('line4');
      const line5 = await findByLabelText('line5');
      const accountNumber = await findByLabelText(
        'company-form.bank.account-number.label',
      );
      const sortCode = await findByLabelText(
        'company-form.bank.sort-code.label',
      );
      const companyNumber = await findByLabelText(
        'company-form.company-details.company-number.label',
      );
      const email = await findByLabelText('email');
      const telephone = await findByLabelText('telephone');
      const name = await findByLabelText(
        'company-form.company-details.name.label',
      );
      const vatRegistration = await findByLabelText(
        'company-form.company-details.vat-registration.label',
      );

      fireEvent.change(line1, {
        target: { focus: () => {}, value: '1 Street' },
      });
      fireEvent.change(line3, { target: { focus: () => {}, value: 'Town' } });
      fireEvent.change(line4, {
        target: { focus: () => {}, value: 'County' },
      });
      fireEvent.change(line5, {
        target: { focus: () => {}, value: 'KT1 1NE' },
      });
      fireEvent.change(accountNumber, {
        target: { focus: () => {}, value: '12345678' },
      });
      fireEvent.change(sortCode, {
        target: { focus: () => {}, value: '12-34-56' },
      });
      fireEvent.change(companyNumber, {
        target: { focus: () => {}, value: '12345678' },
      });
      fireEvent.change(email, {
        target: { focus: () => {}, value: 'info@contact.com' },
      });
      fireEvent.change(telephone, {
        target: { focus: () => {}, value: '07712345678' },
      });
      fireEvent.change(name, {
        target: { focus: () => {}, value: 'New company' },
      });
      fireEvent.change(vatRegistration, {
        target: { focus: () => {}, value: 'GB123456789' },
      });

      await wait();

      const [, button] = await findAllByRole('button');

      fireEvent.click(button);

      await apolloWait(0);

      await findByTestId('next-page');
    });

    expect(add).toHaveBeenCalledWith({
      colour: 'success',
      message: 'add-company.success',
    });
  });
});
