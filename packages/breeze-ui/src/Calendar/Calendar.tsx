/* eslint-disable react/no-array-index-key */
import moment from 'moment';
import React, { FC, memo, ReactNode, useEffect, useState } from 'react';
import Button from '../Button/Button';
import Table from '../Table/Table';
import TableBody from '../TableBody/TableBody';
import TableCell from '../TableCell/TableCell';
import TableHead from '../TableHead/TableHead';
import TableRow from '../TableRow/TableRow';

interface IMonths {
  currentMonth: string;
  months: string[];
  setMonth(month: string): void;
  toggleMonths(): void;
}

const Months: FC<IMonths> = ({
  currentMonth,
  months,
  setMonth,
  toggleMonths,
}) => {
  const selectMonth = (month: string) => {
    setMonth(month);

    toggleMonths();
  };

  const items = months.map(month => {
    const colour = month === currentMonth ? 'primary' : 'secondary';

    return (
      <TableCell key={month} align="center">
        <Button block colour={colour} onClick={() => selectMonth(month)}>
          {month}
        </Button>
      </TableCell>
    );
  });
  const rows: ReactNode[] = [];

  let cells: ReactNode[] = [];

  items.forEach((row, i) => {
    if (i % 3 !== 0 || i === 0) {
      cells.push(row);
    } else {
      rows.push(cells);
      cells = [];
      cells.push(row);
    }
  });

  rows.push(cells);

  return (
    <Table fixed>
      <TableBody>
        {rows.map((m, i) => (
          <TableRow key={i}>{m}</TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const Weekdays: FC = () => {
  const generateWeekdays = moment.weekdaysShort().map(day => (
    <TableCell key={day} as="th" align="center">
      {day}
    </TableCell>
  ));

  return (
    <TableHead>
      <TableRow colour="primary">{generateWeekdays}</TableRow>
    </TableHead>
  );
};

interface IDates {
  date: moment.Moment;
  onSelect(day: number): void;
}

const Dates: FC<IDates> = ({ date, onSelect }) => {
  const clone = date.clone();
  const currentDay = parseInt(clone.format('D'), 10);
  const daysInMonth = clone.daysInMonth();
  const firstDayOfMonth = parseInt(clone.startOf('month').format('d'), 10);

  const blanks = [...Array(firstDayOfMonth)].map((_, i) => (
    <TableCell key={0 - i} />
  ));
  const days = [...Array(daysInMonth)].map((_, i) => {
    const day = i + 1;
    const colour = day === currentDay ? 'primary' : 'secondary';

    return (
      <TableCell key={day} align="center">
        <Button block colour={colour} onClick={() => onSelect(day)}>
          {day}
        </Button>
      </TableCell>
    );
  });
  const totalSlots = [...blanks, ...days];
  const rows: ReactNode[] = [];

  let cells: ReactNode[] = [];

  totalSlots.forEach((row, i) => {
    if (i % 7 !== 0) {
      cells.push(row);
    } else {
      rows.push(cells);
      cells = [];
      cells.push(row);
    }
    if (i === totalSlots.length - 1) {
      rows.push(cells);
    }
  });

  return (
    <TableBody>
      {rows.map((d, i) => (
        <TableRow key={i}>{d}</TableRow>
      ))}
    </TableBody>
  );
};

export interface ICalendarProps {
  selectedDate?: string;
  onDateChange(date: string): void;
}

const Calendar: FC<ICalendarProps> = ({ onDateChange, selectedDate }) => {
  const [date, setDate] = useState(moment(selectedDate));
  const [showMonths, setShowMonths] = useState(false);
  const [currentMonth, setCurrentMonth] = useState('');
  const months = moment.months();
  const setDay = (day: number) => {
    const updated = date.clone();

    updated.set('date', day);

    setDate(updated);
  };
  const setMonth = (month: string) => {
    const index = months.indexOf(month);
    const updated = date.clone();

    updated.set('month', index);

    setDate(updated);
  };
  const toggleMonths = () => {
    setShowMonths(!showMonths);
  };

  useEffect(() => {
    const clone = date.clone();

    setCurrentMonth(clone.format('MMMM'));

    onDateChange(date.format());
  }, [date, onDateChange]);

  return (
    <>
      <Button block onClick={toggleMonths}>
        {currentMonth}
      </Button>

      {showMonths ? (
        <Months
          currentMonth={currentMonth}
          months={months}
          setMonth={setMonth}
          toggleMonths={toggleMonths}
        />
      ) : (
        <Table fixed>
          <Weekdays />

          <Dates date={date} onSelect={setDay} />
        </Table>
      )}
    </>
  );
};

export default memo(Calendar);
