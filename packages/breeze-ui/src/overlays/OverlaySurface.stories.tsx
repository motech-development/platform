import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '../primitives/Button/Button';
import { Dialog } from '../primitives/Dialog/Dialog';
import { Drawer } from '../primitives/Drawer/Drawer';
import { Popover } from '../primitives/Popover/Popover';
import { Typography } from '../primitives/Typography/Typography';
import OverlaySurface from './OverlaySurface';

const meta = {
  args: {
    children: 'Overlay content',
    kind: 'fullscreen',
    title: 'Viewer',
    trigger: 'Open viewer',
  },
  component: OverlaySurface,
  title: 'Foundations/Overlay stack',
} satisfies Meta<typeof OverlaySurface>;

export default meta;
type Story = StoryObj<typeof meta>;

async function browserInput() {
  if (!('__vitest_browser__' in globalThis)) return null;
  const { userEvent: browserUserEvent } = await import('vitest/browser');
  return browserUserEvent;
}

async function pressKeys(keys: string) {
  const input = await browserInput();
  await (input ?? userEvent).keyboard(keys);
}

function focusIsWithin(containers: readonly HTMLElement[]) {
  return containers.some((container) =>
    container.contains(container.ownerDocument.activeElement),
  );
}

async function expectFocusKeptWithin(
  container: HTMLElement | readonly HTMLElement[],
  keys: string,
  presses: number,
) {
  const containers = Array.isArray(container) ? container : [container];
  await Array.from({ length: presses }).reduce<Promise<void>>(
    async (previous) => {
      await previous;
      await pressKeys(keys);
      await expect(focusIsWithin(containers)).toBe(true);
    },
    Promise.resolve(),
  );
}

function overlayLayer(surface: HTMLElement) {
  const layer = surface.closest<HTMLElement>('[data-breeze-overlay]');
  if (!layer) throw new Error('Missing overlay layer');
  return layer;
}

/** An action popover leaves its sheet available and preserves the sheet scrim. */
export const SheetPopover: Story = {
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const sheet = await page.findByRole('dialog', { name: 'Delivery' });
    const sheetLayer = sheet.closest('[data-breeze-overlay]');
    const trigger = within(sheet).getByRole('button', { name: 'Open actions' });
    await userEvent.click(trigger);
    const initialPopover = await page.findByRole('dialog', { name: 'Actions' });
    await expect(initialPopover).not.toHaveAttribute('aria-modal', 'true');
    await expect(sheetLayer).not.toHaveAttribute('inert');
    await expect(page.getByRole('dialog', { name: 'Delivery' })).toBe(sheet);
    await expect(sheetLayer).toHaveAttribute('data-breeze-scrim', 'true');
    await userEvent.click(
      within(sheet).getByRole('button', { name: 'Disabled sheet action' }),
    );
    await waitFor(async () => {
      await expect(
        page.queryByRole('dialog', { name: 'Actions' }),
      ).not.toBeInTheDocument();
    });
    await expect(sheet).toBeVisible();
    await expect(sheetLayer).toHaveAttribute('data-breeze-scrim', 'true');
    await userEvent.click(trigger);
    const popover = await page.findByRole('dialog', { name: 'Actions' });
    await waitFor(async () => {
      const { activeElement } = canvasElement.ownerDocument;
      await expect(
        activeElement === trigger || popover.contains(activeElement),
      ).toBe(true);
    });
    await userEvent.tab({ shift: true });
    await waitFor(async () => {
      const { activeElement } = canvasElement.ownerDocument;
      await expect(sheet.contains(activeElement)).toBe(true);
      await expect(
        page.queryByRole('dialog', { name: 'Actions' }),
      ).not.toBeInTheDocument();
    });
    await userEvent.click(trigger);
    const reopenedPopover = await page.findByRole('dialog', {
      name: 'Actions',
    });
    await userEvent.keyboard('{Escape}');
    await expect(
      reopenedPopover.closest('[data-breeze-overlay]'),
    ).toHaveAttribute('data-breeze-topmost', 'false');
    await userEvent.click(trigger);
    await waitFor(async () => {
      await expect(reopenedPopover).toBeVisible();
      await expect(
        reopenedPopover.contains(canvasElement.ownerDocument.activeElement),
      ).toBe(true);
    });
    await userEvent.keyboard('{Escape}');
    await waitFor(async () => {
      await expect(trigger).toHaveFocus();
    });
    await userEvent.click(trigger);
    await userEvent.click(
      within(sheet).getByRole('button', { name: 'Sheet action' }),
    );
    await waitFor(async () => {
      await expect(
        page.queryByRole('dialog', { name: 'Actions' }),
      ).not.toBeInTheDocument();
    });
    await expect(sheet).toBeVisible();
    await expect(sheetLayer).toHaveAttribute('data-breeze-scrim', 'true');
    await userEvent.click(trigger);
    if (!sheetLayer) throw new Error('Missing sheet layer');
    await userEvent.click(sheetLayer);
    await waitFor(async () => {
      await expect(
        page.queryByRole('dialog', { name: 'Actions' }),
      ).not.toBeInTheDocument();
    });
    await expect(sheet).toBeVisible();
    await expect(sheetLayer).toHaveAttribute('data-breeze-scrim', 'true');
    await userEvent.click(trigger);
    await page.findByRole('dialog', { name: 'Actions' });
  },
  render: () => (
    <Drawer defaultOpen title="Delivery" trigger="Open delivery">
      <Button>Sheet action</Button>
      <Button disabled>Disabled sheet action</Button>
      <Popover title="Actions" trigger="Open actions">
        <Typography>Choose a delivery action.</Typography>
      </Popover>
    </Drawer>
  ),
};

