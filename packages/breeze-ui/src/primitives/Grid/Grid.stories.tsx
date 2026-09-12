import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from '../Card/Card';
import { Grid } from './Grid';

const meta = {
  args: {
    children: (
      <>
        <Card>Primary content</Card>
        <Card>Supporting content</Card>
        <Card>Related content</Card>
      </>
    ),
    columns: 3,
  },
  component: Grid,
  title: 'Layout/Grid',
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Three equal columns that collapse below Breeze's structural breakpoint. */
export const Responsive: Story = {};

/** Two columns that remain side by side at every width. */
export const Fixed: Story = {
  args: {
    collapseBelow: 'none',
    columns: 2,
  },
};
