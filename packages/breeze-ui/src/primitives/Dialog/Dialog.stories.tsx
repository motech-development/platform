import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '../Button/Button';
import { Typography } from '../Typography/Typography';
import { Dialog } from './Dialog';

const meta = {
  args: {
    children: <Typography>Your delivery arrives on Monday.</Typography>,
    defaultOpen: true,
    title: 'Delivery details',
    trigger: 'View delivery details',
  },
  component: Dialog,
  title: 'Overlays/Dialog',
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/** An open surface that can be closed and reopened from its trigger. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const surface = await page.findByRole('dialog', {
      name: 'Delivery details',
    });

    await userEvent.click(
      within(surface).getByRole('button', { name: 'Close' }),
    );
    await waitFor(async () => {
      await expect(
        page.queryByRole('dialog', { name: 'Delivery details' }),
      ).not.toBeInTheDocument();
    });
    const trigger = page.getByRole('button', { name: 'View delivery details' });
    await userEvent.click(trigger);
    await waitFor(async () => {
      await expect(
        page.getByRole('dialog', { name: 'Delivery details' }),
      ).toBeVisible();
    });
  },
};

/** The open surface announces loading while content is prepared. */
export const Loading: Story = {
  args: {
    loading: true,
  },
};

/** A second modal opens above its parent and returns focus when dismissed. */
export const Nested: Story = {
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const outer = await page.findByRole('dialog', { name: 'Delivery details' });
    const trigger = within(outer).getByRole('button', {
      name: 'Change delivery',
    });
    const outerLayer = outer.closest('[data-breeze-overlay]');

    await userEvent.click(trigger);
    const inner = await page.findByRole('dialog', { name: 'Change delivery' });
    const innerLayer = inner.closest('[data-breeze-overlay]');
    await expect(innerLayer).toHaveAttribute('data-breeze-scrim', 'true');
    await expect(outerLayer).toHaveAttribute('data-breeze-scrim', 'false');

    await userEvent.click(within(inner).getByRole('button', { name: 'Close' }));
    await expect(innerLayer).toHaveAttribute('data-exiting');
    await expect(innerLayer).toHaveAttribute('data-breeze-topmost', 'false');
    await expect(innerLayer).toHaveAttribute('data-breeze-scrim', 'false');
    await expect(outerLayer).toHaveAttribute('data-breeze-scrim', 'true');
    await waitFor(async () => {
      await expect(
        page.queryByRole('dialog', { name: 'Change delivery' }),
      ).not.toBeInTheDocument();
      await expect(trigger).toHaveFocus();
      await expect(outerLayer).toHaveAttribute('data-breeze-scrim', 'true');
    });

    await userEvent.click(trigger);
    await waitFor(async () => {
      await expect(
        page.getByRole('dialog', { name: 'Change delivery' }),
      ).toBeVisible();
    });
  },
  render: () => (
    <Dialog
      defaultOpen
      title="Delivery details"
      trigger="View delivery details"
    >
      <Typography>Your delivery arrives on Monday.</Typography>
      <Dialog title="Change delivery" trigger="Change delivery">
        <Typography>Choose another delivery date.</Typography>
      </Dialog>
    </Dialog>
  ),
};

function OuterCloseExample() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      title="Outer surface"
      trigger="Open outer"
    >
      <Dialog title="Inner surface" trigger="Open inner">
        <Button onAction={() => setOpen(false)}>Close outer first</Button>
      </Dialog>
    </Dialog>
  );
}

/** Closing an ancestor removes the whole branch, including animated descendants. */
export const CloseOuterFirst: Story = {
  play: async ({ canvasElement }) => {
    const document = canvasElement.ownerDocument;
    const page = within(document.body);
    const trigger = page.getByRole('button', { name: 'Open outer' });
    await userEvent.click(trigger);
    await userEvent.click(
      await page.findByRole('button', { name: 'Open inner' }),
    );
    await userEvent.click(
      await page.findByRole('button', { name: 'Close outer first' }),
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
        page.getByRole('dialog', { name: 'Outer surface' }),
      ).toBeVisible();
    });
    await expect(
      page.queryByRole('dialog', { name: 'Inner surface' }),
    ).not.toBeInTheDocument();
  },
  render: () => <OuterCloseExample />,
};

/** Both surfaces can start open without hiding the child from assistive technology. */
export const InitiallyNested: Story = {
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const inner = await page.findByRole('dialog', { name: 'Inner surface' });
    await expect(inner.closest('[data-breeze-overlay]')).toHaveAttribute(
      'data-breeze-topmost',
      'true',
    );
    await waitFor(async () => {
      await expect(
        inner.contains(canvasElement.ownerDocument.activeElement),
      ).toBe(true);
    });
    await userEvent.keyboard('{Escape}');
    await waitFor(async () => {
      await expect(
        page.queryByRole('dialog', { name: 'Inner surface' }),
      ).not.toBeInTheDocument();
      const outer = page.getByRole('dialog', { name: 'Outer surface' });
      await expect(outer).toBeVisible();
      await expect(
        outer.contains(canvasElement.ownerDocument.activeElement),
      ).toBe(true);
    });
  },
  render: () => (
    <Dialog defaultOpen title="Outer surface" trigger="Open outer">
      <Dialog defaultOpen title="Inner surface" trigger="Open inner">
        <Typography>Nested content</Typography>
      </Dialog>
    </Dialog>
  ),
};
