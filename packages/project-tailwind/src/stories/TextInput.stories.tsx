import { ComponentMeta, ComponentStory } from '@storybook/react';
import { TextInput } from '../components/Form';

export default {
  args: {
    label: 'Full name',
    name: 'fullName',
    required: false,
  },
  component: TextInput,
} as ComponentMeta<typeof TextInput>;

export const TextInputComponent: ComponentStory<typeof TextInput> = (props) => (
  <TextInput {...props} />
);
