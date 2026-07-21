import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import StoryConstraint from '../../../.storybook/StoryConstraint';
import type { CollectionKey } from '../../internal/types/collection';
import { Item } from '../ListBox/ListBox';
import { Stack } from '../Stack/Stack';
import { Description, Error, Label } from '../TextField/TextField';
import { ListBox, Popover, Root, Select, Trigger, Value } from './Select';

const meta = {
  component: Root,
  decorators: [
    (Story) => {
      Object.assign(Select.Description, {
        displayName: 'Select.Description',
      });
      Object.assign(Select.Error, { displayName: 'Select.Error' });
      Object.assign(Select.Item, { displayName: 'Select.Item' });
      Object.assign(Select.Label, { displayName: 'Select.Label' });
      Object.assign(Select.ListBox, { displayName: 'Select.ListBox' });
      Object.assign(Select.Popover, { displayName: 'Select.Popover' });
      Object.assign(Select.Root, { displayName: 'Select.Root' });
      Object.assign(Select.Trigger, { displayName: 'Select.Trigger' });
      Object.assign(Select.Value, { displayName: 'Select.Value' });

      return <Story />;
    },
  ] satisfies Decorator[],
  subcomponents: {
    Description,
    Error,
    Item,
    Label,
    ListBox,
    Popover,
    Trigger,
    Value,
  },
  title: 'Collections/Select',
} satisfies Meta<typeof Root>;
export default meta;
type Story = StoryObj<typeof meta>;
function Parts() {
  return (
    <>
      <Select.Label>Country</Select.Label>
      <Select.Trigger>
        <Select.Value />
      </Select.Trigger>
      <Select.Popover>
        <Select.ListBox>
          <Select.Item id="gb" textValue="United Kingdom">
            United Kingdom
          </Select.Item>
          <Select.Item id="fr" textValue="France">
            France
          </Select.Item>
        </Select.ListBox>
      </Select.Popover>
    </>
  );
}
function Controlled() {
  const [value, setValue] = useState<CollectionKey | null>('gb');

  return (
    <Select.Root onChange={setValue} value={value}>
      <Parts />
    </Select.Root>
  );
}
/**
 * Renders authored static options and verifies ArrowDown plus Enter opens the
 * popup, commits the first option, and updates the trigger value.
 *
 * @summary static select options with keyboard selection
 */
export const StaticKeyboard: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: /Country/,
    });
    const indicator = trigger.querySelector('[data-breeze-select-indicator]');

    await expect(indicator).toBeVisible();
    await expect(indicator).toHaveAttribute('aria-hidden', 'true');
    trigger.focus();
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await expect(trigger).toHaveTextContent('United Kingdom');
  },
  render: () => (
    <Select.Root>
      <Select.Label>Country</Select.Label>
      <Select.Trigger>
        <Select.Value />
      </Select.Trigger>
      <Select.Popover>
        <Select.ListBox>
          <Select.Item id="gb" textValue="United Kingdom">
            United Kingdom
          </Select.Item>
          <Select.Item id="fr" textValue="France">
            France
          </Select.Item>
        </Select.ListBox>
      </Select.Popover>
    </Select.Root>
  ),
};
/**
 * Authors options directly while preserving stable ids, visible labels, and
 * the shared keyed option contract.
 *
 * @summary statically authored select options
 */
export const Items: Story = {
  args: { children: null },
  render: () => (
    <Select.Root>
      <Parts />
    </Select.Root>
  ),
};
/**
 * Compares an application-controlled select with an immutable selected value
 * whose trigger cannot open or change the option popup.
 *
 * @summary controlled and read-only select values
 */
export const ControlledAndReadOnly: Story = {
  args: { children: null },
  render: () => (
    <Stack gap="md">
      <Controlled />
      <Select.Root readOnly value="fr">
        <Parts />
      </Select.Root>
    </Stack>
  ),
};
/**
 * Places disabled and required invalid selects inside a native form to expose
 * field state, naming, and form-participation behavior.
 *
 * @summary disabled and invalid select form states
 */
export const StatesAndForm: Story = {
  args: { children: null },
  render: () => (
    <form id="form">
      <Select.Root disabled name="country">
        <Parts />
      </Select.Root>
      <Select.Root invalid required name="required">
        <Parts />
      </Select.Root>
    </form>
  ),
};
/**
 * Opens an empty collection and verifies authored empty content appears inside
 * the accessible option surface.
 *
 * @summary open select with application-owned empty content
 */
export const EmptyCollection: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: /Country/,
    });

    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(
      within(canvasElement.ownerDocument.body).getByRole('option', {
        name: 'No countries',
      }),
    ).toBeVisible();
  },
  render: () => (
    <Select.Root placeholder="No countries available">
      <Select.Label>Country</Select.Label>
      <Select.Trigger>
        <Select.Value />
      </Select.Trigger>
      <Select.Popover>
        <Select.ListBox emptyContent="No countries">{null}</Select.ListBox>
      </Select.Popover>
    </Select.Root>
  ),
};
/**
 * Constrains a select with a long placeholder to document trigger truncation
 * and stable field width before any option is selected.
 *
 * @summary long select placeholder in a narrow field
 */
export const Extreme: Story = {
  args: { children: null },
  render: () => (
    <StoryConstraint size="narrow-control">
      <Select.Root placeholder="Choose an option with a long placeholder">
        <Parts />
      </Select.Root>
    </StoryConstraint>
  ),
};
