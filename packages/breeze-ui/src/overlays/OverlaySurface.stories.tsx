import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '../primitives/Button/Button';
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

/** An action popover leaves its sheet available and preserves the sheet scrim. */
export const SheetPopover: Story = {
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const sheet = await page.findByRole('dialog', { name: 'Delivery' });
    const sheetLayer = sheet.closest('[data-breeze-overlay]');
    const trigger = within(sheet).getByRole('button', { name: 'Open actions' });
    await userEvent.click(trigger);
    const popover = await page.findByRole('dialog', { name: 'Actions' });
    await expect(popover).not.toHaveAttribute('aria-modal', 'true');
    await expect(sheetLayer).not.toHaveAttribute('inert');
    await expect(page.getByRole('dialog', { name: 'Delivery' })).toBe(sheet);
    await expect(sheetLayer).toHaveAttribute('data-breeze-scrim', 'true');
    await userEvent.tab({ shift: true });
    await waitFor(async () => {
      await expect(trigger).toHaveFocus();
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
      <Popover title="Actions" trigger="Open actions">
        <Typography>Choose a delivery action.</Typography>
      </Popover>
    </Drawer>
  ),
};

/** Internal fullscreen content covers a mounted sheet without another scrim. */
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
    await expect(sheetLayer).toHaveAttribute('inert');
    await expect(sheetLayer).toHaveAttribute('data-breeze-scrim', 'true');
    await expect(viewerLayer).not.toHaveAttribute('data-breeze-scrim', 'true');
    await expect(
      canvasElement.ownerDocument.querySelectorAll(
        '[data-breeze-scrim="true"]',
      ),
    ).toHaveLength(1);
    await userEvent.keyboard('{Escape}');
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
      </OverlaySurface>
    </Drawer>
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
      document.querySelector('[data-breeze-scrim="true"]'),
    ).toBeNull();
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
