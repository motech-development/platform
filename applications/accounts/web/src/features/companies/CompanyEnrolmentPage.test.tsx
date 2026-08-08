import { BreezeProvider } from '@motech-development/breeze-ui';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { companyEnrolmentSchema } from './company';
import { CompanyEnrolmentPage } from './CompanyEnrolmentPage';

interface CreateCompanyOptions {
  variables: { input: unknown };
}

interface CreateCompanyResult {
  data: {
    createCompany: {
      companyNumber: string;
      id: string;
      name: string;
      owner: string;
    };
  };
}

const mocks = vi.hoisted(() => ({
  createCompany:
    vi.fn<(options: CreateCompanyOptions) => Promise<CreateCompanyResult>>(),
  navigate: vi.fn(),
  toast: { show: vi.fn() },
}));

vi.mock('@apollo/client/react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@apollo/client/react')>()),
  useMutation: () => [mocks.createCompany],
}));

vi.mock('@motech-development/breeze-ui', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@motech-development/breeze-ui')>()),
  useToast: () => mocks.toast,
}));

vi.mock('@tanstack/react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-router')>()),
  useBlocker: () => ({ proceed: vi.fn(), reset: vi.fn(), status: 'idle' }),
  useNavigate: () => mocks.navigate,
}));

vi.mock('./CompaniesPageContent', () => ({
  CompaniesPageContent: () => <main>Your companies</main>,
}));

describe('CompanyEnrolmentPage', () => {
  it('preserves the two-step enrolment defaults and normalises the postcode', async () => {
    const user = userEvent.setup();

    mocks.createCompany.mockResolvedValue({
      data: {
        createCompany: {
          companyNumber: '12345678',
          id: 'company-id',
          name: 'Example Company',
          owner: 'owner-id',
        },
      },
    });

    render(
      <BreezeProvider locale="en-GB">
        <CompanyEnrolmentPage owner="owner-id" />
      </BreezeProvider>,
    );

    expect(screen.getByText('Step 1 of 2')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Continue to settings' }),
    ).toBeDisabled();

    await user.type(screen.getByLabelText('Company name'), 'Example Company');
    await user.type(screen.getByLabelText('Company number'), '12345678');
    await user.type(screen.getByLabelText('Account number'), '12345678');
    await user.type(screen.getByLabelText('Sort code'), '12-34-56');
    await user.type(
      screen.getByLabelText('Address line 1'),
      '1 Example Street',
    );
    await user.type(screen.getByLabelText('Town or city'), 'London');
    await user.type(screen.getByLabelText('Postcode'), 'sw1a 1aa');
    await user.type(
      screen.getByLabelText('Email address'),
      'owner@example.com',
    );
    await user.type(screen.getByLabelText('Telephone number'), '020 7946 0958');
    await user.click(
      screen.getByRole('button', { name: 'Continue to settings' }),
    );

    expect(screen.getByText('Step 2 of 2')).toBeInTheDocument();
    expect(screen.getByLabelText('Standard')).not.toBeChecked();
    expect(screen.getByLabelText('Charge rate')).toHaveValue('20%');
    expect(screen.getByLabelText('Pay rate')).toHaveValue('20%');
    expect(screen.getByLabelText('Opening balance')).toHaveValue('£0.00');
    expect(screen.getByLabelText('VAT owed')).toHaveValue('£0.00');
    expect(screen.getByLabelText('VAT paid')).toHaveValue('£0.00');

    await user.type(screen.getByLabelText('VAT registration'), 'GB123456789');
    await user.click(screen.getByRole('button', { name: 'Back' }));
    await user.click(
      screen.getByRole('button', { name: 'Continue to settings' }),
    );
    expect(screen.getByLabelText('VAT registration')).toHaveValue(
      'GB123456789',
    );

    await user.click(screen.getByLabelText('Standard'));

    fireEvent.submit(screen.getByRole('button', { name: 'Save company' }));

    await waitFor(() => expect(mocks.createCompany).toHaveBeenCalledOnce());
    const call = mocks.createCompany.mock.calls[0];
    const input = companyEnrolmentSchema.parse(call?.[0].variables.input);

    expect(input).toMatchObject({
      company: {
        address: { line5: 'SW1A 1AA' },
        name: 'Example Company',
      },
      vat: { charge: 20, pay: 20, scheme: 'standard' },
    });
  });
});
