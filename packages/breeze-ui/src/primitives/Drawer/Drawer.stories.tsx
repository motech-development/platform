import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
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

/** The open surface announces loading while content is prepared. */
export const Loading: Story = {
  args: {
    loading: true,
  },
};
