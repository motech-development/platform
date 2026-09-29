import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../primitives/Button/Button';
import { PageHeader } from './PageHeader';

const meta = {
  component: PageHeader,
  title: 'Patterns/PageHeader',
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A page title with supporting description. */
export const Default: Story = {
  args: {
    description: 'A short summary that helps explain the page content.',
    title: 'Overview',
  },
};

/** Application-owned actions sit beside the heading on wide layouts. */
export const WithActions: Story = {
  args: {
    actions: (
      <div className="breeze-story-row">
        <Button variant="secondary">Export</Button>
        <Button>Create report</Button>
      </div>
    ),
    description: 'Review recent activity and create a report.',
    title: 'Activity',
  },
};
