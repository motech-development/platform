import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ReactNode, useMemo, useState } from 'react';
import { flushSync } from 'react-dom';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '../primitives/Button/Button';
import { Drawer } from '../primitives/Drawer/Drawer';
import { Link } from '../primitives/Link/Link';
import type { RouterNavigationOptions } from '../provider/BreezeContext';
import { BreezeProvider } from '../provider/BreezeProvider';
import {
  startViewTransition,
  useViewTransitionParticipant,
  type ViewTransitionType,
} from './view-transitions';

function MotionParticipant({
  children,
  hidden = false,
  name,
  participantRole,
  types,
}: Readonly<{
  children?: ReactNode;
  hidden?: boolean;
  name?: string;
  participantRole?: 'botnav' | 'navmark' | 'topbar' | 'topnav';
  types?: readonly ('nav' | 'mode' | 'list' | 'item' | 'expand')[];
}>) {
  const ref = useViewTransitionParticipant(
    participantRole
      ? { role: participantRole }
      : { name: name ?? 'accounts-page', types: types ?? ['nav'] },
  );

  return (
    <div hidden={hidden} ref={ref}>
      {children}
    </div>
  );
}

function TransitionExample() {
  const [location, setLocation] = useState('/accounts');
  const [commitReady, setCommitReady] = useState(false);
  const router = useMemo(
    () => ({
      navigate: (href: string, options: RouterNavigationOptions) =>
        startViewTransition(
          () => {
            // React 19.2.7 state commits must finish before the browser captures
            // the new view; a router adapter owns this boundary.
            flushSync(() => setLocation(href));
          },
          options.transitionTypes satisfies readonly ViewTransitionType[],
        ).then(() => setCommitReady(true)),
    }),
    [],
  );
  const pageTitle = location.endsWith('/activity') ? 'Activity' : 'Overview';

  return (
    <BreezeProvider locale="en-GB" router={router}>
      <div className="breeze-story-stack">
        <MotionParticipant participantRole="topbar">Accounts</MotionParticipant>
        <MotionParticipant participantRole="topnav">
          <nav aria-label="Account pages">
            <Link href="/accounts" target="_self" transitionTypes={['nav']}>
              Overview
            </Link>
            {' · '}
            <Link
              href="/accounts/activity"
              target="_self"
              transitionTypes={['nav', 'expand']}
            >
              Activity
            </Link>
            <MotionParticipant participantRole="navmark">
              Current tab
            </MotionParticipant>
          </nav>
        </MotionParticipant>
        <MotionParticipant name="accounts-page" types={['nav', 'mode']}>
          <main data-testid="page">
            <h1 data-testid="page-title">{pageTitle}</h1>
            {commitReady && <output>DOM commit ready</output>}
            <MotionParticipant name="activity-shared" types={['expand']}>
              Current account range
            </MotionParticipant>
          </main>
        </MotionParticipant>
        <MotionParticipant hidden name="accounts-page" types={['nav', 'mode']}>
          Responsive copy hidden at this viewport
        </MotionParticipant>
        <MotionParticipant participantRole="botnav">
          Bottom navigation
        </MotionParticipant>
        <Drawer title="Details" trigger="Open details">
          <MotionParticipant name="overlay-item" types={['item']}>
            Details content
          </MotionParticipant>
          <Button>Keep open</Button>
        </Drawer>
      </div>
    </BreezeProvider>
  );
}

