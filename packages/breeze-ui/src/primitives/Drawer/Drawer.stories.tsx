import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import {
  SharedOverlayClose as Close,
  SharedOverlayDescription as Description,
  SharedOverlayTitle as Title,
  SharedOverlayTrigger as Trigger,
} from '../../internal/react-aria/OverlayParts';
import { Button } from '../Button/Button';
import { Typography } from '../Typography/Typography';
import { Content, Drawer, Root } from './Drawer';

interface MotionSample {
  left: number;
  opacity: number;
  top: number;
}

async function sampleMotion(
  action: () => Promise<void>,
  getSurface: () => Element | null = () =>
    document.querySelector('.breeze-drawer-surface'),
): Promise<MotionSample[]> {
  const samples: MotionSample[] = [];
  let remainingFrames = 24;
  const sampling = new Promise<void>((resolve) => {
    const sampleFrame = () => {
      const surface = getSurface();

      if (surface !== null) {
        const bounds = surface.getBoundingClientRect();

        samples.push({
          left: bounds.left,
          opacity: Number.parseFloat(getComputedStyle(surface).opacity),
          top: bounds.top,
        });
      }

      remainingFrames -= 1;

      if (remainingFrames === 0) {
        resolve();
      } else {
        requestAnimationFrame(sampleFrame);
      }
    };

    requestAnimationFrame(sampleFrame);
  });

  await action();
  await sampling;

  return samples;
}

async function expectMotionAlongAxis(
  samples: MotionSample[],
  axis: 'inlineEnd' | 'bottom',
  restingPosition: number,
) {
  const movingSamples = samples.filter((sample) =>
    axis === 'inlineEnd'
      ? sample.left > restingPosition + 0.5
      : sample.top > restingPosition + 0.5,
  );

  await expect(movingSamples.length).toBeGreaterThan(0);

  const crossAxisPositions = movingSamples.map((sample) =>
    axis === 'inlineEnd' ? sample.top : sample.left,
  );

  await expect(
    Math.max(...crossAxisPositions) - Math.min(...crossAxisPositions),
  ).toBeLessThan(1);
}

function getDrawer(canvasElement: HTMLElement, name: string, hidden = false) {
  return within(canvasElement.ownerDocument.body).queryByRole('dialog', {
    hidden,
    name,
  });
}

