import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Button } from '../../primitives/Button/Button';
import { SectionHeader } from './SectionHeader';

/**
 * Aligns a content-section heading and concise supporting context with one
 * directly related application action.
 *
 * @summary content-section heading with context and one related action
 */
const meta = {
  component: SectionHeader,
  title: 'Patterns/Page Structure/SectionHeader',
} satisfies Meta<typeof SectionHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Aligns a section heading and concise description with one low-emphasis
 * action, making the relationship clear without creating page-level hierarchy.
 *
 * @summary section heading and description with one related action
 */
export const WithAction: Story = {
  args: {
    action: <Button appearance="ghost">View all updates</Button>,
    description: 'Latest changes across the workspace',
    title: 'Recent updates',
  },
};

/**
 * Exercises the same section composition at the canonical compact viewport to
 * verify the action stays aligned without obscuring or displacing the heading.
 *
 * @summary compact section header retaining heading-action alignment
 */
export const CompactAction: Story = {
  ...WithAction,
  globals: { viewport: { value: 'mobile1' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const heading = canvas.getByRole('heading', { name: 'Recent updates' });
    const action = canvas.getByRole('button', { name: 'View all updates' });

    await expect(action.getBoundingClientRect().top).toBeLessThan(
      heading.getBoundingClientRect().bottom + 1,
    );
  },
};
