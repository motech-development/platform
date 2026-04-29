import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { expectVisualParity } from './visualHarness';

const storyId = 'tooltip--basic-tooltip';
const stateTarget = '[data-testid="tooltip-baseline"] button';

const placements = [
  {
    expectedArrowStyles: {
      borderBottomWidth: '5px',
      borderLeftWidth: '5px',
      borderRightWidth: '5px',
      borderTopWidth: '0px',
      height: '5px',
      width: '10px',
    },
    name: 'bottom',
  },
  {
    expectedArrowStyles: {
      borderBottomWidth: '5px',
      borderLeftWidth: '5px',
      borderRightWidth: '0px',
      borderTopWidth: '5px',
      height: '10px',
      width: '5px',
    },
    name: 'left',
  },
  {
    expectedArrowStyles: {
      borderBottomWidth: '5px',
      borderLeftWidth: '0px',
      borderRightWidth: '5px',
      borderTopWidth: '5px',
      height: '10px',
      width: '5px',
    },
    name: 'right',
  },
  {
    expectedArrowStyles: {
      borderBottomWidth: '0px',
      borderLeftWidth: '5px',
      borderRightWidth: '5px',
      borderTopWidth: '5px',
      height: '5px',
      width: '10px',
    },
    name: 'top',
  },
] as const;

const expectArrowGeometry = async (
  page: Page,
  expectedArrowStyles: (typeof placements)[number]['expectedArrowStyles'],
) => {
  const arrowStyles = await page
    .locator('[role="tooltip"] > div')
    .evaluate((element) => {
      const styles = window.getComputedStyle(element);

      return {
        borderBottomWidth: styles.borderBottomWidth,
        borderLeftWidth: styles.borderLeftWidth,
        borderRightWidth: styles.borderRightWidth,
        borderTopWidth: styles.borderTopWidth,
        height: styles.height,
        width: styles.width,
      };
    });

  expect(arrowStyles).toEqual(expectedArrowStyles);
};

test.describe('Tooltip visual parity', () => {
  test('hidden state', async ({ page }) => {
    await expectVisualParity(page, {
      screenshotName: 'tooltip-hidden.png',
      storyId,
      target: '[data-testid="tooltip-baseline"]',
    });
  });

  placements.forEach(({ expectedArrowStyles, name }) => {
    test(`visible ${name} placement with arrow geometry`, async ({ page }) => {
      await expectVisualParity(page, {
        screenshotName: `tooltip-visible-${name}.png`,
        setup: async (storyPage) => {
          await storyPage.locator(stateTarget).hover();
          await expectArrowGeometry(storyPage, expectedArrowStyles);
        },
        storyId: `tooltip--${name}-tooltip`,
        target: '[data-testid="tooltip-baseline"]',
      });
    });
  });

  test('remains visible during delayed hide', async ({ page }) => {
    await expectVisualParity(page, {
      screenshotName: 'tooltip-delayed-hide-visible.png',
      setup: async (storyPage) => {
        await storyPage.locator(stateTarget).hover();
        await storyPage.mouse.move(0, 0);
        await storyPage.clock.fastForward(999);
      },
      stateAwareSetup: {
        clockTime: new Date('2024-01-01T00:00:00.000Z'),
      },
      storyId,
      target: '[data-testid="tooltip-baseline"]',
    });
  });
});
