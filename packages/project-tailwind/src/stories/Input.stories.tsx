import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Input } from '../components/Form';

export default {
  args: {
    label: 'Full name',
    name: 'fullName',
    required: false,
  },
  component: Input,
} as ComponentMeta<typeof Input>;

const Template: ComponentStory<typeof Input> = (props) => <Input {...props} />;

export const InputComponent = Template.bind({});
