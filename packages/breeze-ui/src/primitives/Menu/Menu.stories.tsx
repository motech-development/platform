import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
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

/** A descriptor-backed action menu with aligned optional icons. */
export const Default: Story = {};

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

/** The application owns visibility and receives descriptor actions. */
export const Controlled: Story = {
  render: () => <ControlledExample />,
};
