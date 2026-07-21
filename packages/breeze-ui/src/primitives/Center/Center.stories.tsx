import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Surface } from '../Surface/Surface';
import { Center } from './Center';

const meta = {
  component: Center,
  title: 'Layout/Center',
} satisfies Meta<typeof Center>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Centres a Surface within a fixed minimum block size and verifies the
 * labelled wrapper retains its child content without adding presentation to
 * the layout primitive.
 *
 * @summary Two-axis centring inside a bounded region.
 */
export const Content: Story = {
  args: {
    'aria-label': 'Centred example',
    children: <Surface>Centred content</Surface>,
    className: 'min-h-64',
  },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Centred example'),
    ).toHaveTextContent('Centred content');
  },
};

/**
 * Uses `minHeight="screen"` with fullscreen Storybook layout to document a
 * viewport-height centre suitable for isolated loading or empty compositions.
 *
 * @summary Full-viewport centring with the screen minimum-height token.
 */
export const FullViewport: Story = {
  args: {
    children: <Surface>Full viewport centre</Surface>,
    minHeight: 'screen',
  },
  parameters: {
    layout: 'fullscreen',
  },
};
