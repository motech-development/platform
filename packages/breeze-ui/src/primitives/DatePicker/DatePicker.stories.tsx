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
  component: DatePicker,
  title: 'Forms/DatePicker',
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A required date field with a localized long-form trigger. */
export const Default: Story = {};

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
      {portalContainer && (
        <BreezeProvider locale="en-GB" portalContainer={portalContainer}>
          <div aria-hidden="true" style={{ blockSize: '240px' }} />
          <DatePicker defaultValue="2026-09-03" label="Transaction date" />
          <div aria-hidden="true" style={{ blockSize: '240px' }} />
        </BreezeProvider>
      )}
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
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const container = canvas.getByRole('region', {
      name: 'Scrollable date picker example',
    });
    const trigger = within(container).getByRole('button', {
      name: 'Transaction date 3 September 2026',
    });

    await userEvent.click(trigger);

    const dialog = await page.findByRole('dialog', {
      name: 'Transaction date',
    });

    await waitFor(async () => {
      const containerRect = container.getBoundingClientRect();
      const dialogRect = dialog.getBoundingClientRect();

      await expect(container.scrollTop).toBeGreaterThan(0);
      await expect(dialogRect.top).toBeGreaterThanOrEqual(containerRect.top);
      await expect(dialogRect.bottom).toBeLessThanOrEqual(containerRect.bottom);
    });
  },
  render: () => <ScrollingContainerExample />,
};
