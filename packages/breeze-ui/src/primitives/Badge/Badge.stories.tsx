import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
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
  play: async ({ canvasElement }) => {
    const badge = within(canvasElement).getByText('warning').parentElement;

    if (!badge) {
      throw new Error('The warning badge was not rendered.');
    }

    const style = getComputedStyle(badge);

    await expect({
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      letterSpacing: style.letterSpacing,
      paddingBlock: style.paddingBlockStart,
      paddingInline: style.paddingInlineStart,
    }).toEqual({
      fontSize: '11px',
      fontWeight: '600',
      letterSpacing: 'normal',
      paddingBlock: '1px',
      paddingInline: '6px',
    });
  },
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
