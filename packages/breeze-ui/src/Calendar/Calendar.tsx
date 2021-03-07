/* eslint-disable react/no-array-index-key */
import {
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faAngleLeft,
  faAngleRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import { FC, memo, ReactNode, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ButtonColour } from '../BaseButton/BaseButton';
import Button from '../Button/Button';
import Table from '../Table/Table';
import TableBody from '../TableBody/TableBody';
import TableCell from '../TableCell/TableCell';
import TableHead from '../TableHead/TableHead';
import TableRow from '../TableRow/TableRow';
import Typography from '../Typography/Typography';

const Toolbar = styled.div`
  align-items: stretch;
  background-color: #007fa8;
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
  view: moment.Moment;
  onSelect(day: number, month: number, year: number): void;
}

const Dates: FC<IDates> = ({ date, id, onSelect, view }) => {
  const clone = view.clone();
  const selectedClone = date.clone();
  const currentDay = parseInt(selectedClone.format('D'), 10);
  const daysInMonth = clone.daysInMonth();
  const firstDayOfMonth = parseInt(clone.startOf('month').format('d'), 10);
  const previousMonth = view.clone().subtract(1, 'months');
  const lastDayOfPreviousMonth = parseInt(
    previousMonth.endOf('month').format('D'),
    10,
  );
  const nextMonth = view.clone().add(1, 'months');

  const blanks = [...Array(firstDayOfMonth)]
    .map((_, i) => {
      const day = lastDayOfPreviousMonth - i;
      const thisMonth = date.isSame(previousMonth, 'month');

      let colour: ButtonColour;

      if (thisMonth) {
        colour = day === currentDay ? 'primary' : 'secondary';
      } else {
        colour = 'secondary';
      }

      return (
        <TableCell key={0 - i} align="center">
          <CalendarButton block disabled colour={colour}>
            {day}
          </CalendarButton>
        </TableCell>
      );
    })
    .reverse();
  const days = [...Array(daysInMonth)].map((_, i) => {
    const day = i + 1;
    const month = view.get('month');
    const year = view.get('year');
    const thisMonth = date.isSame(view, 'month');

    let colour: ButtonColour;

    if (thisMonth) {
      colour = day === currentDay ? 'primary' : 'secondary';
    } else {
      colour = 'secondary';
    }

    return (
      <TableCell key={day} align="center">
        <CalendarButton
          block
          colour={colour}
          tabIndex={-1}
          onClick={() => onSelect(day, month, year)}
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
      const filler = [...Array(7 - cells.length)].map((_, fillerIndex) => {
        const key = daysInMonth + fillerIndex + 1;

        const day = 1 + fillerIndex;
        const thisMonth = date.isSame(nextMonth, 'month');

        let colour: ButtonColour;

        if (thisMonth) {
          colour = day === currentDay ? 'primary' : 'secondary';
        } else {
          colour = 'secondary';
        }

        return (
          <TableCell key={key} align="center">
            <CalendarButton block disabled colour={colour}>
              {day}
            </CalendarButton>
          </TableCell>
        );
      });

      rows.push([...cells, ...filler]);
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

const selectMoment = (start: moment.Moment, date?: moment.Moment) =>
  date || start;

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
  const [startDate] = useState(() => {
    if (selectedDate !== '') {
      return moment.utc(selectedDate);
    }

    return moment.utc();
  });
  const [date, setDate] = useState<moment.Moment>();
  const [view, setView] = useState<moment.Moment>();
  const [currentMonth, setCurrentMonth] = useState('');
  const [currentYear, setCurrentYear] = useState(0);
  const selected = selectMoment(startDate, date);
  const selectedView = selectMoment(startDate, view);
  const grid = `${id}-calendar`;
  const label = `${id}-dialog-label`;
  const setDay = (day: number, month: number, year: number) => {
    const updated = selected.clone();

    updated.set('date', day);
    updated.set('month', month);
    updated.set('year', year);

    setDate(updated);
  };
  const next = (unit: JumpUnits) => {
    const updated = selectedView.clone();

    updated.add(1, unit);

    setView(updated);
  };
  const previous = (unit: JumpUnits) => {
    const updated = selectedView.clone();

    updated.subtract(1, unit);

    setView(updated);
  };

  useEffect(() => {
    const clone = selectedView.clone();

    setCurrentMonth(clone.format('MMMM'));
    setCurrentYear(parseInt(clone.format('Y'), 10));
  }, [selectedView]);

  useEffect(() => {
    if (date) {
      onDateChange(date.format());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

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

      <Dates id={grid} date={selected} view={selectedView} onSelect={setDay} />
    </>
  );
};

export default memo(Calendar);
