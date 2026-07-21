import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import StoryConstraint from '../../../.storybook/StoryConstraint';
import type { CollectionSelection } from '../../internal/types/collection';
import { Tag } from '../Tag/Tag';
import { Description, Label } from '../TextField/TextField';
import { List, Root, TagGroup } from './TagGroup';

const meta = {
  component: Root,
  decorators: [
    (Story) => {
      Object.assign(TagGroup.Description, {
        displayName: 'TagGroup.Description',
      });
      Object.assign(TagGroup.Label, { displayName: 'TagGroup.Label' });
      Object.assign(TagGroup.List, { displayName: 'TagGroup.List' });
      Object.assign(TagGroup.Root, { displayName: 'TagGroup.Root' });

      return <Story />;
    },
  ] satisfies Decorator[],
  subcomponents: {
    Description,
    Label,
    List,
  },
  title: 'Collections/TagGroup',
} satisfies Meta<typeof Root>;
export default meta;
type Story = StoryObj<typeof meta>;
function Controlled() {
  const [selection, setSelection] = useState<CollectionSelection>([1]);

  return (
    <TagGroup.Root onSelectionChange={setSelection} selection={selection}>
      <TagGroup.Label>Controlled</TagGroup.Label>
      <TagGroup.List>
        <Tag id={1} textValue="Open">
          Open
        </Tag>
        <Tag id={2} textValue="Paid">
          Paid
        </Tag>
      </TagGroup.List>
    </TagGroup.Root>
  );
}
/**
 * Selects a statically authored keyed tag through the collection interaction
 * model and exposes the resulting selected state semantically.
 *
 * @summary static selectable tags with keyboard semantics
 */
export const StaticKeyboard: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    const tag = within(canvasElement).getByRole('row', { name: 'Open' });
    await userEvent.click(tag);
    await expect(tag).toHaveAttribute('aria-selected', 'true');
  },
  render: () => (
    <TagGroup.Root onSelectionChange={() => undefined}>
      <TagGroup.Label>Filters</TagGroup.Label>
      <TagGroup.List>
        <Tag id="open" textValue="Open">
          Open
        </Tag>
        <Tag id="paid" textValue="Paid">
          Paid
        </Tag>
      </TagGroup.List>
    </TagGroup.Root>
  ),
};
/**
 * Authors tags directly with stable numeric identities and visible text used
 * by the collection interaction model.
 *
 * @summary statically authored tag collection items
 */
export const Items: Story = {
  args: { children: null },
  render: () => (
    <TagGroup.Root>
      <TagGroup.Label>Items</TagGroup.Label>
      <TagGroup.List>
        <Tag id={1} textValue="Open">
          Open
        </Tag>
        <Tag id={2} textValue="Paid">
          Paid
        </Tag>
      </TagGroup.List>
    </TagGroup.Root>
  ),
};
/**
 * Compares application-controlled multiple selection with an intentionally
 * immutable selected collection using the same keyed item model.
 *
 * @summary controlled and read-only tag selections
 */
export const ControlledAndReadOnly: Story = {
  args: { children: null },
  render: () => (
    <div>
      <Controlled />
      <TagGroup.Root readOnly selection={[1]}>
        <TagGroup.Label>Read only</TagGroup.Label>
        <TagGroup.List>
          <Tag id={1} textValue="Open">
            Open
          </Tag>
          <Tag id={2} textValue="Paid">
            Paid
          </Tag>
        </TagGroup.List>
      </TagGroup.Root>
    </div>
  ),
};
/**
 * Demonstrates application-owned empty content while retaining the root-level
 * disabled-key contract used when items are later supplied.
 *
 * @summary empty tag list with disabled-key configuration
 */
export const EmptyDisabled: Story = {
  args: { children: null },
  render: () => (
    <TagGroup.Root disabledKeys={[2]}>
      <TagGroup.Label>States</TagGroup.Label>
      <TagGroup.List emptyContent="No tags">{null}</TagGroup.List>
    </TagGroup.Root>
  ),
};
/**
 * Wraps a long selected-value label inside a narrow collection host to verify
 * that the tag group remains readable without horizontal overflow.
 *
 * @summary long tag content in a narrow collection
 */
export const Extreme: Story = {
  args: { children: null },
  render: () => (
    <StoryConstraint size="narrow-control">
      <TagGroup.Root>
        <TagGroup.Label>Long labels</TagGroup.Label>
        <TagGroup.List>
          <Tag id="long" textValue="Long">
            A very long tag that wraps
          </Tag>
        </TagGroup.List>
      </TagGroup.Root>
    </StoryConstraint>
  ),
};
