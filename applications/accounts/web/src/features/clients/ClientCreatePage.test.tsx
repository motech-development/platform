import { BreezeProvider } from '@motech-development/breeze-ui';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { clientDetailsSchema } from './client';
import { ClientCreatePage } from './ClientCreatePage';

const mocks = vi.hoisted(() => ({
  blocker: { proceed: vi.fn(), reset: vi.fn(), status: 'idle' },
  createClient: vi.fn(),
  navigate: vi.fn(),
  toast: { show: vi.fn() },
}));

vi.mock('@apollo/client/react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@apollo/client/react')>()),
  useMutation: () => [mocks.createClient],
}));

vi.mock('@motech-development/breeze-ui', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@motech-development/breeze-ui')>()),
  useToast: () => mocks.toast,
}));

vi.mock('@tanstack/react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-router')>()),
  useBlocker: () => ({ ...mocks.blocker }),
  useNavigate: () => mocks.navigate,
}));

vi.mock('./ClientsPageContent', () => ({
  ClientsPageContent: () => <main>Clients</main>,
}));

function fillRequiredClientDetails() {
  const values = {
    'Address line 1': '48 Lumen Street',
    'Client name': 'Northstar Studio',
    'Email address': 'hello@northstar.studio',
    Postcode: 'm1 2ab',
    'Telephone number': '020 7946 0182',
    'Town or city': 'Manchester',
  };

  Object.entries(values).forEach(([label, value]) => {
    fireEvent.change(screen.getByLabelText(label), { target: { value } });
  });
}

describe('ClientCreatePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.blocker.status = 'idle';
    mocks.navigate.mockResolvedValue(undefined);
    mocks.createClient.mockResolvedValue({
      data: {
        createClient: {
          companyId: 'company-id',
          id: 'client-id',
          name: 'Northstar Studio',
        },
      },
    });
  });

  it('creates a normalised client and returns to the collection', async () => {
    const user = userEvent.setup();

    render(
      <BreezeProvider locale="en-GB">
        <ClientCreatePage companyId="company-id" />
      </BreezeProvider>,
    );

    expect(screen.getByText('Details for a new client.')).toBeVisible();
    fillRequiredClientDetails();
    await user.click(screen.getByRole('button', { name: 'Save client' }));

    await waitFor(() => expect(mocks.createClient).toHaveBeenCalledOnce());
    const mutation = mocks.createClient.mock.calls[0]?.[0] as unknown as {
      variables: { input: unknown };
    };
    const input = clientDetailsSchema.parse(mutation.variables.input);

    expect(input).toMatchObject({
      address: { line5: 'M1 2AB' },
      companyId: 'company-id',
      id: '',
      name: 'Northstar Studio',
    });
    expect(mocks.navigate).toHaveBeenCalledWith({
      params: { companyId: 'company-id' },
      to: '/my-companies/clients/$companyId',
    });
  });

  it('retains entered details after a failed mutation and allows retry', async () => {
    const user = userEvent.setup();
    mocks.createClient.mockRejectedValueOnce(new Error('Unavailable'));

    render(
      <BreezeProvider locale="en-GB">
        <ClientCreatePage companyId="company-id" />
      </BreezeProvider>,
    );

    fillRequiredClientDetails();
    await user.click(screen.getByRole('button', { name: 'Save client' }));

    await waitFor(() =>
      expect(mocks.toast.show).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Client could not be added' }),
      ),
    );
    expect(screen.getByLabelText('Client name')).toHaveValue(
      'Northstar Studio',
    );
    expect(mocks.navigate).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Save client' }));

    await waitFor(() => expect(mocks.createClient).toHaveBeenCalledTimes(2));
    expect(mocks.navigate).toHaveBeenCalledOnce();
  });

  it('falls back to the company collection when client-route navigation fails', async () => {
    const user = userEvent.setup();
    mocks.navigate.mockRejectedValueOnce(new Error('Route unavailable'));

    render(
      <BreezeProvider locale="en-GB">
        <ClientCreatePage companyId="company-id" />
      </BreezeProvider>,
    );

    fillRequiredClientDetails();
    await user.click(screen.getByRole('button', { name: 'Save client' }));

    await waitFor(() => expect(mocks.navigate).toHaveBeenCalledTimes(2));
    expect(mocks.navigate).toHaveBeenLastCalledWith({ to: '/my-companies' });
  });

  it('proceeds a blocked navigation once when changes are discarded', async () => {
    const user = userEvent.setup();
    mocks.blocker.status = 'blocked';

    render(
      <BreezeProvider locale="en-GB">
        <ClientCreatePage companyId="company-id" />
      </BreezeProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Discard changes' }));

    expect(mocks.blocker.proceed).toHaveBeenCalledOnce();
    expect(mocks.navigate).not.toHaveBeenCalled();
  });

  it('finishes a blocked company switch after pending creation succeeds', async () => {
    const user = userEvent.setup();
    let resolveCreation!: (value: {
      data: {
        createClient: {
          companyId: string;
          id: string;
          name: string;
        };
      };
    }) => void;
    mocks.createClient.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveCreation = resolve;
      }),
    );
    const view = render(
      <BreezeProvider locale="en-GB">
        <ClientCreatePage companyId="company-id" />
      </BreezeProvider>,
    );

    fillRequiredClientDetails();
    await user.click(screen.getByRole('button', { name: 'Save client' }));
    await waitFor(() => expect(mocks.createClient).toHaveBeenCalledOnce());

    mocks.blocker.status = 'blocked';
    view.rerender(
      <BreezeProvider locale="en-GB">
        <ClientCreatePage companyId="company-id" />
      </BreezeProvider>,
    );
    act(() => {
      resolveCreation({
        data: {
          createClient: {
            companyId: 'company-id',
            id: 'client-id',
            name: 'Northstar Studio',
          },
        },
      });
    });

    await waitFor(() => expect(mocks.blocker.proceed).toHaveBeenCalledOnce());
    expect(mocks.blocker.reset).not.toHaveBeenCalled();
    expect(mocks.navigate).not.toHaveBeenCalled();
  });
});
