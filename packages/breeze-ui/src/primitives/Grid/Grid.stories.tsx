import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Card } from '../Card/Card';
import { Stack } from '../Stack/Stack';
import { Grid } from './Grid';

const meta = {
  args: {
    children: (
      <>
        <Card>Primary content</Card>
        <Card>Supporting content</Card>
        <Card>Related content</Card>
      </>
    ),
    columns: 3,
  },
  component: Grid,
  title: 'Layout/Grid',
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Three equal columns that collapse below Breeze's structural breakpoint. */
export const Responsive: Story = {};

/** Two columns that remain side by side at every width. */
export const Fixed: Story = {
  args: {
    collapseBelow: 'none',
    columns: 2,
  },
};

async function verifyMainAsideGeometry(canvasElement: HTMLElement) {
  if (!('__vitest_browser__' in globalThis)) return;

  const browserContext = await import('vitest/browser');
  const view = canvasElement.ownerDocument.defaultView;

  if (!view) throw new Error('Missing Grid story window.');

  const originalViewport = { height: view.innerHeight, width: view.innerWidth };
  const canvas = within(canvasElement);
  const main = canvas.getByRole('group', { name: 'Main content' });
  const aside = canvas.getByRole('group', { name: 'Aside' });

  try {
    await browserContext.page.viewport(1200, 800);
    await expect(view.innerWidth).toBe(1200);

    const mainRect = main.getBoundingClientRect();
    const asideRect = aside.getBoundingClientRect();

    await expect(Math.abs(asideRect.width - 300)).toBeLessThan(1);
    await expect(mainRect.width).toBeGreaterThan(asideRect.width);
    await expect(Math.abs(mainRect.top - asideRect.top)).toBeLessThan(1);
    await expect(asideRect.height).toBeLessThan(mainRect.height);

    await browserContext.page.viewport(375, 812);
    await expect(view.innerWidth).toBe(375);

    const narrowMainRect = main.getBoundingClientRect();
    const narrowAsideRect = aside.getBoundingClientRect();

    await expect(narrowAsideRect.top).toBeGreaterThanOrEqual(
      narrowMainRect.bottom,
    );
    await expect(
      Math.abs(narrowAsideRect.width - narrowMainRect.width),
    ).toBeLessThan(1);
  } finally {
    await browserContext.page.viewport(
      originalViewport.width,
      originalViewport.height,
    );
  }
}

/** A growing main column beside a 300px aside that stacks below `md`. */
export const MainAside: Story = {
  args: {
    children: (
      <>
        <Card aria-label="Main content">
          <Stack gap={8}>
            <span>Needs you</span>
            <span>Recent activity</span>
          </Stack>
        </Card>
        <Card aria-label="Aside">Year end</Card>
      </>
    ),
    columns: 'mainAside',
  },
  play: async ({ canvasElement }) => {
    await verifyMainAsideGeometry(canvasElement);
  },
};
