import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { MenuIcon } from '../../icons';
import { Button } from '../Button/Button';
import { VisuallyHidden } from './VisuallyHidden';

/**
 * Keeps concise supporting text available to assistive technology while
 * removing the span from ordinary visual layout.
 *
 * @summary visually concealed text available to assistive technology
 */
const meta = {
  component: VisuallyHidden,
  title: 'Foundation/VisuallyHidden',
} satisfies Meta<typeof VisuallyHidden>;
export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Adds screen-reader-only text beside a decorative menu icon so an otherwise
 * icon-only button receives a concise accessible name without visible copy.
 *
 * @summary accessible icon action named by visually hidden text
 */
export const AccessibleIconAction: Story = {
  args: { children: 'Open navigation' },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Open navigation' }),
    ).toBeVisible();
  },
  render: ({ children }) => (
    <Button>
      <MenuIcon />
      <VisuallyHidden>{children}</VisuallyHidden>
    </Button>
  ),
};