async function playResponsiveNestedDrawer(
  canvasElement: HTMLElement,
  compact: boolean,
) {
  const canvas = within(canvasElement);
  const body = within(canvasElement.ownerDocument.body);
  const { documentElement } = canvasElement.ownerDocument;
  const rootTrigger = canvas.getByRole('button', { name: 'Open drawer' });

  await expect(body.queryByRole('dialog')).not.toBeInTheDocument();
  await expect(
    canvasElement.ownerDocument.querySelector('.breeze-drawer-motion'),
  ).toBeNull();

  const outerEntry = await sampleMotion(
    () => userEvent.click(rootTrigger),
    () => getDrawer(canvasElement, 'Responsive drawer'),
  );

  const outerDrawer = body.getByRole('dialog', {
    name: 'Responsive drawer',
  });
  const outerBounds = outerDrawer.getBoundingClientRect();
  const outerMotion = outerDrawer.parentElement;
  const outerOverlay = outerMotion?.parentElement;
  const outerHeader = outerDrawer.querySelector('header');
  const outerHeaderClose = within(outerDrawer).getByRole('button', {
    name: 'Close',
  });
  const expectedAxis = compact ? 'bottom' : 'inlineEnd';

  if (!(outerHeader instanceof HTMLElement)) {
    throw new Error('Outer drawer header is missing.');
  }

  await expect(outerHeaderClose).toHaveFocus();
  await expect(getComputedStyle(outerHeader).backgroundColor).toBe(
    'rgb(21, 28, 43)',
  );
  await waitFor(() => expect(outerMotion).not.toHaveAttribute('data-entering'));
  await expect(outerDrawer.scrollWidth).toBeLessThanOrEqual(
    outerDrawer.clientWidth,
  );
  await expect(documentElement.scrollWidth).toBeLessThanOrEqual(
    documentElement.clientWidth,
  );
  await expect(
    getComputedStyle(outerDrawer).getPropertyValue('--breeze-drawer-x').trim(),
  ).toBe(compact ? '0%' : '100%');
  await expect(
    getComputedStyle(outerDrawer).getPropertyValue('--breeze-drawer-y').trim(),
  ).toBe(compact ? '100%' : '0%');

  if (compact) {
    await expect(outerBounds.left).toBeCloseTo(0, 1);
    await expect(outerBounds.top).toBeCloseTo(0, 1);
    await expect(outerBounds.width).toBeCloseTo(documentElement.clientWidth, 1);
    await expect(outerBounds.height).toBeCloseTo(
      documentElement.clientHeight,
      1,
    );
  } else {
    await expect(outerBounds.width).toBeLessThan(documentElement.clientWidth);
    await expect(outerBounds.right).toBeCloseTo(documentElement.clientWidth, 1);
    await expect(outerBounds.top).toBeCloseTo(0, 1);
    await expect(outerBounds.height).toBeCloseTo(
      documentElement.clientHeight,
      1,
    );
  }

  await expectMotionAlongAxis(
    outerEntry,
    expectedAxis,
    compact ? outerBounds.top : outerBounds.left,
  );

  const nestedTrigger = within(outerDrawer).getByRole('button', {
    name: 'Open nested drawer',
  });
  const nestedEntry = await sampleMotion(
    () => userEvent.click(nestedTrigger),
    () => getDrawer(canvasElement, 'Nested drawer'),
  );
  const nestedDrawer = body.getByRole('dialog', { name: 'Nested drawer' });
  const nestedBounds = nestedDrawer.getBoundingClientRect();
  const nestedMotion = nestedDrawer.parentElement;
  const nestedOverlay = nestedMotion?.parentElement;
  const nestedHeader = nestedDrawer.querySelector('header');
  const nestedHeaderClose = within(nestedDrawer).getByRole('button', {
    name: 'Close',
  });

  if (
    !(outerOverlay instanceof HTMLElement) ||
    !(nestedOverlay instanceof HTMLElement) ||
    !(nestedHeader instanceof HTMLElement)
  ) {
    throw new Error('Drawer overlay anatomy is missing.');
  }

  const followingPosition =
    canvasElement.ownerDocument.defaultView?.Node.DOCUMENT_POSITION_FOLLOWING ??
    0;

  await expect(body.getAllByRole('dialog', { hidden: true })).toHaveLength(2);
  await waitFor(() =>
    expect(nestedMotion).not.toHaveAttribute('data-entering'),
  );
  await expect(nestedHeaderClose).toHaveFocus();
  await expect(getComputedStyle(nestedHeader).backgroundColor).toBe(
    'rgb(34, 44, 64)',
  );
  await expect(nestedDrawer).toHaveClass('breeze-drawer-adjacent-surface');
  await expect(nestedMotion).toHaveClass('breeze-drawer-adjacent-motion');
  await expect(nestedOverlay).toHaveClass('breeze-drawer-adjacent-overlay');
  await expect(nestedOverlay).toHaveStyle(
    '--breeze-drawer-adjacent-inline-end: 768px',
  );
  await expect(nestedOverlay).toHaveStyle('--breeze-drawer-width: 38rem');
  await expect(outerOverlay.compareDocumentPosition(nestedOverlay)).toBe(
    followingPosition,
  );
  await expect(getComputedStyle(nestedOverlay).zIndex).toBe(
    getComputedStyle(outerOverlay).zIndex,
  );
  await expect(nestedDrawer.scrollWidth).toBeLessThanOrEqual(
    nestedDrawer.clientWidth,
  );
  await expect(
    getComputedStyle(nestedDrawer).getPropertyValue('--breeze-drawer-x').trim(),
  ).toBe(compact ? '0%' : '28px');
  await expect(
    getComputedStyle(nestedDrawer).getPropertyValue('--breeze-drawer-y').trim(),
  ).toBe(compact ? '100%' : '0%');

  if (compact) {
    await expect(nestedBounds.left).toBeCloseTo(0, 1);
    await expect(nestedBounds.top).toBeCloseTo(0, 1);
    await expect(nestedBounds.width).toBeCloseTo(
      documentElement.clientWidth,
      1,
    );
    await expect(nestedBounds.height).toBeCloseTo(
      documentElement.clientHeight,
      1,
    );
  } else {
    await expect(nestedBounds.width).toBeLessThan(outerBounds.width);
    await expect(nestedBounds.right).toBeCloseTo(outerBounds.left, 1);
    await expect(nestedBounds.left).toBeGreaterThanOrEqual(0);
  }

  await expectMotionAlongAxis(
    nestedEntry,
    expectedAxis,
    compact ? nestedBounds.top : nestedBounds.left,
  );

  const nestedExit = await sampleMotion(
    async () => {
      await userEvent.keyboard('{Escape}');
    },
    () => getDrawer(canvasElement, 'Nested drawer'),
  );

  await waitFor(() =>
    expect(
      getDrawer(canvasElement, 'Nested drawer', true),
    ).not.toBeInTheDocument(),
  );
  await expect(
    body.getByRole('dialog', { name: 'Responsive drawer' }),
  ).toBeVisible();
  await expect(nestedTrigger).toHaveFocus();
  await expectMotionAlongAxis(
    nestedExit,
    expectedAxis,
    compact ? nestedBounds.top : nestedBounds.left,
  );

  const outerExit = await sampleMotion(
    () => userEvent.click(outerHeaderClose),
    () => getDrawer(canvasElement, 'Responsive drawer'),
  );

  await waitFor(() =>
    expect(
      getDrawer(canvasElement, 'Responsive drawer', true),
    ).not.toBeInTheDocument(),
  );
  await expect(rootTrigger).toHaveFocus();
  await expectMotionAlongAxis(
    outerExit,
    expectedAxis,
    compact ? outerBounds.top : outerBounds.left,
  );
}

