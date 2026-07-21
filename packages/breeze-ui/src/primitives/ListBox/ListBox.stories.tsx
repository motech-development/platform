import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import StoryConstraint from '../../../.storybook/StoryConstraint';
import type { CollectionSelection } from '../../internal/types/collection';
import { Stack } from '../Stack/Stack';
import { Item, ListBox, LoadMore, Root } from './ListBox';

const meta = {
  component: Root,
  decorators: [
    (Story) => {
      Object.assign(ListBox.Item, { displayName: 'ListBox.Item' });
      Object.assign(ListBox.LoadMore, { displayName: 'ListBox.LoadMore' });
      Object.assign(ListBox.Root, { displayName: 'ListBox.Root' });

      return <Story />;
    },
  ] satisfies Decorator[],
  subcomponents: {
    Item,
    LoadMore,
  },
  title: 'Collections/ListBox',
} satisfies Meta<typeof Root>;
export default meta;
type Story = StoryObj<typeof meta>;
function Controlled() {
  const [selection, setSelection] = useState<CollectionSelection>([1]);

  return (
    <ListBox.Root
      aria-label="Controlled"
      onSelectionChange={setSelection}
      selection={selection}
    >
      <ListBox.Item id={1} textValue="Alpha">
        Alpha
      </ListBox.Item>
      <ListBox.Item id={2} textValue="Beta">
        Beta
      </ListBox.Item>
    </ListBox.Root>
  );
}
/**
 * Uses static keyed options and verifies that typeahead moves focus to the
 * option whose text value matches the typed character.
 *
 * @summary static options with keyboard typeahead focus
 */
export const StaticKeyboard: Story = {
  args: { 'aria-label': 'People', children: null },
  play: async ({ canvasElement }) => {
    const box = within(canvasElement).getByRole('listbox');
    box.focus();
    await userEvent.keyboard('b');
    await expect(
      within(canvasElement).getByRole('option', { name: 'Bob' }),
    ).toHaveFocus();
  },
  render: () => (
    <ListBox.Root aria-label="People">
      <ListBox.Item id="ada" textValue="Ada">
        Ada
      </ListBox.Item>
      <ListBox.Item id="bob" textValue="Bob">
        Bob
      </ListBox.Item>
    </ListBox.Root>
  ),
};
/**
 * Authors stable keyed items directly and enables multiple selection while
 * leaving selected-state ownership with ListBox.
 *
 * @summary statically authored items with multiple selection
 */
export const MultipleSelection: Story = {
  args: { 'aria-label': 'Items', children: null },
  render: () => (
    <ListBox.Root aria-label="Items" multiple>
      <ListBox.Item id={1} textValue="Alpha">
        Alpha
      </ListBox.Item>
      <ListBox.Item id={2} textValue="Beta">
        Beta
      </ListBox.Item>
    </ListBox.Root>
  ),
};
/**
 * Compares application-controlled mutable selection with an intentionally
 * immutable selected option so state ownership remains explicit.
 *
 * @summary controlled and read-only listbox selection contracts
 */
export const ControlledAndReadOnly: Story = {
  args: { 'aria-label': 'State', children: null },
  render: () => (
    <Stack gap="md">
      <Controlled />
      <ListBox.Root aria-label="Read only" readOnly selection={['one']}>
        <ListBox.Item id="one" textValue="One">
          One
        </ListBox.Item>
      </ListBox.Root>
    </Stack>
  ),
};
/**
 * Demonstrates application-owned empty content beside a required invalid
 * collection whose only option is disabled and unavailable for interaction.
 *
 * @summary empty disabled required and invalid collection states
 */
export const EmptyDisabledInvalid: Story = {
  args: { 'aria-label': 'States', children: null },
  play: async ({ canvasElement }) => {
    const invalidListBox = within(canvasElement).getByRole('listbox', {
      name: 'Invalid',
    });

    await expect(invalidListBox).toHaveAttribute('aria-invalid', 'true');
    await expect(invalidListBox).toHaveAttribute('aria-required', 'true');
  },
  render: () => (
    <Stack gap="md">
      <ListBox.Root aria-label="Empty" emptyContent="No matches">
        {null}
      </ListBox.Root>
      <ListBox.Root
        aria-label="Invalid"
        disabledKeys={['off']}
        invalid
        required
      >
        <ListBox.Item id="off" textValue="Unavailable">
          Unavailable
        </ListBox.Item>
      </ListBox.Root>
    </Stack>
  ),
};
/**
 * Constrains a long option label to a narrow host to show that option content
 * wraps without losing listbox or option semantics.
 *
 * @summary long option content in a narrow listbox
 */
export const ContentExtreme: Story = {
  args: { 'aria-label': 'Long options', children: null },
  render: () => (
    <StoryConstraint size="narrow-control">
      <ListBox.Root aria-label="Long options">
        <ListBox.Item id="long" textValue="Long option">
          A very long option label that wraps in constrained layouts
        </ListBox.Item>
      </ListBox.Root>
    </StoryConstraint>
  ),
};

/**
 * Enables variable-height windowing and renders the loading sentinel for an
 * application-owned pagination request at a bounded viewport height.
 *
 * @summary variable-height listbox virtualization with loading sentinel
 */
export const VariableVirtualizationAndLoading: Story = {
  args: { 'aria-label': 'Virtual options', children: null },
  render: () => (
    <ListBox.Root
      aria-label="Virtual options"
      virtualization={{
        estimatedRowHeight: 44,
        mode: 'variable',
        overscan: 72,
        viewportHeight: 132,
      }}
    >
      <ListBox.Item id="one" textValue="One">
        One
      </ListBox.Item>
      <ListBox.Item id="two" textValue="Two with wrapping content">
        Two with wrapping content that demonstrates live row measurement
      </ListBox.Item>
      <ListBox.LoadMore loading onLoadMore={() => undefined}>
        Loading more options
      </ListBox.LoadMore>
    </ListBox.Root>
  ),
};
