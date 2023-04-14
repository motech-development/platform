import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Button } from '../components/Button';

export default {
  args: {
    children: 'Click me',
    disabled: false,
  },
  component: Button,
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (props) => (
  <Button {...props} />
);

export const ButtonComponent = Template.bind({});
