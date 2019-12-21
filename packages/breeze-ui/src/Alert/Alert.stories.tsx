import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { boolean, select, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';
import BaseStyles from '../BaseStyles/BaseStyles';
import Alert from './Alert';

const stories = storiesOf('Alert', module);
const colours = {
  Danger: 'danger',
  Primary: 'primary',
  Secondary: 'secondary',
  Success: 'success',
};
const margins = {
  Large: 'lg',
  Medium: 'md',
  Small: 'sm',
};
const message = () => text('Message', 'Hello world');
const colour = () => select('Colour', colours, 'primary');
const spacing = () => select('Spacing', margins, 'md') as 'sm' | 'md' | 'lg';
const dismissable = () => boolean('Dismissable', false);

stories.addDecorator(withKnobs);

stories.add('Various alerts', () => (
  <>
    <BaseStyles />

    <Alert
      message={message()}
      colour={colour()}
      dismissable={dismissable()}
      spacing={spacing()}
    />

    <Alert
      message={message()}
      colour={colour()}
      dismissable={dismissable()}
      icon={() => <FontAwesomeIcon icon={faExclamationTriangle} />}
      spacing={spacing()}
    />
  </>
));
