import { boolean, select, text, withKnobs } from '@storybook/addon-knobs';
import BaseStyles from '../BaseStyles/BaseStyles';
import Button from './Button';

export default {
  component: Button,
  decorators: [withKnobs],
};

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

export const BasicButton = {
  name: 'Basic button',
  render: () => (
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
  ),
};
