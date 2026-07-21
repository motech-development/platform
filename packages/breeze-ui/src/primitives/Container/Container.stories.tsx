import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Surface } from '../Surface/Surface';
import { Container } from './Container';

const meta = {
  component: Container,
  parameters: {
    chromatic: {
      viewports: [360, 800, 1280],
    },
    layout: 'fullscreen',
  },
  title: 'Layout/Container',
} satisfies Meta<typeof Container>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Shows the bounded full-width workspace with its canonical breakpoint gutters
 * across the configured compact, medium, and wide visual-test viewports.
 *
 * @summary canonical bounded workspace and responsive gutters
 */
export const ResponsiveWorkspace: Story = {
  args: {
    'aria-label': 'Workspace',
    children: <Surface>Resize the canvas to inspect the page gutters.</Surface>,
  },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Workspace'),
    ).toHaveTextContent('Resize the canvas');
  },
};

/**
 * Overrides only the documented layout padding values, using a compact base
 * gutter and the page gutter from the medium breakpoint onward.
 *
 * @summary custom breakpoint-responsive workspace padding
 */
export const CustomResponsivePadding: Story = {
  args: {
    children: <Surface>Compact first, spacious from medium.</Surface>,
    padding: {
      base: 'sm',
      md: 'page',
    },
  },
};
