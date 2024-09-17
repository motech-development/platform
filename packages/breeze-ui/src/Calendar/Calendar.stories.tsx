import { withKnobs } from '@storybook/addon-knobs';
import BaseStyles from '../BaseStyles/BaseStyles';
import Card from '../Card/Card';
import Calendar from './Calendar';

export default {
  component: Calendar,
  decorators: [withKnobs],
};

const onDateChange = () => {};

export const BasicCalendar = {
  name: 'Basic calendar',
  render: () => (
    <>
      <BaseStyles />

      <Card padding="lg">
        <Calendar id="test" onDateChange={onDateChange} />
      </Card>
    </>
  ),
};
