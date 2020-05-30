/* eslint-disable react/no-array-index-key */
import {
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faAngleLeft,
  faAngleRight,
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
import Typography from '../Typography/Typography';

const Toolbar = styled.div`
  align-items: stretch;
  background-color: #2e9dc8;
  color: #fff;
  display: flex;
  flex-direction: row;
`;

const Title = styled(Typography)`
  flex-grow: 1;
  line-height: 40px;
`;

interface ICalendarButton {
  $fixed?: boolean;
}

const CalendarButton = styled(Button)<ICalendarButton>`
  ${({ $fixed = false }) => `
    ${$fixed ? 'width' : 'min-width'}: 40px;
    padding: 0;
  `}
`;

const Weekdays: FC = () => {
  const short = moment.weekdaysShort();
  const abbrs = moment.weekdays();

  return (
    <TableHead>
      <TableRow colour="primary">
        {short.map((day, i) => (
          <TableCell
            key={day}
            abbr={abbrs[i]}
            as="th"
            align="center"
            scope="col"
          >
            {day}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

interface IDates {
  date: moment.Moment;
  id: string;
  onSelect(day: number): void;
}

const Dates: FC<IDates> = ({ date, id, onSelect }) => {
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
        <CalendarButton
          block
          colour={colour}
          tabIndex={-1}
          onClick={() => onSelect(day)}
        >
          {day}
        </CalendarButton>
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
    <Table id={id} role="grid">
      <Weekdays />

      <TableBody>
        {rows.map((d, i) => (
          <TableRow key={i}>{d}</TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

type JumpUnits = 'month' | 'year';

export interface ICalendarProps {
  selectedDate?: string;
  id: string;
  onDateChange(date: string): void;
}

const Calendar: FC<ICalendarProps> = ({
  onDateChange,
  id,
  selectedDate = '',
}) => {
  const [date, setDate] = useState(() => {
    if (selectedDate !== '') {
      return moment.utc(selectedDate);
    }

    return moment.utc();
  });
  const [currentMonth, setCurrentMonth] = useState('');
  const [currentYear, setCurrentYear] = useState(0);
  const label = `${id}-dialog-label`;
  const setDay = (day: number) => {
    const updated = date.clone();

    updated.set('date', day);

    setDate(updated);
  };
  const next = (unit: JumpUnits) => {
    const updated = date.clone();

    updated.add(1, unit);

    setDate(updated);
  };
  const previous = (unit: JumpUnits) => {
    const updated = date.clone();

    updated.subtract(1, unit);

    setDate(updated);
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
        <CalendarButton
          $fixed
          block
          aria-label="Previous year"
          onClick={() => previous('year')}
        >
          <FontAwesomeIcon icon={faAngleDoubleLeft} />
        </CalendarButton>

        <CalendarButton
          $fixed
          block
          aria-label="Previous month"
          onClick={() => previous('month')}
        >
          <FontAwesomeIcon icon={faAngleLeft} />
        </CalendarButton>

        <Title
          id={label}
          component="p"
          variant="h6"
          align="center"
          margin="none"
        >
          {currentMonth} {currentYear}
        </Title>

        <CalendarButton
          $fixed
          block
          aria-label="Next month"
          onClick={() => next('month')}
        >
          <FontAwesomeIcon icon={faAngleRight} />
        </CalendarButton>

        <CalendarButton
          $fixed
          block
          aria-label="Next year"
          onClick={() => next('year')}
        >
          <FontAwesomeIcon icon={faAngleDoubleRight} />
        </CalendarButton>
      </Toolbar>

      <Dates id={label} date={date} onSelect={setDay} />
    </>
  );
};

export default memo(Calendar);
