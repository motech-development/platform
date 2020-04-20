import { storiesOf } from '@storybook/react';
import React from 'react';
import BaseStyles from '../BaseStyles/BaseStyles';
import Card from '../Card/Card';
import Calendar from './Calendar';

const stories = storiesOf('Calendar', module);

stories.add('Basic calendar', () => (
  <>
    <BaseStyles />

    <Card padding="lg">
      <Calendar
        onDateChange={date => {
          console.log('Selected date:', date);
        }}
      />
    </Card>
  </>
));
