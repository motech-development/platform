import { select, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';
import BaseStyles from '../BaseStyles/BaseStyles';
import Card from './Card';

const stories = storiesOf('Card', module);
const padding = {
  Small: 'sm',
  Medium: 'md',
  Large: 'lg',
};

stories.addDecorator(withKnobs);

stories.add('Basic card', () => (
  <>
    <BaseStyles />

    <Card padding={select('Padding', padding, 'md') as 'sm' | 'md' | 'lg'}>
      {text('Text', 'Hello world')}
    </Card>
  </>
));
