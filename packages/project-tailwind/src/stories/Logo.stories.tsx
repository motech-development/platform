import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Logo } from '../components/Logo';

export default {
  args: {
    className: 'text-blue-500 w-40 h-40',
  },
  component: Logo,
} as ComponentMeta<typeof Logo>;

const Template: ComponentStory<typeof Logo> = (props) => <Logo {...props} />;

export const LogoComponent = Template.bind({});
