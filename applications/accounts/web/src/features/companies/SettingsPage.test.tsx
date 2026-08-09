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
    error: undefined as Error | undefined,
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
    mocks.navigate.mockResolvedValue(undefined);
    mocks.query.data = {
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
    };
    mocks.query.error = undefined;
    mocks.query.loading = false;
    mocks.query.refetch.mockResolvedValue(undefined);
    mocks.shouldBlockFn = undefined;
  });

  it('announces the initial settings load', () => {
    mocks.query.data = undefined as unknown as typeof mocks.query.data;
    mocks.query.loading = true;

    render(
      <BreezeProvider locale="en-GB">
        <SettingsPage companyId="company-id" />
      </BreezeProvider>,
    );

    expect(screen.getByRole('heading', { name: 'Settings' })).toBeVisible();
    expect(
      screen.getByRole('status', { name: 'Loading settings' }),
    ).toBeVisible();
  });

  it('offers retry when settings are unavailable', async () => {
    const user = userEvent.setup();
    mocks.query.data = {
      getCompany: undefined,
      getSettings: undefined,
    } as unknown as typeof mocks.query.data;

    render(
      <BreezeProvider locale="en-GB">
        <SettingsPage companyId="company-id" />
      </BreezeProvider>,
    );

    expect(screen.getByText('Settings could not be loaded')).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(mocks.query.refetch).toHaveBeenCalledOnce();
  });

  it('formats an unprefixed API VAT registration for editing', () => {
    mocks.query.data.getSettings.vat.registration = '216506516';

    render(
      <BreezeProvider locale="en-GB">
        <SettingsPage companyId="company-id" />
      </BreezeProvider>,
    );

    expect(screen.getByLabelText('Registration number')).toHaveValue(
      'GB216506516',
    );
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

  it('removes an editable expense category', async () => {
    const user = userEvent.setup();

    render(
      <BreezeProvider locale="en-GB">
        <SettingsPage companyId="company-id" />
      </BreezeProvider>,
    );

    await user.click(
      screen.getByRole('button', { name: 'Remove Advertising' }),
    );
    expect(screen.queryByLabelText('Advertising name')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Sales name')).toBeInTheDocument();
  });

  it('formats VAT registration digits using the established GB prefix', () => {
    render(
      <BreezeProvider locale="en-GB">
        <SettingsPage companyId="company-id" />
      </BreezeProvider>,
    );

    fireEvent.change(screen.getByLabelText('Registration number'), {
      target: { value: '216506516' },
    });

    expect(screen.getByLabelText('Registration number')).toHaveValue(
      'GB216506516',
    );
  });

  it('rejects a day that does not exist in the selected month', async () => {
    const user = userEvent.setup();

    render(
      <BreezeProvider locale="en-GB">
        <SettingsPage companyId="company-id" />
      </BreezeProvider>,
    );

    await user.click(screen.getByRole('button', { name: /Month/ }));
    await user.click(screen.getByRole('option', { name: 'April' }));

    expect(
      await screen.findByText('Enter a valid day for the selected month'),
    ).toBeVisible();
    expect(
      screen.getByRole('button', { name: 'Save settings' }),
    ).toBeDisabled();
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

  it('preserves edited settings when the mutation fails', async () => {
    const user = userEvent.setup();
    mocks.mutation.mockRejectedValue(new Error('Save unavailable'));

    render(
      <BreezeProvider locale="en-GB">
        <SettingsPage companyId="company-id" />
      </BreezeProvider>,
    );

    const categoryName = screen.getByLabelText('Advertising name');
    await user.clear(categoryName);
    await user.type(categoryName, 'Local draft');
    await user.click(screen.getByRole('button', { name: 'Save settings' }));

    await waitFor(() =>
      expect(mocks.toast.show).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Settings could not be saved' }),
      ),
    );
    expect(screen.getByLabelText('Local draft name')).toHaveValue(
      'Local draft',
    );
    expect(mocks.navigate).not.toHaveBeenCalled();
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

  it('replaces a dirty draft when the selected company changes', () => {
    const { rerender } = render(
      <BreezeProvider locale="en-GB">
        <SettingsPage companyId="company-id" />
      </BreezeProvider>,
    );

    fireEvent.change(screen.getByLabelText('Advertising name'), {
      target: { value: 'Company A draft' },
    });
    mocks.query.data = {
      getCompany: { id: 'company-b', name: 'Company B' },
      getSettings: {
        ...mocks.query.data.getSettings,
        categories: [
          { name: 'Sales', protect: true, vatRate: 20 },
          { name: 'Operations', protect: false, vatRate: 20 },
        ],
        id: 'company-b',
      },
    };
    rerender(
      <BreezeProvider locale="en-GB">
        <SettingsPage companyId="company-b" />
      </BreezeProvider>,
    );

    expect(screen.getByLabelText('Operations name')).toHaveValue('Operations');
    expect(
      screen.queryByDisplayValue('Company A draft'),
    ).not.toBeInTheDocument();
  });

  it('preserves dirty input when a background refresh fails', () => {
    const { rerender } = render(
      <BreezeProvider locale="en-GB">
        <SettingsPage companyId="company-id" />
      </BreezeProvider>,
    );

    fireEvent.change(screen.getByLabelText('Advertising name'), {
      target: { value: 'Local category' },
    });
    mocks.query.error = new Error('Settings service unavailable');
    rerender(
      <BreezeProvider locale="en-GB">
        <SettingsPage companyId="company-id" />
      </BreezeProvider>,
    );

    expect(screen.getByLabelText('Local category name')).toHaveValue(
      'Local category',
    );
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Settings could not be refreshed. Check your connection, then try again.',
    );
    expect(screen.getByRole('alert')).not.toHaveTextContent(
      'Settings service unavailable',
    );
    expect(
      screen.getByRole('button', { name: 'Try again' }),
    ).toBeInTheDocument();
  });
});
