import { withA11y } from '@storybook/addon-a11y';
import { boolean, select, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import BaseStyles from '../BaseStyles/BaseStyles';
import Button from './Button';

const stories = storiesOf('Button', module);
const colour = {
  Danger: 'danger',
  Primary: 'primary',
  Secondary: 'secondary',
  Success: 'success',
};
const size = {
  Large: 'lg',
  Medium: 'md',
  Small: 'sm',
};

stories.addDecorator(withA11y);
stories.addDecorator(withKnobs);

stories.add('Basic button', () => (
  <>
    <BaseStyles />
    <Button
      block={boolean('Block display', false)}
      colour={
        select('Colour', colour, 'primary') as
          | 'danger'
          | 'primary'
          | 'secondary'
          | 'success'
      }
      size={select('Size', size, 'md') as 'sm' | 'md' | 'lg'}
      loading={boolean('Loading', false)}
    >
      {text('Title', 'Button')}
    </Button>
  </>
));
