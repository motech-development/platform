import { select, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import BaseStyles from '../BaseStyles/BaseStyles';
import Button from '../Button/Button';
import Tooltip from './Tooltip';

const stories = storiesOf('Tooltip', module);
const colour = {
  Danger: 'danger',
  Primary: 'primary',
  Secondary: 'secondary',
  Success: 'success',
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
      id="test"
      parent={
        <Button colour="primary" size="lg">
          Hover over me
        </Button>
      }
      placement={
        select('Placement', placement, 'bottom') as
          | 'bottom'
          | 'left'
          | 'right'
          | 'top'
      }
      colour={
        select('Colour', colour, 'primary') as
          | 'danger'
          | 'primary'
          | 'secondary'
          | 'success'
      }
      message={text('Text', 'This is a tooltip!')}
    />
  </>
));
