import type { Locator, Page } from '@playwright/test';

export default async function focusWithKeyboard(
  page: Page,
  target: Locator,
  unreachableMessage: string,
): Promise<void> {
  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  });
  await page.keyboard.press('Tab');
  const firstFocusedElement = await page.evaluateHandle(
    () => document.activeElement,
  );

  async function advanceUntilTarget(): Promise<void> {
    if (
      await target.evaluate((element) => element === document.activeElement)
    ) {
      return;
    }

    await page.keyboard.press('Tab');

    if (
      await firstFocusedElement.evaluate(
        (firstElement) => firstElement === document.activeElement,
      )
    ) {
      throw new Error(unreachableMessage);
    }

    await advanceUntilTarget();
  }

  try {
    await advanceUntilTarget();
  } finally {
    await firstFocusedElement.dispose();
  }
}
