import BaseStyles from '../BaseStyles/BaseStyles';
import Typography from '../Typography/Typography';
import Content from './Content';

export default {
  component: Content,
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
