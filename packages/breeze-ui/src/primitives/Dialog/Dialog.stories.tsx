import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '../Button/Button';
import { Drawer } from '../Drawer/Drawer';
import { Inline } from '../Inline/Inline';
import { Stack } from '../Stack/Stack';
import { TextField } from '../TextField/TextField';
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

function DiscardChangesDrawer() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);

  return (
    <>
      <Button onAction={() => setSheetOpen(true)}>Edit transaction</Button>
      <Drawer
        onOpenChange={(open) => setConfirming(!open)}
        open={sheetOpen}
        title="Northwind Supplies"
      >
        <TextField defaultValue="Printer toner" label="Description" />
        <Dialog
          onOpenChange={setConfirming}
          open={confirming}
          title="Discard changes?"
        >
          <Stack>
            <Typography>
              Your changes to this transaction will be lost.
            </Typography>
            <Inline justify="end">
              <Button onAction={() => setConfirming(false)} variant="secondary">
                Keep editing
              </Button>
              <Button
                onAction={() => {
                  setConfirming(false);
                  setSheetOpen(false);
                }}
                variant="danger"
              >
                Discard
              </Button>
            </Inline>
          </Stack>
        </Dialog>
      </Drawer>
    </>
  );
}

/** A confirmation opened from state when a drawer is dismissed; the drawer stays open until the person discards. */
export const DiscardChanges: Story = {
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const opener = within(canvasElement).getByRole('button', {
      name: 'Edit transaction',
    });

    await userEvent.click(opener);
    const sheet = await page.findByRole('dialog', {
      name: 'Northwind Supplies',
    });
    await waitFor(async () => {
      await expect(
        sheet.contains(canvasElement.ownerDocument.activeElement),
      ).toBe(true);
    });
    await userEvent.keyboard('{Escape}');
    const confirmation = await page.findByRole('dialog', {
      name: 'Discard changes?',
    });
    await userEvent.click(
      within(confirmation).getByRole('button', { name: 'Discard' }),
    );
    await waitFor(async () => {
      await expect(page.queryByRole('dialog')).not.toBeInTheDocument();
    });
    await waitFor(async () => {
      await expect(opener).toHaveFocus();
    });
  },
  render: () => <DiscardChangesDrawer />,
};
