import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '../Button/Button';
import { Dialog } from '../Dialog/Dialog';
import { Drawer } from '../Drawer/Drawer';
import { Toast, useToast } from './Toast';

function EnqueueExample() {
  const enqueue = useToast();

  return (
    <Button onAction={() => enqueue('Changes saved')}>Save changes</Button>
  );
}

const wrappedMessages = [
  'Changes saved successfully and your updates are ready to review.',
  'Your profile details were updated successfully and are now visible across your account.',
  'The invitation was sent successfully to the selected recipient and will expire soon.',
];

function WrappedToastContent() {
  const enqueue = useToast();

  return wrappedMessages.map((message) => (
    <Button key={message} onAction={() => enqueue(message)}>
      {message}
    </Button>
  ));
}

function ModalToastExample({ kind }: Readonly<{ kind: 'dialog' | 'drawer' }>) {
  const content = <EnqueueExample />;

  return kind === 'dialog' ? (
    <Dialog defaultOpen title="Confirm change" trigger="Open dialog">
      {content}
    </Dialog>
  ) : (
    <Drawer defaultOpen title="Confirm change" trigger="Open drawer">
      {content}
    </Drawer>
  );
}

const meta = {
  args: {
    children: 'Changes saved',
  },
  component: Toast,
  title: 'Feedback/Toast',
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

const desktopViewport = {
  options: {
    toastDesktop: {
      name: 'Toast desktop',
      styles: { height: '720px', width: '1280px' },
      type: 'desktop',
    },
  },
};

const desktopGlobals = { viewport: { value: 'toastDesktop' } };

const mobileViewport = {
  options: {
    toastMobile: {
      name: 'Toast mobile',
      styles: { height: '812px', width: '375px' },
      type: 'mobile',
    },
  },
};

const mobileGlobals = { viewport: { value: 'toastMobile' } };

const shortQueueViewport = {
  options: {
    toastShortQueue: {
      name: 'Toast short queue',
      styles: { height: '240px', width: '375px' },
      type: 'mobile',
    },
  },
};

const shortQueueGlobals = { viewport: { value: 'toastShortQueue' } };

const shortClippedViewport = {
  options: {
    toastShortClipped: {
      name: 'Toast short clipped',
      styles: { height: '120px', width: '375px' },
      type: 'mobile',
    },
  },
};

const shortClippedGlobals = { viewport: { value: 'toastShortClipped' } };

async function assertEnqueuedToast(
  canvasElement: HTMLElement,
  expectedWidth: number,
) {
  const document = canvasElement.ownerDocument;
  const window = document.defaultView;
  const page = within(document.body);
  if (!window) throw new Error('Missing story window.');

  await expect(window.innerWidth).toBe(expectedWidth);

  const trigger = page.getByRole('button', { name: 'Save changes' });
  trigger.focus();
  await userEvent.click(trigger);

  const toast = await page.findByRole('status', { name: 'Changes saved' });
  const expectedEnd = Math.max(
    window.innerWidth < 901 ? 16 : 28,
    (window.innerWidth - 1500) / 2 + 28,
  );

  await expect(toast).toHaveAttribute('aria-live', 'polite');
  await expect(document.querySelectorAll('[aria-live="polite"]')).toHaveLength(
    1,
  );
  await expect(toast).not.toHaveAttribute('tabindex');
  await expect(trigger).toHaveFocus();
  await waitFor(async () => {
    const bounds = toast.getBoundingClientRect();

    await expect(bounds.width).toBe(288);
    await expect(Math.round(bounds.top)).toBe(76);
    await expect(Math.round(window.innerWidth - bounds.right)).toBe(
      expectedEnd,
    );
  });

  await userEvent.keyboard('{Escape}');
  await expect(toast).toBeInTheDocument();
  await expect(trigger).toHaveFocus();
}

async function assertModalToast(canvasElement: HTMLElement) {
  const document = canvasElement.ownerDocument;
  const page = within(document.body);
  const modal = await page.findByRole('dialog', {
    name: 'Confirm change',
  });
  const action = within(modal).getByRole('button', {
    name: 'Save changes',
  });
  await userEvent.click(action);

  const toast = await page.findByRole('status', { name: 'Changes saved' });
  const region = toast.closest('[data-breeze-toast-region]');
  const modalLayer = modal.closest('[data-breeze-overlay]');
  const window = document.defaultView;
  if (!region || !modalLayer || !window) {
    throw new Error('Missing Toast or overlay layer.');
  }

  await expect(region).not.toHaveAttribute('aria-live');
  await expect(region).toHaveAttribute('data-live-announcer');
  await expect(region).toHaveAttribute('data-react-aria-top-layer');
  await expect(region).not.toHaveAttribute('aria-hidden', 'true');
  await expect(region.closest('[aria-hidden="true"]')).toBeNull();
  await expect(region.closest('[inert]')).toBeNull();
  await expect(Number(window.getComputedStyle(region).zIndex)).toBeGreaterThan(
    Number(window.getComputedStyle(modalLayer).zIndex),
  );
  await expect(action).toHaveFocus();
  await expect(document.activeElement).not.toBe(toast);
}

/** A positive status card with no action or dismissal control. */
export const Default: Story = {};

/** Enqueues a confirmation and keeps focus on the action that caused it. */
export const Enqueued: Story = {
  globals: desktopGlobals,
  parameters: {
    viewport: desktopViewport,
  },
  play: async ({ canvasElement }) => {
    await assertEnqueuedToast(canvasElement, 1280);
  },
  render: () => <EnqueueExample />,
};

/** The same fixed-width confirmation at a phone viewport. */
export const Mobile: Story = {
  globals: mobileGlobals,
  parameters: {
    chromatic: {
      viewports: [375],
    },
    viewport: mobileViewport,
  },
  play: async ({ canvasElement }) => {
    await assertEnqueuedToast(canvasElement, 375);
  },
  render: () => <EnqueueExample />,
};

/** A clipped confirmation waits until the short viewport can show it fully. */
export const ShortViewportClipped: Story = {
  globals: shortClippedGlobals,
  parameters: {
    viewport: shortClippedViewport,
  },
  play: async ({ canvasElement }) => {
    const document = canvasElement.ownerDocument;
    const window = document.defaultView;
    const page = within(document.body);
    if (!window) throw new Error('Missing story window.');

    await expect(window.innerWidth).toBe(375);
    await expect(window.innerHeight).toBe(120);
    await userEvent.click(
      page.getByRole('button', { name: wrappedMessages[0] }),
    );

    const toast = await page.findByRole('status', {
      name: wrappedMessages[0],
    });
    await expect(toast.getBoundingClientRect().bottom).toBeGreaterThan(
      window.innerHeight,
    );

    await new Promise<void>((resolve) => {
      setTimeout(resolve, 2700);
    });
    await expect(toast).toBeInTheDocument();
  },
  render: () => <WrappedToastContent />,
};

/** Queued cards wait for a visible slot and then receive their full lifetime. */
export const ShortViewportQueue: Story = {
  globals: shortQueueGlobals,
  parameters: {
    viewport: shortQueueViewport,
  },
  play: async ({ canvasElement }) => {
    const document = canvasElement.ownerDocument;
    const window = document.defaultView;
    const page = within(document.body);
    if (!window) throw new Error('Missing story window.');

    await expect(window.innerWidth).toBe(375);
    await expect(window.innerHeight).toBe(240);
    await wrappedMessages.reduce(
      (previous, message) =>
        previous.then(() =>
          userEvent.click(page.getByRole('button', { name: message })),
        ),
      Promise.resolve(),
    );

    await waitFor(async () => {
      await expect(page.getAllByRole('status')).toHaveLength(3);
    });
    const toasts = page.getAllByRole('status');
    const lastToast = toasts.at(-1);
    if (!lastToast) throw new Error('Missing queued Toast.');
    await expect(lastToast.getBoundingClientRect().bottom).toBeGreaterThan(
      window.innerHeight,
    );

    await new Promise<void>((resolve) => {
      setTimeout(resolve, 2700);
    });
    const promotedToast = await page.findByRole('status', {
      name: wrappedMessages[2],
    });
    await expect(page.getAllByRole('status')).toHaveLength(1);
    await expect(promotedToast.getBoundingClientRect().bottom).toBeLessThan(
      window.innerHeight,
    );

    await new Promise<void>((resolve) => {
      setTimeout(resolve, 2000);
    });
    await expect(promotedToast).toBeInTheDocument();
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 700);
    });
    await expect(
      page.queryByRole('status', { name: wrappedMessages[2] }),
    ).not.toBeInTheDocument();
  },
  render: () => <WrappedToastContent />,
};

