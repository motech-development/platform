import { BreezeProvider } from '@motech-development/breeze-ui';
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthenticationLoading } from './AuthenticationLoading';
import type { RouterAuthentication } from './router';

const mocks = vi.hoisted(() => ({
  routeLoading: false,
}));

vi.mock('@tanstack/react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-router')>()),
  useRouterState: () => mocks.routeLoading,
}));

function loadingBoundary(
  authentication: RouterAuthentication,
  children: ReactNode = <p>Resolved route</p>,
) {
  return (
    <BreezeProvider locale="en-GB">
      <AuthenticationLoading authentication={authentication}>
        {children}
      </AuthenticationLoading>
    </BreezeProvider>
  );
}

function pendingAuthentication() {
  let redirectPending = false;
  let settle: () => void = () => undefined;
  const settled = new Promise<void>((resolve) => {
    settle = resolve;
  });

  return {
    authentication: {
      isRedirectPending: () => redirectPending,
      waitUntilReady: vi.fn(),
      waitUntilSettled: () => settled,
    } satisfies RouterAuthentication,
    markRedirectPending: () => {
      redirectPending = true;
    },
    settle,
  };
}

describe('AuthenticationLoading', () => {
  beforeEach(() => {
    mocks.routeLoading = false;
  });

  it('covers authentication preparation and the destination route load', async () => {
    const { authentication, settle } = pendingAuthentication();
    const view = render(loadingBoundary(authentication));

    expect(
      screen.getByRole('status', { name: 'Loading Accounts' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveAttribute(
      'data-document-background',
      'shell',
    );
    expect(screen.queryByText('Resolved route')).not.toBeInTheDocument();

    mocks.routeLoading = true;
    settle();
    view.rerender(loadingBoundary(authentication));

    expect(
      screen.getByRole('status', { name: 'Loading Accounts' }),
    ).toBeInTheDocument();
    expect(screen.queryByText('Resolved route')).not.toBeInTheDocument();

    mocks.routeLoading = false;
    view.rerender(loadingBoundary(authentication));

    expect(await screen.findByText('Resolved route')).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('does not replace settled routes during later navigation', async () => {
    const authentication = {
      isRedirectPending: () => false,
      waitUntilReady: vi.fn(),
      waitUntilSettled: () => Promise.resolve(),
    } satisfies RouterAuthentication;
    const view = render(loadingBoundary(authentication));

    expect(await screen.findByText('Resolved route')).toBeInTheDocument();

    mocks.routeLoading = true;
    view.rerender(loadingBoundary(authentication));

    expect(screen.getByText('Resolved route')).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('does not reveal a protected fallback while a browser redirect is pending', () => {
    const { authentication, markRedirectPending, settle } =
      pendingAuthentication();

    mocks.routeLoading = true;
    const view = render(loadingBoundary(authentication));

    markRedirectPending();
    settle();
    mocks.routeLoading = false;
    view.rerender(loadingBoundary(authentication));

    expect(
      screen.getByRole('status', { name: 'Loading Accounts' }),
    ).toBeInTheDocument();
    expect(screen.queryByText('Resolved route')).not.toBeInTheDocument();
  });

  it('covers a browser redirect that starts after the initial route settles', async () => {
    const { authentication, markRedirectPending, settle } =
      pendingAuthentication();
    const view = render(loadingBoundary(authentication));

    settle();
    expect(await screen.findByText('Resolved route')).toBeInTheDocument();

    markRedirectPending();
    view.rerender(loadingBoundary(authentication));

    expect(
      screen.getByRole('status', { name: 'Loading Accounts' }),
    ).toBeInTheDocument();
    expect(screen.queryByText('Resolved route')).not.toBeInTheDocument();
  });
});