/** Non-modal fullscreen content over a sheet: no second scrim, Tab stays inside (ADR 0002). */
export const SheetFullscreen: Story = {
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const sheet = await page.findByRole('dialog', { name: 'Delivery' });
    const sheetLayer = sheet.closest('[data-breeze-overlay]');
    const trigger = within(sheet).getByRole('button', { name: 'Open viewer' });
    await userEvent.click(trigger);
    const viewer = await page.findByRole('dialog', { name: 'Viewer' });
    const viewerLayer = viewer.closest('[data-breeze-overlay]');
    await waitFor(async () => {
      const bounds = viewerLayer?.getBoundingClientRect();
      const window = canvasElement.ownerDocument.defaultView;
      await expect(bounds?.x).toBe(0);
      await expect(bounds?.y).toBe(0);
      await expect(bounds?.width).toBe(window?.innerWidth);
      await expect(bounds?.height).toBe(window?.innerHeight);
    });
    await expect(viewer).not.toHaveAttribute('aria-modal', 'true');
    await expect(sheet).toBeInTheDocument();
    await expect(sheetLayer).not.toHaveAttribute('inert');
    await expect(page.getByRole('dialog', { name: 'Delivery' })).toBe(sheet);
    await expect(sheetLayer).toHaveAttribute('data-breeze-scrim', 'true');
    await expect(viewerLayer).not.toHaveAttribute('data-breeze-scrim', 'true');
    await expect(
      canvasElement.ownerDocument.querySelectorAll(
        '[data-breeze-scrim="true"]',
      ),
    ).toHaveLength(1);
    await waitFor(async () => {
      await expect(viewer).toHaveFocus();
    });
    await expectFocusKeptWithin(viewer, '{Tab}', 4);
    await expectFocusKeptWithin(viewer, '{Shift>}{Tab}{/Shift}', 4);
    // Assistive technology can move focus into the covered sheet.
    trigger.focus();
    await waitFor(async () => {
      await expect(
        viewer.contains(canvasElement.ownerDocument.activeElement),
      ).toBe(true);
    });
    await pressKeys('{Escape}');
    await expect(viewerLayer).toHaveAttribute('data-exiting');
    await expect(viewerLayer).toHaveAttribute('data-breeze-topmost', 'false');
    await expect(sheetLayer).toHaveAttribute('data-breeze-scrim', 'true');
    await waitFor(async () => {
      await expect(
        page.queryByRole('dialog', { name: 'Viewer' }),
      ).not.toBeInTheDocument();
      await expect(trigger).toHaveFocus();
    });
    await userEvent.click(trigger);
    await page.findByRole('dialog', { name: 'Viewer' });
  },
  render: () => (
    <Drawer defaultOpen title="Delivery" trigger="Open delivery">
      <OverlaySurface kind="fullscreen" title="Viewer" trigger="Open viewer">
        <Typography>Delivery document</Typography>
        <Button>Viewer action</Button>
      </OverlaySurface>
    </Drawer>
  ),
};

