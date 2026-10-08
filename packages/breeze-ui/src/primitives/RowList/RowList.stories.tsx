import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentType } from 'react';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import type { RowListItemDescriptor, RowListProps } from './RowList';
import { RowList } from './RowList';

const entries = [
  {
    badge: {
      children:
        'Needs review before the next monthly reconciliation is complete',
      variant: 'warning',
    },
    description: 'Coffee shop near the station.',
    icon: 'document',
    id: 'coffee',
    label: 'Coffee shop',
    metadata: { format: 'date', value: '2026-09-14' },
    section: { id: 'september', label: 'September' },
    value: { currency: 'GBP', format: 'currency', value: 4.75 },
  },
  {
    id: 'market',
    label: 'Market',
    metadata: { format: 'text', value: 'Card purchase' },
    section: { id: 'september', label: 'September' },
    value: { format: 'text', value: 'Reviewed' },
  },
  {
    id: 'travel',
    label: 'Travel to work',
    metadata: { format: 'date', value: '2026-09-12' },
    section: { id: 'august', label: 'August' },
    value: { currency: 'GBP', format: 'currency', value: 8.5 },
  },
] satisfies RowListItemDescriptor[];

function getDescriptor(item: unknown): RowListItemDescriptor {
  return item as RowListItemDescriptor;
}

const meta = {
  args: {
    'aria-label': 'Activity',
    getItem: getDescriptor,
    items: entries,
    loadMore: {
      label: 'Load more activity',
      onAction: fn(),
    },
    loading: false,
    onAction: fn(),
  },
  component: RowList as ComponentType<RowListProps<unknown>>,
  title: 'Collections/RowList',
} satisfies Meta<typeof RowList>;

export default meta;
type Story = StoryObj<typeof meta>;

