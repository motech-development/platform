import { storiesOf } from '@storybook/react';
import BaseStyles from '../BaseStyles/BaseStyles';
import Typography from '../Typography/Typography';
import Content from './Content';

const stories = storiesOf('Content', module);

stories.add('Basic content', () => (
  <>
    <BaseStyles />

    <Content>
      <Typography component="h1" variant="h1">
        Hello world
      </Typography>
    </Content>
  </>
));