const meta = {
  component: Root,
  decorators: [
    (Story) => {
      Object.assign(Drawer.Close, { displayName: 'Drawer.Close' });
      Object.assign(Drawer.Content, { displayName: 'Drawer.Content' });
      Object.assign(Drawer.Description, {
        displayName: 'Drawer.Description',
      });
      Object.assign(Drawer.Root, { displayName: 'Drawer.Root' });
      Object.assign(Drawer.Title, { displayName: 'Drawer.Title' });
      Object.assign(Drawer.Trigger, { displayName: 'Drawer.Trigger' });

      return <Story />;
    },
  ] satisfies Decorator[],
  subcomponents: {
    Close,
    Content,
    Description,
    Title,
    Trigger,
  },
  title: 'Primitives/Overlays/Drawer',
} satisfies Meta<typeof Root>;
export default meta;
type Story = StoryObj<typeof meta>;

function ControlledTriggerlessExample() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onAction={() => setOpen(true)}>Edit selected item</Button>
      <Drawer.Root onOpenChange={setOpen} open={open} triggerless>
        <Drawer.Content size="medium">
          <Drawer.Title>Edit item</Drawer.Title>
          <Drawer.Description>
            This drawer is opened by application-owned state.
          </Drawer.Description>
          <Drawer.Close>Save and close</Drawer.Close>
        </Drawer.Content>
      </Drawer.Root>
    </>
  );
}

/**
 * Opens a triggerless drawer from application-owned state and demonstrates the
 * framed medium surface, generated close action, and scroll boundary.
 *
 * @summary externally triggered controlled drawer state
 */
export const ControlledTriggerless: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Edit selected item',
      }),
    );
    const dialog = within(document.body).getByRole('dialog', {
      name: 'Edit item',
    });
    const header = dialog.querySelector('header');
    const close = within(dialog).getByRole('button', { name: 'Close' });

    await expect(dialog.getBoundingClientRect().width).toBeGreaterThan(500);
    await expect(getComputedStyle(dialog).overflow).toBe('clip');
    await expect(dialog.scrollTop).toBe(0);
    await expect(header?.getBoundingClientRect().height).toBeGreaterThanOrEqual(
      close.getBoundingClientRect().height,
    );
    await expect(close.getBoundingClientRect().width).toBe(
      close.getBoundingClientRect().height,
    );
    await expect(close.getBoundingClientRect().height).toBeGreaterThanOrEqual(
      44,
    );
  },
  render: () => <ControlledTriggerlessExample />,
};

/**
 * Moves a wide drawer from bottom to inline-end at the medium breakpoint and
 * layers a softer adjacent drawer while preserving focus restoration.
 *
 * @summary responsive desktop placement with an adjacent nested drawer
 */
export const ResponsivePlacementAndNested: Story = {
  args: { children: null },
  globals: { viewport: { value: 'drawerDesktop' } },
  parameters: {
    viewport: {
      options: {
        drawerDesktop: {
          name: 'Drawer desktop',
          styles: { height: '900px', width: '1600px' },
          type: 'desktop',
        },
      },
    },
  },
  play: async ({ canvasElement }) =>
    playResponsiveNestedDrawer(canvasElement, false),
  render: () => (
    <Drawer.Root>
      <Drawer.Trigger>Open drawer</Drawer.Trigger>
      <Drawer.Content placement={{ base: 'bottom', md: 'end' }} size="wide">
        <Drawer.Title>Responsive drawer</Drawer.Title>
        <Drawer.Description>
          Bottom on compact screens and inline-end on wider screens, including
          RTL.
        </Drawer.Description>
        <Drawer.Root>
          <Drawer.Trigger>Open nested drawer</Drawer.Trigger>
          <Drawer.Content
            adjacent={{ inlineEndOffset: 768 }}
            chrome="soft"
            placement={{ base: 'bottom', md: 'end' }}
            size="medium"
          >
            <Drawer.Title>Nested drawer</Drawer.Title>
            <Drawer.Description>
              Escape closes this layer first and restores focus.
            </Drawer.Description>
            <Drawer.Close>Close nested</Drawer.Close>
          </Drawer.Content>
        </Drawer.Root>
        <Drawer.Close>Close outer</Drawer.Close>
      </Drawer.Content>
    </Drawer.Root>
  ),
};
/**
 * Exercises the same nested drawer composition in a compact viewport where
 * both layers occupy the full screen and enter from the bottom edge.
 *
 * @summary compact full-screen nested drawer placement
 */
