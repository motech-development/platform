import { boolean, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';
import BaseStyles from '../BaseStyles/BaseStyles';
import Button from '../Button/Button';
import Typography from '../Typography/Typography';
import Modal from './Modal';

const stories = storiesOf('Modal', module);
const onDismiss = () => {};

stories.addDecorator(withKnobs);

stories.add('Basic modal', () => (
  <>
    <BaseStyles />

    <Modal isOpen={boolean('Show', true)} onDismiss={onDismiss}>
      <Typography rule component="h1" variant="h2" margin="lg">
        Are you sure you want to do this?
      </Typography>
      <Typography component="p" variant="p" margin="lg">
        Clicking OK will delete this permanently
      </Typography>
      <Button colour="danger">Delete</Button>{' '}
      <Button>Actually, don&#39;t bother</Button>
    </Modal>
  </>
));
