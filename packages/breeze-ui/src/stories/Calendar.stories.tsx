import { storiesOf } from '@storybook/react';
import Card from '../components/Card';
import Calendar from '../components/Calendar';

const stories = storiesOf('Calendar', module);
const onDateChange = () => {};

stories.add('Basic calendar', () => (
  <>
    <Card padding="lg">
      <Calendar id="test" onDateChange={onDateChange} />
    </Card>
  </>
));