async function verifyResponsiveGeometry(canvasElement: HTMLElement) {
  if (!('__vitest_browser__' in globalThis)) return;

  const browserContext = await import('vitest/browser');
  const document = canvasElement.ownerDocument;
  const view = document.defaultView;

  if (!view) throw new Error('Missing RowList story window.');

  const originalViewport = { height: view.innerHeight, width: view.innerWidth };
  const canvas = within(canvasElement);

  try {
    await browserContext.page.viewport(1200, 800);
    await expect(view.innerWidth).toBe(1200);

    const grid = canvas.getByRole('grid', { name: 'Activity' });
    const coffeeRow = within(grid).getByRole('row', { name: 'Coffee shop' });
    const marketRow = within(grid).getByRole('row', { name: 'Market' });
    const coffeeLabel = within(coffeeRow).getByText('Coffee shop');
    const coffeeDate = within(coffeeRow).getByText('14 Sept 2026');
    const coffeeValue = within(coffeeRow).getByText('£4.75');
    const marketDate = within(marketRow).getByText('Card purchase');
    const marketValue = within(marketRow).getByText('Reviewed');
    const coffeeLabelRect = coffeeLabel.getBoundingClientRect();
    const coffeeDateRect = coffeeDate.getBoundingClientRect();
    const coffeeValueRect = coffeeValue.getBoundingClientRect();
    const marketDateRect = marketDate.getBoundingClientRect();
    const marketValueRect = marketValue.getBoundingClientRect();
    const coffeeMetadataRegion = coffeeRow.querySelector<HTMLElement>(
      '[class~="breeze:col-start-2"]',
    );
    const marketMetadataRegion = marketRow.querySelector<HTMLElement>(
      '[class~="breeze:col-start-2"]',
    );
    const coffeeValueRegion = coffeeRow.querySelector<HTMLElement>(
      '[class~="breeze:-col-end-1"]',
    );
    const marketValueRegion = marketRow.querySelector<HTMLElement>(
      '[class~="breeze:-col-end-1"]',
    );

    if (
      !coffeeMetadataRegion ||
      !marketMetadataRegion ||
      !coffeeValueRegion ||
      !marketValueRegion
    ) {
      throw new Error('Missing one of the RowList aligned regions.');
    }

    const coffeeMetadataRect = coffeeMetadataRegion.getBoundingClientRect();
    const marketMetadataRect = marketMetadataRegion.getBoundingClientRect();
    const coffeeValueRegionRect = coffeeValueRegion.getBoundingClientRect();
    const marketValueRegionRect = marketValueRegion.getBoundingClientRect();

    const coffeeBadgeRect = within(coffeeRow)
      .getByText(/^Needs review/)
      .getBoundingClientRect();
    const coffeeDescriptionRect = within(coffeeRow)
      .getByText('Coffee shop near the station.')
      .getBoundingClientRect();

    await expect(getComputedStyle(coffeeRow).display).toBe('grid');
    await expect(coffeeBadgeRect.left).toBeGreaterThan(coffeeLabelRect.right);
    await expect(coffeeBadgeRect.top).toBeLessThan(coffeeLabelRect.bottom);
    await expect(coffeeDescriptionRect.top).toBeGreaterThanOrEqual(
      coffeeLabelRect.bottom,
    );
    await expect(coffeeLabelRect.left).toBeLessThan(coffeeDateRect.left);
    await expect(coffeeDateRect.left).toBeLessThan(coffeeValueRect.left);
    await expect(
      Math.abs(coffeeMetadataRect.left - marketMetadataRect.left),
    ).toBeLessThan(1);
    await expect(
      Math.abs(coffeeValueRegionRect.left - marketValueRegionRect.left),
    ).toBeLessThan(1);
    await expect(
      Math.abs(coffeeDateRect.left - marketDateRect.left),
    ).toBeLessThan(1);
    await expect(
      Math.abs(coffeeValueRect.right - marketValueRect.right),
    ).toBeLessThan(1);
    await expect(coffeeMetadataRect.width).toBe(120);
    await expect(coffeeValueRegionRect.width).toBe(104);

    await browserContext.page.viewport(375, 812);
    await expect(view.innerWidth).toBe(375);

    const narrowGrid = canvas.getByRole('grid', { name: 'Activity' });
    const narrowCoffeeRow = within(narrowGrid).getByRole('row', {
      name: 'Coffee shop',
    });
    const narrowRow = narrowCoffeeRow.getBoundingClientRect();
    const narrowLabel = within(narrowCoffeeRow)
      .getByText('Coffee shop')
      .getBoundingClientRect();
    const narrowDescription = within(narrowCoffeeRow)
      .getByText('Coffee shop near the station.')
      .getBoundingClientRect();
    const narrowBadge = within(narrowCoffeeRow)
      .getByText(/^Needs review/)
      .getBoundingClientRect();
    const narrowValue = within(narrowCoffeeRow)
      .getByText('£4.75')
      .getBoundingClientRect();

    await expect(
      within(narrowCoffeeRow).getByText('14 Sept 2026'),
    ).not.toBeVisible();
    await expect(narrowBadge.left).toBeLessThan(narrowLabel.right);
    await expect(narrowBadge.top).toBeGreaterThanOrEqual(
      narrowDescription.bottom + 4,
    );
    await expect(narrowValue.top).toBeLessThan(narrowDescription.bottom);
    await expect(narrowValue.left).toBeGreaterThan(narrowDescription.right);
    await expect(
      Math.abs(narrowValue.right - (narrowRow.right - 16)),
    ).toBeLessThan(1);
    await expect(narrowGrid.scrollWidth).toBeLessThanOrEqual(
      narrowGrid.clientWidth,
    );
    await expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
      view.innerWidth,
    );
  } finally {
    await browserContext.page.viewport(
      originalViewport.width,
      originalViewport.height,
    );
  }
}

