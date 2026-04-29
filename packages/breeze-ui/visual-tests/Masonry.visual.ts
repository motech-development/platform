import { test } from '@playwright/test';
import { expectMasonryLayout, expectVisualParity } from './visualHarness';

const itemSelector = '[data-masonry-item]';
const columnSelector = '[data-testid="masonry-baseline"] > div > div';
const rowSelector = '[data-testid="masonry-baseline"] > div';
const storyId = 'masonry--basic-masonry';
const defaultMasonryGutterPx = 16;

const masonryItems = {
  lg: [
    ['Outside of loop', 'Item 4'],
    ['Item 1', 'Item 5'],
    ['Item 2', 'Item 6'],
    ['Item 3'],
  ],
  md: [
    ['Outside of loop', 'Item 3', 'Item 6'],
    ['Item 1', 'Item 4'],
    ['Item 2', 'Item 5'],
  ],
  sm: [
    ['Outside of loop', 'Item 2', 'Item 4', 'Item 6'],
    ['Item 1', 'Item 3', 'Item 5'],
  ],
  xs: [
    [
      'Outside of loop',
      'Item 1',
      'Item 2',
      'Item 3',
      'Item 4',
      'Item 5',
      'Item 6',
    ],
  ],
};

const masonryLayouts = [
  {
    columns: 1,
    name: 'xs',
  },
  {
    columns: 2,
    name: 'sm',
  },
  {
    columns: 3,
    name: 'md',
  },
  {
    columns: 4,
    name: 'lg',
  },
] as const;

test.describe('Masonry visual parity', () => {
  masonryLayouts.forEach(({ columns, name }) => {
    test(`${name} layout`, async ({ page }) => {
      await expectVisualParity(page, {
        screenshotName: `masonry-${name}.png`,
        setup: async () => {
          const rowWidth = await page
            .locator(rowSelector)
            .evaluate((element) => element.getBoundingClientRect().width);
          const expectedColumnWidth =
            (rowWidth - (columns - 1) * defaultMasonryGutterPx) / columns;

          await expectMasonryLayout(page.locator('body'), {
            columnSelector,
            expectedColumnWidth,
            expectedColumns: columns,
            expectedGutter: columns > 1 ? defaultMasonryGutterPx : undefined,
            expectedItemOrder: masonryItems[name],
            itemSelector,
          });
        },
        storyId,
        viewport: name,
      });
    });
  });
});
