import { Meta, StoryFn } from '@storybook/react';
import { Typography } from '../components/Typography';

export default {
  args: {
    children: 'Hello, world',
  },
  component: Typography,
} as Meta<typeof Typography>;

const Template: StoryFn<typeof Typography> = (props) => (
  <Typography {...props} />
);

export const TypographyComponent = Template.bind({});
