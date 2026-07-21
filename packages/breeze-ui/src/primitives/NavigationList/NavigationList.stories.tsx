import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Stack } from '../Stack/Stack';
import { Item, NavigationList, Root } from './NavigationList';

const meta = {
  component: Root,
  decorators: [
    (Story) => {
      Object.assign(NavigationList.Item, {
        displayName: 'NavigationList.Item',
      });
      Object.assign(NavigationList.Root, {
        displayName: 'NavigationList.Root',
      });

      return <Story />;
    },
  ] satisfies Decorator[],
  subcomponents: { Item },
  title: 'Primitives/Navigation/NavigationList',
} satisfies Meta<typeof Root>;
export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Compares vertical and horizontal labelled navigation landmarks while
 * preserving current-page and disabled destination semantics in each layout.
 *
 * @summary navigation orientations with current and disabled destinations
 */
export const StatesAndOrientations: Story = {
  args: { 'aria-label': 'Vertical navigation', children: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getAllByRole('navigation')).toHaveLength(2);
    await Promise.all(
      canvas
        .getAllByRole('link', { name: 'Overview' })
        .map((link) => expect(link).toHaveAttribute('aria-current', 'page')),
    );
    await Promise.all(
      canvas
        .getAllByText('Admin')
        .map((item) => expect(item).toHaveAttribute('aria-disabled', 'true')),
    );
  },
  render: () => (
    <Stack gap="xl">
      <NavigationList.Root aria-label="Vertical navigation">
        <NavigationList.Item current href="/overview" id="overview">
          Overview
        </NavigationList.Item>
        <NavigationList.Item href="/team" id={2}>
          Team
        </NavigationList.Item>
        <NavigationList.Item disabled href="/admin" id="admin">
          Admin
        </NavigationList.Item>
      </NavigationList.Root>
      <NavigationList.Root
        aria-label="Horizontal navigation"
        orientation="horizontal"
      >
        <NavigationList.Item current href="/overview" id="overview">
          Overview
        </NavigationList.Item>
        <NavigationList.Item href="/team" id={2}>
          Team
        </NavigationList.Item>
        <NavigationList.Item disabled href="/admin" id="admin">
          Admin
        </NavigationList.Item>
      </NavigationList.Root>
    </Stack>
  ),
};
