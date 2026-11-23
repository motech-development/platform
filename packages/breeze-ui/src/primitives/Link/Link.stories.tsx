import type { Meta, StoryObj } from '@storybook/react-vite';
import { useMemo, useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import type { RouterNavigationOptions } from '../../provider/BreezeContext';
import { BreezeProvider } from '../../provider/BreezeProvider';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { Inline } from '../Inline/Inline';
import { Typography } from '../Typography/Typography';
import { Link, type LinkVariant } from './Link';

const variants = ['default', 'subtle'] satisfies LinkVariant[];

const buttonStyle = (element: HTMLElement) => {
  const style = getComputedStyle(element);

  return {
    backgroundColor: style.backgroundColor,
    borderColor: style.borderTopColor,
    fontSize: style.fontSize,
    fontWeight: style.fontWeight,
    height: element.getBoundingClientRect().height,
    paddingInline: style.paddingInlineStart,
    textDecoration: style.textDecorationLine,
  };
};

const meta = {
  args: {
    children: 'View account activity',
    href: '/accounts/activity',
  },
  component: Link,
  title: 'Navigation/Link',
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A same-document link with the default brand treatment. */
export const Default: Story = {};

/** A lower-emphasis link for supporting destinations. */
export const Subtle: Story = {
  args: {
    children: 'View details',
    variant: 'subtle',
  },
};

/** A panel header's navigation action. */
export const PanelAction: Story = {
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link', {
      name: 'View all money',
    });
    const style = getComputedStyle(link);

    await expect({
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      height: link.getBoundingClientRect().height,
      paddingInline: style.paddingInlineStart,
      textDecoration: style.textDecorationLine,
    }).toEqual({
      fontSize: '13px',
      fontWeight: '400',
      height: 18.84375,
      paddingInline: '4px',
      textDecoration: 'none',
    });
  },
  render: () => (
    <Card
      action={<Link href="#money">View all money</Link>}
      element="section"
      title="Recent activity"
    >
      <Typography tone="secondary">Your latest transactions.</Typography>
    </Card>
  ),
};

/** Both closed visual treatments. */
export const Treatments: Story = {
  render: () => (
    <Inline gap={4}>
      {variants.map((variant) => (
        <Link href="/accounts/activity" key={variant} variant={variant}>
          {`${variant} link`}
        </Link>
      ))}
    </Inline>
  ),
};

/** Navigation and download links that look like primary and secondary buttons. */
export const ButtonTreatments: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      buttonStyle(canvas.getByRole('link', { name: 'Back to overview' })),
    ).toEqual(
      buttonStyle(canvas.getByRole('button', { name: 'Create report' })),
    );
    await expect(
      buttonStyle(canvas.getByRole('link', { name: 'Open year end' })),
    ).toEqual(buttonStyle(canvas.getByRole('button', { name: 'Cancel' })));
    await expect(
      buttonStyle(canvas.getByRole('link', { name: 'Download' })),
    ).toEqual(buttonStyle(canvas.getByRole('button', { name: 'Remove' })));
  },
  render: () => (
    <div className="breeze-story-stack">
      <Inline gap={2}>
        <Link href="/overview" variant="primary">
          Back to overview
        </Link>
        <Link href="/year-end" variant="secondary">
          Open year end
        </Link>
        <Link download href="/reports/2026.csv" size="sm" variant="secondary">
          Download
        </Link>
      </Inline>
      <Inline gap={2}>
        <Button>Create report</Button>
        <Button variant="secondary">Cancel</Button>
        <Button size="sm" variant="secondary">
          Remove
        </Button>
      </Inline>
    </div>
  ),
};

function RouterExample() {
  const [location, setLocation] = useState('/accounts');
  const [transitionLabel, setTransitionLabel] = useState('');
  const router = useMemo(
    () => ({
      navigate: (href: string, options: RouterNavigationOptions) => {
        setLocation(href);
        setTransitionLabel(options.transitionTypes.join(', ') || 'none');
      },
    }),
    [],
  );

  return (
    <BreezeProvider locale="en-GB" router={router}>
      <div className="breeze-story-stack">
        <Link
          href="/accounts/activity"
          target="_self"
          transitionTypes={['nav']}
        >
          Activity
        </Link>
        <output aria-live="polite">{`${location} · ${transitionLabel}`}</output>
      </div>
    </BreezeProvider>
  );
}

/** A router receives only the caller's opt-in transition types. */
export const RouterNavigation: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('link', { name: 'Activity' }));
    await expect(canvas.getByRole('status')).toHaveTextContent(
      '/accounts/activity · nav',
    );
  },
  render: () => <RouterExample />,
};
