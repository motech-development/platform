import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { select, text, withKnobs } from '@storybook/addon-knobs';
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
const message = () => text('Message', 'Hello world');
const colour = () => select('Colour', colours, 'primary');

stories.addDecorator(withKnobs);

stories.add('Basic alert', () => (
  <>
    <BaseStyles />

    <Alert message={message()} colour={colour()} />
  </>
));

stories.add('Alert with icon', () => (
  <>
    <BaseStyles />

    <Alert
      message={message()}
      colour={colour()}
      icon={() => <FontAwesomeIcon icon={faExclamationTriangle} />}
    />
  </>
));
