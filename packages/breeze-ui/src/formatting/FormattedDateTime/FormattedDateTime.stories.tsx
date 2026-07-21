import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormattedDateTime } from './FormattedDateTime';

const meta = {
  component: FormattedDateTime,
  title: 'Formatting/FormattedDateTime',
} satisfies Meta<typeof FormattedDateTime>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Formats one explicit-offset instant with both date and time styles while the
 * provider supplies the locale and optional display time zone.
 *
 * @summary explicit-offset instant with localized date and time
 */
export const DateAndTime: Story = {
  args: {
    options: { dateStyle: 'medium', timeStyle: 'short' },
    value: '2026-07-12T08:42:00+00:00',
  },
};
