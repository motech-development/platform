import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Card } from '../components/Card';
import { Typography } from '../components/Typography';

export default {
  component: Card,
} as ComponentMeta<typeof Card>;

const Template: ComponentStory<typeof Card> = (props) => (
  <Card {...props}>
    <Typography rule as="h1" align="centre" variant="h1">
      Hello, world
    </Typography>

    <Typography align="centre" margin="none" variant="lead">
      This is an example of a card
    </Typography>
  </Card>
);

export const CardComponent = Template.bind({});
