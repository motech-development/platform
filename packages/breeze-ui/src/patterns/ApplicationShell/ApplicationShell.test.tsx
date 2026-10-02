import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentProps } from 'react';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import { BreezeProvider } from '../../provider/BreezeProvider';
import {
  ApplicationShell,
  type ApplicationShellProps,
} from './ApplicationShell';

interface Destination {
  href: string;
  id: string;
  label: string;
}

const destinations: Destination[] = [
  { href: '/overview', id: 'overview', label: 'Overview' },
  { href: '/activity', id: 'activity', label: 'Activity' },
];

const getItem = (item: Destination) => item;

expectTypeOf<ApplicationShellProps<Destination>>().not.toHaveProperty(
  'className',
);
expectTypeOf<ApplicationShellProps<Destination>>().not.toHaveProperty('style');
expectTypeOf<ApplicationShellProps<Destination>>().not.toHaveProperty(
  'loading',
);
expectTypeOf<{
  label: string;
  onAction: () => void;
}>().not.toExtend<ApplicationShellProps<Destination>['action']>();

function renderShell(
  router: ComponentProps<typeof BreezeProvider>['router'] = undefined,
  children: ApplicationShellProps<Destination>['children'] = null,
  action: ApplicationShellProps<Destination>['action'] = {
    icon: 'add',
    label: 'Create transaction',
    onAction: vi.fn(),
  },
) {
  return render(
    <BreezeProvider locale="en-GB" router={router}>
      <ApplicationShell
        account={<button type="button">Account</button>}
        action={action}
        brand={<span>Motech</span>}
        context={<button type="button">Company</button>}
        currentItem="overview"
        getItem={getItem}
        items={destinations}
        notifications={<button type="button">Notifications</button>}
      >
        {children}
      </ApplicationShell>
    </BreezeProvider>,
  );
}

describe('ApplicationShell', () => {
  it('renders the supplied chrome slots and marks the current destination', () => {
    const { container } = renderShell();

    expect(screen.getByText('Motech')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Company' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Notifications' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Account' })).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();

    const currentLinks = container.querySelectorAll('a[aria-current="page"]');
    expect(currentLinks).toHaveLength(2);
    expect(
      Array.from(currentLinks).every(
        (link) => link.getAttribute('href') === '/overview',
      ),
    ).toBe(true);
  });

  it('routes section links with the navigation transition type', async () => {
    const navigate = vi.fn();
    const { container } = renderShell({ navigate });
    const activityLink = container.querySelector<HTMLAnchorElement>(
      'a[href="/activity"]',
    );

    if (!activityLink) throw new Error('Missing Activity destination link.');

    await userEvent.click(activityLink);

    expect(navigate).toHaveBeenCalledExactlyOnceWith('/activity', {
      transitionTypes: ['nav'],
    });
  });

  it('puts the skip link first and moves focus into its shell-owned main', async () => {
    const { container } = renderShell();
    const firstFocusable = container.querySelector(
      'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const skipLink = screen.getByRole('link', { name: 'Skip to main content' });
    const main = screen.getByRole('main');

    expect(firstFocusable).toBe(skipLink);
    expect(skipLink).toHaveAttribute('href', `#${main.id}`);

    await userEvent.click(skipLink);

    expect(document.activeElement).toBe(main);
  });

  it('keeps the fixed mobile action present when page content is empty', () => {
    renderShell();

    expect(
      screen.getByRole('button', { name: 'Create transaction' }),
    ).toBeInTheDocument();
  });

  it('activates the icon-only fixed action through its accessible label', async () => {
    const onAction = vi.fn();
    renderShell(undefined, null, {
      icon: 'add',
      label: 'Create transaction',
      onAction,
    });
    const action = screen.getByRole('button', { name: 'Create transaction' });

    await userEvent.click(action);

    expect(action.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    expect(onAction).toHaveBeenCalledExactlyOnceWith();
  });

  it('generates a unique main target for each shell', () => {
    const { container } = render(
      <BreezeProvider locale="en-GB">
        <ApplicationShell
          account={null}
          action={{ icon: 'add', label: 'Create first', onAction: vi.fn() }}
          brand="First"
          context={null}
          currentItem="overview"
          getItem={getItem}
          items={destinations}
          notifications={null}
        >
          First page
        </ApplicationShell>
        <ApplicationShell
          account={null}
          action={{ icon: 'add', label: 'Create second', onAction: vi.fn() }}
          brand="Second"
          context={null}
          currentItem="overview"
          getItem={getItem}
          items={destinations}
          notifications={null}
        >
          Second page
        </ApplicationShell>
      </BreezeProvider>,
    );
    const mainIds = Array.from(container.querySelectorAll('main')).map(
      (main) => main.id,
    );

    expect(new Set(mainIds).size).toBe(2);
  });

  it('leaves modified and external navigation to the browser', () => {
    const navigate = vi.fn();
    const { container, rerender } = renderShell({ navigate });
    const modifiedLink = container.querySelector<HTMLAnchorElement>(
      'a[href="/activity"]',
    );

    if (!modifiedLink) throw new Error('Missing Activity destination link.');

    const modifiedClick = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      ctrlKey: true,
    });
    modifiedLink.dispatchEvent(modifiedClick);
    expect(modifiedClick.defaultPrevented).toBe(false);

    rerender(
      <BreezeProvider locale="en-GB" router={{ navigate }}>
        <ApplicationShell
          account={null}
          action={{
            icon: 'add',
            label: 'Create transaction',
            onAction: vi.fn(),
          }}
          brand="Motech"
          context={null}
          currentItem="overview"
          getItem={(item) => ({
            ...item,
            href: 'https://example.test/activity',
          })}
          items={destinations}
          notifications={null}
        >
          null
        </ApplicationShell>
      </BreezeProvider>,
    );
    const externalLink = container.querySelector<HTMLAnchorElement>(
      'a[href="https://example.test/activity"]',
    );

    if (!externalLink) throw new Error('Missing external destination link.');

    const externalClick = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });
    externalLink.dispatchEvent(externalClick);

    expect(externalClick.defaultPrevented).toBe(false);
    expect(navigate).not.toHaveBeenCalled();
  });
});
