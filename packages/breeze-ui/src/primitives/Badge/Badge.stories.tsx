import type { Meta, StoryObj } from '@storybook/react-vite';
import { Inline } from '../Inline/Inline';
import { Badge, type BadgeVariant } from './Badge';

const variants = [
  'neutral',
  'brand',
  'positive',
  'warning',
  'danger',
] satisfies BadgeVariant[];

const meta = {
  args: {
    children: 'Pending',
  },
  component: Badge,
  title: 'Content/Badge',
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The neutral treatment for ordinary metadata. */
export const Default: Story = {};

/** Badge's own five status treatments. */
export const Treatments: Story = {
  render: () => (
    <Inline gap={2} wrap>
      {variants.map((variant) => (
        <Badge key={variant} variant={variant}>
          {variant}
        </Badge>
      ))}
    </Inline>
  ),
};

/** Preserves the badge shape while its status is loading. */
export const Loading: Story = {
  args: { loading: true },
};
