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
      '[class~="breeze:col-start-3"]',
    );
    const marketValueRegion = marketRow.querySelector<HTMLElement>(
      '[class~="breeze:col-start-3"]',
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
      Math.abs(coffeeDateRect.right - marketDateRect.right),
    ).toBeLessThan(1);
    await expect(
      Math.abs(coffeeValueRect.right - marketValueRect.right),
    ).toBeLessThan(1);

    await browserContext.page.viewport(375, 812);
    await expect(view.innerWidth).toBe(375);

    const narrowGrid = canvas.getByRole('grid', { name: 'Activity' });
    const narrowCoffeeRow = within(narrowGrid).getByRole('row', {
      name: 'Coffee shop',
    });
    const narrowLabel = within(narrowCoffeeRow)
      .getByText('Coffee shop')
      .getBoundingClientRect();
    const narrowDate = within(narrowCoffeeRow)
      .getByText('14 Sept 2026')
      .getBoundingClientRect();
    const narrowValue = within(narrowCoffeeRow)
      .getByText('£4.75')
      .getBoundingClientRect();

    await expect(narrowDate.top).toBeGreaterThan(narrowLabel.top);
    await expect(narrowValue.top).toBeGreaterThan(narrowDate.top);
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

/** Three aligned regions stack below Breeze's medium breakpoint. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    await verifyResponsiveGeometry(canvasElement);
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
