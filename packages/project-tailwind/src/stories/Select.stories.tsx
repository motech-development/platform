import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Select } from '../components/Form';

export default {
  args: {
    label: 'RAM',
    name: 'ram',
    options: [
      {
        label: '4 GB',
        value: '4',
      },
      {
        label: '8 GB',
        value: '8',
      },
      {
        label: '16 GB',
        value: '16',
      },
      {
        label: '32 GB',
        value: '32',
      },
      {
        label: '64 GB',
        value: '64',
      },
      {
        disabled: true,
        label: '128 GB',
        value: '128',
      },
    ],
  },
  component: Select,
} as ComponentMeta<typeof Select>;

const Template: ComponentStory<typeof Select> = (props) => <Select {...props} />;

export const SelectComponent = Template.bind({});
