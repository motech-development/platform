import { BreezeProvider } from '@motech-development/breeze-ui';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SettingsPage } from './SettingsPage';

const mocks = vi.hoisted(() => ({
  mutation: vi.fn(),
  navigate: vi.fn(),
  query: {
    data: {
      getCompany: { id: 'company-id', name: 'Example Company' },
      getSettings: {
        categories: [
          { name: 'Sales', protect: true, vatRate: 20 },
          { name: 'Advertising', protect: false, vatRate: 20 },
        ],
        id: 'company-id',
        vat: {
          charge: 20,
          pay: 20,
          registration: 'GB123456789',
          scheme: 'standard',
        },
        yearEnd: { day: 31, month: 2 },
      },
    },
    error: undefined,
    loading: false,
    refetch: vi.fn(),
  },
  toast: { show: vi.fn() },
}));

vi.mock('@apollo/client/react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@apollo/client/react')>()),
  useMutation: () => [mocks.mutation],
  useQuery: () => mocks.query,
}));

vi.mock('@motech-development/breeze-ui', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@motech-development/breeze-ui')>()),
  useToast: () => mocks.toast,
}));

vi.mock('@motech-development/breeze-ui/icons', () => ({
  AddIcon: () => <span aria-hidden="true">+</span>,
  DeleteIcon: () => <span aria-hidden="true">×</span>,
  WarningIcon: () => <span aria-hidden="true">!</span>,
}));

vi.mock('@tanstack/react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-router')>()),
  useBlocker: () => ({ proceed: vi.fn(), reset: vi.fn(), status: 'idle' }),
  useNavigate: () => mocks.navigate,
}));

describe('SettingsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('keeps protected categories read-only and defaults new categories to 20% VAT', async () => {
    const user = userEvent.setup();

    render(
      <BreezeProvider locale="en-GB">
        <SettingsPage companyId="company-id" />
      </BreezeProvider>,
    );

    expect(screen.getByLabelText('Sales name')).toHaveAttribute('readonly');
    expect(screen.getByLabelText('VAT rate for Sales')).toHaveAttribute(
      'readonly',
    );
    expect(
      screen.queryByRole('button', { name: 'Remove Sales' }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Remove Advertising' }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: 'Add a new category' }),
    );

    expect(screen.getByLabelText('New category name')).toHaveValue('');
    expect(screen.getByLabelText('VAT rate for new category')).toHaveValue(
      '20%',
    );
  });

  it('returns to the company dashboard after saving settings', async () => {
    const user = userEvent.setup();
    mocks.mutation.mockResolvedValue({
      data: { updateSettings: mocks.query.data.getSettings },
    });

    render(
      <BreezeProvider locale="en-GB">
        <SettingsPage companyId="company-id" />
      </BreezeProvider>,
    );

    const categoryName = screen.getByLabelText('Advertising name');
    const payRate = screen.getByLabelText('Pay rate');

    await user.clear(categoryName);
    await user.type(categoryName, 'Marketing');
    await user.clear(payRate);
    await user.type(payRate, '15.5');
    await user.click(screen.getByRole('button', { name: 'Save settings' }));

    await waitFor(() =>
      expect(mocks.mutation).toHaveBeenCalledWith({
        variables: {
          input: {
            categories: [
              { name: 'Sales', protect: true, vatRate: 20 },
              { name: 'Marketing', protect: false, vatRate: 20 },
            ],
            id: 'company-id',
            vat: {
              charge: 20,
              pay: 15.5,
              registration: 'GB123456789',
              scheme: 'standard',
            },
            yearEnd: { day: 31, month: 2 },
          },
        },
      }),
    );
    await waitFor(() =>
      expect(mocks.navigate).toHaveBeenCalledWith({
        params: { companyId: 'company-id' },
        to: '/my-companies/dashboard/$companyId',
      }),
    );
  });
});
