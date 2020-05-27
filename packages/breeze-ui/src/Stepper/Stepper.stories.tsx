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

    <Card>
      <Stepper
        previousLabel="Go back"
        nextLabel="Next"
        onComplete={<Button disabled>The end!</Button>}
      >
        <div>Step 1</div>

        <div>Step 2</div>

        <div>Step 3</div>

        <div>Step 4</div>
      </Stepper>
    </Card>
  </>
));
