import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Button } from '../../primitives/Button/Button';
import { FileAttachment } from './FileAttachment';

const meta = {
  component: FileAttachment,
  title: 'Patterns/Forms/FileAttachment',
} satisfies Meta<typeof FileAttachment>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Keeps a selected file name visible beside application-owned view and delete
 * actions, with those actions stacking to full width in compact layouts.
 *
 * @summary selected file with persistent view and delete actions
 */
export const WithActions: Story = {
  args: {
    actions: (
      <>
        <Button appearance="outline" variant="secondary">
          View file
        </Button>
        <Button variant="danger">Delete file</Button>
      </>
    ),
    className: 'w-full max-w-3xl',
    name: 'design-brief.pdf',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const attachment = canvas.getByText('design-brief.pdf').closest('div');
    const actions = canvas.getByRole('button', {
      name: 'View file',
    }).parentElement;

    await expect(attachment).not.toBeNull();
    await expect(actions).not.toBeNull();
    await expect(
      attachment!.getBoundingClientRect().height,
    ).toBeGreaterThanOrEqual(actions!.getBoundingClientRect().height);
    await expect(getComputedStyle(attachment!).display).toBe('flex');
    await expect(getComputedStyle(actions!).display).toBe('flex');
  },
};
