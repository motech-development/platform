import { boolean, select, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import BaseStyles from '../BaseStyles/BaseStyles';
import LinkButton from './LinkButton';

const stories = storiesOf('LinkButton', module);
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

stories.add('Basic link button', () => (
  <MemoryRouter>
    <BaseStyles />
    <LinkButton
      block={boolean('Block display', false)}
      colour={select('Colour', colour, 'primary')}
      size={select('Size', size, 'md') as 'sm' | 'md' | 'lg'}
      to={text('To', '/home')}
    >
      {text('Title', 'Button')}
    </LinkButton>
  </MemoryRouter>
));
