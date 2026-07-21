import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormattedList } from './FormattedList';

const meta = {
  component: FormattedList,
  title: 'Formatting/FormattedList',
} satisfies Meta<typeof FormattedList>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Joins an ordered set of supported file labels with the provider locale's
 * default conjunction, punctuation, and final separator.
 *
 * @summary locale-aware conjunction for ordered inline labels
 */
export const Conjunction: Story = {
  args: { values: ['PDF', 'JPG', 'PNG'] },
};

/**
 * Uses disjunction formatting when the application means any one of several
 * contact methods rather than treating the values as a semantic list.
 *
 * @summary locale-aware disjunction for alternative inline values
 */
export const Disjunction: Story = {
  args: {
    options: { type: 'disjunction' },
    values: ['Email', 'telephone', 'post'],
  },
};
