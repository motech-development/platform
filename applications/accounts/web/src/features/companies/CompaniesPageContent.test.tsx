import { BreezeProvider } from '@motech-development/breeze-ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CompaniesPageContent } from './CompaniesPageContent';

interface CompanyQueryData {
  getCompanies: { items: Array<Record<string, unknown>> };
}

const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  query: {
    data: undefined as CompanyQueryData | undefined,
    error: undefined as Error | undefined,
    loading: false,
    refetch: vi.fn(),
  },
}));

vi.mock('@apollo/client/react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@apollo/client/react')>()),
  useQuery: () => mocks.query,
}));

vi.mock('@motech-development/breeze-ui/icons', () => ({
  AddIcon: () => <span aria-hidden="true">+</span>,
  BuildingIcon: () => <span aria-hidden="true">building</span>,
  WarningIcon: () => <span aria-hidden="true">warning</span>,
}));

vi.mock('@tanstack/react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-router')>()),
  useNavigate: () => mocks.navigate,
}));

vi.mock('../../auth/owner', () => ({
  useAccountsOwnerId: () => 'owner-id',
}));

describe('CompaniesPageContent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.navigate.mockResolvedValue(undefined);
    mocks.query.data = { getCompanies: { items: [] } };
    mocks.query.error = undefined;
    mocks.query.loading = false;
    mocks.query.refetch.mockResolvedValue(undefined);
  });

  it('shows one add-company action in the empty state', async () => {
    const user = userEvent.setup();

    render(
      <BreezeProvider locale="en-GB">
        <CompaniesPageContent />
      </BreezeProvider>,
    );

    expect(screen.getByText('No companies yet')).toBeInTheDocument();
    expect(
      screen.getAllByRole('button', { name: 'Add a new company' }),
    ).toHaveLength(1);
    await user.click(screen.getByRole('button', { name: 'Add a new company' }));
    expect(mocks.navigate).toHaveBeenCalledWith({
      to: '/my-companies/add-company',
    });
  });

  it('keeps the page-header add action when companies exist', () => {
    mocks.query.data = {
      getCompanies: {
        items: [
          {
            companyNumber: '12345678',
            contact: { email: 'owner@example.com' },
            id: 'company-id',
            name: 'Example Company',
          },
        ],
      },
    };

    render(
      <BreezeProvider locale="en-GB">
        <CompaniesPageContent />
      </BreezeProvider>,
    );

    expect(screen.queryByText('No companies yet')).not.toBeInTheDocument();
    expect(
      screen.getAllByRole('button', { name: 'Add a new company' }),
    ).toHaveLength(1);
  });

  it('renders the complete loading composition while the first query runs', () => {
    mocks.query.data = undefined;
    mocks.query.loading = true;

    render(
      <BreezeProvider locale="en-GB">
        <CompaniesPageContent />
      </BreezeProvider>,
    );

    expect(
      screen.getByRole('status', { name: 'Loading companies' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Add a new company' }),
    ).toBeInTheDocument();
  });

  it('offers retry without showing the empty state after a query failure', async () => {
    const user = userEvent.setup();
    mocks.query.data = undefined;
    mocks.query.error = new Error('Companies unavailable');

    render(
      <BreezeProvider locale="en-GB">
        <CompaniesPageContent />
      </BreezeProvider>,
    );

    expect(screen.getByText('We could not load companies')).toBeVisible();
    expect(screen.queryByText('No companies yet')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Add a new company' }),
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(mocks.query.refetch).toHaveBeenCalledOnce();
  });

  it('preserves cached companies with a compact retry after refresh fails', async () => {
    const user = userEvent.setup();
    mocks.query.data = {
      getCompanies: {
        items: [
          {
            companyNumber: '12345678',
            contact: { email: 'owner@example.com' },
            id: 'company-id',
            name: 'Example Company',
          },
        ],
      },
    };
    mocks.query.error = new Error('Refresh unavailable');

    render(
      <BreezeProvider locale="en-GB">
        <CompaniesPageContent />
      </BreezeProvider>,
    );

    expect(screen.getByTestId('Example Company')).toBeVisible();
    expect(screen.queryByText('We could not load companies')).toBeNull();
    expect(screen.getByText(/Companies could not be refreshed/)).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(mocks.query.refetch).toHaveBeenCalledOnce();
  });

  it('opens the selected company dashboard', async () => {
    const user = userEvent.setup();
    mocks.query.data = {
      getCompanies: {
        items: [
          {
            companyNumber: '12345678',
            contact: { email: 'owner@example.com' },
            id: 'company-id',
            name: 'Example Company',
          },
        ],
      },
    };

    render(
      <BreezeProvider locale="en-GB">
        <CompaniesPageContent />
      </BreezeProvider>,
    );

    await user.click(screen.getByTestId('Example Company'));
    expect(mocks.navigate).toHaveBeenCalledWith({
      params: { companyId: 'company-id' },
      to: '/my-companies/dashboard/$companyId',
    });
  });
});