export const ResponsivePlacementAndNestedCompact: Story = {
  ...ResponsivePlacementAndNested,
  globals: { viewport: { value: 'mobile1' } },
  play: async ({ canvasElement }) =>
    playResponsiveNestedDrawer(canvasElement, true),
};
/**
 * Keeps the drawer frame fixed while a long application-owned body scrolls
 * independently within the viewport-height modal surface.
 *
 * @summary independently scrolling long drawer content
 */
export const LongContent: Story = {
  args: {
    children: (
      <>
        <Drawer.Trigger>Open long drawer</Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Title>Long drawer</Drawer.Title>
          <Drawer.Description>
            The surface scrolls independently.
          </Drawer.Description>
          <Typography>Drawer item 1</Typography>
          <Typography>Drawer item 2</Typography>
          <Typography>Drawer item 3</Typography>
          <Typography>Drawer item 4</Typography>
          <Typography>Drawer item 5</Typography>
          <Typography>Drawer item 6</Typography>
          <Typography>Drawer item 7</Typography>
          <Typography>Drawer item 8</Typography>
          <Typography>Drawer item 9</Typography>
          <Typography>Drawer item 10</Typography>
          <Typography>Drawer item 11</Typography>
          <Typography>Drawer item 12</Typography>
          <Typography>Drawer item 13</Typography>
          <Typography>Drawer item 14</Typography>
          <Typography>Drawer item 15</Typography>
          <Typography>Drawer item 16</Typography>
          <Drawer.Close>Close</Drawer.Close>
        </Drawer.Content>
      </>
    ),
  },
};

/**
 * Opens a start-placed drawer and verifies that entry and exit motion remains
 * on the logical inline axis without unintended vertical displacement.
 *
 * @summary logical start-edge entry and exit motion
 */
export const DirectionalMotion: Story = {
  args: {
    children: (
      <>
        <Drawer.Trigger>Open directional drawer</Drawer.Trigger>
        <Drawer.Content placement="start">
          <Drawer.Title>Directional drawer</Drawer.Title>
          <Drawer.Description>
            Slides along the inline axis without vertical movement.
          </Drawer.Description>
          <Drawer.Close>Close directional drawer</Drawer.Close>
        </Drawer.Content>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const entrySamples = await sampleMotion(() =>
      userEvent.click(
        within(canvasElement).getByRole('button', {
          name: 'Open directional drawer',
        }),
      ),
    );
    const dialog = within(document.body).getByRole('dialog', {
      name: 'Directional drawer',
    });
    const movingEntrySamples = entrySamples.filter(
      (sample) => sample.left < -0.5,
    );
    const entryTops = movingEntrySamples.map((sample) => sample.top);
    const entryOpacities = movingEntrySamples.map((sample) => sample.opacity);

    await expect(movingEntrySamples.length).toBeGreaterThan(0);
    await expect(Math.max(...entryTops) - Math.min(...entryTops)).toBeLessThan(
      1,
    );
    await expect(Math.min(...entryOpacities)).toBeLessThan(1);

    const exitSamples = await sampleMotion(() =>
      userEvent.click(
        within(dialog).getByRole('button', {
          name: 'Close directional drawer',
        }),
      ),
    );
    const movingExitSamples = exitSamples.filter(
      (sample) => sample.left < -0.5,
    );
    const exitTops = movingExitSamples.map((sample) => sample.top);
    const exitOpacities = movingExitSamples.map((sample) => sample.opacity);

    await expect(movingExitSamples.length).toBeGreaterThan(0);
    await expect(Math.max(...exitTops) - Math.min(...exitTops)).toBeLessThan(1);
    await expect(Math.min(...exitOpacities)).toBeLessThan(1);
  },
};
