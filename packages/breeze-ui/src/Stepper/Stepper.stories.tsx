import { storiesOf } from '@storybook/react';
import React from 'react';
import BaseStyles from '../BaseStyles/BaseStyles';
import Button from '../Button/Button';
import Card from '../Card/Card';
import Stepper from './Stepper';

const stories = storiesOf('Stepper', module);

stories.add('Basic stepper', () => (
  <>
    <BaseStyles />

    <Stepper
      previousLabel="Go back"
      nextLabel="Next"
      onComplete={
        <Button block disabled colour="success" size="lg">
          The end!
        </Button>
      }
      onStart={
        <Button block colour="secondary" size="lg">
          Exit
        </Button>
      }
    >
      <Card padding="lg">Step 1</Card>

      <Card padding="lg">Step 2</Card>

      <Card padding="lg">Step 3</Card>

      <Card padding="lg">Step 4</Card>
    </Stepper>
  </>
));