/** A fullscreen surface over a page keeps wheel scrolling and Tab inside it. */
export const PageFullscreen: Story = {
  play: async ({ canvasElement }) => {
    const document = canvasElement.ownerDocument;
    const view = document.defaultView;
    if (!view) throw new Error('Missing overlay story window.');
    const page = within(document.body);
    const trigger = page.getByRole('button', { name: 'Open viewer' });
    await userEvent.click(trigger);
    const viewer = await page.findByRole('dialog', { name: 'Viewer' });
    const viewerLayer = viewer.closest<HTMLElement>('[data-breeze-overlay]');
    if (!viewerLayer) throw new Error('Missing viewer layer');
    await waitFor(async () => {
      await expect(viewerLayer).not.toHaveAttribute('data-entering');
      await expect(viewer).toHaveFocus();
    });
    await expectFocusKeptWithin(viewer, '{Tab}', 3);
    await expectFocusKeptWithin(viewer, '{Shift>}{Tab}{/Shift}', 3);

    const input = await browserInput();
    if (input) {
      const pageScroll = view.scrollY;
      await input.wheel(viewer, { delta: { y: 400 }, times: 20 });
      await waitFor(async () => {
        await expect(viewerLayer.scrollTop).toBeGreaterThan(0);
      });
      await expect(view.scrollY).toBe(pageScroll);
    }

    await pressKeys('{Escape}');
    await waitFor(async () => {
      await expect(
        page.queryByRole('dialog', { name: 'Viewer' }),
      ).not.toBeInTheDocument();
      await expect(trigger).toHaveFocus();
    });
  },
  render: () => (
    <div style={{ minBlockSize: '300vh' }}>
      <OverlaySurface kind="fullscreen" title="Viewer" trigger="Open viewer">
        <div style={{ minBlockSize: '200vh' }}>
          <Typography>Long document</Typography>
        </div>
        <Button>Viewer action</Button>
      </OverlaySurface>
    </div>
  ),
};

/** A popover in a fullscreen surface takes focus and closes on Escape before the viewer. */
export const FullscreenPopover: Story = {
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const sheet = await page.findByRole('dialog', { name: 'Delivery' });
    await userEvent.click(
      within(sheet).getByRole('button', { name: 'Open viewer' }),
    );
    const viewer = await page.findByRole('dialog', { name: 'Viewer' });
    const viewerLayer = overlayLayer(viewer);
    const actionsTrigger = within(viewer).getByRole('button', {
      name: 'Open actions',
    });
    const openActions = async () => {
      await userEvent.click(actionsTrigger);
      const actions = await page.findByRole('dialog', { name: 'Actions' });
      await waitFor(async () => {
        await expect(focusIsWithin([actions])).toBe(true);
      });
      return actions;
    };

    const actions = await openActions();
    await expect(overlayLayer(actions)).toHaveAttribute(
      'data-breeze-topmost',
      'true',
    );
    await expect(viewerLayer).not.toHaveAttribute('inert');
    await pressKeys('{Tab}');
    await expect(
      within(actions)
        .getAllByRole('button')
        .includes(
          canvasElement.ownerDocument.activeElement as HTMLButtonElement,
        ),
    ).toBe(true);
    await pressKeys('{Escape}');
    await waitFor(async () => {
      await expect(
        page.queryByRole('dialog', { name: 'Actions' }),
      ).not.toBeInTheDocument();
      await expect(actionsTrigger).toHaveFocus();
    });
    await expect(page.getByRole('dialog', { name: 'Viewer' })).toBe(viewer);
    await expect(viewerLayer).toHaveAttribute('data-breeze-topmost', 'true');

    await openActions();
    await expectFocusKeptWithin(
      [viewerLayer, page.getByRole('dialog', { name: 'Actions' })],
      '{Tab}',
      5,
    );
    await openActions();
    await expectFocusKeptWithin(
      [viewerLayer, page.getByRole('dialog', { name: 'Actions' })],
      '{Shift>}{Tab}{/Shift}',
      5,
    );
    await waitFor(async () => {
      await expect(
        page.queryByRole('dialog', { name: 'Actions' }),
      ).not.toBeInTheDocument();
    });
    await expectFocusKeptWithin(viewerLayer, '{Tab}', 4);
    await pressKeys('{Escape}');
    await waitFor(async () => {
      await expect(
        page.queryByRole('dialog', { name: 'Viewer' }),
      ).not.toBeInTheDocument();
      await expect(
        sheet.contains(canvasElement.ownerDocument.activeElement),
      ).toBe(true);
    });
  },
  render: () => (
    <Drawer defaultOpen title="Delivery" trigger="Open delivery">
      <OverlaySurface kind="fullscreen" title="Viewer" trigger="Open viewer">
        <Typography>Delivery document</Typography>
        <Popover title="Actions" trigger="Open actions">
          <Button>Rotate</Button>
          <Button>Download</Button>
        </Popover>
        <Button>Viewer action</Button>
      </OverlaySurface>
    </Drawer>
  ),
};

