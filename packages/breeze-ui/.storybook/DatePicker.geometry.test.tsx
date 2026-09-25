import { act, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { cdp, page } from 'vitest/browser';
import { DatePicker } from '../src/primitives/DatePicker/DatePicker';
import renderBreeze from '../test/render';
import '../src/styles/reset.css';
import '../src/styles/styles.css';

it('keeps coarse-pointer calendar grids within 320px and 360px viewports', async () => {
  const originalViewport = {
    height: window.innerHeight,
    width: window.innerWidth,
  };
  const browserSession = cdp();
  await browserSession.send('Emulation.setTouchEmulationEnabled', {
    enabled: true,
    maxTouchPoints: 1,
  });

  try {
    expect(window.matchMedia('(any-pointer: coarse)').matches).toBe(true);

    const expectGridFitsViewport = async (viewportWidth: number) => {
      await page.viewport(viewportWidth, 800);

      const { unmount } = renderBreeze(
        <DatePicker defaultValue="2026-09-03" label="Date" />,
      );

      try {
        await userEvent
          .setup()
          .click(screen.getByRole('button', { name: 'Date 3 September 2026' }));

        const dialog = screen.getByRole('dialog', { name: 'Date' });
        const popover = dialog.closest<HTMLElement>(
          '[data-breeze-overlay="popover"]',
        );
        const grid = screen.getByRole('grid');
        const weekButtons = within(grid).getAllByRole('button').slice(0, 7);
        const firstButton = weekButtons[0];
        const lastButton = weekButtons.at(-1);

        if (!popover || !firstButton || !lastButton) {
          throw new Error(
            'The open calendar grid must contain a complete week.',
          );
        }

        await waitFor(() => {
          expect(popover).not.toHaveAttribute('data-entering');
        });

        const popoverRect = popover.getBoundingClientRect();
        const firstButtonRect = firstButton.getBoundingClientRect();
        const lastButtonRect = lastButton.getBoundingClientRect();

        expect(window.innerWidth).toBe(viewportWidth);
        expect(weekButtons).toHaveLength(7);
        expect(popover.scrollWidth).toBeLessThanOrEqual(popover.clientWidth);
        expect(grid.scrollWidth).toBeLessThanOrEqual(grid.clientWidth);
        expect(popoverRect.left).toBeGreaterThanOrEqual(4);
        expect(popoverRect.right).toBeLessThanOrEqual(viewportWidth - 4);
        const touchTargetSizes = weekButtons.map((button) => {
          const { height, width } = button.getBoundingClientRect();

          return { height, width };
        });
        expect(
          touchTargetSizes.every(
            ({ height, width }) => width >= 44 && height >= 44,
          ),
        ).toBe(true);
        expect(firstButtonRect.left).toBeGreaterThanOrEqual(popoverRect.left);
        expect(lastButtonRect.right).toBeLessThanOrEqual(popoverRect.right);
      } finally {
        unmount();
      }
    };

    await expectGridFitsViewport(320);
    await expectGridFitsViewport(360);
  } finally {
    await act(async () => {
      await browserSession.send('Emulation.setTouchEmulationEnabled', {
        enabled: false,
      });
      await page.viewport(originalViewport.width, originalViewport.height);
    });
  }
});
