import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import StoryConstraint from '../../../.storybook/StoryConstraint';
import { Inline } from '../Inline/Inline';
import { Stack } from '../Stack/Stack';
import { Typography } from '../Typography/Typography';
import { Separator } from './Separator';

const meta = {
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
    },
    tone: {
      control: 'inline-radio',
      options: ['default', 'strong'],
    },
  },
  args: {
    decorative: false,
    orientation: 'horizontal',
    tone: 'default',
  },
  component: Separator,
  title: 'Layout/Separator',
} satisfies Meta<typeof Separator>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Places the default meaningful horizontal divider between stacked content
 * and verifies it remains exposed with separator semantics.
 *
 * @summary meaningful horizontal divider between stacked regions
 */
export const Horizontal: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('separator')).toBeVisible();
  },
  render: (args) => (
    <Stack>
      <Typography as="span">Before</Typography>
      <Separator
        decorative={args.decorative}
        orientation={args.orientation}
        tone={args.tone}
      />
      <Typography as="span">After</Typography>
    </Stack>
  ),
};

/**
 * Places a strong vertical divider inside a height-bearing inline layout to
 * demonstrate its stretching cross-axis geometry and orientation.
 *
 * @summary strong vertical divider inside an inline layout
 */
export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    tone: 'strong',
  },
  render: (args) => (
    <StoryConstraint size="compact-height">
      <Inline>
        <Typography as="span">Before</Typography>
        <Separator
          decorative={args.decorative}
          orientation={args.orientation}
          tone={args.tone}
        />
        <Typography as="span">After</Typography>
      </Inline>
    </StoryConstraint>
  ),
};

/**
 * Renders a horizontal visual divider that is explicitly removed from the
 * accessibility tree because it adds no semantic relationship.
 *
 * @summary decorative divider hidden from assistive technology
 */
export const Decorative: Story = {
  args: {
    decorative: true,
  },
  render: (args) => (
    <Stack>
      <Typography as="span">Before</Typography>
      <Separator
        decorative={args.decorative}
        orientation={args.orientation}
        tone={args.tone}
      />
      <Typography as="span">After</Typography>
    </Stack>
  ),
};
