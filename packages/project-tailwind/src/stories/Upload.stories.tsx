import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Upload } from '../components/Form';

export default {
  args: {
    label: 'Photo',
    name: 'photo',
    placeholder: 'Select a file to upload',
    required: false,
  },
  component: Upload,
} as ComponentMeta<typeof Upload>;

const Template: ComponentStory<typeof Upload> = (props) => (
  <Upload {...props} />
);

export const UploadComponent = Template.bind({});
