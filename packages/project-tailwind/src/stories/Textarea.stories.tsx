import { Meta, StoryFn } from '@storybook/react';
import { Textarea } from '../components/Form';

export default {
  args: {
    label: 'Address',
    name: 'address',
    required: false,
  },
  component: Textarea,
} as Meta<typeof Textarea>;

const Template: StoryFn<typeof Textarea> = (props) => <Textarea {...props} />;

export const TextareaComponent = Template.bind({});
