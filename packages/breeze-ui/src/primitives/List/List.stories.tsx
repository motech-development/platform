import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Grid } from '../Grid/Grid';
import { Item, List, Root } from './List';

const meta = {
  component: Root,
  decorators: [
    (Story) => {
      Object.assign(List.Item, { displayName: 'List.Item' });
      Object.assign(List.Root, { displayName: 'List.Root' });

      return <Story />;
    },
  ] satisfies Decorator[],
  subcomponents: { Item },
  title: 'Data Display/List',
} satisfies Meta<typeof Root>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Compares unordered highlights with an ordered sequence, including wrapping
 * content, to demonstrate native list semantics without collection behavior.
 *
 * @summary ordered and unordered native content lists
 */
export const OrderedAndUnordered: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getAllByRole('list')).toHaveLength(2);
  },
  render: () => (
    <Grid columns={{ base: 1, sm: 2 }} gap="xl">
      <List.Root aria-label="Highlights">
        <List.Item>Short content</List.Item>
        <List.Item>A longer item that can wrap across multiple lines</List.Item>
      </List.Root>
      <List.Root aria-label="Sequence" ordered>
        <List.Item>Prepare</List.Item>
        <List.Item>Review</List.Item>
        <List.Item>Publish</List.Item>
      </List.Root>
    </Grid>
  ),
};
