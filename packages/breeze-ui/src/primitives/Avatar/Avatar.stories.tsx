import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Inline } from '../Inline/Inline';
import { Avatar } from './Avatar';

const meta = {
  component: Avatar,
  title: 'Foundation/Avatar',
} satisfies Meta<typeof Avatar>;
export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Omits `src` so Avatar derives the deterministic initials “AL” from the
 * accessible person name; use this as the baseline fallback configuration.
 *
 * @summary Deterministic initials fallback from a person name.
 */
export const Initials: Story = {
  args: { name: 'Ada Lovelace' },
};
/**
 * Supplies both `src` and `name`, showing the image presentation while
 * retaining the name for alternative text and automatic fallback if loading
 * fails.
 *
 * @summary Image avatar with named fallback behaviour.
 */
export const Image: Story = {
  args: {
    name: 'Grace Hopper',
    src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=128&q=80',
  },
};
/**
 * Renders the same initials at `sm`, `md`, and `lg` to compare canonical
 * person-avatar sizes without changing identity or semantics.
 *
 * @summary Comparison of the three canonical avatar sizes.
 */
export const Sizes: Story = {
  args: { name: 'Alan Turing' },
  render: ({ name }) => (
    <Inline gap="md" wrap={false}>
      <Avatar name={name} size="sm" />
      <Avatar name={name} size="md" />
      <Avatar name={name} size="lg" />
    </Inline>
  ),
};
/**
 * Uses `shape="square"` with an explicit one-character initials override for a
 * compact non-person entity marker.
 *
 * @summary Compact square marker for an entity rather than a person.
 */
export const SquareEntity: Story = {
  args: {
    initials: 'E',
    name: 'Example Team',
    shape: 'square',
    size: 'sm',
  },
};
/**
 * Compares compact and medium square entity markers in primary and accent
 * tones, verifying equal geometry, square corners, and the semantic accent
 * treatment.
 *
 * @summary Square entity-marker sizes and semantic tones.
 */
export const EntityMarkers: Story = {
  args: { name: 'Entity' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const compact = canvas.getByRole('img', { name: 'Compact entity' });
    const primary = canvas.getByRole('img', { name: 'Primary context' });
    const accent = canvas.getByRole('img', { name: 'Alternate context' });
    const view = canvasElement.ownerDocument.defaultView;

    await expect(compact.getBoundingClientRect().width).toBe(
      compact.getBoundingClientRect().height,
    );
    await expect(primary.getBoundingClientRect().width).toBe(
      primary.getBoundingClientRect().height,
    );
    await expect(accent.getBoundingClientRect().width).toBe(
      primary.getBoundingClientRect().width,
    );
    await expect(view?.getComputedStyle(primary).borderRadius).toBe('0px');
    await expect(view?.getComputedStyle(accent).backgroundColor).toBe(
      'rgb(242, 233, 255)',
    );
    await expect(view?.getComputedStyle(accent).color).toBe(
      'rgb(110, 54, 167)',
    );
  },
  render: () => (
    <Inline gap="md" wrap={false}>
      <Avatar initials="C" name="Compact entity" shape="square" size="sm" />
      <Avatar initials="P" name="Primary context" shape="square" size="md" />
      <Avatar
        initials="A"
        name="Alternate context"
        shape="square"
        size="md"
        tone="accent"
      />
    </Inline>
  ),
};
