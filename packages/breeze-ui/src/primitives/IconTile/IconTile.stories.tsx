import type { Meta, StoryObj } from '@storybook/react-vite';
import { Inline } from '../Inline/Inline';
import { IconTile, type IconTileTone } from './IconTile';

const tones = [
  'neutral',
  'brand',
  'positive',
  'warning',
  'danger',
] satisfies IconTileTone[];

const meta = {
  args: {
    name: 'document',
  },
  component: IconTile,
  title: 'Content/IconTile',
} satisfies Meta<typeof IconTile>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A 44px square brand wash for content states. */
export const Default: Story = {};

/** Every semantic colour treatment. */
export const Treatments: Story = {
  render: () => (
    <Inline gap={3}>
      {tones.map((tone) => (
        <IconTile key={tone} name="document" tone={tone} />
      ))}
    </Inline>
  ),
};

/** A compact circular direction marker. */
export const Direction: Story = {
  args: {
    name: 'moneyIn',
    shape: 'circle',
    size: 'sm',
    tone: 'positive',
  },
};
