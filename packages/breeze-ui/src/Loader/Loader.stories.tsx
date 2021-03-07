import { withA11y } from '@storybook/addon-a11y';
import { select, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import BaseStyles from '../BaseStyles/BaseStyles';
import Loader from './Loader';

const stories = storiesOf('Loader', module);
const colour = {
  Default: 'default',
  Secondary: 'secondary',
};

stories.addDecorator(withA11y);
stories.addDecorator(withKnobs);

stories.add('Basic loader', () => (
  <>
    <BaseStyles />

    <Loader
      colour={select('Colour', colour, 'default') as 'default' | 'secondary'}
    />
  </>
));
