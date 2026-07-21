import type { Meta, StoryObj } from '@storybook/react-vite';
import { ToastRegion } from './Toast';

const meta = {
  args: {
    label: 'Secondary notifications',
  },
  component: ToastRegion,
  title: 'Feedback/ToastRegion',
} satisfies Meta<typeof ToastRegion>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Adds a separately named region when an application layout deliberately needs
 * another presentation of the provider-owned queue.
 *
 * @summary for advanced layouts that need an additional labelled toast region
 */
export const AdditionalRegion: Story = {};
