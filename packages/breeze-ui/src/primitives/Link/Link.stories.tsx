import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { ExternalLinkIcon } from '../../icons';
import { Inline } from '../Inline/Inline';
import { Link } from './Link';

const meta = {
  component: Link,
  title: 'Foundation/Link',
} satisfies Meta<typeof Link>;
export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Renders an internal destination with a real href so the provider router can
 * enhance ordinary activation without changing native link semantics.
 *
 * @summary internal router-neutral destination with a native href
 */
export const Internal: Story = {
  args: { children: 'Preferences', href: '/preferences' },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('link', { name: 'Preferences' }),
    ).toHaveAttribute('href', '/preferences');
  },
};
/**
 * Compares semantic text colours with the disabled state so inline navigation
 * emphasis can match its surrounding content and consequence.
 *
 * @summary semantic link variants and disabled navigation
 */
export const Variants: Story = {
  args: { children: 'Link', href: '/target' },
  render: () => (
    <Inline align="stretch" gap="md" wrap={false}>
      <Link href="/primary">Primary</Link>
      <Link href="/muted" variant="muted">
        Muted
      </Link>
      <Link href="/remove" variant="danger">
        Danger
      </Link>
      <Link disabled href="/disabled">
        Disabled
      </Link>
    </Inline>
  ),
};
/**
 * Opens an external destination in a new browsing context with a decorative
 * icon while preserving the browser's native target and rel behaviour.
 *
 * @summary external destination with native alternate-target behaviour
 */
export const External: Story = {
  args: {
    children: (
      <>
        Example website <ExternalLinkIcon />
      </>
    ),
    href: 'https://example.com',
    rel: 'noreferrer',
    target: '_blank',
  },
};
