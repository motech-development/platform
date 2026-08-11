import { BreezeProvider } from '@motech-development/breeze-ui';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ClientEditPage } from './ClientEditPage';

const client = {
  address: {
    line1: '48 Lumen Street',
    line2: 'Northern Quarter',
    line3: 'Manchester',
    line4: 'Greater Manchester',
    line5: 'M1 2AB',
  },
  companyId: 'company-id',
  contact: {
    email: 'hello@northstar.studio',
    telephone: '020 7946 0182',
  },
  id: 'client-id',
  name: 'Northstar Studio',
};

const mocks = vi.hoisted(() => ({
  blocker: { proceed: vi.fn(), reset: vi.fn(), status: 'idle' },
  deleteClient: vi.fn(),
  deleteLoading: false,
  navigate: vi.fn(),
  query: {
    data: undefined as undefined | { getClient: typeof client },
    error: undefined as Error | undefined,
    loading: false,
    refetch: vi.fn(),
  },
  toast: { show: vi.fn() },
  updateClient: vi.fn(),
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

    return name === 'DeleteClient'
      ? [mocks.deleteClient, { loading: mocks.deleteLoading }]
      : [mocks.updateClient, { loading: false }];
  },
  useQuery: () => mocks.query,
}));

vi.mock('@motech-development/breeze-ui', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@motech-development/breeze-ui')>()),
  useToast: () => mocks.toast,
}));

vi.mock('@motech-development/breeze-ui/icons', async (importOriginal) => ({
  ...(await importOriginal<
    typeof import('@motech-development/breeze-ui/icons')
  >()),
  CloseIcon: () => <span aria-hidden="true">close</span>,
  WarningIcon: () => <span aria-hidden="true">warning</span>,
}));

vi.mock('@tanstack/react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-router')>()),
  useBlocker: () => ({ ...mocks.blocker }),
  useNavigate: () => mocks.navigate,
}));

vi.mock('./ClientsPageContent', () => ({
  ClientsPageContent: () => <main>Clients</main>,
}));