/** Below Breeze's medium breakpoint the metadata hides and the badge moves under the description. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    await verifyResponsiveGeometry(canvasElement);
  },
};

const activity = [
  {
    description: 'Website retainer · Sales',
    direction: 'in',
    icon: 'incoming',
    id: 'retainer',
    label: 'Bramble Studio',
    value: {
      currency: 'GBP',
      format: 'currency',
      sign: 'always',
      tone: 'positive',
      value: 2100,
    },
  },
  {
    description: 'Printer paper and toner · Office',
    direction: 'out',
    icon: 'outgoing',
    id: 'supplies',
    label: 'Northgate Supplies',
    value: {
      currency: 'GBP',
      format: 'currency',
      sign: 'always',
      value: -184.6,
    },
  },
  {
    description: 'Return journey · Travel',
    direction: 'out',
    icon: 'outgoing',
    id: 'rail',
    label: 'Rail fare',
    value: {
      currency: 'GBP',
      format: 'currency',
      sign: 'always',
      value: -42.3,
    },
  },
] satisfies RowListItemDescriptor[];

/** Money in and out carry a direction tile, amount tone and explicit sign. */
export const Activity: Story = {
  args: {
    items: activity,
    loadMore: undefined,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const moneyIn = canvas.getByText('+£2,100.00');
    const moneyOut = canvas.getByText('−£184.60');
    const valueRegion = moneyIn.closest<HTMLElement>(
      '[class~="breeze:-col-end-1"]',
    );
    const row = canvas.getByRole('row', { name: 'Bramble Studio' });

    if (!valueRegion) throw new Error('Missing the RowList value region.');

    const rowRect = row.getBoundingClientRect();
    const leadingRect = within(row)
      .getByText('Bramble Studio')
      .closest('[class~="breeze:col-start-1"]')
      ?.getBoundingClientRect();

    await expect(getComputedStyle(moneyIn).fontSize).toBe('13px');
    await expect(getComputedStyle(moneyIn).fontWeight).toBe('600');
    await expect(getComputedStyle(moneyIn).color).not.toBe(
      getComputedStyle(moneyOut).color,
    );
    await expect(moneyIn.scrollWidth).toBeLessThanOrEqual(
      valueRegion.clientWidth,
    );
    // Without metadata only the value column is reserved beside the leading region.
    await expect(leadingRect?.width).toBe(rowRect.width - 32 - 12 - 104);
  },
};

const money = [
  {
    description: 'Website retainer, October',
    direction: 'in',
    icon: 'incoming',
    id: 'retainer-october',
    label: 'Bramble Studio',
    metadata: { format: 'text', value: 'Sales' },
    metadataAmount: { currency: 'GBP', format: 'currency', value: 400 },
    section: {
      id: 'pending',
      label: 'Pending',
      summary: { format: 'text', value: 'Not in the balance yet' },
    },
    value: {
      currency: 'GBP',
      format: 'currency',
      sign: 'always',
      tone: 'positive',
      value: 2400,
    },
  },
  {
    badge: { children: 'Publishes 8 Sep', variant: 'brand' },
    description: 'Standing order, workshop rent',
    direction: 'out',
    icon: 'outgoing',
    id: 'rent',
    label: 'Northgate Supplies',
    metadata: { format: 'text', value: 'Premises' },
    metadataAmount: { currency: 'GBP', format: 'currency', value: 53.07 },
    section: {
      id: 'pending',
      label: 'Pending',
      summary: { format: 'text', value: 'Not in the balance yet' },
    },
    value: {
      currency: 'GBP',
      format: 'currency',
      sign: 'always',
      value: -318.4,
    },
  },
  {
    description: 'Website retainer, September',
    direction: 'in',
    icon: 'incoming',
    id: 'retainer-september',
    label: 'Bramble Studio',
    metadata: { format: 'text', value: 'Sales' },
    metadataAmount: { currency: 'GBP', format: 'currency', value: 350.07 },
    section: {
      id: '2026-09-03',
      label: 'Thursday 3 September',
      summary: {
        currency: 'GBP',
        format: 'currency',
        label: 'Confirmed daily total',
        sign: 'always',
        tone: 'positive',
        value: 1776.4,
      },
    },
    value: {
      currency: 'GBP',
      format: 'currency',
      sign: 'always',
      tone: 'positive',
      value: 2100,
    },
  },
  {
    badge: { children: 'No receipt', variant: 'warning' },
    description: 'Van service and MOT',
    direction: 'out',
    icon: 'outgoing',
    id: 'garage',
    label: 'Fen Lane Garage',
    metadata: { format: 'text', value: 'Vehicle' },
    metadataAmount: { currency: 'GBP', format: 'currency', value: 23.17 },
    section: {
      id: '2026-09-03',
      label: 'Thursday 3 September',
      summary: {
        currency: 'GBP',
        format: 'currency',
        label: 'Confirmed daily total',
        sign: 'always',
        tone: 'positive',
        value: 1776.4,
      },
    },
    value: { currency: 'GBP', format: 'currency', sign: 'always', value: -139 },
  },
  {
    description: 'Mobile and broadband',
    direction: 'out',
    icon: 'outgoing',
    id: 'telecom',
    label: 'Meridian Telecom',
    metadata: { format: 'text', value: 'Utilities' },
    metadataAmount: { currency: 'GBP', format: 'currency', value: 10.81 },
    section: {
      id: '2026-09-02',
      label: 'Wednesday 2 September',
      summary: {
        currency: 'GBP',
        format: 'currency',
        label: 'Confirmed daily total',
        sign: 'always',
        value: -64.85,
      },
    },
    value: {
      currency: 'GBP',
      format: 'currency',
      sign: 'always',
      value: -64.85,
    },
  },
] satisfies RowListItemDescriptor[];

