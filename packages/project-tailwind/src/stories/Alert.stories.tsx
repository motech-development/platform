import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { Meta, StoryFn } from '@storybook/react';
import { Alert } from '../components/Alert';

export default {
  args: {
    icon: <ExclamationTriangleIcon />,
    message: 'Hello, world!',
  },
  component: Alert,
} as Meta<typeof Alert>;

const Template: StoryFn<typeof Alert> = (props) => <Alert {...props} />;

export const AlertComponent = Template.bind({});
