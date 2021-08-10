import { boolean, select, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import Button from '../components/Button';

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

stories.addDecorator(withKnobs);

stories.add('Basic button', () => (
  <>
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
