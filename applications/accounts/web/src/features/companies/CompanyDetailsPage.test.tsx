import { BreezeProvider } from '@motech-development/breeze-ui';
import { render, screen, waitFor } from '@testing-library/react';
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
    error: undefined,
    loading: false,
    refetch: vi.fn(),
  },
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

vi.mock('@tanstack/react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-router')>()),
  useBlocker: () => ({ proceed: vi.fn(), reset: vi.fn(), status: 'idle' }),
  useNavigate: () => mocks.navigate,
}));

describe('CompanyDetailsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
});
