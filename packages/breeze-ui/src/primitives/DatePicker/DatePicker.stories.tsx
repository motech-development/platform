import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { BreezeProvider } from '../../provider/BreezeProvider';
import type { IsoCalendarDate } from '../Typography/Typography';
import { DatePicker } from './DatePicker';

const meta = {
  args: {
    defaultValue: '2026-09-03',
    label: 'Transaction date',
  },
  beforeEach: () => {
    const originalNow = Date.now;
    const fixedNow = new Date(2026, 8, 15, 12).getTime();

    Date.now = () => fixedNow;

    return () => {
      Date.now = originalNow;
    };
  },
  component: DatePicker,
  title: 'Forms/DatePicker',
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

function resolvedTokenColour(element: HTMLElement, token: string) {
  const probe = element.ownerDocument.createElement('span');

  probe.style.backgroundColor = `var(${token})`;
  element.after(probe);

  const colour = getComputedStyle(probe).backgroundColor;

  probe.remove();

  return colour;
}

/** A required date field with a localized long-form trigger. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole('button', {
      name: 'Transaction date 3 September 2026',
    });

    trigger.focus();
    await userEvent.keyboard('{Enter}');

    const dialog = await page.findByRole('dialog', {
      name: 'Transaction date',
    });
    const today = within(dialog).getByRole('button', {
      name: /Tuesday, 15 September 2026/,
    });
    const selectedDate = within(dialog).getByRole('button', {
      name: /Thursday, 3 September 2026 selected/,
    });

    await expect(today).toHaveAttribute('data-today', 'true');
    await expect(today).not.toHaveAttribute('data-selected', 'true');
    await expect(selectedDate).toHaveFocus();
  },
};

/** A visible error marks the trigger invalid. */
export const Error: Story = {
  args: {
    error: 'Choose a transaction date.',
  },
};

/** A disabled date field cannot be opened or changed. */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

/** An optional date offers a clear control in its calendar. */
export const Optional: Story = {
  args: {
    required: false,
  },
};

/** A read-only date stays focusable and submitted but cannot be opened. */
export const ReadOnly: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readOnlyTrigger = canvas.getByRole('button', {
      name: 'Recorded date 3 September 2026',
    });
    const editableTrigger = canvas.getByRole('button', {
      name: 'Transaction date 3 September 2026',
    });
    const readOnlyBackground =
      getComputedStyle(readOnlyTrigger).backgroundColor;

    await expect(readOnlyBackground).not.toBe(
      getComputedStyle(editableTrigger).backgroundColor,
    );
    await expect(readOnlyBackground).toBe(
      resolvedTokenColour(readOnlyTrigger, '--breeze-color-breeze-sunken'),
    );
  },
  render: () => (
    <div className="breeze-story-stack">
      <DatePicker
        defaultValue="2026-09-03"
        label="Recorded date"
        name="recordedDate"
        readOnly
      />
      <DatePicker defaultValue="2026-09-03" label="Transaction date" />
    </div>
  ),
};

/** A shape-preserving loading field keeps its value out of form submission. */
export const Loading: Story = {
  args: {
    description: 'Choose the transaction date.',
    error: 'Choose a transaction date.',
    loading: true,
  },
};

function ControlledExample() {
  const [value, setValue] = useState<IsoCalendarDate>('2026-09-03');

  return (
    <div className="breeze-story-action">
      <DatePicker label="Transaction date" onChange={setValue} value={value} />
      <output>Current ISO date: {value}</output>
    </div>
  );
}

/** The application owns the selected date and receives an ISO value. */
export const Controlled: Story = {
  render: () => <ControlledExample />,
};

function ScrollingContainerExample() {
  const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(
    null,
  );

  return (
    <div
      aria-label="Scrollable date picker example"
      ref={setPortalContainer}
      role="region"
      style={{ blockSize: '500px', overflowY: 'auto' }}
    >
      <div aria-hidden="true" style={{ blockSize: '150px' }} />
      <div
        aria-label="Nested date picker scroll area"
        role="region"
        style={{ blockSize: '600px', overflowY: 'auto' }}
      >
        {portalContainer && (
          <BreezeProvider locale="en-GB" portalContainer={portalContainer}>
            <div aria-hidden="true" style={{ blockSize: '175px' }} />
            <DatePicker defaultValue="2026-09-03" label="Transaction date" />
            {/* Keep the trigger in the inner scroller while the outer one needs to move. */}
            <div aria-hidden="true" style={{ blockSize: '400px' }} />
          </BreezeProvider>
        )}
      </div>
    </div>
  );
}

