import { Meta, StoryFn } from '@storybook/react';
import { Title } from '../components/Title';

export default {
  args: {
    title: 'Hello, world',
  },
  component: Title,
} as Meta<typeof Title>;

const Template: StoryFn<typeof Title> = (props) => <Title {...props} />;

export const TitleComponent = Template.bind({});
