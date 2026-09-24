import type { Meta, StoryObj } from '@storybook/react-vite';
import { Calendar } from './Calendar';

const meta = {
  args: {
    defaultValue: '2026-09-03',
    label: 'Choose a date',
  },
  component: Calendar,
  title: 'Forms/Calendar',
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A six-week Monday-first calendar with a selected date. */
export const Default: Story = {};

/** A calendar can prevent all date changes. */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
