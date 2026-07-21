import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import {
  SharedDisclosurePanel as Panel,
  SharedDisclosureTrigger as Trigger,
} from '../../internal/react-aria/DisclosureParts';
import { Accordion, Item, Root } from './Accordion';

const meta = {
  component: Root,
  decorators: [
    (Story) => {
      Object.assign(Accordion.Item, { displayName: 'Accordion.Item' });
      Object.assign(Accordion.Panel, { displayName: 'Accordion.Panel' });
      Object.assign(Accordion.Root, { displayName: 'Accordion.Root' });
      Object.assign(Accordion.Trigger, { displayName: 'Accordion.Trigger' });

      return <Story />;
    },
  ] satisfies Decorator[],
  subcomponents: {
    Item,
    Panel,
    Trigger,
  },
  title: 'Primitives/Navigation/Accordion',
} satisfies Meta<typeof Root>;
export default meta;
type Story = StoryObj<typeof meta>;

const items = (
  <>
    <Accordion.Item id={1}>
      <Accordion.Trigger>First section</Accordion.Trigger>
      <Accordion.Panel>First content</Accordion.Panel>
    </Accordion.Item>
    <Accordion.Item id="second">
      <Accordion.Trigger>Second section</Accordion.Trigger>
      <Accordion.Panel>Second content</Accordion.Panel>
    </Accordion.Item>
    <Accordion.Item disabled id="disabled">
      <Accordion.Trigger>Disabled section</Accordion.Trigger>
      <Accordion.Panel>Unavailable content</Accordion.Panel>
    </Accordion.Item>
  </>
);

/**
 * Shows the default single-expansion contract with a numeric item id initially
 * open. Activating the second trigger closes the first, so use this shape when
 * only one section should be visible.
 *
 * @summary Uncontrolled single expansion with mixed string and number item ids.
 */
export const SingleUncontrolled: Story = {
  args: { children: items, defaultValue: [1] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const firstTrigger = canvas.getByRole('button', {
      name: 'First section',
    });
    const secondTrigger = canvas.getByRole('button', {
      name: 'Second section',
    });

    await expect(firstTrigger).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByText('First content')).toBeVisible();
    await userEvent.click(secondTrigger);
    await expect(firstTrigger).toHaveAttribute('aria-expanded', 'false');
    await expect(secondTrigger).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByText('First content')).not.toBeVisible();
    await expect(canvas.getByText('Second content')).toBeVisible();
  },
};
/**
 * Enables `multiple` and initializes two item ids in `defaultValue`,
 * demonstrating the independent expansion policy used when readers need to
 * compare several panels.
 *
 * @summary Multiple independently expanded accordion items.
 */
export const Multiple: Story = {
  args: { children: items, defaultValue: [1, 'second'], multiple: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('First content')).toBeVisible();
    await expect(canvas.getByText('Second content')).toBeVisible();
  },
};
/**
 * Supplies immutable controlled `value` with `readOnly`, proving triggers
 * remain inspectable without changing expansion and that an item-level
 * `disabled` trigger stays unavailable.
 *
 * @summary Immutable controlled expansion with one disabled item.
 */
export const ReadOnly: Story = {
  args: { children: items, readOnly: true, value: ['second'] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const firstTrigger = canvas.getByRole('button', {
      name: 'First section',
    });

    await userEvent.click(firstTrigger);
    await expect(firstTrigger).toHaveAttribute('aria-expanded', 'false');
    await expect(
      canvas.getByRole('button', { name: 'Second section' }),
    ).toHaveAttribute('aria-expanded', 'true');
    await expect(
      canvas.getByRole('button', { name: 'Disabled section' }),
    ).toBeDisabled();
  },
};
