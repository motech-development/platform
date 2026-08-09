import { BreezeProvider } from '@motech-development/breeze-ui';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  AccountsPending,
  PublicRouteNotFound,
  RouteError,
} from './-RouteState';

const mocks = vi.hoisted(() => ({
  captureRouteFailure: vi.fn(),
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
