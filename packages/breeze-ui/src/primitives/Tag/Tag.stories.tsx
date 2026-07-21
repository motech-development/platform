import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { TagGroup } from '../TagGroup/TagGroup';
import { Tag } from './Tag';

const meta = {
  component: Tag,
  render: (args) => (
    <TagGroup.Root>
      <TagGroup.Label>Tag example</TagGroup.Label>
      <TagGroup.List>
        <Tag
          disabled={args.disabled}
          id={args.id}
          onAction={args.onAction}
          textValue={args.textValue}
        >
          {args.children}
        </Tag>
      </TagGroup.List>
    </TagGroup.Root>
  ),
  title: 'Collections/Tag',
} satisfies Meta<typeof Tag>;
export default meta;
type Story = StoryObj<typeof meta>;
/**
 * Renders one ordinary keyed tag inside the required labelled TagGroup
 * collection so focus and collection semantics are available.
 *
 * @summary static keyed tag in a labelled collection
 */
export const Static: Story = {
  args: { children: 'Open', id: 'open', textValue: 'Open' },
};
/**
 * Prevents focus, selection, semantic actions, and removal for a tag that
 * remains visible as unavailable collection content.
 *
 * @summary disabled tag collection item
 */
export const Disabled: Story = {
  args: {
    children: 'Unavailable',
    disabled: true,
    id: 'off',
    textValue: 'Unavailable',
  },
};
/**
 * Uses a stable numeric collection key to demonstrate that tag identity may be
 * a string or number without leaking application record objects.
 *
 * @summary tag with a stable numeric key
 */
export const NumberKey: Story = {
  args: { children: 'Numeric key', id: 42, textValue: 'Numeric key' },
};
/**
 * Invokes an application-owned semantic action with the stable tag key while
 * the containing group retains collection focus behaviour.
 *
 * @summary actionable tag reporting its stable key
 */
export const Action: Story = {
  args: {
    children: 'Action tag',
    id: 'action',
    onAction: fn(),
    textValue: 'Action tag',
  },
  play: async ({ args, canvasElement }) => {
    await userEvent.dblClick(
      within(canvasElement).getByRole('row', { name: 'Action tag' }),
    );
    await expect(args.onAction).toHaveBeenCalledWith('action');
  },
};
/**
 * Uses an intentionally long visible label to show content pressure within a
 * single tag and the boundary for choosing ordinary text instead.
 *
 * @summary long standalone tag label content
 */
export const Extreme: Story = {
  args: {
    children: 'A very long standalone tag label',
    id: 'long',
    textValue: 'A very long standalone tag label',
  },
};
