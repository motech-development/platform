import { BreezeProvider } from '@motech-development/breeze-ui';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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
  shouldBlockFn: undefined as undefined | (() => boolean),
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
  useBlocker: (options: { shouldBlockFn: () => boolean }) => {
    mocks.shouldBlockFn = options.shouldBlockFn;

    return { proceed: vi.fn(), reset: vi.fn(), status: 'idle' };
  },
  useNavigate: () => mocks.navigate,
}));

describe('SettingsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.shouldBlockFn = undefined;
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
    await user.click(
      screen.getByRole('button', { name: 'Add a new category' }),
    );

    expect(screen.getByLabelText('New category name 3')).toHaveValue('');
    expect(screen.getByLabelText('New category name 4')).toHaveValue('');
    expect(screen.getByLabelText('VAT rate for new category 3')).toHaveValue(
      '20%',
    );
    expect(screen.getByLabelText('VAT rate for new category 4')).toHaveValue(
      '20%',
    );
    expect(
      screen.getByRole('button', { name: 'Remove new category 3' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Remove new category 4' }),
    ).toBeInTheDocument();
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

  it('restores dirty-form blocking when navigation fails after saving', async () => {
    const user = userEvent.setup();
    mocks.mutation.mockResolvedValue({
      data: { updateSettings: mocks.query.data.getSettings },
    });
    mocks.navigate.mockRejectedValue(new Error('Dashboard unavailable'));

    render(
      <BreezeProvider locale="en-GB">
        <SettingsPage companyId="company-id" />
      </BreezeProvider>,
    );

    fireEvent.change(screen.getByLabelText('Advertising name'), {
      target: { value: 'Marketing' },
    });
    await user.click(screen.getByRole('button', { name: 'Save settings' }));
    await waitFor(() =>
      expect(mocks.toast.show).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Settings saved' }),
      ),
    );
    expect(mocks.toast.show).not.toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Settings could not be saved' }),
    );

    fireEvent.change(screen.getByLabelText('Marketing name'), {
      target: { value: 'Campaigns' },
    });

    await waitFor(() => expect(mocks.shouldBlockFn?.()).toBe(true));
  });

  it('refreshes untouched settings without replacing dirty input', async () => {
    const { rerender } = render(
      <BreezeProvider locale="en-GB">
        <SettingsPage companyId="company-id" />
      </BreezeProvider>,
    );

    mocks.query.data = {
      ...mocks.query.data,
      getSettings: {
        ...mocks.query.data.getSettings,
        categories: mocks.query.data.getSettings.categories.map((category) =>
          category.name === 'Advertising'
            ? { ...category, name: 'Marketing' }
            : category,
        ),
      },
    };
    rerender(
      <BreezeProvider locale="en-GB">
        <SettingsPage companyId="company-id" />
      </BreezeProvider>,
    );

    await waitFor(() =>
      expect(screen.getByLabelText('Marketing name')).toHaveValue('Marketing'),
    );

    fireEvent.change(screen.getByLabelText('Marketing name'), {
      target: { value: 'Local category' },
    });
    mocks.query.data = {
      ...mocks.query.data,
      getSettings: {
        ...mocks.query.data.getSettings,
        categories: mocks.query.data.getSettings.categories.map((category) =>
          category.name === 'Marketing'
            ? { ...category, name: 'Campaigns' }
            : category,
        ),
      },
    };
    rerender(
      <BreezeProvider locale="en-GB">
        <SettingsPage companyId="company-id" />
      </BreezeProvider>,
    );

    expect(screen.getByLabelText('Local category name')).toHaveValue(
      'Local category',
    );
  });
});
