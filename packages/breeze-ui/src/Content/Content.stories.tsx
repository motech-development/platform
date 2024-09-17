import { withKnobs } from '@storybook/addon-knobs';
import BaseStyles from '../BaseStyles/BaseStyles';
import Typography from '../Typography/Typography';
import Content from './Content';

export default {
  component: Content,
  decorators: [withKnobs],
};

export const BasicContent = {
  name: 'Basic content',
  render: () => (
    <>
      <BaseStyles />

      <Content>
        <Typography component="h1" variant="h1">
          Hello world
        </Typography>
      </Content>
    </>
  ),
};
