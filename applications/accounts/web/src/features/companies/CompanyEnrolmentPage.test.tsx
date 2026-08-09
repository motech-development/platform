import { BreezeProvider } from '@motech-development/breeze-ui';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
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
  blocker: {
    proceed: vi.fn(),
    reset: vi.fn(),
    status: 'idle',
  },
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
  useBlocker: () => mocks.blocker,
  useNavigate: () => mocks.navigate,
}));

vi.mock('./CompaniesPageContent', () => ({
  CompaniesPageContent: () => <main>My companies</main>,
}));

function fillCompanyDetails() {
  const values = {
    'Account number': '12345678',
    'Address line 1': '1 Example Street',
    'Company name': 'Example Company',
    'Company number': '12345678',
    'Email address': 'owner@example.com',
    Postcode: 'sw1a 1aa',
    'Sort code': '12-34-56',
    'Telephone number': '020 7946 0958',
    'Town or city': 'London',
  };

  Object.entries(values).forEach(([label, value]) => {
    fireEvent.change(screen.getByLabelText(label), { target: { value } });
  });
}

describe('CompanyEnrolmentPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.blocker.status = 'idle';
    mocks.createCompany.mockReset();
    mocks.navigate.mockReset().mockResolvedValue(undefined);
  });

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

    fillCompanyDetails();
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

    fireEvent.change(screen.getByLabelText('VAT registration'), {
      target: { value: '123456789' },
    });
    expect(screen.getByLabelText('VAT registration')).toHaveValue(
      'GB123456789',
    );
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

  it('rejects a day that does not exist in the selected month', async () => {
    const user = userEvent.setup();

    render(
      <BreezeProvider locale="en-GB">
        <CompanyEnrolmentPage owner="owner-id" />
      </BreezeProvider>,
    );

    fillCompanyDetails();
    await user.click(
      screen.getByRole('button', { name: 'Continue to settings' }),
    );
    await user.click(screen.getByLabelText('Standard'));
    await user.clear(screen.getByLabelText('Day'));
    await user.type(screen.getByLabelText('Day'), '31');
    await user.click(screen.getByRole('button', { name: /Month/ }));
    await user.click(screen.getByRole('option', { name: 'April' }));

    expect(
      await screen.findByText('Enter a valid day for the selected month'),
    ).toBeVisible();
    expect(screen.getByRole('button', { name: 'Save company' })).toBeDisabled();
  });

  it('recovers safely when dashboard navigation fails after creation', async () => {
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
    mocks.navigate
      .mockRejectedValueOnce(new Error('Dashboard unavailable'))
      .mockResolvedValueOnce(undefined);

    render(
      <BreezeProvider locale="en-GB">
        <CompanyEnrolmentPage owner="owner-id" />
      </BreezeProvider>,
    );

    fillCompanyDetails();
    await user.click(
      screen.getByRole('button', { name: 'Continue to settings' }),
    );
    await user.click(screen.getByLabelText('Standard'));
    const saveButton = screen.getByRole('button', { name: 'Save company' });

    fireEvent.submit(saveButton);

    await waitFor(() =>
      expect(mocks.navigate).toHaveBeenNthCalledWith(2, {
        to: '/my-companies',
      }),
    );
    expect(saveButton).toBeDisabled();
    fireEvent.submit(saveButton);
    expect(mocks.createCompany).toHaveBeenCalledOnce();
    expect(mocks.toast.show).not.toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Company could not be added' }),
    );
  });

  it('preserves retryable input when company creation fails', async () => {
    const user = userEvent.setup();
    mocks.createCompany.mockRejectedValue(new Error('Create unavailable'));

    render(
      <BreezeProvider locale="en-GB">
        <CompanyEnrolmentPage owner="owner-id" />
      </BreezeProvider>,
    );

    fillCompanyDetails();
    await user.click(
      screen.getByRole('button', { name: 'Continue to settings' }),
    );
    await user.click(screen.getByLabelText('Standard'));
    await user.click(screen.getByRole('button', { name: 'Save company' }));

    await waitFor(() =>
      expect(mocks.toast.show).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Company could not be added' }),
      ),
    );
    expect(screen.getByLabelText('VAT scheme')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save company' })).toBeEnabled();
    expect(mocks.navigate).not.toHaveBeenCalled();
  });

  it('closes a clean enrolment drawer without confirmation', async () => {
    const user = userEvent.setup();

    render(
      <BreezeProvider locale="en-GB">
        <CompanyEnrolmentPage owner="owner-id" />
      </BreezeProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(mocks.navigate).toHaveBeenCalledWith({ to: '/my-companies' });
    expect(
      screen.queryByRole('heading', { name: 'Discard this company?' }),
    ).not.toBeInTheDocument();
  });

  it('keeps dirty enrolment input when discard is cancelled', async () => {
    const user = userEvent.setup();

    render(
      <BreezeProvider locale="en-GB">
        <CompanyEnrolmentPage owner="owner-id" />
      </BreezeProvider>,
    );

    fireEvent.change(screen.getByLabelText('Company name'), {
      target: { value: 'Draft Company' },
    });
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(
      screen.getByRole('heading', { name: 'Discard this company?' }),
    ).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Keep editing' }));
    expect(screen.getByLabelText('Company name')).toHaveValue('Draft Company');
    expect(mocks.navigate).not.toHaveBeenCalled();
  });

  it('proceeds with blocked navigation after discard is confirmed', async () => {
    const user = userEvent.setup();
    mocks.blocker.status = 'blocked';

    render(
      <BreezeProvider locale="en-GB">
        <CompanyEnrolmentPage owner="owner-id" />
      </BreezeProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Discard changes' }));
    expect(mocks.blocker.proceed).toHaveBeenCalledOnce();
    expect(mocks.blocker.reset).not.toHaveBeenCalled();
    expect(mocks.navigate).not.toHaveBeenCalled();
  });
});