describe('ClientEditPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.blocker.status = 'idle';
    mocks.deleteLoading = false;
    mocks.navigate.mockResolvedValue(undefined);
    mocks.query.data = { getClient: client };
    mocks.query.error = undefined;
    mocks.query.loading = false;
    mocks.query.refetch.mockResolvedValue(undefined);
    mocks.deleteClient.mockResolvedValue({ data: { deleteClient: client } });
    mocks.updateClient.mockResolvedValue({ data: { updateClient: client } });
  });

  it('requires the exact case-sensitive client name before deletion', async () => {
    const user = userEvent.setup();

    render(
      <BreezeProvider locale="en-GB">
        <ClientEditPage clientId="client-id" companyId="company-id" />
      </BreezeProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Delete client' }));
    expect(screen.getByRole('alertdialog')).toHaveTextContent(
      'Type Northstar Studio to confirm',
    );
    const confirmation = screen.getByLabelText(
      'Type Northstar Studio to confirm',
    );
    const deleteButton = screen.getByRole('button', {
      name: 'Permanently delete client',
    });

    await user.type(confirmation, 'northstar studio');
    expect(deleteButton).toBeDisabled();
    await user.clear(confirmation);
    await user.type(confirmation, 'Northstar Studio');
    expect(deleteButton).toBeEnabled();
    await user.click(deleteButton);

    expect(mocks.deleteClient).toHaveBeenCalledWith(
      expect.objectContaining({ variables: { id: 'client-id' } }),
    );
  });

  it('announces the initial client-details load inside the drawer', () => {
    mocks.query.data = undefined;
    mocks.query.loading = true;

    render(
      <BreezeProvider locale="en-GB">
        <ClientEditPage clientId="client-id" companyId="company-id" />
      </BreezeProvider>,
    );

    expect(screen.getByRole('heading', { name: 'Edit client' })).toBeVisible();
    expect(
      screen.getByRole('status', { name: 'Loading client details' }),
    ).toBeVisible();
  });

  it('offers retry when client details are unavailable', async () => {
    const user = userEvent.setup();
    mocks.query.data = undefined;
    mocks.query.error = new Error('Client unavailable');

    render(
      <BreezeProvider locale="en-GB">
        <ClientEditPage clientId="client-id" companyId="company-id" />
      </BreezeProvider>,
    );

    expect(
      screen.getByText('Client details could not be loaded'),
    ).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(mocks.query.refetch).toHaveBeenCalledOnce();
  });

  it('never renders a client owned by another company', () => {
    mocks.query.data = {
      getClient: { ...client, companyId: 'another-company-id' },
    };

    render(
      <BreezeProvider locale="en-GB">
        <ClientEditPage clientId="client-id" companyId="company-id" />
      </BreezeProvider>,
    );

    expect(
      screen.getByText('Client details could not be loaded'),
    ).toBeVisible();
    expect(screen.queryByLabelText('Client name')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Delete client' }),
    ).not.toBeInTheDocument();
  });

  it('keeps cached details visible with retry after a refresh failure', async () => {
    const user = userEvent.setup();
    mocks.query.error = new Error('Refresh unavailable');

    render(
      <BreezeProvider locale="en-GB">
        <ClientEditPage clientId="client-id" companyId="company-id" />
      </BreezeProvider>,
    );

    expect(screen.getByLabelText('Client name')).toHaveValue(client.name);
    expect(
      screen.getByText(/Client details could not be refreshed/),
    ).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(mocks.query.refetch).toHaveBeenCalledOnce();
  });

  it('proceeds a blocked navigation once when edits are discarded', async () => {
    const user = userEvent.setup();
    mocks.blocker.status = 'blocked';

    render(
      <BreezeProvider locale="en-GB">
        <ClientEditPage clientId="client-id" companyId="company-id" />
      </BreezeProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Discard changes' }));

    expect(mocks.blocker.proceed).toHaveBeenCalledOnce();
    expect(mocks.navigate).not.toHaveBeenCalled();
  });

  it('retains edits after a failed update and allows retry', async () => {
    const user = userEvent.setup();
    mocks.updateClient.mockRejectedValueOnce(new Error('Unavailable'));

    render(
      <BreezeProvider locale="en-GB">
        <ClientEditPage clientId="client-id" companyId="company-id" />
      </BreezeProvider>,
    );

    const name = screen.getByLabelText('Client name');
    await user.clear(name);
    await user.type(name, 'Northstar Studio Ltd');
    await user.click(screen.getByRole('button', { name: 'Save client' }));

    await vi.waitFor(() =>
      expect(mocks.toast.show).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Client details could not be saved',
        }),
      ),
    );
    expect(name).toHaveValue('Northstar Studio Ltd');
    expect(mocks.navigate).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Save client' }));

    await vi.waitFor(() => expect(mocks.updateClient).toHaveBeenCalledTimes(2));
    expect(mocks.navigate).toHaveBeenCalledOnce();
  });

  it('finishes blocked company navigation after an unchanged save', async () => {
    const user = userEvent.setup();
    let resolveUpdate!: (value: {
      data: { updateClient: typeof client };
    }) => void;
    mocks.updateClient.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveUpdate = resolve;
      }),
    );
    const view = render(
      <BreezeProvider locale="en-GB">
        <ClientEditPage clientId="client-id" companyId="company-id" />
      </BreezeProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Save client' }));
    await vi.waitFor(() => expect(mocks.updateClient).toHaveBeenCalledOnce());

    mocks.blocker.status = 'blocked';
    view.rerender(
      <BreezeProvider locale="en-GB">
        <ClientEditPage clientId="client-id" companyId="company-id" />
      </BreezeProvider>,
    );
    act(() => {
      resolveUpdate({ data: { updateClient: client } });
    });

    await vi.waitFor(() =>
      expect(mocks.blocker.proceed).toHaveBeenCalledOnce(),
    );
    expect(mocks.navigate).not.toHaveBeenCalled();
    expect(mocks.toast.show).toHaveBeenCalledWith({
      title: 'Client details saved',
      variant: 'success',
    });
  });

  it('keeps delete confirmation open after failure and allows retry', async () => {
    const user = userEvent.setup();
    mocks.deleteClient.mockRejectedValueOnce(new Error('Unavailable'));

    render(
      <BreezeProvider locale="en-GB">
        <ClientEditPage clientId="client-id" companyId="company-id" />
      </BreezeProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Delete client' }));
    await user.type(
      screen.getByLabelText('Type Northstar Studio to confirm'),
      'Northstar Studio',
    );
    await user.click(
      screen.getByRole('button', { name: 'Permanently delete client' }),
    );

    await vi.waitFor(() =>
      expect(mocks.toast.show).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Client could not be deleted' }),
      ),
    );
    expect(
      screen.getByRole('heading', { name: 'Delete Northstar Studio?' }),
    ).toBeVisible();

    await user.click(
      screen.getByRole('button', { name: 'Permanently delete client' }),
    );
    await vi.waitFor(() => expect(mocks.deleteClient).toHaveBeenCalledTimes(2));
    expect(mocks.navigate).toHaveBeenCalledOnce();
  });
});
