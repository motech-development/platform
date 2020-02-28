import { act, fireEvent, render, waitForElement } from '@testing-library/react';
import React from 'react';
import TestProvider from '../../utils/TestProvider';
import CompanyForm, { FormSchema } from '../CompanyForm';

describe('CompanyForm', () => {
  let initialValues: FormSchema;
  let onSave: jest.Mock;

  beforeEach(() => {
    initialValues = {
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
      name: 'New company',
      vatRegistration: 'GB123456789',
    };
    onSave = jest.fn();
  });

  describe('without pre-populated data', () => {
    it('should render the form', async () => {
      const { findByRole } = render(
        <TestProvider>
          <CompanyForm backTo="/test" onSave={value => onSave(value)} />
        </TestProvider>,
      );

      const form = await waitForElement(() => findByRole('form'));

      expect(form).toBeInTheDocument();
    });
  });

  describe('with pre-populated data', () => {
    it('should render the form', async () => {
      const { findByRole } = render(
        <TestProvider>
          <CompanyForm
            initialValues={initialValues}
            backTo="/test"
            onSave={value => onSave(value)}
          />
        </TestProvider>,
      );

      const form = await waitForElement(() => findByRole('form'));

      expect(form).toBeInTheDocument();
    });

    it('should submit the form with the correct data', async () => {
      const { findByRole } = render(
        <TestProvider>
          <CompanyForm
            initialValues={initialValues}
            backTo="/test"
            onSave={value => onSave(value)}
          />
        </TestProvider>,
      );

      await act(async () => {
        const button = await findByRole('button');

        fireEvent.click(button);
      });

      expect(onSave).toHaveBeenCalledWith(initialValues);
    });
  });
});
