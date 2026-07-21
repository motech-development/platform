import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import StoryConstraint from '../../../.storybook/StoryConstraint';
import { Grid } from '../Grid/Grid';
import { Inline } from '../Inline/Inline';
import { Stack } from '../Stack/Stack';
import { Surface } from '../Surface/Surface';
import { Typography } from '../Typography/Typography';
import { Skeleton } from './Skeleton';

const meta = {
  component: Skeleton,
  title: 'Feedback/Skeleton',
} satisfies Meta<typeof Skeleton>;
export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Shows the canonical full-width text-line placeholder and verifies its visual
 * height while keeping the decorative shape non-announcing.
 *
 * @summary canonical non-announcing text skeleton
 */
export const Text: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const placeholder = within(canvasElement).getByTestId('text-skeleton');

    await expect(getComputedStyle(placeholder).height).toBe('14px');
    await expect(placeholder).toHaveAttribute('aria-hidden', 'true');
  },
  render: () => <Skeleton data-testid="text-skeleton" />,
};
/**
 * Renders a typed span placeholder alongside a real heading name so the inline
 * shape remains decorative without obscuring meaningful loading context.
 *
 * @summary inline span skeleton beside accessible loading text
 */
export const InlineText: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const placeholder = canvas.getByTestId('inline-skeleton');

    await expect(placeholder.tagName).toBe('SPAN');
    await expect(placeholder).toHaveAttribute('aria-hidden', 'true');
    await expect(canvas.getByRole('heading')).toHaveAccessibleName(
      'Loading project summary',
    );
  },
  render: () => (
    <Inline gap="compact" wrap={false}>
      <Typography as="h2">Loading project summary</Typography>
      <Skeleton
        as="span"
        className="inline-block w-24"
        data-testid="inline-skeleton"
      />
    </Inline>
  ),
};
/**
 * Composes circular, text-line, and rectangular placeholders into an
 * application-owned loading layout that approximates avatar and content rows.
 *
 * @summary composed circle text and rectangle skeleton shapes
 */
export const Shapes: Story = {
  args: {},
  decorators: [
    (Story) => (
      <StoryConstraint size="bounded-control">
        <Story />
      </StoryConstraint>
    ),
  ],
  render: () => (
    <Grid className="grid-cols-[auto_1fr]" gap="md">
      <Skeleton shape="circle" />
      <Stack gap="sm" justify="center">
        <Skeleton className="w-2/3" />
        <Skeleton />
      </Stack>
      <Skeleton className="col-span-2 min-h-32" shape="rectangle" />
    </Grid>
  ),
};

/**
 * Compares inverse, default, and danger placeholders on their intended dark
 * and ordinary surfaces and verifies each semantic background token.
 *
 * @summary surface-aware default inverse and danger skeleton tones
 */
export const Tones: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const view = canvasElement.ownerDocument.defaultView;

    await expect(
      view?.getComputedStyle(canvas.getByTestId('default')).backgroundColor,
    ).toBe('rgb(223, 228, 235)');
    await expect(
      view?.getComputedStyle(canvas.getByTestId('inverse')).backgroundColor,
    ).toBe('rgb(86, 97, 116)');
    await expect(
      view?.getComputedStyle(canvas.getByTestId('danger')).backgroundColor,
    ).toBe('rgb(243, 218, 221)');
  },
  render: () => (
    <StoryConstraint size="bounded-control">
      <Surface border="none" padding="md" tone="inverse">
        <Stack gap="md">
          <Skeleton data-testid="inverse" tone="inverse" />
          <Surface border="none" padding="md">
            <Stack gap="md">
              <Skeleton data-testid="default" />
              <Skeleton data-testid="danger" tone="danger" />
            </Stack>
          </Surface>
        </Stack>
      </Surface>
    </StoryConstraint>
  ),
};
