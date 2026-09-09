import type { Meta, StoryObj } from '@storybook/react-vite';
import { Inline } from '../Inline/Inline';
import { Stack } from '../Stack/Stack';
import { Skeleton } from './Skeleton';

const meta = {
  args: {
    label: 'Loading content',
  },
  component: Skeleton,
  title: 'Content/Skeleton',
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A labelled text placeholder. */
export const Text: Story = {};

/** Arbitrary dimensions let placeholders match the content they replace. */
export const Shapes: Story = {
  args: {
    label: 'Loading content preview',
  },
  render: ({ label }) => (
    <Stack gap={4}>
      <Skeleton inlineSize="72%" label={label} />
      <Inline gap={3}>
        <Skeleton blockSize={44} inlineSize={44} shape="circle" />
        <Skeleton blockSize={96} inlineSize="14rem" shape="rectangle" />
      </Inline>
    </Stack>
  ),
};
