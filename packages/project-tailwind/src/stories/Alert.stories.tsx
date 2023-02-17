import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Alert } from '../components/Alert';

export default {
  args: {
    icon: <ExclamationTriangleIcon />,
    message: 'Hello, world!',
  },
  component: Alert,
} as ComponentMeta<typeof Alert>;

const Template: ComponentStory<typeof Alert> = (props) => <Alert {...props} />;

export const AlertComponent = Template.bind({});