async function assertCoarsePointerCalendarGeometry(canvasElement: HTMLElement) {
  // The browser controls are supplied by the existing Storybook Vitest suite.
  if (!('__vitest_browser__' in globalThis)) return;

  const browserContext = await import('vitest/browser');

  const view = canvasElement.ownerDocument.defaultView;

  if (!view) {
    throw new globalThis.Error('Missing date picker story window.');
  }

  const originalViewport = {
    height: view.innerHeight,
    width: view.innerWidth,
  };
  const browserSession = browserContext.cdp();

  await browserSession.send('Emulation.setTouchEmulationEnabled', {
    enabled: true,
    maxTouchPoints: 1,
  });

  try {
    await expect(view.matchMedia('(any-pointer: coarse)').matches).toBe(true);

    const trigger = within(canvasElement).getByRole('button', {
      name: 'Transaction date 3 September 2026',
    });
    const page = within(canvasElement.ownerDocument.body);

    const assertViewportGeometry = async (viewportWidth: number) => {
      await browserContext.page.viewport(viewportWidth, 800);
      await userEvent.click(trigger);

      const dialog = page.getByRole('dialog', {
        name: 'Transaction date',
      });
      const popover = dialog.closest<HTMLElement>(
        '[data-breeze-overlay="popover"]',
      );
      const grid = page.getByRole('grid');
      const weekButtons = within(grid).getAllByRole('button').slice(0, 7);
      const firstButton = weekButtons[0];
      const lastButton = weekButtons.at(-1);

      if (!popover || !firstButton || !lastButton) {
        throw new globalThis.Error(
          'The open calendar grid must contain a complete week.',
        );
      }

      await waitFor(async () => {
        await expect(popover).not.toHaveAttribute('data-entering');
      });

      const popoverRect = popover.getBoundingClientRect();
      const firstButtonRect = firstButton.getBoundingClientRect();
      const lastButtonRect = lastButton.getBoundingClientRect();
      const touchTargetSizes = weekButtons.map((button) => {
        const { height, width } = button.getBoundingClientRect();

        return { height, width };
      });

      await expect(view.innerWidth).toBe(viewportWidth);
      await expect(weekButtons).toHaveLength(7);
      await expect(popover.scrollWidth).toBeLessThanOrEqual(
        popover.clientWidth,
      );
      await expect(grid.scrollWidth).toBeLessThanOrEqual(grid.clientWidth);
      await expect(popoverRect.left).toBeGreaterThanOrEqual(4);
      await expect(popoverRect.right).toBeLessThanOrEqual(viewportWidth - 4);
      await expect(
        touchTargetSizes.every(
          ({ height, width }) => width >= 44 && height >= 44,
        ),
      ).toBe(true);
      await expect(firstButtonRect.left).toBeGreaterThanOrEqual(
        popoverRect.left,
      );
      await expect(lastButtonRect.right).toBeLessThanOrEqual(popoverRect.right);

      await userEvent.click(trigger);
      await waitFor(async () => {
        await expect(trigger).toHaveAttribute('aria-expanded', 'false');
      });
    };

    await assertViewportGeometry(320);
    await assertViewportGeometry(360);
  } finally {
    await browserSession.send('Emulation.setTouchEmulationEnabled', {
      enabled: false,
    });
    await browserContext.page.viewport(
      originalViewport.width,
      originalViewport.height,
    );
  }
}

/** A phone-width calendar keeps seven 44px targets inside the viewport. */
export const CoarsePointerGeometry: Story = {
  play: async ({ canvasElement }) => {
    await assertCoarsePointerCalendarGeometry(canvasElement);
  },
};

