import { Meta, StoryFn } from '@storybook/react';
import { Input } from '../components/Form';

export default {
  args: {
    label: 'Full name',
    name: 'fullName',
    required: false,
  },
  component: Input,
} as Meta<typeof Input>;

const Template: StoryFn<typeof Input> = (props) => <Input {...props} />;

export const InputComponent = Template.bind({});
