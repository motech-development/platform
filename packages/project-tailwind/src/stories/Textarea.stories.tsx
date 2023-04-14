import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Textarea } from '../components/Form';

export default {
  args: {
    label: 'Address',
    name: 'address',
    required: false,
  },
  component: Textarea,
} as ComponentMeta<typeof Textarea>;

const Template: ComponentStory<typeof Textarea> = (props) => (
  <Textarea {...props} />
);

export const TextareaComponent = Template.bind({});