/** Category and VAT columns, with section headers ending in a daily total or a muted note. */
export const Money: Story = {
  args: {
    'aria-label': 'Transactions',
    items: money,
    loadMore: undefined,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const confirmed = canvas.getByRole('rowheader', {
      name: /^Thursday 3 September/,
    });
    const total = within(confirmed).getByText('+£1,776.40');
    const note = canvas.getByText('Not in the balance yet');

    await expect(confirmed).toHaveTextContent(
      'Thursday 3 SeptemberConfirmed daily total+£1,776.40',
    );
    await expect(getComputedStyle(total).fontSize).toBe('12px');
    await expect(getComputedStyle(total).fontWeight).toBe('600');
    await expect(getComputedStyle(note).fontSize).toBe('12px');
    await expect(getComputedStyle(note).color).not.toBe(
      getComputedStyle(canvas.getByText('Pending')).color,
    );

    const row = canvas.getByRole('row', { name: 'Fen Lane Garage' });
    const rowRect = row.getBoundingClientRect();
    const category = within(row).getByText('Vehicle');
    const categoryRect = category.getBoundingClientRect();
    const vat = within(row).getByText('£23.17');
    const vatRect = vat.getBoundingClientRect();
    const amountRect = within(row)
      .getByText('−£139.00')
      .getBoundingClientRect();

    const textStyle = (element: HTMLElement) => {
      const { color, fontSize, fontWeight, lineHeight } =
        getComputedStyle(element);

      return { color, fontSize, fontWeight, lineHeight };
    };
    const mutedText = {
      color: getComputedStyle(note).color,
      fontSize: '12px',
      fontWeight: '400',
      lineHeight: '16px',
    };

    await expect(textStyle(category)).toEqual(mutedText);
    await expect(textStyle(vat)).toEqual(mutedText);
    // Category, VAT and amount columns are 120, 80 and 104px with 12px gaps.
    await expect(amountRect.right).toBe(rowRect.right - 16);
    await expect(vatRect.right).toBe(amountRect.right - 104 - 12);
    await expect(vatRect.width).toBe(80);
    await expect(categoryRect.left).toBe(vatRect.left - 12 - 120);
  },
};

const phoneViewport = {
  options: {
    rowListPhone: {
      name: 'RowList phone',
      styles: { height: '812px', width: '375px' },
      type: 'mobile',
    },
  },
};

