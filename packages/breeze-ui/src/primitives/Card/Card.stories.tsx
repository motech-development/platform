import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, within } from 'storybook/test';
import { Link } from '../Link/Link';
import { RowList, type RowListItemDescriptor } from '../RowList/RowList';
import { Stack } from '../Stack/Stack';
import { Typography } from '../Typography/Typography';
import { Card } from './Card';

const activity = [
  {
    description: 'Card payment',
    icon: 'document',
    id: 'coffee',
    label: 'Coffee shop',
    value: { currency: 'GBP', format: 'currency', value: -4.75 },
  },
  {
    description: 'Bank transfer',
    icon: 'document',
    id: 'invoice',
    label: 'Invoice 1042',
    value: { currency: 'GBP', format: 'currency', value: 1200 },
  },
] satisfies RowListItemDescriptor[];

function getDescriptor(item: RowListItemDescriptor) {
  return item;
}

const meta = {
  args: {
    children: (
      <Stack gap={1}>
        <Typography variant="title">Release notes</Typography>
        <Typography tone="secondary" variant="body">
          Updated guidance for three components
        </Typography>
      </Stack>
    ),
  },
  component: Card,
  title: 'Content/Card',
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The default surface card with panel elevation. */
export const Surface: Story = {};

/** A raised neutral card for content nested within a surface. */
export const Raised: Story = {
  args: {
    variant: 'raised',
  },
};

/** A titled panel with a count beside its heading. */
export const TitledWithCount: Story = {
  args: {
    children: (
      <Typography tone="secondary" variant="body">
        Two receipts are waiting to be matched.
      </Typography>
    ),
    count: 2,
    element: 'section',
    title: 'Needs you',
  },
};

/** A form panel whose header describes it under the title, with a trailing action. */
export const TitledWithDescription: Story = {
  args: {
    action: <Link href="#categories">Add category</Link>,
    children: (
      <Typography tone="secondary" variant="body">
        Vehicle, Office, Travel
      </Typography>
    ),
    description:
      'Each one carries the VAT rate used when you record a purchase.',
    element: 'section',
    title: 'Expense categories',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const title = canvas
      .getByRole('heading', { name: 'Expense categories' })
      .getBoundingClientRect();
    const description = canvas.getByText(/^Each one carries/);

    await expect(getComputedStyle(description).fontSize).toBe('12px');
    await expect(
      description.getBoundingClientRect().top,
    ).toBeGreaterThanOrEqual(title.bottom);
    await expect(description.getBoundingClientRect().left).toBe(title.left);
  },
};

/** A titled panel with a trailing action and flush rows. */
export const TitledWithAction: Story = {
  args: {
    action: <Link href="#money">View all money</Link>,
    children: (
      <RowList
        aria-label="Recent activity"
        getItem={getDescriptor}
        items={activity}
        onAction={fn()}
      />
    ),
    element: 'section',
    padding: 0,
    title: 'Recent activity',
  },
};
