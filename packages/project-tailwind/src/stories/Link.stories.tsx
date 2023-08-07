import { Meta, StoryFn } from '@storybook/react';
import { Link } from '../components/Link';

export default {
  args: {
    children: 'Hello, world',
    href: 'https://www.google.com',
    target: '_blank',
  },
  component: Link,
} as Meta<typeof Link>;

const Template: StoryFn<typeof Link> = (props) => <Link {...props} />;

export const LinkComponent = Template.bind({});
