import { withA11y } from '@storybook/addon-a11y';
import { text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';
import BaseStyles from '../BaseStyles/BaseStyles';
import PageTitle from './PageTitle';

const stories = storiesOf('PageTitle', module);

stories.addDecorator(withA11y);
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
