import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import type { CollectionKey } from '../../internal/types/collection';
import { List, Panel, Panels, Root, Tab, Tabs } from './Tabs';

const meta = {
  component: Root,
  decorators: [
    (Story) => {
      Object.assign(Tabs.List, { displayName: 'Tabs.List' });
      Object.assign(Tabs.Panel, { displayName: 'Tabs.Panel' });
      Object.assign(Tabs.Panels, { displayName: 'Tabs.Panels' });
      Object.assign(Tabs.Root, { displayName: 'Tabs.Root' });
      Object.assign(Tabs.Tab, { displayName: 'Tabs.Tab' });

      return <Story />;
    },
  ] satisfies Decorator[],
  subcomponents: {
    List,
    Panel,
    Panels,
    Tab,
  },
  title: 'Primitives/Navigation/Tabs',
} satisfies Meta<typeof Root>;
export default meta;
type Story = StoryObj<typeof meta>;

function ControlledTabs() {
  const [value, setValue] = useState<CollectionKey>('profile');

  return (
    <Tabs.Root onChange={setValue} value={value}>
      <Tabs.List aria-label="Workspace settings">
        <Tabs.Tab id="profile">Profile</Tabs.Tab>
        <Tabs.Tab id={2}>Security</Tabs.Tab>
        <Tabs.Tab disabled id="advanced">
          Advanced
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panels>
        <Tabs.Panel id="profile">Profile settings</Tabs.Panel>
        <Tabs.Panel id={2}>Security settings</Tabs.Panel>
        <Tabs.Panel id="advanced">Advanced settings</Tabs.Panel>
      </Tabs.Panels>
    </Tabs.Root>
  );
}

/**
 * Keeps selection in application state while verifying horizontal arrow-key
 * activation, matching panel visibility, and disabled-tab skipping.
 *
 * @summary controlled horizontal tabs with keyboard navigation
 */
export const ControlledKeyboardAndDisabled: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const profile = canvas.getByRole('tab', { name: 'Profile' });
    const security = canvas.getByRole('tab', { name: 'Security' });

    profile.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(security).toHaveFocus();
    await expect(security).toHaveAttribute('aria-selected', 'true');
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent(
      'Security settings',
    );
    await expect(canvas.getByRole('tab', { name: 'Advanced' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  },
  render: ControlledTabs,
};
/**
 * Presents a vertical tab list whose controlled selection is intentionally
 * immutable even when another enabled tab is clicked.
 *
 * @summary vertical read-only tab selection
 */
export const VerticalReadOnly: Story = {
  args: { children: null, orientation: 'vertical', readOnly: true, value: 2 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const firstTab = canvas.getByRole('tab', { name: 'One' });
    const selectedTab = canvas.getByRole('tab', { name: 'Two' });

    await userEvent.click(firstTab);
    await expect(selectedTab).toHaveAttribute('aria-selected', 'true');
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('Two');
  },
  render: () => (
    <Tabs.Root orientation="vertical" readOnly value={2}>
      <Tabs.List aria-label="Read only tabs">
        <Tabs.Tab id="one">One</Tabs.Tab>
        <Tabs.Tab id={2}>Two</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel id="one">One</Tabs.Panel>
      <Tabs.Panel id={2}>Two</Tabs.Panel>
    </Tabs.Root>
  ),
};
