import { withA11y } from '@storybook/addon-a11y';
import { number, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';
import BaseStyles from '../BaseStyles/BaseStyles';
import ProgressBar from './ProgressBar';

const stories = storiesOf('ProgressBar', module);

stories.addDecorator(withA11y);
stories.addDecorator(withKnobs);

stories.add('Basic progress bar', () => (
  <>
    <BaseStyles />

    <ProgressBar max={number('Max', 100)} progress={number('Progress', 50)} />
  </>
));
