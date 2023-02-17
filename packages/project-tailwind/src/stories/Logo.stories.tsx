import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Logo } from '../components/Logo';

export default {
  args: {
    alt: 'Motech Development',
    className: 'w-40 h-40 text-blue-600',
  },
  component: Logo,
} as ComponentMeta<typeof Logo>;

const Template: ComponentStory<typeof Logo> = (props) => <Logo {...props} />;

export const LogoComponent = Template.bind({});
