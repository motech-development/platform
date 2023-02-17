import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Title } from '../components/Title';

export default {
  args: {
    title: 'Hello, world',
  },
  component: Title,
} as ComponentMeta<typeof Title>;

const Template: ComponentStory<typeof Title> = (props) => <Title {...props} />;

export const TitleComponent = Template.bind({});
