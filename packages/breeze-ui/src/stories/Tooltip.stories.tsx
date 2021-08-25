import { Placement, placements } from '@popperjs/core';
import { select, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import Button from '../components/Button';
import Tooltip from '../components/Tooltip';
import TTheme, { Theme } from '../utils/theme';

const stories = storiesOf('Tooltip', module);

stories.addDecorator(withKnobs);

stories.add('Basic tooltip', () => (
  <>
    <Tooltip
      id="test"
      parent={
        <Button colour="primary" size="lg">
          Hover over me
        </Button>
      }
      placement={select<Placement>('Placement', placements, 'bottom')}
      colour={select<TTheme>('Colour', Theme, 'primary')}
      message={text('Text', 'This is a tooltip!')}
    />
  </>
));
