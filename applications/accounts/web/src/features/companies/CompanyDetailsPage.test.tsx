import { BreezeProvider } from '@motech-development/breeze-ui';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CompanyDetailsPage } from './CompanyDetailsPage';

const mocks = vi.hoisted(() => ({
  deleteCompany: vi.fn(),
  navigate: vi.fn(),
  query: {
    data: {
      getCompany: {
        address: {
          line1: '1 Road',
          line2: '',
          line3: 'London',
          line4: '',
          line5: 'SW1A 1AA',
        },
        bank: { accountNumber: '12345678', sortCode: '12-34-56' },
        companyNumber: '12345678',
        contact: { email: 'owner@example.com', telephone: '020 7946 0958' },
        id: 'company-id',
        name: 'Example Company',
      },
    },
    error: undefined as Error | undefined,
    loading: false,
    refetch: vi.fn(),
  },
  shouldBlockFn: undefined as undefined | (() => boolean),
  toast: { show: vi.fn() },
  updateCompany: vi.fn(),
}));

vi.mock('@apollo/client/react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@apollo/client/react')>()),
  useMutation: (
    document: Readonly<{
      definitions?: ReadonlyArray<{ kind?: string; name?: { value?: string } }>;
    }>,
  ) => {
    const name = document.definitions?.find(
      ({ kind }) => kind === 'OperationDefinition',
    )?.name?.value;
    return [
      name === 'AccountsWebDeleteCompany'
        ? mocks.deleteCompany
        : mocks.updateCompany,
      { loading: false },
    ];
  },
  useQuery: () => mocks.query,
}));

vi.mock('@motech-development/breeze-ui', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@motech-development/breeze-ui')>()),
  useToast: () => mocks.toast,
}));

vi.mock('@motech-development/breeze-ui/icons', () => ({
  WarningIcon: () => <span aria-hidden="true">!</span>,
}));

vi.mock('@tanstack/react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-router')>()),
  useBlocker: (options: { shouldBlockFn: () => boolean }) => {
    mocks.shouldBlockFn = options.shouldBlockFn;

    return { proceed: vi.fn(), reset: vi.fn(), status: 'idle' };
  },
  useNavigate: () => mocks.navigate,
}));

