import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { SkipLink } from './SkipLink';

const meta = {
  args: {
    targetId: 'skip-link-story-main',
  },
  component: SkipLink,
  title: 'Accessibility/SkipLink',
} satisfies Meta<typeof SkipLink>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The first Tab reveals a link that moves focus into the main landmark. */
export const KeyboardNavigation: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.keyboard('{Tab}');
    const skipLink = canvas.getByRole('link', {
      name: 'Skip to main content',
    });
    await expect(skipLink).toHaveFocus();
    await expect(skipLink).toBeVisible();
    await expect(skipLink.getBoundingClientRect().width).toBeGreaterThan(1);
    await expect(skipLink.getBoundingClientRect().height).toBeGreaterThan(1);

    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByRole('main')).toHaveFocus();
  },
  render: ({ targetId }) => (
    <div className="breeze-story-stack">
      <SkipLink targetId={targetId} />
      <main id={targetId} tabIndex={-1}>
        <h1>Page content</h1>
        <p>Keyboard focus arrives here after activating the skip link.</p>
      </main>
    </div>
  ),
};
