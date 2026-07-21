import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Stack } from '../Stack/Stack';
import { Surface } from '../Surface/Surface';
import { Typography } from './Typography';

const meta = {
  component: Typography,
  title: 'Foundation/Typography',
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Renders every visual text level with letters and numerals and verifies the
 * bundled Cabin display font is available for heading and label treatments.
 *
 * @summary complete visual typography level scale
 */
export const Levels: Story = {
  args: { children: 'Typography' },
  play: async () => {
    await document.fonts.load('700 16px "Cabin Variable"');
    await expect(document.fonts.check('700 16px "Cabin Variable"')).toBe(true);
  },
  render: () => (
    <div>
      <Typography as="div" gutterBottom level="h1">
        h1: The quick brown fox 0123456789
      </Typography>
      <Typography as="div" gutterBottom level="h2">
        h2: The quick brown fox 0123456789
      </Typography>
      <Typography as="div" gutterBottom level="h3">
        h3: The quick brown fox 0123456789
      </Typography>
      <Typography as="div" gutterBottom level="h4">
        h4: The quick brown fox 0123456789
      </Typography>
      <Typography as="div" gutterBottom level="h5">
        h5: The quick brown fox 0123456789
      </Typography>
      <Typography as="div" gutterBottom level="h6">
        h6: The quick brown fox 0123456789
      </Typography>
      <Typography as="div" gutterBottom level="metric">
        metric: The quick brown fox 0123456789
      </Typography>
      <Typography as="div" gutterBottom level="summary">
        summary: The quick brown fox 0123456789
      </Typography>
      <Typography as="div" gutterBottom level="label">
        label: The quick brown fox 0123456789
      </Typography>
      <Typography as="div" gutterBottom level="body">
        body: The quick brown fox 0123456789
      </Typography>
    </div>
  ),
};

/**
 * Renders a semantic second-level heading with fourth-level visual styling to
 * demonstrate that document structure and appearance are independent.
 *
 * @summary semantic heading with an independent visual level
 */
export const SemanticIndependence: Story = {
  args: { as: 'h2', children: 'A semantic h2 with h4 styling', level: 'h4' },
};

/**
 * Compares primary text on a surface with inverse and muted-inverse text on the
 * shell, demonstrating semantic colours across contrasting contexts.
 *
 * @summary semantic text colours on surface and shell contexts
 */
export const SemanticColours: Story = {
  args: { children: 'Typography' },
  render: () => (
    <Stack gap="compact">
      <Surface border="none" padding="lg">
        <Typography colour="primary">Primary action context</Typography>
      </Surface>
      <Surface border="none" padding="lg" tone="inverse">
        <Stack gap="compact">
          <Typography colour="inverse">Inverse text</Typography>
          <Typography colour="inverse-muted">Muted inverse text</Typography>
        </Stack>
      </Surface>
    </Stack>
  ),
};

/**
 * Constrains a long body paragraph to two lines so bounded clamping can be
 * evaluated without introducing general layout or overflow props.
 *
 * @summary long body copy with a two-line clamp
 */
export const ContentHandling: Story = {
  args: {
    children:
      'A long body of content demonstrates bounded line clamping without exposing general layout props. A long body of content demonstrates bounded line clamping without exposing general layout props.',
    lineClamp: 2,
  },
};

/**
 * Leaves alignment unspecified inside an end-aligned parent and verifies the
 * text preserves ordinary CSS inheritance rather than forcing start alignment.
 *
 * @summary typography inheriting alignment from its parent
 */
export const InheritedAlignment: Story = {
  args: { children: 'Inherited alignment' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const text = canvas.getByText('Inherited alignment');
    const view = canvasElement.ownerDocument.defaultView;

    await expect(view?.getComputedStyle(text).textAlign).toBe('end');
  },
  render: () => (
    <Typography align="end" as="div">
      <Typography>Inherited alignment</Typography>
    </Typography>
  ),
};
