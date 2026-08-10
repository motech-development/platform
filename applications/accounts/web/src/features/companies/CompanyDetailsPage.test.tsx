import { BreezeProvider } from '@motech-development/breeze-ui';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CompanyDetailsPage } from './CompanyDetailsPage';

const mocks = vi.hoisted(() => ({
  blocker: {
    proceed: vi.fn(),
    reset: vi.fn(),
    status: 'idle',
  },
  deleteCompany: vi.fn(),
  deleteLoading: false,
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
      {
        loading: name === 'AccountsWebDeleteCompany' && mocks.deleteLoading,
      },
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

    return { ...mocks.blocker };
  },
  useNavigate: () => mocks.navigate,
}));

describe('CompanyDetailsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.navigate.mockResolvedValue(undefined);
    mocks.blocker.status = 'idle';
    mocks.deleteLoading = false;
    mocks.query.error = undefined;
    mocks.query.loading = false;
    mocks.query.refetch.mockResolvedValue(undefined);
    mocks.query.data = {
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
    };
    mocks.shouldBlockFn = undefined;
  });

  it('announces the initial company-details load', () => {
    mocks.query.data = undefined as unknown as typeof mocks.query.data;
    mocks.query.loading = true;

    render(
      <BreezeProvider locale="en-GB">
        <CompanyDetailsPage companyId="company-id" owner="owner-id" />
      </BreezeProvider>,
    );

    expect(
      screen.getByRole('heading', { name: 'Company details' }),
    ).toBeVisible();
    expect(
      screen.getByRole('status', { name: 'Loading company details' }),
    ).toBeVisible();
  });

  it('offers retry when company details are unavailable', async () => {
    const user = userEvent.setup();
    mocks.query.data = {
      getCompany: undefined,
    } as unknown as typeof mocks.query.data;

    render(
      <BreezeProvider locale="en-GB">
        <CompanyDetailsPage companyId="company-id" owner="owner-id" />
      </BreezeProvider>,
    );

    expect(
      screen.getByText('Company details could not be loaded'),
    ).toBeVisible();
    expect(
      screen.getByRole('heading', { name: 'Company details' }),
    ).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(mocks.query.refetch).toHaveBeenCalledOnce();
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

  it('matches the prototype company-details section hierarchy', () => {
    render(
      <BreezeProvider locale="en-GB">
        <CompanyDetailsPage companyId="company-id" owner="owner-id" />
      </BreezeProvider>,
    );

    expect(
      screen.getAllByRole('heading', { name: 'Company details' }),
    ).toHaveLength(2);
    expect(
      screen.queryByRole('heading', { name: 'Identity' }),
    ).not.toBeInTheDocument();
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
    const confirmationLayout = confirmation.parentElement?.parentElement;
    const deleteButton = screen.getByRole('button', {
      name: 'Permanently delete company',
    });

    expect(confirmationLayout).toHaveClass('gap-5');
    expect(screen.getByRole('group').parentElement).toBe(confirmationLayout);

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

  it('freezes company details while saving', async () => {
    const user = userEvent.setup();
    let resolveUpdate: (result: unknown) => void = () => undefined;

    mocks.updateCompany.mockReturnValue(
      new Promise((resolve) => {
        resolveUpdate = resolve;
      }),
    );

    render(
      <BreezeProvider locale="en-GB">
        <CompanyDetailsPage companyId="company-id" owner="owner-id" />
      </BreezeProvider>,
    );

    await user.clear(screen.getByLabelText('Email address'));
    await user.type(screen.getByLabelText('Email address'), 'new@example.com');
    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    await waitFor(() => expect(mocks.updateCompany).toHaveBeenCalledOnce());
    expect(screen.getByLabelText('Company name')).toBeDisabled();
    expect(screen.getByLabelText('Email address')).toBeDisabled();
    expect(screen.getByLabelText('Telephone number')).toBeDisabled();
    expect(
      screen.getByRole('button', { name: 'Delete company' }),
    ).toBeDisabled();

    resolveUpdate({
      data: { updateCompany: mocks.query.data.getCompany },
    });

    await waitFor(() => expect(mocks.navigate).toHaveBeenCalledOnce());
  });

  it('holds blocked navigation until a pending save succeeds', async () => {
    const user = userEvent.setup();
    let resolveUpdate: (result: unknown) => void = () => undefined;

    mocks.updateCompany.mockReturnValue(
      new Promise((resolve) => {
        resolveUpdate = resolve;
      }),
    );

    const { rerender } = render(
      <BreezeProvider locale="en-GB">
        <CompanyDetailsPage companyId="company-id" owner="owner-id" />
      </BreezeProvider>,
    );

    await user.clear(screen.getByLabelText('Email address'));
    await user.type(screen.getByLabelText('Email address'), 'new@example.com');
    await user.click(screen.getByRole('button', { name: 'Save changes' }));
    await waitFor(() => expect(mocks.updateCompany).toHaveBeenCalledOnce());

    mocks.blocker.status = 'blocked';
    rerender(
      <BreezeProvider locale="en-GB">
        <CompanyDetailsPage companyId="company-id" owner="owner-id" />
      </BreezeProvider>,
    );

    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();

    resolveUpdate({
      data: { updateCompany: mocks.query.data.getCompany },
    });

    await waitFor(() => expect(mocks.blocker.reset).toHaveBeenCalledOnce());
    expect(mocks.blocker.proceed).not.toHaveBeenCalled();
    expect(mocks.navigate).toHaveBeenCalledWith({
      params: { companyId: 'company-id' },
      to: '/my-companies/dashboard/$companyId',
    });
  });

  it('preserves edited details when the save mutation fails', async () => {
    const user = userEvent.setup();
    mocks.updateCompany.mockRejectedValue(new Error('Save unavailable'));

    render(
      <BreezeProvider locale="en-GB">
        <CompanyDetailsPage companyId="company-id" owner="owner-id" />
      </BreezeProvider>,
    );

    await user.clear(screen.getByLabelText('Email address'));
    await user.type(
      screen.getByLabelText('Email address'),
      'draft@example.com',
    );
    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    await waitFor(() =>
      expect(mocks.toast.show).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Company details could not be saved',
        }),
      ),
    );
    expect(screen.getByLabelText('Email address')).toHaveValue(
      'draft@example.com',
    );
    expect(screen.getByLabelText('Email address')).toBeEnabled();
    expect(mocks.navigate).not.toHaveBeenCalled();
  });

  it('keeps the delete dialog recoverable when deletion fails', async () => {
    const user = userEvent.setup();
    mocks.deleteCompany.mockRejectedValue(new Error('Delete unavailable'));

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
        expect.objectContaining({ title: 'Company could not be deleted' }),
      ),
    );
    expect(
      screen.getByRole('button', { name: 'Permanently delete company' }),
    ).toBeEnabled();
    expect(mocks.navigate).not.toHaveBeenCalled();
  });

  it('prevents cancellation and navigation while deletion is pending', async () => {
    const user = userEvent.setup();
    let resolveDelete: (result: unknown) => void = () => undefined;

    mocks.deleteCompany.mockReturnValue(
      new Promise((resolve) => {
        resolveDelete = resolve;
      }),
    );

    const { rerender } = render(
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
    await waitFor(() => expect(mocks.deleteCompany).toHaveBeenCalledOnce());

    mocks.deleteLoading = true;
    mocks.blocker.status = 'blocked';
    rerender(
      <BreezeProvider locale="en-GB">
        <CompanyDetailsPage companyId="company-id" owner="owner-id" />
      </BreezeProvider>,
    );

    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
    expect(mocks.shouldBlockFn?.()).toBe(true);
    await user.keyboard('{Escape}');
    expect(screen.getByRole('alertdialog')).toBeVisible();

    mocks.deleteLoading = false;
    resolveDelete({
      data: {
        deleteCompany: {
          id: 'company-id',
          name: 'Example Company',
          owner: 'owner-id',
        },
      },
    });
    await waitFor(() => expect(mocks.blocker.reset).toHaveBeenCalledOnce());
    await waitFor(() => expect(mocks.navigate).toHaveBeenCalledOnce());
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
