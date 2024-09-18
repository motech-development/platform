import { Meta, StoryFn } from '@storybook/react';
import { Button } from '../components/Button';

export default {
  args: {
    children: 'Click me',
    disabled: false,
  },
  component: Button,
} as Meta<typeof Button>;

const Template: StoryFn<typeof Button> = (props) => <Button {...props} />;

export const ButtonComponent = Template.bind({});
