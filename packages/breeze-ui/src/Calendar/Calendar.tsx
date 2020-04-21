/* eslint-disable react/no-array-index-key */
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import React, { FC, memo, ReactNode, useEffect, useState } from 'react';
import styled from 'styled-components';
import Button from '../Button/Button';
import Table from '../Table/Table';
import TableBody from '../TableBody/TableBody';
import TableCell from '../TableCell/TableCell';
import TableHead from '../TableHead/TableHead';
import TableRow from '../TableRow/TableRow';

const Toolbar = styled.div`
  align-items: stretch;
  display: flex;
  flex-direction: row;
`;

interface IYear {
  currentYear: number;
  date: moment.Moment;
  setYear(year: number): void;
}

const Year: FC<IYear> = ({ currentYear, date, setYear }) => {
  const lower = parseInt(
    date
      .clone()
      .subtract(4, 'year')
      .format('Y'),
    10,
  );
  const upper = parseInt(
    date
      .clone()
      .add(7, 'year')
      .format('Y'),
    10,
  );
  const range = [...Array(upper - lower + 1)]
    .fill(0)
    .map((_, idx) => lower + idx);

  const items = range.map(year => {
    const colour = year === currentYear ? 'primary' : 'secondary';

    return (
      <TableCell key={year} align="center">
        <Button block colour={colour} onClick={() => setYear(year)}>
          {year}
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
        {rows.map((y, i) => (
          <TableRow key={i}>{y}</TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

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
    <Table fixed>
      <Weekdays />

      <TableBody>
        {rows.map((d, i) => (
          <TableRow key={i}>{d}</TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export interface ICalendarProps {
  selectedDate?: string;
  onDateChange(date: string): void;
}

const Calendar: FC<ICalendarProps> = ({ onDateChange, selectedDate }) => {
  const [date, setDate] = useState(moment(selectedDate));
  const [showDates, setShowDates] = useState(true);
  const [showMonths, setShowMonths] = useState(false);
  const [showYears, setShowYears] = useState(false);
  const [currentMonth, setCurrentMonth] = useState('');
  const [currentYear, setCurrentYear] = useState(0);
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
    toggleMonths();
  };
  const setYear = (year: number) => {
    const updated = date.clone();

    updated.set('year', year);

    setDate(updated);
    toggleYears();
  };
  const next = () => {
    const updated = date.clone();

    updated.add(1, 'month');

    setDate(updated);
  };
  const previous = () => {
    const updated = date.clone();

    updated.subtract(1, 'month');

    setDate(updated);
  };
  const toggleMonths = () => {
    setShowMonths(!showMonths);
    setShowDates(showMonths);
    setShowYears(false);
  };
  const toggleYears = () => {
    setShowYears(!showYears);
    setShowDates(showYears);
    setShowMonths(false);
  };

  useEffect(() => {
    const clone = date.clone();

    setCurrentMonth(clone.format('MMMM'));
    setCurrentYear(parseInt(clone.format('Y'), 10));

    onDateChange(date.format());
  }, [date, onDateChange]);

  return (
    <>
      <Toolbar>
        <Button onClick={previous}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </Button>

        <Button block onClick={toggleMonths}>
          {currentMonth}
        </Button>

        <Button block onClick={toggleYears}>
          {currentYear}
        </Button>

        <Button onClick={next}>
          <FontAwesomeIcon icon={faChevronRight} />
        </Button>
      </Toolbar>

      {showYears && (
        <Year currentYear={currentYear} date={date} setYear={setYear} />
      )}

      {showMonths && (
        <Months
          currentMonth={currentMonth}
          months={months}
          setMonth={setMonth}
          toggleMonths={toggleMonths}
        />
      )}

      {showDates && <Dates date={date} onSelect={setDay} />}
    </>
  );
};

export default memo(Calendar);
