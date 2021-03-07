import { withA11y } from '@storybook/addon-a11y';
import { storiesOf } from '@storybook/react';
import BaseStyles from '../BaseStyles/BaseStyles';
import Card from '../Card/Card';
import Calendar from './Calendar';

const stories = storiesOf('Calendar', module);
const onDateChange = () => {};

stories.addDecorator(withA11y);

stories.add('Basic calendar', () => (
  <>
    <BaseStyles />

    <Card padding="lg">
      <Calendar id="test" onDateChange={onDateChange} />
    </Card>
  </>
));
