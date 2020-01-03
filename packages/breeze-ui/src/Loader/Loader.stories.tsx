import { select, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';
import BaseStyles from '../BaseStyles/BaseStyles';
import Loader from './Loader';

const stories = storiesOf('Loader', module);
const colour = {
  Default: 'default',
  Secondary: 'secondary',
};

stories.addDecorator(withKnobs);

stories.add('Basic loader', () => (
  <>
    <BaseStyles />

    <Loader
      colour={select('Colour', colour, 'default') as 'default' | 'secondary'}
    />
  </>
));
