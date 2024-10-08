import BaseStyles from '../BaseStyles/BaseStyles';
import Button from '../Button/Button';
import Card from '../Card/Card';
import Stepper from './Stepper';

export default {
  component: Stepper,
};

export const BasicStepper = {
  name: 'Basic stepper',
  render: () => (
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
  ),
};
