import { storiesOf } from '@storybook/react';
import Typography from '../components/Typography';
import Content from '../components/Content';

const stories = storiesOf('Content', module);

stories.add('Basic content', () => (
  <>
    <Content>
      <Typography component="h1" variant="h1">
        Hello world
      </Typography>
    </Content>
  </>
));
