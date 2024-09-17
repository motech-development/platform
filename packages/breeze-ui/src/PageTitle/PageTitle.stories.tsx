import { text, withKnobs } from '@storybook/addon-knobs';
import BaseStyles from '../BaseStyles/BaseStyles';
import PageTitle from './PageTitle';

export default {
  component: PageTitle,
  decorators: [withKnobs],
};

export const BasicTypography = {
  name: 'Basic typography',
  render: () => (
    <>
      <BaseStyles />

      <PageTitle
        title={text('Title', 'Page title')}
        subTitle={text('Subtitle', '')}
      />
    </>
  ),
};
