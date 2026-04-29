import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

export const DEFAULT_MAX_DIFF_PIXEL_RATIO = 0.001;

export const BREEZE_VIEWPORTS = {
  lg: {
    height: 1000,
    width: 992,
  },
  md: {
    height: 900,
    width: 768,
  },
  sm: {
    height: 800,
    width: 576,
  },
  xs: {
    height: 667,
    width: 375,
  },
} as const;

export type BreezeBreakpoint = keyof typeof BREEZE_VIEWPORTS;
export type VisualState = 'default' | 'focus' | 'hover';

export interface StorybookStoryOptions {
  args?: Record<string, boolean | number | string>;
  globals?: Record<string, boolean | number | string>;
  storyId: string;
  viewport?: BreezeBreakpoint;
}

export interface StateAwareSetupOptions {
  animationTimestamp?: number;
  bodyMarkup?: string;
  clockTime?: Date;
  disableAnimations?: boolean;
  overflow?: 'auto' | 'hidden' | 'visible';
  scroll?: {
    x: number;
    y: number;
  };
}

export interface VisualCaptureOptions extends StorybookStoryOptions {
  maxDiffPixelRatio?: number;
  screenshotName: string;
  setup?: (page: Page) => Promise<void>;
  state?: VisualState;
  stateAwareSetup?: StateAwareSetupOptions;
  stateTarget?: string;
  target?: string;
}

export interface MasonryLayoutOptions {
  columnSelector: string;
  expectedColumns: number;
  expectedColumnWidth?: number;
  expectedGutter?: number;
  expectedItemOrder?: string[][];
  itemSelector: string;
  widthTolerance?: number;
}

const encodeStorybookParams = (
  params: Record<string, boolean | number | string> = {},
) =>
  Object.entries(params)
    .map(([key, value]) => `${key}:${String(value)}`)
    .join(';');

const getMaxDiffPixelRatio = (maxDiffPixelRatio?: number) => {
  const resolvedMaxDiffPixelRatio =
    maxDiffPixelRatio ?? DEFAULT_MAX_DIFF_PIXEL_RATIO;

  if (resolvedMaxDiffPixelRatio > DEFAULT_MAX_DIFF_PIXEL_RATIO) {
    throw new Error(
      `Visual parity maxDiffPixelRatio must be ${DEFAULT_MAX_DIFF_PIXEL_RATIO} or stricter.`,
    );
  }

  return resolvedMaxDiffPixelRatio;
};

export const getStorybookIframeUrl = ({
  args,
  globals,
  storyId,
}: StorybookStoryOptions) => {
  const searchParams = new URLSearchParams({
    id: storyId,
    viewMode: 'story',
  });
  const encodedArgs = encodeStorybookParams(args);
  const encodedGlobals = encodeStorybookParams(globals);

  if (encodedArgs) {
    searchParams.set('args', encodedArgs);
  }

  if (encodedGlobals) {
    searchParams.set('globals', encodedGlobals);
  }

  return `/iframe.html?${searchParams.toString()}`;
};

export const waitForStableStory = async (page: Page) => {
  await page.waitForLoadState('networkidle');
  await page.evaluate(async () => document.fonts.ready);
};

export const openStory = async (page: Page, options: StorybookStoryOptions) => {
  await page.setViewportSize(BREEZE_VIEWPORTS[options.viewport ?? 'lg']);
  await page.goto(getStorybookIframeUrl(options));
  await waitForStableStory(page);
};

export const prepareStateAwareCapture = async (
  page: Page,
  {
    animationTimestamp = 0,
    bodyMarkup,
    clockTime,
    disableAnimations = true,
    overflow = 'visible',
    scroll = {
      x: 0,
      y: 0,
    },
  }: StateAwareSetupOptions = {},
) => {
  if (clockTime) {
    await page.clock.install({
      time: clockTime,
    });
  }

  if (bodyMarkup) {
    await page.evaluate((markup) => {
      document.body.insertAdjacentHTML('beforeend', markup);
    }, bodyMarkup);
  }

  await page.evaluate(
    ({ overflowValue, scrollX, scrollY }) => {
      document.body.style.overflow = overflowValue;
      window.scrollTo(scrollX, scrollY);
    },
    {
      overflowValue: overflow,
      scrollX: scroll.x,
      scrollY: scroll.y,
    },
  );

  if (disableAnimations) {
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-delay: -${animationTimestamp}ms !important;
          animation-duration: 1ms !important;
          animation-iteration-count: 1 !important;
          caret-color: transparent !important;
          transition-delay: 0ms !important;
          transition-duration: 0ms !important;
        }
      `,
    });
  }
};

export const applyVisualState = async (
  page: Page,
  selector: string,
  state: VisualState = 'default',
) => {
  const target = page.locator(selector).first();

  if (state === 'hover') {
    await target.hover();
  }

  if (state === 'focus') {
    await target.focus();
  }

  return target;
};

export const expectVisualParity = async (
  page: Page,
  {
    setup,
    state = 'default',
    stateAwareSetup = {},
    stateTarget,
    target = '#storybook-root',
    ...options
  }: VisualCaptureOptions,
) => {
  const { clockTime, ...postNavigationStateSetup } = stateAwareSetup;

  if (clockTime) {
    await page.clock.install({
      time: clockTime,
    });
  }

  await openStory(page, options);
  await prepareStateAwareCapture(page, postNavigationStateSetup);

  if (setup) {
    await setup(page);
    await waitForStableStory(page);
  }

  if (state !== 'default' && !stateTarget) {
    throw new Error('stateTarget is required for hover and focus screenshots.');
  }

  if (stateTarget) {
    await applyVisualState(page, stateTarget, state);
  }

  await expect(page.locator(target)).toHaveScreenshot(options.screenshotName, {
    maxDiffPixelRatio: getMaxDiffPixelRatio(options.maxDiffPixelRatio),
  });
};

export const expectMasonryLayout = async (
  container: Locator,
  {
    columnSelector,
    expectedColumns,
    expectedColumnWidth,
    expectedGutter,
    expectedItemOrder,
    itemSelector,
    widthTolerance = 1,
  }: MasonryLayoutOptions,
) => {
  const columns = container.locator(columnSelector);

  await expect(columns).toHaveCount(expectedColumns);

  if (expectedItemOrder) {
    const renderedItemOrder = await columns.evaluateAll(
      (elements, selector) =>
        elements.map((element) =>
          Array.from(element.querySelectorAll(selector)).map(
            (item) => item.textContent?.trim() ?? '',
          ),
        ),
      itemSelector,
    );

    expect(renderedItemOrder).toEqual(expectedItemOrder);
  }

  if (expectedGutter !== undefined) {
    const columnBoxes = await columns.evaluateAll((elements) =>
      elements.map((element) => {
        const { left, right } = element.getBoundingClientRect();

        return {
          left,
          right,
        };
      }),
    );

    const gutters = columnBoxes.slice(1).map(({ left }, index) => {
      const previousRight = columnBoxes[index].right;

      return Math.round(left - previousRight);
    });

    expect(gutters).toEqual(
      Array.from({
        length: expectedColumns - 1,
      }).map(() => expectedGutter),
    );
  }

  if (expectedColumnWidth !== undefined) {
    const columnWidths = await columns.evaluateAll((elements) =>
      elements.map((element) => element.getBoundingClientRect().width),
    );

    columnWidths.forEach((columnWidth) => {
      expect(Math.abs(columnWidth - expectedColumnWidth)).toBeLessThanOrEqual(
        widthTolerance,
      );
    });
  }
};
