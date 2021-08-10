import { text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import BaseStyles from '../BaseStyles/BaseStyles';
import PageTitle from './PageTitle';

const stories = storiesOf('PageTitle', module);

stories.addDecorator(withKnobs);

stories.add('Basic typography', () => (
  <>
    <BaseStyles />

    <PageTitle
      title={text('Title', 'Page title')}
      subTitle={text('Subtitle', '')}
    />
  </>
));
