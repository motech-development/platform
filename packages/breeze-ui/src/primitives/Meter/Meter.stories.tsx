import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Stack } from '../Stack/Stack';
import { Meter } from './Meter';

const meta = {
  component: Meter,
  title: 'Feedback/Meter',
} satisfies Meta<typeof Meter>;
export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Displays storage utilization with application-owned value text and a
 * warning treatment for a scalar measurement that is not task progress.
 *
 * @summary storage utilization with descriptive announced value text
 */
export const Usage: Story = {
  args: {
    label: 'Storage used',
    value: 72,
    valueText: '72 gigabytes used',
    variant: 'warning',
  },
};
/**
 * Maps signal quality across a non-zero one-to-five range and supplies
 * translated value text that explains the measurement to assistive technology.
 *
 * @summary measurement with a custom non-zero range
 */
export const CustomRange: Story = {
  args: {
    label: 'Signal quality',
    maximum: 5,
    minimum: 1,
    value: 4,
    valueText: '4 out of 5',
  },
};
/**
 * Supplies a value above the configured maximum to demonstrate that displayed,
 * announced, and visual output are consistently clamped to the valid range.
 *
 * @summary out-of-range measurement clamped to its maximum
 */
export const ClampedValues: Story = {
  args: {
    label: 'Clamped measurement',
    maximum: 20,
    minimum: 10,
    value: 25,
  },
  play: async ({ canvasElement }) => {
    const meter = within(canvasElement).getByRole('meter', {
      name: 'Clamped measurement',
    });
    const fill = meter.lastElementChild?.firstElementChild;

    if (!(fill instanceof HTMLElement)) {
      throw new Error('Expected Meter to render a track fill.');
    }

    await expect(meter).toHaveAttribute('aria-valuenow', '20');
    await expect(meter).toHaveTextContent('20');
    await expect(fill.style.width).toBe('100%');
  },
};
/**
 * Compares every supported semantic fill colour at the same value so a
 * measurement's meaning can be chosen independently from its magnitude.
 *
 * @summary complete semantic meter variant comparison
 */
export const Variants: Story = {
  args: { label: 'Measurement', value: 60 },
  render: () => (
    <Stack gap="md">
      <Meter label="Primary measurement" value={60} variant="primary" />
      <Meter label="Secondary measurement" value={60} variant="secondary" />
      <Meter label="Success measurement" value={60} variant="success" />
      <Meter label="Danger measurement" value={60} variant="danger" />
      <Meter label="Warning measurement" value={60} variant="warning" />
      <Meter label="Information measurement" value={60} variant="info" />
      <Meter label="Light measurement" value={60} variant="light" />
      <Meter label="Dark measurement" value={60} variant="dark" />
    </Stack>
  ),
};
