import { withA11y } from '@storybook/addon-a11y';
import { select, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import BaseStyles from '../BaseStyles/BaseStyles';
import Card from './Card';

const stories = storiesOf('Card', module);
const padding = {
  Large: 'lg',
  Medium: 'md',
  Small: 'sm',
};

stories.addDecorator(withA11y);
stories.addDecorator(withKnobs);

stories.add('Basic card', () => (
  <>
    <BaseStyles />

    <Card padding={select('Padding', padding, 'md') as 'sm' | 'md' | 'lg'}>
      {text('Text', 'Hello world')}
    </Card>
  </>
));
