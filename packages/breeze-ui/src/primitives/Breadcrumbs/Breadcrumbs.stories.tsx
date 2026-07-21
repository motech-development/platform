import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Breadcrumbs, Item, Root } from './Breadcrumbs';

const meta = {
  component: Root,
  decorators: [
    (Story) => {
      Object.assign(Breadcrumbs.Item, { displayName: 'Breadcrumbs.Item' });
      Object.assign(Breadcrumbs.Root, { displayName: 'Breadcrumbs.Root' });

      return <Story />;
    },
  ] satisfies Decorator[],
  subcomponents: { Item },
  title: 'Primitives/Navigation/Breadcrumbs',
} satisfies Meta<typeof Root>;
export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Builds a labelled hierarchy with string and number ids, navigable ancestors,
 * a wrapping long intermediate label, and a non-link final item marked as the
 * current page.
 *
 * @summary Navigable breadcrumb ancestors, long content, and current-page semantics.
 */
export const RoutingAndExtremes: Story = {
  args: { 'aria-label': 'Breadcrumb', children: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('link', { name: 'Home' })).toHaveAttribute(
      'href',
      '/',
    );
    await expect(canvas.getByText('Current page')).toHaveAttribute(
      'aria-current',
      'page',
    );
  },
  render: () => (
    <Breadcrumbs.Root aria-label="Breadcrumb">
      <Breadcrumbs.Item href="/" id="home">
        Home
      </Breadcrumbs.Item>
      <Breadcrumbs.Item href="/very-long" id={2}>
        A very long intermediate hierarchy label that wraps safely
      </Breadcrumbs.Item>
      <Breadcrumbs.Item id="current">Current page</Breadcrumbs.Item>
    </Breadcrumbs.Root>
  ),
};
