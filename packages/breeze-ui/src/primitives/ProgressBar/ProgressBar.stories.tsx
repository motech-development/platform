import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { ProgressBar } from './ProgressBar';

const meta = {
  args: {
    'aria-label': 'Paperwork',
    maxValue: 7,
    value: 3,
    valueLabel: '3 of 7 done',
  },
  component: ProgressBar,
  title: 'Feedback/ProgressBar',
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Progress through a queue, counting only what is done. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const progress = within(canvasElement).getByRole('progressbar');
    const track = progress.lastElementChild;
    const fill = track?.firstElementChild;

    if (!track || !fill) throw new Error('Missing the progress track.');

    await expect(track.getBoundingClientRect().height).toBe(6);
    await expect(
      fill.getBoundingClientRect().width / track.getBoundingClientRect().width,
    ).toBeCloseTo(3 / 7);
  },
};

/** Steps of a multi-step form, with the step's name in the value text. */
export const Steps: Story = {
  args: {
    'aria-label': 'Add a company',
    maxValue: 3,
    value: 2,
    valueLabel: 'Step 2 of 3 — Opening position',
  },
};