const meta = {
  component: TransitionExample,
  title: 'Foundations/View transitions',
} satisfies Meta<typeof TransitionExample>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Typed names exist only during their declared transition. */
export const TypedParticipants: Story = {
  play: async ({ canvasElement }) => {
    const document = canvasElement.ownerDocument;
    const view = document.defaultView;
    if (!view) throw new Error('Missing browser window');
    const page = within(canvasElement);
    const body = within(document.body);
    const pageParticipant = page.getByTestId('page').parentElement;
    if (!pageParticipant)
      throw new Error('Missing page transition participant');

    await expect(typeof document.startViewTransition).toBe('function');
    await expect(typeof view.ViewTransition).toBe('function');
    await expect('types' in view.ViewTransition.prototype).toBe(true);
    await expect(
      view.CSS.supports('selector(:active-view-transition-type(nav))'),
    ).toBe(true);
    await expect(pageParticipant.style.viewTransitionName).toBe('');
    await expect(document.documentElement.hasAttribute('data-vt')).toBe(false);

    await userEvent.click(page.getByRole('button', { name: 'Open details' }));
    const dialog = await body.findByRole('dialog', { name: 'Details' });
    const overlayLayer = dialog.closest('[data-breeze-overlay]');
    await expect(pageParticipant).toHaveAttribute(
      'data-breeze-transition-enabled',
      'false',
    );
    await expect(body.getByText('Details content')).toHaveAttribute(
      'data-breeze-transition-enabled',
      'true',
    );
    await expect(view.getComputedStyle(overlayLayer!).viewTransitionName).toBe(
      'none',
    );
    await userEvent.click(
      within(dialog).getByRole('button', { name: 'Close' }),
    );
    await waitFor(async () => {
      await expect(body.queryByRole('dialog', { name: 'Details' })).toBeNull();
      await expect(pageParticipant).toHaveAttribute(
        'data-breeze-transition-enabled',
        'true',
      );
    });

    const originalStartDescriptor = Object.getOwnPropertyDescriptor(
      document,
      'startViewTransition',
    );
    const originalStart = document.startViewTransition.bind(document);
    const calls: Array<{
      committed: boolean;
      name: string;
      transition: ViewTransition;
      types: readonly string[];
    }> = [];

    Object.defineProperty(document, 'startViewTransition', {
      configurable: true,
      value: (options: StartViewTransitionOptions) => {
        const call = {
          committed: false,
          name: '',
          transition: undefined as unknown as ViewTransition,
          types: options.types ?? [],
        };
        const transition = originalStart({
          ...options,
          update: async () => {
            await options.update?.();
            call.committed =
              page.getByTestId('page-title').textContent === 'Activity';
            call.name =
              view.getComputedStyle(pageParticipant).viewTransitionName;
          },
        });
        call.transition = transition;
        calls.push(call);
        return transition;
      },
    });

    try {
      await userEvent.click(page.getByRole('link', { name: 'Activity' }));
      await expect(calls).toHaveLength(1);
      await waitFor(async () => {
        await expect(page.getByTestId('page-title')).toHaveTextContent(
          'Activity',
        );
        await expect(page.getByRole('status')).toHaveTextContent(
          'DOM commit ready',
        );
        await expect(calls).toHaveLength(1);
        await expect(calls[0]?.committed).toBe(true);
      });
      await expect(calls[0]?.types).toEqual(['nav', 'expand']);
      await expect(calls[0]?.name).toBe('accounts-page');
      await expect(calls[0]?.transition.ready).resolves.toBeUndefined();
      const oldRoot = view.getComputedStyle(
        document.documentElement,
        '::view-transition-old(root)',
      );
      const newRoot = view.getComputedStyle(
        document.documentElement,
        '::view-transition-new(root)',
      );
      const rootImagePair = view.getComputedStyle(
        document.documentElement,
        '::view-transition-image-pair(root)',
      );
      const navmarkGroup = view.getComputedStyle(
        document.documentElement,
        '::view-transition-group(breeze-navmark)',
      );
      const navmarkOld = view.getComputedStyle(
        document.documentElement,
        '::view-transition-old(breeze-navmark)',
      );
      const topbarOld = view.getComputedStyle(
        document.documentElement,
        '::view-transition-old(breeze-topbar)',
      );
      const topbarImagePair = view.getComputedStyle(
        document.documentElement,
        '::view-transition-image-pair(breeze-topbar)',
      );
      const navmarkImagePair = view.getComputedStyle(
        document.documentElement,
        '::view-transition-image-pair(breeze-navmark)',
      );
      const sharedOld = view.getComputedStyle(
        document.documentElement,
        '::view-transition-old(activity-shared)',
      );
      const sharedImagePair = view.getComputedStyle(
        document.documentElement,
        '::view-transition-image-pair(activity-shared)',
      );
      await expect(oldRoot.animationName).toBe('breeze-transition-fade-out');
      await expect(newRoot.animationName).toBe('breeze-transition-rise');
      await expect(rootImagePair.animationName).toBe('none');
      await expect(navmarkGroup.animationDuration).toBe('0.3s');
      await expect(navmarkOld.animationName).toBe('none');
      await expect(topbarOld.animationName).toBe('none');
      await expect(topbarImagePair.animationName).toBe('none');
      await expect(navmarkImagePair.animationName).toBe('none');
      await expect(sharedOld.animationName).toBe('breeze-transition-fade-out');
      await expect(sharedImagePair.animationName).toBe(
        'breeze-transition-blur',
      );

      const originalMatchMediaDescriptor = Object.getOwnPropertyDescriptor(
        view,
        'matchMedia',
      );
      const originalMatchMedia = view.matchMedia;
      Object.defineProperty(view, 'matchMedia', {
        configurable: true,
        value: (query: string) =>
          query === '(prefers-reduced-motion: reduce)'
            ? {
                addEventListener: () => undefined,
                matches: true,
                media: query,
                removeEventListener: () => undefined,
              }
            : originalMatchMedia.call(view, query),
      });

      try {
        await userEvent.click(page.getByRole('link', { name: 'Overview' }));
        await expect(page.getByTestId('page-title')).toHaveTextContent(
          'Overview',
        );
        await expect(calls).toHaveLength(1);
      } finally {
        if (originalMatchMediaDescriptor) {
          Object.defineProperty(
            view,
            'matchMedia',
            originalMatchMediaDescriptor,
          );
        } else {
          Reflect.deleteProperty(view, 'matchMedia');
        }
      }
    } finally {
      if (originalStartDescriptor) {
        Object.defineProperty(
          document,
          'startViewTransition',
          originalStartDescriptor,
        );
      } else {
        Reflect.deleteProperty(document, 'startViewTransition');
      }
    }
  },
  render: () => <TransitionExample />,
};
