import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Item, List, Menu, Popover, Root, Submenu, Trigger } from './Menu';

const meta = {
  component: Root,
  decorators: [
    (Story) => {
      Object.assign(Menu.Item, { displayName: 'Menu.Item' });
      Object.assign(Menu.List, { displayName: 'Menu.List' });
      Object.assign(Menu.Popover, { displayName: 'Menu.Popover' });
      Object.assign(Menu.Root, { displayName: 'Menu.Root' });
      Object.assign(Menu.Submenu, { displayName: 'Menu.Submenu' });
      Object.assign(Menu.Trigger, { displayName: 'Menu.Trigger' });

      return <Story />;
    },
  ] satisfies Decorator[],
  subcomponents: {
    Item,
    List,
    Popover,
    Submenu,
    Trigger,
  },
  title: 'Primitives/Navigation/Menu',
} satisfies Meta<typeof Root>;
export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Opens a static action menu, enters a nested submenu with ArrowRight, and
 * verifies Escape returns focus and context to the parent menu.
 *
 * @summary static nested menu keyboard focus lifecycle
 */
export const StaticNestedKeyboardAndTouch: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(document.body);

    await userEvent.click(canvas.getByRole('button', { name: 'Actions' }));

    const share = page.getByRole('menuitem', { name: 'Share' });

    share.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(page.getByRole('menu', { name: 'Share' })).toBeVisible();

    await userEvent.keyboard('{Escape}');

    await expect(
      page.queryByRole('menu', { name: 'Share' }),
    ).not.toBeInTheDocument();
    await expect(page.getByRole('menu', { name: 'Actions' })).toBeVisible();
    await waitFor(() => expect(share).toHaveFocus());
  },
  render: () => (
    <Menu.Root>
      <Menu.Trigger>Actions</Menu.Trigger>
      <Menu.Popover>
        <Menu.List aria-label="Actions">
          <Menu.Item id="edit" textValue="Edit">
            Edit
          </Menu.Item>
          <Menu.Item disabled id={2} textValue="Archive">
            Archive
          </Menu.Item>
          <Menu.Submenu>
            <Menu.Item id="share" textValue="Share">
              Share
            </Menu.Item>
            <Menu.Popover>
              <Menu.List aria-label="Share">
                <Menu.Item id="email" textValue="Email">
                  Email
                </Menu.Item>
              </Menu.List>
            </Menu.Popover>
          </Menu.Submenu>
        </Menu.List>
      </Menu.Popover>
    </Menu.Root>
  ),
};
/**
 * Authors density choices directly with an intentionally immutable selected
 * key in an initially open menu.
 *
 * @summary statically authored menu items with read-only selection
 */
export const ReadOnlySelection: Story = {
  args: { children: null },
  render: () => (
    <Menu.Root defaultOpen>
      <Menu.Trigger>Density</Menu.Trigger>
      <Menu.Popover>
        <Menu.List aria-label="Density" readOnly selection={[1]}>
          <Menu.Item id={1} textValue="Compact">
            Compact
          </Menu.Item>
          <Menu.Item id="comfortable" textValue="Comfortable">
            Comfortable
          </Menu.Item>
        </Menu.List>
      </Menu.Popover>
    </Menu.Root>
  ),
};
