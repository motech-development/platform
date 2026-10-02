import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentProps } from 'react';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import { BreezeProvider } from '../../provider/BreezeProvider';
import { Link, type LinkProps, type LinkVariant } from './Link';

expectTypeOf<LinkProps>().not.toHaveProperty('className');
expectTypeOf<LinkProps>().not.toHaveProperty('style');
expectTypeOf<LinkProps>().not.toHaveProperty('loading');
expectTypeOf<LinkVariant>().toEqualTypeOf<'default' | 'subtle'>();

function renderLink(
  router: ComponentProps<typeof BreezeProvider>['router'] = undefined,
  children = <Link href="/accounts">Accounts</Link>,
) {
  return render(
    <BreezeProvider locale="en-GB" router={router}>
      {children}
    </BreezeProvider>,
  );
}

describe('Link', () => {
  it('renders a native anchor with its declared link attributes', () => {
    renderLink(
      undefined,
      <Link
        aria-label="Read the ledger"
        download="ledger.csv"
        href="/ledger.csv"
        hrefLang="en-GB"
        rel="external"
        target="_blank"
        title="Download ledger"
        variant="subtle"
      >
        Ledger
      </Link>,
    );

    const link = screen.getByRole('link', { name: 'Read the ledger' });
    expect(link).toHaveAttribute('href', '/ledger.csv');
    expect(link).toHaveAttribute('download', 'ledger.csv');
    expect(link).toHaveAttribute('hreflang', 'en-GB');
    expect(link).toHaveAttribute('rel', 'external');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('title', 'Download ledger');
    expect(link).toHaveClass('breeze:underline');
  });

  it('delegates opted-in same-origin navigation and its transition types', async () => {
    const navigate = vi.fn();
    renderLink(
      { navigate },
      <Link href="/accounts/transactions" transitionTypes={['nav', 'list']}>
        Transactions
      </Link>,
    );

    const link = screen.getByRole('link', { name: 'Transactions' });
    await userEvent.click(link);

    expect(navigate).toHaveBeenCalledExactlyOnceWith('/accounts/transactions', {
      transitionTypes: ['nav', 'list'],
    });
    expect(link).toHaveAttribute('href', '/accounts/transactions');
  });

  it('preserves the one-argument router contract without opting into motion', async () => {
    const navigate = vi.fn((href: string) => href);
    renderLink({ navigate }, <Link href="/accounts">Accounts</Link>);

    await userEvent.click(screen.getByRole('link', { name: 'Accounts' }));

    expect(navigate).toHaveBeenCalledTimes(1);
    expect(navigate.mock.calls[0]?.[0]).toBe('/accounts');
  });

  it.each([
    { expected: '/accounts/transactions/accounts', href: 'accounts' },
    { expected: '/accounts/reports', href: '../reports' },
    { expected: '/accounts/transactions/?page=2', href: '?page=2' },
    { expected: '/ledger?year=2026', href: '/ledger?year=2026' },
  ])(
    'routes $href to the destination the browser resolves',
    async ({ expected, href }) => {
      const navigate = vi.fn();
      const originalUrl = window.location.href;

      window.history.replaceState(null, '', '/accounts/transactions/');

      try {
        renderLink({ navigate }, <Link href={href}>Go</Link>);

        await userEvent.click(screen.getByRole('link', { name: 'Go' }));

        expect(navigate).toHaveBeenCalledExactlyOnceWith(expected, {
          transitionTypes: [],
        });
      } finally {
        window.history.replaceState(null, '', originalUrl);
      }
    },
  );

  it.each(['altKey', 'ctrlKey', 'metaKey', 'shiftKey'] as const)(
    'leaves a click with %s to the browser when a router is configured',
    (modifier) => {
      const navigate = vi.fn();
      renderLink({ navigate });

      const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        [modifier]: true,
      });
      screen.getByRole('link', { name: 'Accounts' }).dispatchEvent(event);

      expect(event.defaultPrevented).toBe(false);
      expect(navigate).not.toHaveBeenCalled();
    },
  );

  it.each([
    {
      description: 'external origins',
      download: undefined,
      href: 'https://example.test/accounts',
      target: undefined,
    },
    {
      description: 'non-http protocols',
      download: undefined,
      href: 'mailto:accounts@example.test',
      target: undefined,
    },
    {
      description: 'download with an empty filename',
      download: '',
      href: '/ledger.csv',
      target: undefined,
    },
    {
      description: 'alternate targets',
      download: undefined,
      href: '/accounts',
      target: '_blank',
    },
    {
      description: 'fragments',
      download: undefined,
      href: '#transactions',
      target: undefined,
    },
    {
      description: 'paths with a fragment',
      download: undefined,
      href: '/accounts#totals',
      target: undefined,
    },
    {
      description: 'paths with an empty fragment',
      download: undefined,
      href: '/accounts#',
      target: undefined,
    },
  ])('leaves $description to the browser', ({ download, href, target }) => {
    const navigate = vi.fn();
    renderLink(
      { navigate },
      <Link download={download} href={href} target={target}>
        Go
      </Link>,
    );

    const link = screen.getByRole('link', { name: 'Go' });
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    link.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);
    expect(navigate).not.toHaveBeenCalled();
  });

  it('leaves a missing router and browser-modified clicks native', () => {
    const navigate = vi.fn();
    const { rerender } = renderLink(
      undefined,
      <Link href="/accounts">Accounts</Link>,
    );

    const nativeEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      ctrlKey: true,
    });
    screen.getByRole('link', { name: 'Accounts' }).dispatchEvent(nativeEvent);
    expect(nativeEvent.defaultPrevented).toBe(false);

    rerender(
      <BreezeProvider locale="en-GB" router={{ navigate }}>
        <Link href="/accounts">Accounts</Link>
      </BreezeProvider>,
    );
    const middleClick = new MouseEvent('click', {
      bubbles: true,
      button: 1,
      cancelable: true,
    });
    screen.getByRole('link', { name: 'Accounts' }).dispatchEvent(middleClick);

    expect(middleClick.defaultPrevented).toBe(false);
    expect(navigate).not.toHaveBeenCalled();
  });

  it('honours a caller cancellation before routing', () => {
    const navigate = vi.fn();
    renderLink(
      { navigate },
      <div onClickCapture={(event) => event.preventDefault()}>
        <Link href="/accounts">Accounts</Link>
      </div>,
    );
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    screen.getByRole('link', { name: 'Accounts' }).dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    expect(navigate).not.toHaveBeenCalled();
  });

  it('respects a document base target when no anchor target is declared', () => {
    const navigate = vi.fn();
    const base = document.createElement('base');
    base.target = '_blank';
    document.head.append(base);

    try {
      renderLink({ navigate });
      const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      });
      screen.getByRole('link', { name: 'Accounts' }).dispatchEvent(event);

      expect(event.defaultPrevented).toBe(false);
      expect(navigate).not.toHaveBeenCalled();
    } finally {
      base.remove();
    }
  });
});