/** Opening the calendar keeps its panel visible in a scrolling container. */
export const ScrollingContainer: Story = {
  play: async ({ canvasElement }) => {
    const view = canvasElement.ownerDocument.defaultView;

    if (!view) {
      throw new globalThis.Error('Missing date picker story window.');
    }

    const isVitestBrowser = '__vitest_browser__' in globalThis;
    const browserContext = isVitestBrowser
      ? await import('vitest/browser')
      : undefined;
    const originalViewport = {
      height: view.innerHeight,
      width: view.innerWidth,
    };
    let viewportChanged = false;

    try {
      if (browserContext) {
        viewportChanged = true;
        await browserContext.page.viewport(2336, 1000);
        await expect(view.innerWidth).toBe(2336);
        await expect(view.innerHeight).toBe(1000);
      }

      const canvas = within(canvasElement);
      const page = within(canvasElement.ownerDocument.body);
      const container = canvas.getByRole('region', {
        name: 'Scrollable date picker example',
      });
      const innerContainer = canvas.getByRole('region', {
        name: 'Nested date picker scroll area',
      });
      const trigger = within(container).getByRole('button', {
        name: 'Transaction date 3 September 2026',
      });

      const originalTransform = container.style.transform;
      const originalContainerScrollTop = container.scrollTop;
      const originalInnerScrollTop = innerContainer.scrollTop;

      try {
        container.scrollTop = 0;
        innerContainer.scrollTop = 0;
        container.style.transform = 'translateY(-136px)';

        const initialTriggerRect = trigger.getBoundingClientRect();

        await expect(initialTriggerRect.top).toBeGreaterThanOrEqual(0);
        await expect(initialTriggerRect.bottom).toBeLessThanOrEqual(
          view.innerHeight,
        );

        trigger.focus();
        await userEvent.keyboard('{Enter}');

        const viewportDialog = await page.findByRole('dialog', {
          name: 'Transaction date',
        });

        await waitFor(async () => {
          const triggerRect = trigger.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          const dialogRect = viewportDialog.getBoundingClientRect();
          const visibleTop = Math.max(containerRect.top, 0);
          const visibleBottom = Math.min(
            containerRect.bottom,
            view.innerHeight,
          );

          await expect(triggerRect.top).toBeGreaterThanOrEqual(0);
          await expect(triggerRect.bottom).toBeLessThanOrEqual(
            view.innerHeight,
          );
          await expect(dialogRect.top).toBeGreaterThanOrEqual(visibleTop);
          await expect(dialogRect.bottom).toBeLessThanOrEqual(visibleBottom);
          await expect(viewportDialog).toBeVisible();
          await expect(trigger).toHaveAttribute('aria-expanded', 'true');
        });
      } finally {
        try {
          if (trigger.getAttribute('aria-expanded') === 'true') {
            await userEvent.keyboard('{Escape}');
            await waitFor(() =>
              expect(
                page.queryByRole('dialog', { name: 'Transaction date' }),
              ).not.toBeInTheDocument(),
            );
          }
        } finally {
          container.style.transform = originalTransform;
          container.scrollTop = originalContainerScrollTop;
          innerContainer.scrollTop = originalInnerScrollTop;
        }
      }

      trigger.focus();
      await userEvent.keyboard('{Enter}');

      await waitFor(async () => {
        const dialog = page.getByRole('dialog', {
          name: 'Transaction date',
        });
        const containerRect = container.getBoundingClientRect();
        const dialogRect = dialog.getBoundingClientRect();

        await expect(container.scrollTop).toBeGreaterThan(0);
        await expect(innerContainer.scrollTop).toBe(0);
        await expect(dialogRect.top).toBeGreaterThanOrEqual(containerRect.top);
        await expect(dialogRect.bottom).toBeLessThanOrEqual(
          containerRect.bottom,
        );
      });

      const dialog = page.getByRole('dialog', { name: 'Transaction date' });
      const selectedDate = within(dialog).getByRole('button', {
        name: /Thursday, 3 September 2026 selected/,
      });

      await waitFor(async () => expect(dialog).toBeVisible());
      await expect(trigger).toHaveAttribute('aria-expanded', 'true');
      await waitFor(async () => expect(selectedDate).toHaveFocus());
    } finally {
      if (browserContext && viewportChanged) {
        await browserContext.page.viewport(
          originalViewport.width,
          originalViewport.height,
        );
      }
    }
  },
  render: () => <ScrollingContainerExample />,
};