/** A fully visible card expires before the queued card is promoted. */
export const ShortViewportPromotion: Story = {
  globals: shortQueueGlobals,
  parameters: {
    toastLimit: 1,
    viewport: shortQueueViewport,
  },
  play: async ({ canvasElement }) => {
    const document = canvasElement.ownerDocument;
    const window = document.defaultView;
    const page = within(document.body);
    if (!window) throw new Error('Missing story window.');

    await expect(window.innerWidth).toBe(375);
    await expect(window.innerHeight).toBe(240);
    await userEvent.click(
      page.getByRole('button', { name: wrappedMessages[0] }),
    );
    const firstToast = await page.findByRole('status', {
      name: wrappedMessages[0],
    });
    await userEvent.click(
      page.getByRole('button', { name: wrappedMessages[1] }),
    );
    await expect(
      page.queryByRole('status', { name: wrappedMessages[1] }),
    ).not.toBeInTheDocument();
    await expect(firstToast.getBoundingClientRect().bottom).toBeLessThanOrEqual(
      window.innerHeight,
    );

    await new Promise<void>((resolve) => {
      setTimeout(resolve, 2700);
    });
    await expect(firstToast).not.toBeInTheDocument();
    const promotedToast = await page.findByRole('status', {
      name: wrappedMessages[1],
    });
    await expect(promotedToast).toBeInTheDocument();
  },
  render: () => <WrappedToastContent />,
};

/** A dialog keeps the live status above its surface without taking focus. */
export const DialogLayering: Story = {
  play: async ({ canvasElement }) => {
    await assertModalToast(canvasElement);
  },
  render: () => <ModalToastExample kind="dialog" />,
};

/** A drawer keeps the live status above its surface without taking focus. */
export const DrawerLayering: Story = {
  play: async ({ canvasElement }) => {
    await assertModalToast(canvasElement);
  },
  render: () => <ModalToastExample kind="drawer" />,
};
