import { BreezeProvider } from '@motech-development/breeze-ui';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CompaniesPageContent } from './CompaniesPageContent';

const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  query: {
    data: { getCompanies: { items: [] as Array<Record<string, unknown>> } },
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
    mocks.query.data = { getCompanies: { items: [] } };
    mocks.query.error = undefined;
    mocks.query.loading = false;
  });

  it('shows one add-company action in the empty state', () => {
    render(
      <BreezeProvider locale="en-GB">
        <CompaniesPageContent />
      </BreezeProvider>,
    );

    expect(screen.getByText('No companies yet')).toBeInTheDocument();
    expect(
      screen.getAllByRole('button', { name: 'Add a new company' }),
    ).toHaveLength(1);
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
});
