import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Pagination } from './Pagination';

const meta = {
  component: Pagination,
  title: 'Patterns/Navigation/Pagination',
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Shows a middle page in a long known range, including compact ellipsis gaps,
 * first and last page access, and a verified next-page request.
 *
 * @summary many-page navigation with a current middle page
 */
export const ManyPages: Story = {
  args: {
    'aria-label': 'Example results pages',
    currentPage: 4,
    onChange: fn(),
    pageCount: 12,
  },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Next page' }),
    );
    await expect(args.onChange).toHaveBeenCalledWith(5);
  },
};

/**
 * Shows the one-page boundary where the current page is the only entry and
 * both directional navigation actions are unavailable.
 *
 * @summary single-page range with disabled boundary actions
 */
export const SinglePage: Story = {
  args: {
    'aria-label': 'Example results pages',
    currentPage: 1,
    onChange: fn(),
    pageCount: 1,
  },
};
