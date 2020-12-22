import { InMemoryCache } from '@apollo/client/cache';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { waitForApollo } from '@motech-development/appsync-apollo';
import {
  act,
  fireEvent,
  render,
  RenderResult,
  wait,
} from '@testing-library/react';
import { createMemoryHistory, MemoryHistory } from 'history';
import React from 'react';
import ADD_COMPANY from '../../../graphql/company/ADD_COMPANY';
import GET_COMPANIES from '../../../graphql/company/GET_COMPANIES';
import TestProvider, { add } from '../../../utils/TestProvider';
import AddCompany from '../AddCompany';

describe('AddCompany', () => {
  let cache: InMemoryCache;
  let component: RenderResult;
  let history: MemoryHistory;
  let mocks: MockedResponse[];

  beforeEach(() => {
    history = createMemoryHistory({
      initialEntries: ['/add-company'],
    });

    jest.spyOn(history, 'push');
  });

  describe('when data is returned', () => {
    beforeEach(async () => {
      cache = new InMemoryCache();

      cache.writeQuery({
        data: {
          getCompanies: {
            __typename: 'Companies',
            id: 'user-id',
            items: [],
          },
        },
        query: GET_COMPANIES,
        variables: {
          id: 'user-id',
        },
      });

      mocks = [
        {
          request: {
            query: ADD_COMPANY,
            variables: {
              input: {
                balance: {
                  balance: 0,
                  vat: {
                    owed: 0,
                    paid: 0,
                  },
                },
                company: {
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
                },
                vat: {
                  charge: 20,
                  pay: 20,
                  registration: 'GB123456789',
                  scheme: 'flatRate',
                },
                yearEnd: {
                  day: '5',
                  month: '3',
                },
              },
            },
          },
          result: {
            data: {
              createCompany: {
                __typename: 'Company',
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
                owner: 'user-id',
              },
            },
          },
        },
      ];

      await act(async () => {
        component = render(
          <TestProvider path="/add-company" history={history}>
            <MockedProvider mocks={mocks} cache={cache}>
              <AddCompany />
            </MockedProvider>
          </TestProvider>,
        );
      });
    });

    it('should redirect you to the dashboard on complete', async () => {
      const { findAllByRole, findByLabelText, findByTestId } = component;

      await act(async () => {
        const line1 = await findByLabelText('address.line1');
        const line3 = await findByLabelText('address.line3');
        const line4 = await findByLabelText('address.line4');
        const line5 = await findByLabelText('address.line5');
        const accountNumber = await findByLabelText('bank.account-number');
        const sortCode = await findByLabelText('bank.sort-code');
        const companyNumber = await findByLabelText(
          'company-details.company-number',
        );
        const email = await findByLabelText('contact-details.email');
        const telephone = await findByLabelText('contact-details.telephone');
        const name = await findByLabelText('company-details.name');

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

        const [next] = await findAllByRole('button');

        fireEvent.click(next);

        const vatRegistration = await findByLabelText(
          'vat-settings.registration',
        );
        const vatScheme = await findByLabelText('vat-settings.scheme.flatRate');
        const yearEndDay = await findByLabelText('year-end.day.label');
        const yearEndMonth = await findByLabelText('year-end.month.label');

        fireEvent.change(vatRegistration, {
          target: { focus: () => {}, value: 'GB123456789' },
        });

        fireEvent.change(yearEndDay, {
          target: {
            value: '5',
          },
        });

        fireEvent.change(yearEndMonth, {
          target: {
            value: '3',
          },
        });

        fireEvent.click(vatScheme);

        await wait();

        const [, submit] = await findAllByRole('button');

        fireEvent.click(submit);

        await waitForApollo(0);

        await findByTestId('next-page');
      });

      expect(history.push).toHaveBeenCalledWith(
        '/my-companies/dashboard/company-uuid',
      );
    });

    it('should display a success toast', async () => {
      const { findAllByRole, findByLabelText, findByTestId } = component;

      await act(async () => {
        const line1 = await findByLabelText('address.line1');
        const line3 = await findByLabelText('address.line3');
        const line4 = await findByLabelText('address.line4');
        const line5 = await findByLabelText('address.line5');
        const accountNumber = await findByLabelText('bank.account-number');
        const sortCode = await findByLabelText('bank.sort-code');
        const companyNumber = await findByLabelText(
          'company-details.company-number',
        );
        const email = await findByLabelText('contact-details.email');
        const telephone = await findByLabelText('contact-details.telephone');
        const name = await findByLabelText('company-details.name');

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

        const [next] = await findAllByRole('button');

        fireEvent.click(next);

        const vatRegistration = await findByLabelText(
          'vat-settings.registration',
        );
        const vatScheme = await findByLabelText('vat-settings.scheme.flatRate');
        const yearEndDay = await findByLabelText('year-end.day.label');
        const yearEndMonth = await findByLabelText('year-end.month.label');

        fireEvent.change(vatRegistration, {
          target: { focus: () => {}, value: 'GB123456789' },
        });

        fireEvent.change(yearEndDay, {
          target: {
            value: '5',
          },
        });

        fireEvent.change(yearEndMonth, {
          target: {
            value: '3',
          },
        });

        fireEvent.click(vatScheme);

        await wait();

        const [, submit] = await findAllByRole('button');

        fireEvent.click(submit);

        await waitForApollo(0);

        await findByTestId('next-page');
      });

      await wait(() =>
        expect(add).toHaveBeenCalledWith({
          colour: 'success',
          message: 'add-company.success',
        }),
      );
    });
  });

  describe('when data is not returned', () => {
    beforeEach(async () => {
      mocks = [
        {
          request: {
            query: ADD_COMPANY,
            variables: {
              input: {
                balance: {
                  balance: 0,
                  vat: {
                    owed: 0,
                    paid: 0,
                  },
                },
                company: {
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
                },
                vat: {
                  charge: 20,
                  pay: 20,
                  registration: 'GB123456789',
                  scheme: 'flatRate',
                },
                yearEnd: {
                  day: '5',
                  month: '3',
                },
              },
            },
          },
          result: {
            data: {},
          },
        },
      ];

      await act(async () => {
        component = render(
          <TestProvider path="/add-company" history={history}>
            <MockedProvider mocks={mocks}>
              <AddCompany />
            </MockedProvider>
          </TestProvider>,
        );
      });
    });

    it('should display a warning toast', async () => {
      const { findAllByRole, findByLabelText, findByTestId } = component;

      await act(async () => {
        const line1 = await findByLabelText('address.line1');
        const line3 = await findByLabelText('address.line3');
        const line4 = await findByLabelText('address.line4');
        const line5 = await findByLabelText('address.line5');
        const accountNumber = await findByLabelText('bank.account-number');
        const sortCode = await findByLabelText('bank.sort-code');
        const companyNumber = await findByLabelText(
          'company-details.company-number',
        );
        const email = await findByLabelText('contact-details.email');
        const telephone = await findByLabelText('contact-details.telephone');
        const name = await findByLabelText('company-details.name');

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

        const [next] = await findAllByRole('button');

        fireEvent.click(next);

        const vatRegistration = await findByLabelText(
          'vat-settings.registration',
        );
        const vatScheme = await findByLabelText('vat-settings.scheme.flatRate');
        const yearEndDay = await findByLabelText('year-end.day.label');
        const yearEndMonth = await findByLabelText('year-end.month.label');

        fireEvent.change(vatRegistration, {
          target: { focus: () => {}, value: 'GB123456789' },
        });

        fireEvent.change(yearEndDay, {
          target: {
            value: '5',
          },
        });

        fireEvent.change(yearEndMonth, {
          target: {
            value: '3',
          },
        });

        fireEvent.click(vatScheme);

        await wait();

        const [, submit] = await findAllByRole('button');

        fireEvent.click(submit);

        await waitForApollo(0);

        await findByTestId('next-page');
      });

      await wait(() =>
        expect(add).toHaveBeenCalledWith({
          colour: 'danger',
          message: 'add-company.retry',
        }),
      );
    });

    it('should redirect you back to my companies page', async () => {
      const { findAllByRole, findByLabelText, findByTestId } = component;

      await act(async () => {
        const line1 = await findByLabelText('address.line1');
        const line3 = await findByLabelText('address.line3');
        const line4 = await findByLabelText('address.line4');
        const line5 = await findByLabelText('address.line5');
        const accountNumber = await findByLabelText('bank.account-number');
        const sortCode = await findByLabelText('bank.sort-code');
        const companyNumber = await findByLabelText(
          'company-details.company-number',
        );
        const email = await findByLabelText('contact-details.email');
        const telephone = await findByLabelText('contact-details.telephone');
        const name = await findByLabelText('company-details.name');

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

        const [next] = await findAllByRole('button');

        fireEvent.click(next);

        const vatRegistration = await findByLabelText(
          'vat-settings.registration',
        );
        const vatScheme = await findByLabelText('vat-settings.scheme.flatRate');
        const yearEndDay = await findByLabelText('year-end.day.label');
        const yearEndMonth = await findByLabelText('year-end.month.label');

        fireEvent.change(vatRegistration, {
          target: { focus: () => {}, value: 'GB123456789' },
        });

        fireEvent.change(yearEndDay, {
          target: {
            value: '5',
          },
        });

        fireEvent.change(yearEndMonth, {
          target: {
            value: '3',
          },
        });

        fireEvent.click(vatScheme);

        await wait();

        const [, submit] = await findAllByRole('button');

        fireEvent.click(submit);

        await waitForApollo(0);

        await findByTestId('next-page');
      });

      expect(history.push).toHaveBeenCalledWith('/my-companies');
    });
  });
});