/** At phone width amounts stay inline, badges move under the description and metadata hides. */
export const Phone: Story = {
  args: Money.args,
  globals: { viewport: { value: 'rowListPhone' } },
  parameters: {
    chromatic: {
      viewports: [375],
    },
    viewport: phoneViewport,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const row = canvas.getByRole('row', { name: 'Fen Lane Garage' });
    const rowRect = row.getBoundingClientRect();
    const description = within(row)
      .getByText('Van service and MOT')
      .getBoundingClientRect();
    const badge = within(row).getByText('No receipt').getBoundingClientRect();
    const amount = within(row).getByText('−£139.00').getBoundingClientRect();

    await expect(canvasElement.ownerDocument.defaultView?.innerWidth).toBe(375);
    await expect(within(row).getByText('Vehicle')).not.toBeVisible();
    await expect(badge.top).toBeGreaterThanOrEqual(description.bottom + 4);
    await expect(Math.abs(amount.right - (rowRect.right - 16))).toBeLessThan(1);
    await expect(
      Math.abs(
        amount.top + amount.height / 2 - (rowRect.top + rowRect.height / 2),
      ),
    ).toBeLessThan(1);
  },
};

/** An empty result remains a named grid with a structural row and cell. */
export const Empty: Story = {
  args: {
    items: [],
    loadMore: undefined,
    loading: false,
  },
};

/** Initial loading keeps a fixed skeleton shape inside the named grid. */
export const InitialLoading: Story = {
  args: {
    items: [],
    loadMore: undefined,
    loading: true,
  },
};

/** Per-row placeholders remain separate from the load-more action. */
export const Loading: Story = {
  args: {
    items: [{ ...entries[0], loading: true }, ...entries.slice(1)],
    loadMore: {
      label: 'Load more activity',
      loading: true,
      onAction: fn(),
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', {
      name: /Load more activity/,
    });
    const grid = canvas.getByRole('grid', { name: 'Activity' });
    const status = canvas.getByRole('status');
    const coffeeRow = within(grid).getByRole('row', { name: 'Coffee shop' });

    await expect(button).toHaveAttribute('aria-busy', 'true');
    await expect(button).toHaveAccessibleName(/Load more activity/);
    await expect(grid).not.toHaveAttribute('aria-busy');
    await expect(status).toHaveTextContent('Loading');
    await expect(grid.closest('[aria-live]')).toBeNull();
    await expect(status.closest('[aria-busy]')).toBeNull();
    await expect(grid).not.toContainElement(status);
    await expect(coffeeRow).toBeInTheDocument();
    await expect(
      within(coffeeRow).getAllByRole('progressbar', { hidden: true }),
    ).toHaveLength(2);
  },
};

/** Top-level refresh loading retains ordinary rows and their focus. */
export const RetainedLoading: Story = {
  args: {
    items: entries,
    loadMore: undefined,
    loading: true,
  },
};

function mergeEntries(
  current: RowListItemDescriptor[],
): RowListItemDescriptor[] {
  const existingIds = new Set(current.map(({ id }) => id));

  return [
    ...(existingIds.has('october')
      ? []
      : [
          {
            id: 'october',
            label: 'October entry',
            section: { id: 'october', label: 'October' },
          },
        ]),
    ...current,
    ...(existingIds.has('september-later')
      ? []
      : [
          {
            id: 'september-later',
            label: 'Later September entry',
            section: { id: 'september', label: 'September' },
          },
        ]),
  ];
}

function MergingExample() {
  const [items, setItems] = useState<RowListItemDescriptor[]>(entries);
  const merge = () => setItems((current) => mergeEntries(current));

  return (
    <RowList
      aria-label="Activity"
      getItem={getDescriptor}
      items={items}
      loadMore={{ label: 'Load more activity', onAction: merge }}
      onAction={merge}
    />
  );
}

/** Activating a row merges items while retaining its focused DOM row. */
export const Merging: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const grid = canvas.getByRole('grid', { name: 'Activity' });
    const coffeeRow = within(grid).getByRole('row', { name: 'Coffee shop' });

    grid.focus();
    await expect(coffeeRow).toHaveFocus();
    await userEvent.keyboard('{Enter}');

    await expect(
      within(grid).getByRole('row', { name: 'October entry' }),
    ).toBeInTheDocument();
    await expect(
      within(grid).getByRole('row', { name: 'Later September entry' }),
    ).toBeInTheDocument();
    await expect(within(grid).getByRole('row', { name: 'Coffee shop' })).toBe(
      coffeeRow,
    );
    await expect(coffeeRow).toHaveFocus();
  },
  render: () => <MergingExample />,
};
