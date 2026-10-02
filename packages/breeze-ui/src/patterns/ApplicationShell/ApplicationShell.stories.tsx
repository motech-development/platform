import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentType } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import type { RouterNavigationOptions } from '../../provider/BreezeContext';
import { BreezeProvider } from '../../provider/BreezeProvider';
import { PageHeader } from '../PageHeader/PageHeader';
import type {
  ApplicationShellNavigationItem,
  ApplicationShellProps,
} from './ApplicationShell';
import { ApplicationShell } from './ApplicationShell';

const sections = [
  { href: '/overview', icon: 'overview', id: 'overview', label: 'Overview' },
  { href: '/projects', icon: 'building', id: 'projects', label: 'Projects' },
  { href: '/activity', icon: 'clock', id: 'activity', label: 'Activity' },
  { href: '/settings', icon: 'settings', id: 'settings', label: 'Settings' },
] satisfies ApplicationShellNavigationItem[];

const meta = {
  component: ApplicationShell as ComponentType<
    ApplicationShellProps<ApplicationShellNavigationItem>
  >,
  parameters: { layout: 'fullscreen' },
  title: 'Patterns/ApplicationShell',
} satisfies Meta<ApplicationShellProps<ApplicationShellNavigationItem>>;

export default meta;
type Story = Omit<StoryObj<typeof meta>, 'args'>;

function ShellExample() {
  const [currentHref, setCurrentHref] = useState('/overview');
  const [transitionTypes, setTransitionTypes] = useState('none');
  const [createdCount, setCreatedCount] = useState(0);
  const currentSection = sections.find(({ href }) => href === currentHref);
  const router = useMemo(
    () => ({
      navigate: (href: string, options: RouterNavigationOptions) => {
        setCurrentHref(href);
        setTransitionTypes(options.transitionTypes.join(', ') || 'none');
      },
    }),
    [],
  );

  useEffect(() => {
    const baseTarget = document.querySelector<HTMLBaseElement>('base[target]');
    const originalBaseTarget = baseTarget?.getAttribute('target');

    baseTarget?.setAttribute('target', '_self');

    return () => {
      if (!baseTarget) return;

      if (originalBaseTarget === null) {
        baseTarget.removeAttribute('target');
      } else if (originalBaseTarget !== undefined) {
        baseTarget.setAttribute('target', originalBaseTarget);
      }
    };
  }, []);

  if (!currentSection) {
    throw new Error(`Missing section for route "${currentHref}".`);
  }

  return (
    <BreezeProvider locale="en-GB" router={router}>
      <ApplicationShell
        account={<button type="button">Jordan Lee</button>}
        action={{
          icon: 'add',
          label: 'Create item',
          onAction: () => setCreatedCount((count) => count + 1),
        }}
        brand={<strong>Northstar</strong>}
        context={<span>Sample workspace</span>}
        currentItem={currentSection.id}
        getItem={(item) => ({
          href: item.href,
          icon: item.icon,
          id: item.id,
          label: item.label,
        })}
        items={sections}
        notifications={<button type="button">Notifications</button>}
      >
        <div className="breeze-story-stack" data-testid="shell-content">
          <PageHeader
            description="Shared navigation around application-owned page content."
            title={currentSection.label}
          />
          <p role="status" data-testid="route-status">
            {`${currentHref} · ${transitionTypes}`}
          </p>
          <p>Created items: {createdCount}</p>
          <section aria-label="Recent updates" style={{ minHeight: '48rem' }}>
            <h2>Recent updates</h2>
            <ul>
              <li>Planning notes were updated this morning.</li>
              <li>A shared draft is ready for review.</li>
              <li>The next project milestone is approaching.</li>
            </ul>
          </section>
          <p data-testid="last-content">End of the page content.</p>
        </div>
      </ApplicationShell>
    </BreezeProvider>
  );
}

function getVisibleNavigation(canvasElement: HTMLElement) {
  const visibleNavigations = within(canvasElement).getAllByRole('navigation', {
    name: 'Primary navigation',
  });

  if (visibleNavigations.length !== 1) {
    throw new Error('Expected one visible ApplicationShell navigation.');
  }

  return visibleNavigations[0];
}

async function expectCurrentMarker(navigation: HTMLElement): Promise<void> {
  const markers = navigation.querySelectorAll(
    '[data-breeze-transition-name="breeze-navmark"]',
  );
  const currentLinks = navigation.querySelectorAll<HTMLAnchorElement>(
    'a[aria-current="page"]',
  );

  await expect(markers).toHaveLength(1);
  await expect(currentLinks).toHaveLength(1);

  const marker = currentLinks[0]?.querySelector(
    '[data-breeze-transition-name="breeze-navmark"]',
  );

  if (!marker) {
    throw new Error('Missing the current section navigation marker.');
  }

  const markerRect = marker.getBoundingClientRect();

  await expect(marker).toHaveAttribute('data-breeze-transition-types', 'nav');
  await expect(markerRect.width).toBeGreaterThan(0);
  await expect(markerRect.height).toBe(2);
}

