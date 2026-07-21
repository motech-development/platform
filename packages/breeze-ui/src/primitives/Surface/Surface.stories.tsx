import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Grid } from '../Grid/Grid';
import { Surface } from './Surface';

const meta = {
  argTypes: {
    as: {
      control: 'inline-radio',
      options: ['div', 'section', 'article'],
    },
    border: {
      control: 'inline-radio',
      options: ['none', 'default', 'strong'],
    },
    tone: {
      control: 'inline-radio',
      options: ['default', 'subtle', 'canvas', 'inverse'],
    },
  },
  args: {
    border: 'default',
    padding: 'lg',
    tone: 'default',
  },
  component: Surface,
  title: 'Layout/Surface',
} satisfies Meta<typeof Surface>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Shows the canonical default background, border, and inset spacing with
 * controls for the deliberately bounded surface presentation props.
 *
 * @summary default canonical surface treatment
 */
export const Playground: Story = {
  args: {
    children: 'Surface content',
  },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Surface content'),
    ).toBeVisible();
  },
};

/**
 * Compares all background tones and the borderless and strong-boundary
 * treatments so surrounding contrast can guide the semantic choice.
 *
 * @summary complete surface tone and border comparison
 */
export const TonesAndBorders: Story = {
  render: () => (
    <Grid columns={{ base: 1, md: 2 }}>
      <Surface tone="default">Default tone</Surface>
      <Surface tone="subtle">Subtle tone</Surface>
      <Surface tone="canvas">Canvas tone</Surface>
      <Surface tone="inverse">Inverse tone</Surface>
      <Surface border="none">No border</Surface>
      <Surface border="strong">Strong border</Surface>
    </Grid>
  ),
};

/**
 * Renders a named native section when the contained application content forms
 * a meaningful document region rather than a purely visual grouping.
 *
 * @summary labelled semantic section surface
 */
export const SemanticSection: Story = {
  args: {
    'aria-label': 'Project summary',
    as: 'section',
    children: 'Summary content',
  },
};
