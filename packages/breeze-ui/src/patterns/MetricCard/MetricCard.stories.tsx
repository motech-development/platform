import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { FormattedNumber } from '../../formatting/FormattedNumber/FormattedNumber';
import { Skeleton } from '../../primitives/Skeleton/Skeleton';
import { MetricCard } from './MetricCard';

/**
 * Presents one prominent application-formatted value without owning
 * calculations, refresh state, or domain meaning.
 *
 * @summary prominent labelled metric with optional supporting context
 */
const meta = {
  component: MetricCard,
  title: 'Patterns/Data/MetricCard',
} satisfies Meta<typeof MetricCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Uses the inverse shell-compatible surface for a locale-formatted value and
 * short recency description while preserving the metric's labelled article.
 *
 * @summary inverse metric with formatted value and supporting context
 */
export const Inverse: Story = {
  args: {
    description: 'Updated recently',
    label: 'Project progress',
    tone: 'inverse',
    value: <FormattedNumber options={{ style: 'percent' }} value={0.72} />,
  },
  play: async ({ canvasElement }) => {
    const card = within(canvasElement).getByRole('article', {
      name: 'Project progress',
    });
    const label = within(card).getByText('Project progress');
    const value = within(card).getByText('72%');
    const cardStyle = getComputedStyle(card);
    const labelStyle = getComputedStyle(label);
    const valueStyle = getComputedStyle(value);

    await expect(cardStyle.backgroundColor).toBe('rgb(34, 44, 64)');
    await expect(cardStyle.borderBottomColor).toBe('rgb(14, 21, 36)');
    await expect(cardStyle.borderBottomWidth).toBe('2px');
    await expect(cardStyle.borderTopWidth).toBe('0px');
    await expect(cardStyle.columnGap).toBe('8px');
    await expect(cardStyle.paddingTop).toBe(cardStyle.paddingRight);
    await expect(cardStyle.paddingBottom).toBe(cardStyle.paddingTop);
    await expect(cardStyle.paddingLeft).toBe(cardStyle.paddingRight);
    await expect(labelStyle.color).toBe('rgb(202, 208, 220)');
    await expect(labelStyle.fontFamily).toContain('Cabin');
    await expect(labelStyle.fontSize).toBe('16px');
    await expect(labelStyle.fontWeight).toBe('400');
    await expect(valueStyle.fontFamily).toContain('Cabin');
    await expect(valueStyle.fontSize).toBe('32px');
    await expect(valueStyle.fontWeight).toBe('700');
    await expect(Number.parseFloat(valueStyle.lineHeight)).toBeCloseTo(38.4, 3);
  },
};

/**
 * Places the inverse metric at the canonical compact viewport to demonstrate
 * its equal inset spacing and readable value treatment at narrow widths.
 *
 * @summary compact inverse metric with balanced responsive spacing
 */
export const InverseCompact: Story = {
  ...Inverse,
  globals: { viewport: { value: 'mobile1' } },
  play: async ({ canvasElement }) => {
    const card = within(canvasElement).getByRole('article', {
      name: 'Project progress',
    });
    const cardStyle = getComputedStyle(card);

    await expect(cardStyle.paddingTop).toBe(cardStyle.paddingRight);
    await expect(cardStyle.paddingBottom).toBe(cardStyle.paddingTop);
    await expect(cardStyle.paddingLeft).toBe(cardStyle.paddingRight);
  },
};

/**
 * Replaces unavailable label and value content with inverse-tone skeletons and
 * hides the placeholder article so assistive technology does not announce it.
 *
 * @summary non-announced inverse loading placeholder for a metric
 */
export const InverseLoading: Story = {
  args: {
    'aria-hidden': true,
    density: 'spacious',
    label: <Skeleton className="h-5 w-32" tone="inverse" />,
    tone: 'inverse',
    value: <Skeleton className="h-9 w-48" tone="inverse" />,
  },
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector('article');
    const skeletons = card?.querySelectorAll<HTMLElement>('[data-shape]');

    await expect(card).not.toBeNull();
    await expect(card).toHaveAttribute('aria-hidden', 'true');
    await expect(skeletons).toHaveLength(2);
    await expect(
      getComputedStyle(skeletons?.[0] as HTMLElement).backgroundColor,
    ).toBe('rgb(86, 97, 116)');
  },
};

/**
 * Uses the subtle surface when a metric belongs inside a light content region
 * and does not need the visual weight of an inverse shell treatment.
 *
 * @summary subtle metric surface for supporting page information
 */
export const Subtle: Story = {
  args: {
    label: 'Open items',
    tone: 'subtle',
    value: <FormattedNumber value={12} />,
  },
};
