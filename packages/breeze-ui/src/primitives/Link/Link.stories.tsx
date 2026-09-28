import type { Meta, StoryObj } from '@storybook/react-vite';
import { useMemo, useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import type { RouterNavigationOptions } from '../../provider/BreezeContext';
import { BreezeProvider } from '../../provider/BreezeProvider';
import { Inline } from '../Inline/Inline';
import { Link, type LinkVariant } from './Link';

const variants = ['default', 'subtle'] satisfies LinkVariant[];

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
