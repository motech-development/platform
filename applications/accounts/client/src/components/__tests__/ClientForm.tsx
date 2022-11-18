import { act, fireEvent, render, waitFor } from '@testing-library/react';
import TestProvider from '../../utils/TestProvider';
import ClientForm, { FormSchema } from '../ClientForm';

describe('ClientForm', () => {
  let initialValues: FormSchema;
  let onSave: jest.Mock<unknown>;

  beforeEach(() => {
    initialValues = {
      address: {
        line1: '1 Street',
        line2: '',
        line3: 'Town',
        line4: 'County',
        line5: 'KT1 1NE',
      },
      companyId: 'company-uuid',
      contact: {
        email: 'info@contact.com',
        telephone: '07712345678',
      },
      id: 'client-uuid',
      name: 'New client',
    };
    onSave = jest.fn();
  });

  describe('without pre-populated data', () => {
    it('should render the form', async () => {
      const { findByRole } = render(
        <TestProvider>
          <ClientForm
            backTo="/test"
            companyId="company-uuid"
            loading={false}
            onSave={(value) => onSave(value)}
          />
        </TestProvider>,
      );

      const form = await waitFor(() => findByRole('form'));

      expect(form).toBeInTheDocument();
    });
  });

  describe('with pre-populated data', () => {
    it('should render the form', async () => {
      const { findByRole } = render(
        <TestProvider>
          <ClientForm
            companyId="company-uuid"
            initialValues={initialValues}
            loading={false}
            backTo="/test"
            onSave={(value) => onSave(value)}
          />
        </TestProvider>,
      );

      const form = await waitFor(() => findByRole('form'));

      expect(form).toBeInTheDocument();
    });

    it('should submit the form with the correct data', async () => {
      const { findByRole } = render(
        <TestProvider>
          <ClientForm
            companyId="company-uuid"
            initialValues={initialValues}
            loading={false}
            backTo="/test"
            onSave={(value) => onSave(value)}
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
