import type { Meta, StoryObj } from '@storybook/react-vite';
import { Inline } from '../Inline/Inline';
import { Stack } from '../Stack/Stack';
import { Typography } from '../Typography/Typography';
import { Icon, type IconName } from './Icon';

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
