import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Stack } from '../Stack/Stack';
import { Typography } from './Typography';

const meta = {
  component: Typography,
  title: 'Content/Typography',
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The text hierarchy used by Breeze interfaces. */
export const Roles: Story = {
  args: {
    children: 'Typography',
  },
  render: () => (
    <Stack gap={3}>
      <Typography variant="heading">Page heading</Typography>
      <Typography variant="title">Panel title</Typography>
      <Typography variant="body">Body text explains the content.</Typography>
      <Typography tone="muted" variant="caption">
        Caption and metadata
      </Typography>
      <Typography tone="muted" variant="label">
        Field label
      </Typography>
      <Typography tone="muted" variant="micro">
        Column heading
      </Typography>
    </Stack>
  ),
};

/** Numeric headings use figure styling without tightening interface headings. */
export const FiguresAndInterfaceText: Story = {
  args: {
    children: 'Typography',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const figure = canvas.getByText('128');
    const interfaceHeading = canvas.getByText('Overview');

    await expect(getComputedStyle(figure).fontVariantNumeric).toContain(
      'tabular-nums',
    );
    await expect(getComputedStyle(figure).letterSpacing).not.toBe('normal');
    await expect(getComputedStyle(interfaceHeading).letterSpacing).toBe(
      'normal',
    );
  },
  render: () => (
    <Stack gap={2} horizontalAlign="start">
      <Typography variant="heading">Overview</Typography>
      <Typography numeric variant="heading">
        128
      </Typography>
    </Stack>
  ),
};

/** Money and calendar dates formatted from semantic values. */
export const Formatting: Story = {
  args: {
    children: 'Typography',
  },
  render: () => (
    <Stack gap={2} horizontalAlign="start">
      <Typography
        currency="EUR"
        format="currency"
        sign="always"
        value={1234.56}
        variant="money"
      />
      <Typography format="date" value="2026-09-03" variant="caption" />
    </Stack>
  ),
};

/** Preserves the text's place while its value is loading. */
export const Loading: Story = {
  args: {
    children: 'Loading text',
    loading: true,
  },
};
