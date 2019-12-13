import { select, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';
import BaseStyles from '../BaseStyles/BaseStyles';
import Button from '../Button/Button';
import Tooltip from './Tooltip';

const stories = storiesOf('Tooltip', module);
const colour = {
  Danger: 'danger',
  Primary: 'primary',
};
const placement = {
  Bottom: 'bottom',
  Left: 'left',
  Right: 'right',
  Top: 'top',
};

stories.addDecorator(withKnobs);

stories.add('Basic tooltip', () => (
  <>
    <BaseStyles />

    <Tooltip
      parent={() => (
        <Button colour="primary" size="lg">
          Hover over me
        </Button>
      )}
      placement={
        select('Placement', placement, 'bottom') as
          | 'bottom'
          | 'left'
          | 'right'
          | 'top'
      }
      colour={select('Colour', colour, 'primary')}
    >
      {text('Text', 'This is a tooltip!')}
    </Tooltip>
  </>
));
