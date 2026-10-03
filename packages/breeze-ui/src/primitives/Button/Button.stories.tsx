import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, within } from 'storybook/test';
import { Card } from '../Card/Card';
import { Inline } from '../Inline/Inline';
import { Link } from '../Link/Link';
import { Stack } from '../Stack/Stack';
import { Typography } from '../Typography/Typography';
import { Button, type ButtonVariant, type ControlSize } from './Button';

const meta = {
  args: {
    children: 'Save changes',
  },
  component: Button,
  title: 'Actions/Button',
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The default variant and size. */
export const Primary: Story = {};

/** A neutral alternative to the primary action. */
export const Secondary: Story = {
  args: {
    children: 'Cancel',
    variant: 'secondary',
  },
};

/** A decorative icon leads the label, as on a page's primary action. */
export const WithIcon: Story = {
  args: {
    children: 'Record transaction',
    icon: 'add',
  },
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button', {
      name: 'Record transaction',
    });
    const icon = button.querySelector('svg')!.getBoundingClientRect();
    const label = within(button)
      .getByText('Record transaction')
      .getBoundingClientRect();

    await expect(icon.width).toBe(16);
    await expect(label.left - icon.right).toBe(8);
  },
};

/** A text action without a control box. */
export const Quiet: Story = {
  args: {
    children: 'Mark all as read',
    variant: 'quiet',
  },
};

const reports = [
  { created: '3 October 2026', expires: '4 October 2026', id: 'october' },
  { created: '2 September 2026', expires: '3 September 2026', id: 'september' },
];

/** Quiet text actions on rows inside a panel. */
export const RowAction: Story = {
  play: async ({ canvasElement }) => {
    const [download] = within(canvasElement).getAllByRole('button', {
      name: 'Download',
    });
    const style = getComputedStyle(download);

    await expect({
      background: style.backgroundColor,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      height: download.getBoundingClientRect().height,
      paddingInline: style.paddingInlineStart,
    }).toEqual({
      background: 'rgba(0, 0, 0, 0)',
      fontSize: '13px',
      fontWeight: '400',
      height: 18.84375,
      paddingInline: '4px',
    });
  },
  render: () => (
    <Card
      action={<Link href="#reports">All</Link>}
      element="section"
      title="Recent reports"
    >
      <Stack gap={3}>
        {reports.map((report) => (
          <Inline
            gap={3}
            justify="between"
            key={report.id}
            verticalAlign="center"
          >
            <Stack gap={0}>
              <Typography id={`report-${report.id}`}>
                {report.created}
              </Typography>
              <Typography tone="muted" variant="caption">
                {`Expires ${report.expires}`}
              </Typography>
            </Stack>
            <Button aria-describedby={`report-${report.id}`} variant="quiet">
              Download
            </Button>
          </Inline>
        ))}
      </Stack>
    </Card>
  ),
};

/** A destructive action. */
export const Danger: Story = {
  args: {
    children: 'Delete item',
    variant: 'danger',
  },
};

/** Every boxed treatment at each size. */
export const TreatmentsAndSizes: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const measure = (name: string) => {
      const button = canvas.getByRole('button', { name });
      const style = getComputedStyle(button);

      return {
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        height: button.getBoundingClientRect().height,
        paddingInline: style.paddingInlineStart,
      };
    };

    await expect(measure('secondary · sm')).toEqual({
      fontSize: '12px',
      fontWeight: '600',
      height: 32,
      paddingInline: '12px',
    });
    await expect(measure('primary · md')).toEqual({
      fontSize: '13px',
      fontWeight: '600',
      height: 36,
      paddingInline: '14px',
    });
    await expect(measure('secondary · md')).toEqual({
      fontSize: '13px',
      fontWeight: '600',
      height: 36,
      paddingInline: '12px',
    });
  },
  render: () => (
    <div className="breeze-story-stack">
      {(['sm', 'md', 'lg'] satisfies ControlSize[]).map((size) => (
        <div className="breeze-story-row" key={size}>
          {(['primary', 'secondary', 'danger'] satisfies ButtonVariant[]).map(
            (variant) => (
              <Button key={variant} size={size} variant={variant}>
                {`${variant} · ${size}`}
              </Button>
            ),
          )}
        </div>
      ))}
    </div>
  ),
};

/** Every boxed treatment and size, and the quiet text action, while loading. */
export const Loading: Story = {
  render: () => (
    <div className="breeze-story-stack">
      {(['sm', 'md', 'lg'] satisfies ControlSize[]).map((size) => (
        <div className="breeze-story-row" key={size}>
          {(['primary', 'secondary', 'danger'] satisfies ButtonVariant[]).map(
            (variant) => (
              <Button key={variant} loading size={size} variant={variant}>
                {`${variant} · ${size}`}
              </Button>
            ),
          )}
        </div>
      ))}
      <div className="breeze-story-row">
        <Button loading variant="quiet">
          quiet
        </Button>
      </div>
    </div>
  ),
};

/** A button that cannot be activated. */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

/** A label that wraps onto a second line. */
export const LongLabel: Story = {
  args: {
    children: 'Save all changes and return to the previous screen',
    variant: 'secondary',
  },
};

function ActionExample() {
  const [count, setCount] = useState(0);

  return (
    <div className="breeze-story-action">
      <Button onAction={() => setCount((value) => value + 1)}>
        Save changes
      </Button>
      <p role="status">{count} actions completed</p>
    </div>
  );
}

/** `onAction` updating application state. */
export const Activation: Story = {
  render: () => <ActionExample />,
};
