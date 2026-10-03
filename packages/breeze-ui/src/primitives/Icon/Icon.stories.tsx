import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Inline } from '../Inline/Inline';
import { Stack } from '../Stack/Stack';
import { Typography } from '../Typography/Typography';
import { Icon, type IconName, type IconSize } from './Icon';

const names = [
  'overview',
  'people',
  'calendar',
  'document',
  'building',
  'settings',
  'notifications',
  'add',
  'warning',
] satisfies IconName[];

const sizes = [
  ['2xs', 14],
  ['xs', 15],
  ['sm', 16],
  ['md', 17],
  ['lg', 20],
  ['xl', 21],
  ['2xl', 22],
  ['3xl', 24],
  ['4xl', 26],
] satisfies [IconSize, number][];

const meta = {
  args: {
    name: 'calendar',
  },
  component: Icon,
  title: 'Content/Icon',
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Decorative artwork inherits the surrounding text colour. */
export const Decorative: Story = {};

/** A named icon used without an accompanying text label. */
export const Named: Story = {
  args: {
    label: 'Choose a date',
  },
};

/** A sample of the curated semantic artwork names. */
export const Gallery: Story = {
  render: () => (
    <Inline gap={5} wrap>
      {names.map((name) => (
        <Stack gap={1} horizontalAlign="center" key={name}>
          <Icon name={name} />
          <Typography variant="caption">{name}</Typography>
        </Stack>
      ))}
    </Inline>
  ),
};

/** Each size on the closed scale, labelled with its rendered square in pixels. */
export const Sizes: Story = {
  play: async ({ canvasElement }) => {
    const icons = [...canvasElement.querySelectorAll('svg')];
    const pixels = sizes.map(([, size]) => size);

    await expect(
      icons.map((icon) => icon.getBoundingClientRect().width),
    ).toEqual(pixels);
    await expect(
      icons.map((icon) => icon.getBoundingClientRect().height),
    ).toEqual(pixels);
  },
  render: () => (
    <Inline gap={5} verticalAlign="end" wrap>
      {sizes.map(([size, pixels]) => (
        <Stack gap={1} horizontalAlign="center" key={size}>
          <Icon name="calendar" size={size} />
          <Typography variant="caption">
            {size} · {pixels}px
          </Typography>
        </Stack>
      ))}
    </Inline>
  ),
};
