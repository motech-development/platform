import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Avatar } from '../components/Avatar';

export default {
  args: {
    alt: 'My avatar',
    className: 'h-40 w-40',
    src: 'https://www.gravatar.com/avatar/8801091e665fdac669daa63d32167b7b',
  },
  component: Avatar,
} as ComponentMeta<typeof Avatar>;

const Template: ComponentStory<typeof Avatar> = (props) => (
  <Avatar {...props} />
);

export const AvatarComponent = Template.bind({});