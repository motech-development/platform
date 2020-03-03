import { MockedProvider, MockedResponse, wait } from '@apollo/react-testing';
import { act, fireEvent, render, RenderResult } from '@testing-library/react';
import { InMemoryCache } from 'apollo-cache-inmemory';
import React from 'react';
import ADD_COMPANY from '../../../graphql/ADD_COMPANY';
import history from '../../../history';
import TestProvider from '../../../utils/TestProvider';
import AddCompany from '../AddCompany';

describe('AddCompany', () => {
  let cache: InMemoryCache;
  let component: RenderResult;
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
                __typename: 'Bank',
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
      <TestProvider>
        <MockedProvider mocks={mocks} cache={cache}>
          <AddCompany />
        </MockedProvider>
      </TestProvider>,
    );
  });

  it('should redirect you to the dashboard on complete', async () => {
    const { findByLabelText, findAllByRole } = component;
    const line1 = await findByLabelText('company-form.address.line1.label');
    const line3 = await findByLabelText('company-form.address.line3.label');
    const line4 = await findByLabelText('company-form.address.line4.label');
    const line5 = await findByLabelText('company-form.address.line5.label');
    const accountNumber = await findByLabelText(
      'company-form.bank.account-number.label',
    );
    const sortCode = await findByLabelText('company-form.bank.sort-code.label');
    const companyNumber = await findByLabelText(
      'company-form.company-details.company-number.label',
    );
    const email = await findByLabelText('company-form.contact.email.label');
    const telephone = await findByLabelText(
      'company-form.contact.telephone.label',
    );
    const name = await findByLabelText(
      'company-form.company-details.name.label',
    );
    const vatRegistration = await findByLabelText(
      'company-form.company-details.vat-registration.label',
    );

    fireEvent.change(line1, { target: { focus: () => {}, value: '1 Street' } });
    fireEvent.change(line3, { target: { focus: () => {}, value: 'Town' } });
    fireEvent.change(line4, { target: { focus: () => {}, value: 'County' } });
    fireEvent.change(line5, { target: { focus: () => {}, value: 'KT1 1NE' } });
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

    const [, button] = await findAllByRole('button');

    fireEvent.click(button);

    await act(async () => wait(100));

    expect(history.push).toHaveBeenCalled();
  });
});
