import { withA11y } from '@storybook/addon-a11y';
import { text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import BaseStyles from '../BaseStyles/BaseStyles';
import Card from '../Card/Card';
import Link from './Link';

const stories = storiesOf('Link', module);

stories.addDecorator(withA11y);
stories.addDecorator(withKnobs);

stories.add('Basic link', () => (
  <MemoryRouter>
    <BaseStyles />

    <Card>
      <Link to={text('To', '/home')}>{text('Text', 'This is a link')}</Link>
    </Card>
  </MemoryRouter>
));
