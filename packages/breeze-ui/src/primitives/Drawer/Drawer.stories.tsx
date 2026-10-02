import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '../Button/Button';
import { TextField } from '../TextField/TextField';
import { Typography } from '../Typography/Typography';
import { Drawer } from './Drawer';

const meta = {
  args: {
    children: <Typography>Your delivery arrives on Monday.</Typography>,
    defaultOpen: true,
    title: 'Delivery details',
    trigger: 'View delivery details',
  },
  component: Drawer,
  title: 'Overlays/Drawer',
} satisfies Meta<typeof Drawer>;

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

const recordFields = [
  ['Name', 'Northwind Supplies'],
  ['Category', 'Office costs'],
  ['Amount', '139.00'],
  ['VAT paid', '23.17'],
  ['Date', '3 September 2026'],
  ['Description', 'Printer toner and paper'],
  ['Reference', 'INV-20931'],
  ['Payment method', 'Business card'],
  ['Supplier email', 'accounts@northwind.example'],
  ['Supplier telephone', '020 7946 0000'],
  ['Project', 'Office refit'],
  ['Cost centre', 'Operations'],
  ['Notes', 'Delivered to the studio'],
] as const;

function RecordTransactionDrawer() {
  const [open, setOpen] = useState(true);

  return (
    <Drawer
      footerActions={
        <>
          <Button onAction={() => setOpen(false)} variant="secondary">
            Cancel
          </Button>
          <Button onAction={() => setOpen(false)}>Save transaction</Button>
        </>
      }
      footerSummary="Takes £139.00 off the balance now"
      onOpenChange={setOpen}
      open={open}
      title="New transaction"
      trigger="Record transaction"
    >
      {recordFields.map(([label, value]) => (
        <TextField defaultValue={value} key={label} label={label} />
      ))}
    </Drawer>
  );
}

function scrollParent(element: HTMLElement) {
  let current = element.parentElement;
  while (current && current.scrollHeight <= current.clientHeight) {
    current = current.parentElement;
  }
  if (!current) throw new Error('Missing scrolling drawer body.');
  return current;
}

/** A record form whose body scrolls between a fixed header and a pinned footer of summary and actions. */
export const RecordTransaction: Story = {
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const surface = await page.findByRole('dialog', {
      name: 'New transaction',
    });
    const close = within(surface).getByRole('button', { name: 'Close' });
    const save = within(surface).getByRole('button', {
      name: 'Save transaction',
    });
    const summary = within(surface).getByText(
      'Takes £139.00 off the balance now',
    );
    const summaryStyle = getComputedStyle(summary);
    await expect(summaryStyle.fontSize).toBe('12px');
    await expect(summaryStyle.textOverflow).toBe('ellipsis');
    await expect(summary.getBoundingClientRect().right).toBeLessThanOrEqual(
      within(surface)
        .getByRole('button', { name: 'Cancel' })
        .getBoundingClientRect().left,
    );
    const body = scrollParent(within(surface).getByLabelText('Name'));
    const closeTop = close.getBoundingClientRect().top;
    const saveTop = save.getBoundingClientRect().top;

    body.scrollTo({ top: body.scrollHeight });
    await waitFor(async () => {
      await expect(body.scrollTop).toBeGreaterThan(0);
    });
    await expect(close.getBoundingClientRect().top).toBe(closeTop);
    await expect(save.getBoundingClientRect().top).toBe(saveTop);

    await userEvent.click(
      within(surface).getByRole('button', { name: 'Cancel' }),
    );
    await waitFor(async () => {
      await expect(
        page.queryByRole('dialog', { name: 'New transaction' }),
      ).not.toBeInTheDocument();
    });
  },
  render: () => <RecordTransactionDrawer />,
};
