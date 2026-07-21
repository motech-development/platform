import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CalendarIcon,
  WarningIcon,
} from '../../icons';
import { Inline } from '../Inline/Inline';
import { IconTile } from './IconTile';

const meta = {
  component: IconTile,
  title: 'Foundation/IconTile',
} satisfies Meta<typeof IconTile>;
export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Compares primary, warning, and danger marker tiles across canonical sizes so
 * surrounding content can express constrained semantic emphasis.
 *
 * @summary bordered semantic marker variants and sizes
 */
export const SemanticTiles: Story = {
  args: { children: <CalendarIcon /> },
  render: () => (
    <Inline align="stretch" gap="compact" wrap={false}>
      <IconTile variant="primary">
        <CalendarIcon />
      </IconTile>
      <IconTile variant="warning">
        <WarningIcon />
      </IconTile>
      <IconTile size="lg" variant="danger">
        <WarningIcon />
      </IconTile>
    </Inline>
  ),
};
/**
 * Shows circular borderless status markers plus a meaningful text marker that
 * deliberately remains exposed to assistive technology.
 *
 * @summary borderless decorative icons and meaningful marker text
 */
export const BorderlessMarkers: Story = {
  args: { children: <CalendarIcon /> },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const markers = [
      canvas.getByTestId('income-marker'),
      canvas.getByTestId('expense-marker'),
      canvas.getByTestId('neutral-marker'),
    ];
    const statusCode = canvas.getByTestId('status-code');
    const view = canvasElement.ownerDocument.defaultView;

    await Promise.all(
      markers.map(async (marker) => {
        const style = view?.getComputedStyle(marker);

        await expect(marker.getBoundingClientRect().width).toBe(
          marker.getBoundingClientRect().height,
        );
        await expect(marker.getBoundingClientRect().width).toBeGreaterThan(0);
        await expect(style?.borderTopWidth).toBe('0px');
        await expect(
          Number.parseFloat(style?.borderRadius ?? '0'),
        ).toBeGreaterThanOrEqual(18);
      }),
    );
    await expect(
      view?.getComputedStyle(canvas.getByTestId('neutral-marker'))
        .backgroundColor,
    ).toBe('rgb(223, 227, 233)');
    await expect(statusCode.getBoundingClientRect().width).toBe(
      statusCode.getBoundingClientRect().height,
    );
    await expect(statusCode.getBoundingClientRect().width).toBeGreaterThan(0);
    await expect(statusCode).not.toHaveAttribute('aria-hidden');
    await expect(view?.getComputedStyle(statusCode).borderTopWidth).toBe('0px');
    await expect(view?.getComputedStyle(statusCode).fontFamily).toContain(
      'Cabin',
    );
    await expect(view?.getComputedStyle(statusCode).fontSize).toBe('24px');
  },
  render: () => (
    <Inline gap="compact" wrap={false}>
      <IconTile
        bordered={false}
        data-testid="income-marker"
        shape="circle"
        size="sm"
        variant="success"
      >
        <ArrowRightIcon />
      </IconTile>
      <IconTile
        bordered={false}
        data-testid="expense-marker"
        shape="circle"
        size="sm"
        variant="danger"
      >
        <ArrowLeftIcon />
      </IconTile>
      <IconTile
        bordered={false}
        data-testid="neutral-marker"
        shape="circle"
        size="sm"
        variant="neutral"
      >
        <ArrowLeftIcon />
      </IconTile>
      <IconTile
        bordered={false}
        data-testid="status-code"
        decorative={false}
        size="lg"
      >
        404
      </IconTile>
    </Inline>
  ),
};