/** A modal above a fullscreen surface takes over focus containment until it closes. */
export const FullscreenModal: Story = {
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.click(page.getByRole('button', { name: 'Open viewer' }));
    const viewer = await page.findByRole('dialog', { name: 'Viewer' });
    const viewerLayer = overlayLayer(viewer);
    await waitFor(async () => {
      await expect(viewer).toHaveFocus();
    });
    const confirmTrigger = within(viewer).getByRole('button', {
      name: 'Remove document',
    });
    await userEvent.click(confirmTrigger);
    const confirmation = await page.findByRole('dialog', {
      name: 'Remove this document?',
    });
    await waitFor(async () => {
      await expect(focusIsWithin([confirmation])).toBe(true);
      await expect(viewerLayer).toHaveAttribute('inert');
    });
    await expectFocusKeptWithin(confirmation, '{Tab}', 4);
    await expectFocusKeptWithin(confirmation, '{Shift>}{Tab}{/Shift}', 4);

    await pressKeys('{Escape}');
    await waitFor(async () => {
      await expect(
        page.queryByRole('dialog', { name: 'Remove this document?' }),
      ).not.toBeInTheDocument();
      await expect(confirmTrigger).toHaveFocus();
    });
    await expect(viewerLayer).not.toHaveAttribute('inert');
    await expect(page.getByRole('dialog', { name: 'Viewer' })).toBe(viewer);
    await expectFocusKeptWithin(viewer, '{Tab}', 4);
    await expectFocusKeptWithin(viewer, '{Shift>}{Tab}{/Shift}', 4);
  },
  render: () => (
    <OverlaySurface kind="fullscreen" title="Viewer" trigger="Open viewer">
      <Typography>Delivery document</Typography>
      <Dialog title="Remove this document?" trigger="Remove document">
        <Button>Remove</Button>
      </Dialog>
      <Button>Viewer action</Button>
    </OverlaySurface>
  ),
};

function OuterCloseExample() {
  const [open, setOpen] = useState(false);
  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      title="Delivery"
      trigger="Open delivery"
    >
      <OverlaySurface kind="fullscreen" title="Viewer" trigger="Open viewer">
        <Button onAction={() => setOpen(false)}>Close sheet first</Button>
      </OverlaySurface>
    </Drawer>
  );
}

/** Closing the sheet retires the entire branch before its exit animations finish. */
export const CloseOuterFirst: Story = {
  play: async ({ canvasElement }) => {
    const document = canvasElement.ownerDocument;
    const page = within(document.body);
    const trigger = page.getByRole('button', { name: 'Open delivery' });
    await userEvent.click(trigger);
    await userEvent.click(
      await page.findByRole('button', { name: 'Open viewer' }),
    );
    await userEvent.click(
      await page.findByRole('button', { name: 'Close sheet first' }),
    );
    await expect(
      document.querySelector('[data-breeze-topmost="true"]'),
    ).toBeNull();
    await expect(
      document.querySelector(
        '[data-breeze-overlay][data-breeze-scrim="true"][data-breeze-topmost="true"]',
      ),
    ).toBeNull();
    await expect(
      document.querySelector('[data-breeze-overlay="drawer"][data-exiting]'),
    ).toHaveAttribute('data-breeze-scrim', 'true');
    await waitFor(async () => {
      await expect(document.querySelector('[data-breeze-overlay]')).toBeNull();
      await expect(trigger).toHaveFocus();
    });
    await userEvent.click(trigger);
    await waitFor(async () => {
      await expect(
        page.getByRole('dialog', { name: 'Delivery' }),
      ).toBeVisible();
    });
    await expect(
      page.queryByRole('dialog', { name: 'Viewer' }),
    ).not.toBeInTheDocument();
  },
  render: () => <OuterCloseExample />,
};

/** Initially open surfaces retain their ancestry and restore focus into the sheet. */
export const InitiallyNested: Story = {
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const viewer = await page.findByRole('dialog', { name: 'Viewer' });
    await expect(viewer.closest('[data-breeze-overlay]')).toHaveAttribute(
      'data-breeze-topmost',
      'true',
    );
    await waitFor(async () => {
      await expect(
        viewer.contains(canvasElement.ownerDocument.activeElement),
      ).toBe(true);
    });
    await userEvent.keyboard('{Escape}');
    await waitFor(async () => {
      await expect(
        page.queryByRole('dialog', { name: 'Viewer' }),
      ).not.toBeInTheDocument();
      const sheet = page.getByRole('dialog', { name: 'Delivery' });
      await expect(sheet).toBeVisible();
      await expect(
        sheet.contains(canvasElement.ownerDocument.activeElement),
      ).toBe(true);
    });
    await userEvent.click(page.getByRole('button', { name: 'Open viewer' }));
    await page.findByRole('dialog', { name: 'Viewer' });
  },
  render: () => (
    <Drawer defaultOpen title="Delivery" trigger="Open delivery">
      <OverlaySurface
        defaultOpen
        kind="fullscreen"
        title="Viewer"
        trigger="Open viewer"
      >
        <Typography>Delivery document</Typography>
      </OverlaySurface>
    </Drawer>
  ),
};
