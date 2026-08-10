import { BreezeProvider } from '@motech-development/breeze-ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
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

describe('AccountsPending', () => {
  it.each([
    ['/my-companies', 'My companies'],
    ['/my-companies/accounts/company-id', 'Accounts'],
    ['/my-companies/accounts/company-id/record-transaction', 'Accounts'],
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

  it.each([
    ['/my-companies/clients/company-id/add-client', 'Add client'],
    [
      '/my-companies/clients/company-id/update-details/client-id',
      'Edit client',
    ],
  ])('keeps the client drawer visible while %s loads', (pathname, title) => {
    renderPending(pathname);

    expect(screen.getByRole('dialog', { name: title })).toBeInTheDocument();
    expect(
      screen.getByRole('status', { name: 'Loading client details' }),
    ).toHaveAttribute('aria-busy', 'true');
  });

  it('closes a pending client drawer to its safe parent', async () => {
    const user = userEvent.setup();
    renderPending('/my-companies/clients/company-id/add-client');

    await user.click(screen.getByRole('button', { name: 'Close' }));

    expect(mocks.navigate).toHaveBeenCalledWith({
      params: { companyId: 'company-id' },
      to: '/my-companies/clients/$companyId',
    });
  });

  it('closes the pending enrolment drawer to its safe parent', async () => {
    const user = userEvent.setup();
    renderPending('/my-companies/add-company');

    await user.click(screen.getByRole('button', { name: 'Close' }));

    expect(mocks.navigate).toHaveBeenCalledWith({ to: '/my-companies' });
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
});
