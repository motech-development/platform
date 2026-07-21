import type { Meta, StoryObj } from '@storybook/react-vite';
import { RelativeTime } from './RelativeTime';

const meta = {
  component: RelativeTime,
  title: 'Formatting/RelativeTime',
} satisfies Meta<typeof RelativeTime>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Converts an application-calculated negative one-day distance into natural
 * locale-aware wording without introducing a clock or automatic updates.
 *
 * @summary natural-language relative day from a stable signed value
 */
export const NaturalLanguage: Story = {
  args: { options: { numeric: 'auto' }, unit: 'day', value: -1 },
};
