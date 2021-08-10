import { FC } from 'react';

export interface ICalendarProps {
  selectedDate?: string;
  id: string;
  onDateChange(date: string): void;
}

// {
//   onDateChange,
//   id,
//   selectedDate = '',
// }
const Calendar: FC<ICalendarProps> = () => <div />;

export default Calendar;
