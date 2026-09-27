import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, within } from 'storybook/test';
import type { ItemDescriptor } from '../Collection/item.types';
import { Menu } from './Menu';

const actions = [
  {
    badge: {
      children: 'New',
      variant: 'brand',
    },
    icon: 'settings',
    id: 'settings',
    label: 'Settings',
  },
  {
    description: 'End the current session.',
    icon: 'signOut',
    id: 'sign-out',
    label: 'Sign out',
  },
  {
    disabled: true,
    id: 'unavailable',
    label: 'Unavailable action',
  },
] satisfies ItemDescriptor[];

const meta = {
  args: {
    defaultOpen: true,
    getItem: (item: unknown) => item as ItemDescriptor,
    items: actions,
    trigger: 'Account actions',
    triggerIcon: 'people',
  },
  component: Menu,
  title: 'Overlays/Menu',
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A compact set of account actions. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Account actions',
    });
    const menu = await within(document.body).findByRole('menu', {
      name: 'Account actions',
    });
    const popover = menu.closest('.breeze-popover');

    if (!popover) throw new Error('The menu popover was not rendered.');

    const widthDelta =
      Number.parseFloat(getComputedStyle(popover).minInlineSize) -
      trigger.getBoundingClientRect().width;

    await expect(Math.abs(widthDelta)).toBeLessThan(1);
  },
};

function ControlledExample() {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState('none');

  return (
    <div className="breeze-story-action">
      <Menu
        getItem={(item) => item}
        items={actions}
        onAction={(descriptor) => setAction(descriptor.label)}
        onOpenChange={setOpen}
        open={open}
        trigger="Account actions"
        triggerIcon="people"
      />
      <output>
        Menu is {open ? 'open' : 'closed'}. Last action: {action}.
      </output>
    </div>
  );
}

/** Control visibility and receive the selected item's details. */
export const Controlled: Story = {
  render: () => <ControlledExample />,
};
