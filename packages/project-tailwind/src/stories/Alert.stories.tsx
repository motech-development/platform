import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Alert } from '../components/Alert';

export default {
  argTypes: {
    icon: {
      defaultValue: <ExclamationTriangleIcon />,
    },
    message: {
      defaultValue: 'Hello, world!',
    },
  },
  component: Alert,
} as ComponentMeta<typeof Alert>;

const Template: ComponentStory<typeof Alert> = (props) => <Alert {...props} />;

export const AlertComponent = Template.bind({});
