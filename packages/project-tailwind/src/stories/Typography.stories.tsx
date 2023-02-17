import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Typography } from '../components/Typography';

export default {
  args: {
    children: 'Hello, world',
  },
  component: Typography,
} as ComponentMeta<typeof Typography>;

const Template: ComponentStory<typeof Typography> = (props) => (
  <Typography {...props} />
);

export const TypographyComponent = Template.bind({});
