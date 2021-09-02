import { storiesOf } from '@storybook/react';
import Button from '../components/Button';
import Card from '../components/Card';
import Stepper from '../components/Stepper';

const stories = storiesOf('Stepper', module);

stories.add('Basic stepper', () => (
  <>
    <Stepper
      previousLabel="Go back"
      nextLabel="Next"
      onComplete={
        <Button block disabled colour="success">
          The end!
        </Button>
      }
      onStart={
        <Button block colour="secondary">
          Exit
        </Button>
      }
    >
      <Card padding="md">Step 1</Card>

      <Card padding="md">Step 2</Card>

      <Card padding="md">Step 3</Card>

      <Card padding="md">Step 4</Card>
    </Stepper>
  </>
));
