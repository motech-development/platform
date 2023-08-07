import { Meta, StoryFn } from '@storybook/react';
import { Card } from '../components/Card';
import { Typography } from '../components/Typography';

export default {
  component: Card,
} as Meta<typeof Card>;

const Template: StoryFn<typeof Card> = (props) => (
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