function getBottomNavigationSides(navigation: HTMLElement) {
  const sides = navigation.querySelectorAll<HTMLElement>(':scope > div > div');

  if (sides.length !== 2) {
    throw new Error('Expected two side regions around the mobile action.');
  }

  return { leading: sides[0], trailing: sides[1] };
}

/** Application-owned topbar slots, section navigation and fixed mobile action. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    if (!('__vitest_browser__' in globalThis)) return;

    const browserContext = await import('vitest/browser');
    const document = canvasElement.ownerDocument;
    const view = document.defaultView;

    if (!view) throw new Error('Missing ApplicationShell story window.');

    const originalViewport = {
      height: view.innerHeight,
      width: view.innerWidth,
    };
    const canvas = within(canvasElement);

    try {
      await userEvent.keyboard('{Tab}');
      const skipLink = canvas.getByRole('link', {
        name: 'Skip to main content',
      });
      await expect(skipLink).toHaveFocus();
      await expect(skipLink).toBeVisible();
      await expect(skipLink.getBoundingClientRect().width).toBeGreaterThan(1);
      await expect(skipLink.getBoundingClientRect().height).toBeGreaterThan(1);
      await userEvent.keyboard('{Enter}');
      await expect(canvas.getByRole('main')).toHaveFocus();

      const verifyViewport = async (width: number, height: number) => {
        await browserContext.page.viewport(width, height);
        await expect(view.innerWidth).toBe(width);

        const navigation = getVisibleNavigation(canvasElement);
        await expectCurrentMarker(navigation);
        await expect(view.getComputedStyle(navigation).position).toBe(
          width < 1181 ? 'fixed' : 'static',
        );

        if (width < 1181) {
          await expect(navigation.getBoundingClientRect().bottom).toBe(height);
        }

        await expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
          width,
        );

        if (width === 390) {
          const action = canvas.getByRole('button', { name: 'Create item' });
          const beforeAction = action.getBoundingClientRect();
          const beforeSides = getBottomNavigationSides(navigation);
          const beforeLeadingGap =
            beforeAction.left -
            beforeSides.leading.getBoundingClientRect().right;
          const beforeTrailingGap =
            beforeSides.trailing.getBoundingClientRect().left -
            beforeAction.right;

          await expect(
            Math.abs(beforeAction.left + beforeAction.width / 2 - width / 2),
          ).toBeLessThanOrEqual(1);
          await expect(beforeAction.width).toBe(beforeAction.height);
          await expect(beforeLeadingGap).toBeCloseTo(beforeTrailingGap, 1);

          await userEvent.click(
            within(navigation).getByRole('link', { name: 'Activity' }),
          );

          await expect(canvas.getByTestId('route-status')).toHaveTextContent(
            '/activity · nav',
          );

          const updatedNavigation = getVisibleNavigation(canvasElement);
          await expectCurrentMarker(updatedNavigation);
          await expect(
            within(updatedNavigation).getByRole('link', {
              current: 'page',
              name: 'Activity',
            }),
          ).toBeInTheDocument();

          const afterAction = action.getBoundingClientRect();
          const afterSides = getBottomNavigationSides(updatedNavigation);
          const afterLeadingGap =
            afterAction.left - afterSides.leading.getBoundingClientRect().right;
          const afterTrailingGap =
            afterSides.trailing.getBoundingClientRect().left -
            afterAction.right;

          await expect(afterAction.left).toBe(beforeAction.left);
          await expect(afterAction.top).toBe(beforeAction.top);
          await expect(afterAction.width).toBe(beforeAction.width);
          await expect(afterAction.height).toBe(beforeAction.height);
          await expect(afterLeadingGap).toBe(beforeLeadingGap);
          await expect(afterTrailingGap).toBe(beforeTrailingGap);

          await userEvent.click(action);
          await expect(
            canvas.getByText('Created items: 1'),
          ).toBeInTheDocument();

          await expect(
            Number.parseFloat(
              view.getComputedStyle(canvas.getByRole('main')).paddingBlockEnd,
            ),
          ).toBe(updatedNavigation.getBoundingClientRect().height);

          view.scrollTo(0, document.documentElement.scrollHeight);
          const lastContent = canvas.getByTestId('last-content');
          await expect(
            lastContent.getBoundingClientRect().bottom,
          ).toBeLessThanOrEqual(updatedNavigation.getBoundingClientRect().top);
          await expect(
            document.documentElement.scrollWidth,
          ).toBeLessThanOrEqual(width);
        }
      };

      await verifyViewport(1440, 900);
      await verifyViewport(1100, 900);
      await verifyViewport(390, 844);
    } finally {
      await browserContext.page.viewport(
        originalViewport.width,
        originalViewport.height,
      );
    }
  },
  render: () => <ShellExample />,
};
