import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '../Button/Button';
import { Toast, useToast } from './Toast';

function EnqueueExample() {
  const enqueue = useToast();

  return (
    <Button onAction={() => enqueue('Changes saved')}>Save changes</Button>
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

/** A positive status card with no action or dismissal control. */
export const Default: Story = {};

/** Enqueues a confirmation and keeps focus on the action that caused it. */
export const Enqueued: Story = {
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const trigger = page.getByRole('button', { name: 'Save changes' });

    trigger.focus();
    await userEvent.click(trigger);

    const toast = await page.findByRole('status', { name: 'Changes saved' });
    const window = canvasElement.ownerDocument.defaultView;
    const expectedEnd = Math.max(
      (window?.innerWidth ?? 0) < 901 ? 16 : 28,
      ((window?.innerWidth ?? 0) - 1500) / 2 + 28,
    );

    await expect(toast).toHaveAttribute('aria-live', 'polite');
    await expect(toast).not.toHaveAttribute('tabindex');
    await expect(trigger).toHaveFocus();
    await waitFor(async () => {
      const bounds = toast.getBoundingClientRect();

      await expect(bounds.width).toBe(288);
      await expect(bounds.y).toBe(76);
      await expect(Math.round((window?.innerWidth ?? 0) - bounds.right)).toBe(
        expectedEnd,
      );
    });

    await userEvent.keyboard('{Escape}');
    await expect(toast).toBeInTheDocument();
    await expect(trigger).toHaveFocus();
  },
  render: () => <EnqueueExample />,
};

/** The same fixed-width confirmation at a phone viewport. */
export const Mobile: Story = {
  parameters: {
    chromatic: {
      viewports: [375],
    },
  },
  play: Enqueued.play,
  render: Enqueued.render,
};