describe('CompanyDetailsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.navigate.mockResolvedValue(undefined);
    mocks.query.error = undefined;
    mocks.query.data.getCompany = {
      address: {
        line1: '1 Road',
        line2: '',
        line3: 'London',
        line4: '',
        line5: 'SW1A 1AA',
      },
      bank: { accountNumber: '12345678', sortCode: '12-34-56' },
      companyNumber: '12345678',
      contact: { email: 'owner@example.com', telephone: '020 7946 0958' },
      id: 'company-id',
      name: 'Example Company',
    };
    mocks.shouldBlockFn = undefined;
  });

  it('formats an unseparated API sort code for editing', () => {
    mocks.query.data.getCompany = {
      ...mocks.query.data.getCompany,
      bank: { ...mocks.query.data.getCompany.bank, sortCode: '308639' },
    };

    render(
      <BreezeProvider locale="en-GB">
        <CompanyDetailsPage companyId="company-id" owner="owner-id" />
      </BreezeProvider>,
    );

    expect(screen.getByLabelText('Sort code')).toHaveValue('30-86-39');
  });

  it('requires the exact case-sensitive name before deleting a company', async () => {
    const user = userEvent.setup();
    mocks.deleteCompany.mockResolvedValue({
      data: {
        deleteCompany: {
          id: 'company-id',
          name: 'Example Company',
          owner: 'owner-id',
        },
      },
    });

    render(
      <BreezeProvider locale="en-GB">
        <CompanyDetailsPage companyId="company-id" owner="owner-id" />
      </BreezeProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Delete company' }));
    const confirmation = screen.getByLabelText(
      'Type Example Company to confirm',
    );
    const deleteButton = screen.getByRole('button', {
      name: 'Permanently delete company',
    });

    await user.type(confirmation, 'example company');
    expect(deleteButton).toBeDisabled();
    await user.clear(confirmation);
    await user.type(confirmation, 'Example Company');
    expect(deleteButton).toBeEnabled();
    await user.click(deleteButton);

    expect(mocks.deleteCompany).toHaveBeenCalledWith(
      expect.objectContaining({ variables: { id: 'company-id' } }),
    );
  });

  it('does not report a successful deletion as failed when navigation fails', async () => {
    const user = userEvent.setup();

    mocks.deleteCompany.mockResolvedValue({
      data: {
        deleteCompany: {
          id: 'company-id',
          name: 'Example Company',
          owner: 'owner-id',
        },
      },
    });
    mocks.navigate.mockRejectedValue(new Error('Companies unavailable'));

    render(
      <BreezeProvider locale="en-GB">
        <CompanyDetailsPage companyId="company-id" owner="owner-id" />
      </BreezeProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Delete company' }));
    await user.type(
      screen.getByLabelText('Type Example Company to confirm'),
      'Example Company',
    );
    await user.click(
      screen.getByRole('button', { name: 'Permanently delete company' }),
    );

    await waitFor(() =>
      expect(mocks.toast.show).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Company deleted' }),
      ),
    );
    expect(mocks.toast.show).not.toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Company could not be deleted' }),
    );
  });

  it('returns to the company dashboard after saving details', async () => {
    const user = userEvent.setup();
    mocks.updateCompany.mockResolvedValue({
      data: { updateCompany: mocks.query.data.getCompany },
    });

    render(
      <BreezeProvider locale="en-GB">
        <CompanyDetailsPage companyId="company-id" owner="owner-id" />
      </BreezeProvider>,
    );

    await user.clear(screen.getByLabelText('Email address'));
    await user.type(screen.getByLabelText('Email address'), 'new@example.com');
    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    await waitFor(() =>
      expect(mocks.navigate).toHaveBeenCalledWith({
        params: { companyId: 'company-id' },
        to: '/my-companies/dashboard/$companyId',
      }),
    );
  });

  it('refreshes untouched details without replacing dirty input', async () => {
    const { rerender } = render(
      <BreezeProvider locale="en-GB">
        <CompanyDetailsPage companyId="company-id" owner="owner-id" />
      </BreezeProvider>,
    );

    mocks.query.data.getCompany = {
      ...mocks.query.data.getCompany,
      contact: {
        ...mocks.query.data.getCompany.contact,
        email: 'network@example.com',
      },
    };
    rerender(
      <BreezeProvider locale="en-GB">
        <CompanyDetailsPage companyId="company-id" owner="owner-id" />
      </BreezeProvider>,
    );

    await waitFor(() =>
      expect(screen.getByLabelText('Email address')).toHaveValue(
        'network@example.com',
      ),
    );

    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'local@example.com' },
    });
    mocks.query.data.getCompany = {
      ...mocks.query.data.getCompany,
      contact: {
        ...mocks.query.data.getCompany.contact,
        email: 'newer-network@example.com',
      },
    };
    rerender(
      <BreezeProvider locale="en-GB">
        <CompanyDetailsPage companyId="company-id" owner="owner-id" />
      </BreezeProvider>,
    );

    expect(screen.getByLabelText('Email address')).toHaveValue(
      'local@example.com',
    );
  });

  it('replaces a dirty draft when the selected company changes', () => {
    const { rerender } = render(
      <BreezeProvider locale="en-GB">
        <CompanyDetailsPage companyId="company-id" owner="owner-id" />
      </BreezeProvider>,
    );

    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'company-a-draft@example.com' },
    });
    mocks.query.data.getCompany = {
      ...mocks.query.data.getCompany,
      contact: {
        ...mocks.query.data.getCompany.contact,
        email: 'company-b@example.com',
      },
      id: 'company-b',
      name: 'Company B',
    };
    rerender(
      <BreezeProvider locale="en-GB">
        <CompanyDetailsPage companyId="company-b" owner="owner-id" />
      </BreezeProvider>,
    );

    expect(screen.getByLabelText('Email address')).toHaveValue(
      'company-b@example.com',
    );
  });

  it('preserves dirty input when a background refresh fails', () => {
    const { rerender } = render(
      <BreezeProvider locale="en-GB">
        <CompanyDetailsPage companyId="company-id" owner="owner-id" />
      </BreezeProvider>,
    );

    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'local@example.com' },
    });
    mocks.query.error = new Error('Company service unavailable');
    rerender(
      <BreezeProvider locale="en-GB">
        <CompanyDetailsPage companyId="company-id" owner="owner-id" />
      </BreezeProvider>,
    );

    expect(screen.getByLabelText('Email address')).toHaveValue(
      'local@example.com',
    );
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Company details could not be refreshed. Check your connection, then try again.',
    );
    expect(screen.getByRole('alert')).not.toHaveTextContent(
      'Company service unavailable',
    );
    expect(
      screen.getByRole('button', { name: 'Try again' }),
    ).toBeInTheDocument();
  });

  it('keeps later edits protected when navigation fails after saving', async () => {
    const user = userEvent.setup();
    mocks.updateCompany.mockResolvedValue({
      data: { updateCompany: mocks.query.data.getCompany },
    });
    mocks.navigate.mockRejectedValue(new Error('Dashboard unavailable'));

    render(
      <BreezeProvider locale="en-GB">
        <CompanyDetailsPage companyId="company-id" owner="owner-id" />
      </BreezeProvider>,
    );

    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'saved@example.com' },
    });
    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    await waitFor(() =>
      expect(mocks.toast.show).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Company details saved' }),
      ),
    );
    expect(mocks.toast.show).not.toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Company details could not be saved',
      }),
    );

    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'later@example.com' },
    });

    await waitFor(() => expect(mocks.shouldBlockFn?.()).toBe(true));
  });
});
