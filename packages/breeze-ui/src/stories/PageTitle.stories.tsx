import { select, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import PageTitle from '../components/PageTitle';
import TTheme, { Theme } from '../utils/theme';

const stories = storiesOf('PageTitle', module);

stories.addDecorator(withKnobs);

stories.add('Basic typography', () => (
  <>
    <PageTitle
      colour={select<TTheme>('Colour', Theme, 'secondary')}
      title={text('Title', 'Page title')}
      subTitle={text('Subtitle', '')}
    />
  </>
));
