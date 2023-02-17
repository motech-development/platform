import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Link } from '../components/Link';

export default {
  args: {
    children: 'Hello, world',
    href: 'https://www.google.com',
    target: '_blank',
  },
  component: Link,
} as ComponentMeta<typeof Link>;

const Template: ComponentStory<typeof Link> = (props) => <Link {...props} />;

export const LinkComponent = Template.bind({});
