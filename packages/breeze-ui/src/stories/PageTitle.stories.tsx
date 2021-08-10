import { text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import PageTitle from '../components/PageTitle';

const stories = storiesOf('PageTitle', module);

stories.addDecorator(withKnobs);

stories.add('Basic typography', () => (
  <>
    <PageTitle
      title={text('Title', 'Page title')}
      subTitle={text('Subtitle', '')}
    />
  </>
));
