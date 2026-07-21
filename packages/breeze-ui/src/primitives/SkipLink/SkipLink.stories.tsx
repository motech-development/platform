import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { SkipLink } from './SkipLink';

/**
 * Reveals a native main-content fragment link on keyboard focus so users can
 * bypass repeated application chrome.
 *
 * @summary focus-revealed bypass link to a main-content target
 */
const meta = {
  component: SkipLink,
  title: 'Primitives/Navigation/SkipLink',
} satisfies Meta<typeof SkipLink>;
export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Places the bypass link before repeated page chrome, verifies its native
 * fragment target, and reveals it as the first destination in keyboard order.
 *
 * @summary first-tab bypass link targeting focusable main content
 */
export const KeyboardFocus: Story = {
  args: { children: 'Skip to main content', targetId: 'story-main' },
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link', {
      name: 'Skip to main content',
    });

    await expect(link).toHaveAttribute('href', '#story-main');
    await userEvent.tab();
    await expect(link).toHaveFocus();
  },
  render: () => (
    <>
      <SkipLink targetId="story-main">Skip to main content</SkipLink>
      <header>Repeated navigation</header>
      <main id="story-main" tabIndex={-1}>
        Main content
      </main>
    </>
  ),
};
