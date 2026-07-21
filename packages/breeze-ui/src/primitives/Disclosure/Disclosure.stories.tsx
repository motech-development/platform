import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import {
  SharedDisclosurePanel as Panel,
  SharedDisclosureTrigger as Trigger,
} from '../../internal/react-aria/DisclosureParts';
import { Disclosure, Root } from './Disclosure';

const meta = {
  component: Root,
  decorators: [
    (Story) => {
      Object.assign(Disclosure.Panel, { displayName: 'Disclosure.Panel' });
      Object.assign(Disclosure.Root, { displayName: 'Disclosure.Root' });
      Object.assign(Disclosure.Trigger, {
        displayName: 'Disclosure.Trigger',
      });

      return <Story />;
    },
  ] satisfies Decorator[],
  subcomponents: {
    Panel,
    Trigger,
  },
  title: 'Primitives/Navigation/Disclosure',
} satisfies Meta<typeof Root>;
export default meta;
type Story = StoryObj<typeof meta>;

function ControlledDisclosure() {
  const [open, setOpen] = useState(false);

  return (
    <Disclosure.Root onOpenChange={setOpen} open={open}>
      <Disclosure.Trigger>Advanced details</Disclosure.Trigger>
      <Disclosure.Panel role="region">
        Application-owned details and actions.
      </Disclosure.Panel>
    </Disclosure.Root>
  );
}

/**
 * Places expanded state under application control and verifies that the trigger
 * reveals the associated region after activation.
 *
 * @summary controlled expansion and trigger activation
 */
export const Controlled: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Advanced details' });
    const panel = canvas.getByRole('region', { hidden: true });

    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(panel).not.toBeVisible();
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(panel).toBeVisible();
  },
  render: ControlledDisclosure,
};
/**
 * Keeps initially expanded content visible while disabling the trigger so the
 * disclosed information remains readable but cannot be collapsed.
 *
 * @summary disabled trigger with visible expanded content
 */
export const DisabledOpen: Story = {
  args: { children: null, defaultOpen: true, disabled: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      canvas.getByRole('button', { name: 'Unavailable details' }),
    ).toBeDisabled();
    await expect(
      canvas.getByText('Visible but immutable content.'),
    ).toBeVisible();
  },
  render: () => (
    <Disclosure.Root defaultOpen disabled>
      <Disclosure.Trigger>Unavailable details</Disclosure.Trigger>
      <Disclosure.Panel>Visible but immutable content.</Disclosure.Panel>
    </Disclosure.Root>
  ),
};
