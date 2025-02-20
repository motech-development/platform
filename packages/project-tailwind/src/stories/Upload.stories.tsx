import { Meta, StoryFn } from '@storybook/react';
import { Upload } from '../components/Form';

export default {
  args: {
    label: 'Photo',
    name: 'photo',
    placeholder: 'Select a file to upload',
    required: false,
  },
  component: Upload,
} as Meta<typeof Upload>;

const Template: StoryFn<typeof Upload> = (props) => <Upload {...props} />;

export const UploadComponent = Template.bind({});
