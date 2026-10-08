import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentType } from 'react';
import { expect, within } from 'storybook/test';
import type { StatStripItemDescriptor, StatStripProps } from './StatStrip';
import { StatStrip } from './StatStrip';

const balance = [
  {
    currency: 'GBP',
    id: 'balance',
    label: 'Current balance',
    value: 24180.5,
  },
  {
    currency: 'GBP',
    id: 'balance-less-vat',
    label: 'Balance less VAT owed',
    value: 20060.5,
  },
  {
    badge: { children: 'Standard 20%' },
    currency: 'GBP',
    id: 'vat-owed',
    label: 'VAT owed',
    value: 4120,
  },
] satisfies StatStripItemDescriptor[];

function getDescriptor(item: unknown): StatStripItemDescriptor {
  return item as StatStripItemDescriptor;
}

const meta = {
  args: {
    'aria-label': 'Balance',
    getItem: getDescriptor,
    items: balance,
  },
  component: StatStrip as ComponentType<StatStripProps<unknown>>,
  title: 'Patterns/StatStrip',
} satisfies Meta<typeof StatStrip>;

export default meta;
type Story = StoryObj<typeof meta>;

function getCells(canvasElement: HTMLElement) {
  const group = within(canvasElement).getByRole('group', { name: 'Balance' });

  return Array.from(group.querySelectorAll('dl > div'));
}

/** Three balance figures, the last scoped by a badge, as on the overview. */
export const Overview: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const cells = getCells(canvasElement);
    const [first, second, third] = cells.map((cell) =>
      cell.getBoundingClientRect(),
    );

    await expect(canvas.getByText('£24,180.50')).toBeVisible();
    await expect(canvas.getByText('Standard 20%')).toBeVisible();
    // Equal columns with a 12px gap before each 1px divider.
    await expect(second.left - first.right).toBeCloseTo(12);
    await expect(third.left - second.right).toBeCloseTo(12);
    await expect(Math.abs(first.width - third.width)).toBeLessThan(1);
    await expect(first.top).toBe(third.top);
    await expect(getComputedStyle(cells[1]).borderInlineStartWidth).toBe('1px');
    await expect(getComputedStyle(cells[0]).borderInlineStartWidth).toBe('0px');
  },
};

/** The loading shape replaces the figures with three skeleton cells. */
export const Loading: Story = {
  args: {
    loading: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const group = canvas.getByRole('group', { name: 'Balance' });

    await expect(canvas.getByRole('progressbar')).toHaveAccessibleName(
      'Loading',
    );
    await expect(group.querySelector('[aria-busy="true"]')).not.toBeNull();
    await expect(group.querySelector('dl')).toBeNull();
  },
};

const phoneViewport = {
  options: {
    statStripPhone: {
      name: 'StatStrip phone',
      styles: { height: '812px', width: '375px' },
      type: 'mobile',
    },
  },
};

/** Below Breeze's medium breakpoint the figures stack with dividers between them. */
export const Phone: Story = {
  globals: { viewport: { value: 'statStripPhone' } },
  parameters: {
    chromatic: {
      viewports: [375],
    },
    viewport: phoneViewport,
  },
  play: async ({ canvasElement }) => {
    const cells = getCells(canvasElement);
    const [first, second, third] = cells.map((cell) =>
      cell.getBoundingClientRect(),
    );

    await expect(canvasElement.ownerDocument.defaultView?.innerWidth).toBe(375);
    await expect(second.top - first.bottom).toBeCloseTo(12);
    await expect(third.top - second.bottom).toBeCloseTo(12);
    await expect(first.left).toBe(third.left);
    await expect(getComputedStyle(cells[1]).borderBlockStartWidth).toBe('1px');
    await expect(getComputedStyle(cells[1]).borderInlineStartWidth).toBe('0px');
  },
};
