import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { BreezeProvider } from '@motech-development/breeze-ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  AccountsPending,
  PublicRouteNotFound,
  RouteError,
} from './-RouteState';

const mocks = vi.hoisted(() => ({
  captureRouteFailure: vi.fn(),
  navigate: vi.fn().mockResolvedValue(undefined),
  pathname: '/my-companies',
}));

vi.mock('../observability', () => ({
  captureRouteFailure: mocks.captureRouteFailure,
}));

vi.mock('@motech-development/breeze-ui/icons', async (importOriginal) => ({
  ...(await importOriginal<
    typeof import('@motech-development/breeze-ui/icons')
  >()),
  AddIcon: () => <span aria-hidden="true">+</span>,
  ArrowLeftIcon: () => <span aria-hidden="true">←</span>,
}));

vi.mock('@tanstack/react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-router')>()),
  useLocation: () => ({
    href: mocks.pathname,
    pathname: mocks.pathname,
  }),
  useNavigate: () => mocks.navigate,
}));

function renderPending(pathname: string) {
  mocks.pathname = pathname;

  return render(
    <BreezeProvider locale="en-GB">
      <AccountsPending />
    </BreezeProvider>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.navigate.mockResolvedValue(undefined);
});

describe('AccountsPending', () => {
  it.each([
    ['/my-companies', 'My companies'],
    ['/my-companies/accounts/company-id', 'Transactions'],
    [
      '/my-companies/accounts/company-id/pending-transactions',
      'Pending transactions',
    ],
    [
      '/my-companies/accounts/company-id/pending-transactions/record-transaction',
      'Pending transactions',
    ],
    [
      '/my-companies/accounts/company-id/pending-transactions/view-transaction/transaction-id',
      'Pending transactions',
    ],
    ['/my-companies/accounts/company-id/record-transaction', 'Transactions'],
    [
      '/my-companies/accounts/company-id/view-transaction/transaction-id',
      'Transactions',
    ],
    ['/my-companies/dashboard/company-id', ''],
    ['/my-companies/clients/company-id', 'Clients'],
    ['/my-companies/clients/company-id/add-client', 'Clients'],
    ['/my-companies/clients/company-id/update-details/client-id', 'Clients'],
    ['/my-companies/update-details/company-id', 'Company details'],
    ['/my-companies/settings/company-id', 'Settings'],
  ])('keeps the %s page title stable while loading', (pathname, title) => {
    renderPending(pathname);

    expect(
      screen.getByRole('heading', { level: 1, name: title }),
    ).toBeInTheDocument();
  });

  it('keeps the Pending Transactions back action visible while loading', () => {
    renderPending('/my-companies/accounts/company-id/pending-transactions');

    expect(screen.getByRole('link', { name: 'Back' })).toHaveAttribute(
      'href',
      '/my-companies/accounts/company-id',
    );
  });

  it('uses the safe companies route when a Pending URL has no company identity', () => {
    renderPending('/my-companies/accounts//pending-transactions');

    expect(screen.getByRole('link', { name: 'Back' })).toHaveAttribute(
      'href',
      '/my-companies',
    );
  });

  it('announces the Pending Transactions load and preserves its record drawer context', () => {
    renderPending(
      '/my-companies/accounts/company-id/pending-transactions/record-transaction',
    );

    expect(
      screen.getByRole('status', { name: 'Loading Pending Transactions' }),
    ).toHaveAttribute('aria-busy', 'true');
    expect(
      screen.getByRole('dialog', { name: 'Record transaction' }),
    ).toBeVisible();
  });

  it.each([
    '/my-companies/accounts/company-id/view-transaction/transaction-id',
    '/my-companies/accounts/company-id/pending-transactions/view-transaction/transaction-id',
  ])('preserves the edit drawer context while %s loads', (pathname) => {
    renderPending(pathname);

    expect(
      screen.getByRole('dialog', { name: 'Edit transaction' }),
    ).toBeVisible();
    expect(
      screen.getByRole('status', { name: 'Loading transaction form' }),
    ).toBeVisible();
  });

  it.each([
    ['/my-companies/update-details/company-id', 'Loading company details'],
    ['/my-companies/settings/company-id', 'Loading settings'],
  ])('labels the %s form skeleton while loading', (pathname, label) => {
    renderPending(pathname);

    expect(screen.getByRole('status', { name: label })).toHaveAttribute(
      'aria-busy',
      'true',
    );
  });

  it('keeps the enrolment drawer visible while its route loads', () => {
    renderPending('/my-companies/add-company');

    expect(
      screen.getByRole('dialog', { name: 'Add company' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Company details')).toBeInTheDocument();
    expect(screen.getByText('Bank account')).toBeInTheDocument();
    expect(screen.getByText('Address')).toBeInTheDocument();
    expect(screen.getByText('Contact details')).toBeInTheDocument();
  });

  it('keeps client creation available while the collection route loads', async () => {
    const user = userEvent.setup();

    renderPending('/my-companies/clients/company-id');

    await user.click(screen.getByRole('button', { name: 'Add a new client' }));
    expect(mocks.navigate).toHaveBeenCalledWith({
      params: { companyId: 'company-id' },
      to: '/my-companies/clients/$companyId/add-client',
    });
  });

  it.each([
    [
      '/my-companies/clients/company-id/add-client',
      'Add client',
      'Details for a new client.',
    ],
    [
      '/my-companies/clients/company-id/update-details/client-id',
      'Edit client',
      'Keep this client’s details up to date.',
    ],
  ])(
    'keeps the client drawer visible while %s loads',
    (pathname, title, description) => {
      renderPending(pathname);

      expect(screen.getByRole('dialog', { name: title })).toBeInTheDocument();
      expect(screen.getByText(description)).toBeVisible();
      expect(
        screen.getByRole('status', { name: 'Loading client details' }),
      ).toHaveAttribute('aria-busy', 'true');
    },
  );

  it.each([
    '/my-companies/clients/company-id/add-client',
    '/my-companies/clients/company-id/update-details/client-id',
  ])(
    'closes the pending client drawer at %s to its safe parent',
    async (path) => {
      const user = userEvent.setup();
      renderPending(path);

      await user.click(screen.getByRole('button', { name: 'Close' }));

      expect(mocks.navigate).toHaveBeenCalledWith({
        params: { companyId: 'company-id' },
        to: '/my-companies/clients/$companyId',
      });
    },
  );

  it('closes the pending enrolment drawer to its safe parent', async () => {
    const user = userEvent.setup();
    renderPending('/my-companies/add-company');

    await user.click(screen.getByRole('button', { name: 'Close' }));

    expect(mocks.navigate).toHaveBeenCalledWith({ to: '/my-companies' });
  });

  it('keeps a rejected client-drawer close navigation recoverable', async () => {
    mocks.navigate.mockRejectedValueOnce(new Error('Navigation failed'));
    renderPending('/my-companies/clients/company-id/add-client');

    await userEvent.click(screen.getByRole('button', { name: 'Close' }));

    expect(screen.getByRole('dialog', { name: 'Add client' })).toBeVisible();
  });

  it('falls back to the authentication loading panel for an unknown pending route', () => {
    renderPending('/unexpected');

    expect(screen.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
    expect(
      screen.getByRole('button', { name: 'Sign in securely' }),
    ).toHaveAttribute('aria-busy', 'true');
  });

  it('uses a form-shaped company-details loading state', () => {
    renderPending('/my-companies/update-details/company-id');

    expect(screen.getAllByText('Company details')).toHaveLength(2);
    expect(screen.queryByText('Identity')).not.toBeInTheDocument();
    expect(screen.getByText('Address')).toBeInTheDocument();
    expect(screen.getByText('Contact details')).toBeInTheDocument();
    expect(screen.getByText('Bank account')).toBeInTheDocument();
  });

  it('uses a row-shaped settings loading state', () => {
    renderPending('/my-companies/settings/company-id');

    expect(screen.getByText('Expense categories')).toBeInTheDocument();
    expect(screen.getByText('Financial year end')).toBeInTheDocument();
    expect(screen.getByText('VAT settings')).toBeInTheDocument();
  });
});

describe('PublicRouteNotFound', () => {
  it('keeps the public fallback inside the main landmark', () => {
    render(
      <BreezeProvider locale="en-GB">
        <PublicRouteNotFound />
      </BreezeProvider>,
    );

    expect(screen.getByRole('main')).toContainElement(
      screen.getByRole('heading', { name: 'Page not found' }),
    );
  });
});

describe('RouteError', () => {
  it('reports the original route failure while providing recovery', () => {
    const error = new Error('Route rendering failed');

    render(
      <BreezeProvider locale="en-GB">
        <RouteError error={error} reset={vi.fn()} />
      </BreezeProvider>,
    );

    expect(mocks.captureRouteFailure).toHaveBeenCalledExactlyOnceWith(error);
    expect(
      screen.getByRole('button', { name: 'Try again' }),
    ).toBeInTheDocument();
  });

  it('leaves GraphQL failures with Apollo telemetry and still provides recovery', async () => {
    const reset = vi.fn();
    const error = new CombinedGraphQLErrors({
      errors: [{ message: 'Resolver failed' }],
    });

    render(
      <BreezeProvider locale="en-GB">
        <RouteError error={error} reset={reset} />
      </BreezeProvider>,
    );

    expect(mocks.captureRouteFailure).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(reset).toHaveBeenCalledOnce();
  });
});
