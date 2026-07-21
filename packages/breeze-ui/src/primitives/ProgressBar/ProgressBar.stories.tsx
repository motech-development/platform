import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Stack } from '../Stack/Stack';
import { ProgressBar } from './ProgressBar';

const meta = {
  component: ProgressBar,
  title: 'Feedback/ProgressBar',
} satisfies Meta<typeof ProgressBar>;
export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Presents measurable file-upload progress with a translated label and an
 * authored value description for assistive technology.
 *
 * @summary determinate upload progress with value text
 */
export const Determinate: Story = {
  args: {
    label: 'Uploading files',
    value: 64,
    valueText: '64 percent complete',
  },
};
/**
 * Presents ongoing connection work without a measurable current value so
 * current-value semantics are intentionally omitted.
 *
 * @summary indeterminate connection progress without a value
 */
export const Indeterminate: Story = {
  args: {
    indeterminate: true,
    label: 'Connecting to the service',
  },
};
/**
 * Uses a non-zero minimum and custom maximum to demonstrate a bounded range
 * whose announced text explains the application-specific units.
 *
 * @summary determinate progress within a custom numeric range
 */
export const CustomRange: Story = {
  args: {
    label: 'Items processed',
    maximum: 20,
    minimum: 10,
    value: 15,
    valueText: '15 of 20 items',
  },
};
/**
 * Compares every semantic fill colour in an identical determinate state and
 * verifies that primary and informational treatments remain distinct.
 *
 * @summary complete semantic progress-bar variant set
 */
export const Variants: Story = {
  args: { label: 'Progress', value: 60 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const primary = canvas
      .getByTestId('primary-progress')
      .querySelector<HTMLElement>('[aria-hidden="true"] > div');
    const info = canvas
      .getByTestId('info-progress')
      .querySelector<HTMLElement>('[aria-hidden="true"] > div');
    const view = canvasElement.ownerDocument.defaultView;

    await expect(primary).not.toBeNull();
    await expect(info).not.toBeNull();
    await expect(view?.getComputedStyle(primary!).backgroundColor).toBe(
      'rgb(34, 88, 214)',
    );
    await expect(view?.getComputedStyle(info!).backgroundColor).toBe(
      'rgb(0, 107, 153)',
    );
    await expect(view?.getComputedStyle(info!).backgroundColor).not.toBe(
      view?.getComputedStyle(primary!).backgroundColor,
    );
  },
  render: () => (
    <Stack gap="md">
      <ProgressBar
        data-testid="primary-progress"
        label="Primary progress"
        value={60}
        variant="primary"
      />
      <ProgressBar
        data-testid="secondary-progress"
        label="Secondary progress"
        value={60}
        variant="secondary"
      />
      <ProgressBar
        data-testid="success-progress"
        label="Success progress"
        value={60}
        variant="success"
      />
      <ProgressBar
        data-testid="danger-progress"
        label="Danger progress"
        value={60}
        variant="danger"
      />
      <ProgressBar
        data-testid="warning-progress"
        label="Warning progress"
        value={60}
        variant="warning"
      />
      <ProgressBar
        data-testid="info-progress"
        label="Information progress"
        value={60}
        variant="info"
      />
      <ProgressBar
        data-testid="light-progress"
        label="Light progress"
        value={60}
        variant="light"
      />
      <ProgressBar
        data-testid="dark-progress"
        label="Dark progress"
        value={60}
        variant="dark"
      />
    </Stack>
  ),
};
