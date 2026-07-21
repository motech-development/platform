import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormattedNumber } from './FormattedNumber';

const meta = {
  component: FormattedNumber,
  title: 'Formatting/FormattedNumber',
} satisfies Meta<typeof FormattedNumber>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Applies an application-owned two-decimal display policy to a domain-neutral
 * numeric value using the locale supplied by BreezeProvider.
 *
 * @summary localized decimal with fixed application-owned precision
 */
export const Decimal: Story = {
  args: {
    options: { maximumFractionDigits: 2, minimumFractionDigits: 2 },
    value: 24862.4,
  },
};

/**
 * Supplies GBP currency meaning explicitly through Intl options so the
 * formatter can localize the symbol, grouping, and decimal presentation.
 *
 * @summary localized GBP currency from explicit Intl options
 */
export const Currency: Story = {
  args: {
    options: { currency: 'GBP', style: 'currency' },
    value: 1042.16,
  },
};
