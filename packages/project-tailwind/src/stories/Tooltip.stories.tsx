import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Button } from '../components/Button';
import { Tooltip } from '../components/Tooltip';
import { Typography } from '../components/Typography';

export default {
  args: {
    content: <Typography margin="none">Hello, world</Typography>,
    parent: <Button>Hover over me</Button>,
  },
  component: Tooltip,
} as ComponentMeta<typeof Tooltip>;

const Template: ComponentStory<typeof Tooltip> = (props) => (
  <div className="flex h-screen items-center justify-center">
    <Tooltip {...props} />
  </div>
);

export const TooltipComponent = Template.bind({});
