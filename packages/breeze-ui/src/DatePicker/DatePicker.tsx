import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Field, FieldProps, getIn } from 'formik';
import moment from 'moment';
import React, { FC, memo, useEffect, useState } from 'react';
import { usePopper } from 'react-popper';
import styled from 'styled-components';
import Calendar from '../Calendar/Calendar';
import DateTime, { formatDateTime } from '../DateTime/DateTime';
import useOutsideClick from '../hooks/useOutsideClick';
import InputWrapper from '../InputWrapper/InputWrapper';
import Label from '../Label/Label';
import { InputSpacing } from '../TextBox/TextBox';

const IconOuter = styled.div`
  margin-top: -21px;
  position: absolute;
  right: 38px;
  top: 50%;
  z-index: 1;
`;

const IconButton = styled.button`
  appearance: none;
  background-color: #fff;
  border: 0;
  color: #aaa;
  cursor: pointer;
  display: block;
  height: 42px;
  line-height: 42px;
  padding: 0;
  text-align: center;
  width: 42px;
`;

const LikeInput = styled.div`
  background: #fff;
  border: none;
  color: #333;
  font-size: 16px;
  outline: 0;
  padding: 16px 0 10px;
  width: 100%;
`;

const DatePickerWrapper = styled.div`
  position: relative;
`;

const CalendarWrapper = styled.div`
  z-index: 1000;
`;

interface IInnerDatePicker extends FieldProps {
  helpText: string;
  label: string;
  spacing: InputSpacing;
}

const InnerDatePicker: FC<IInnerDatePicker> = ({
  field,
  form,
  helpText,
  label,
  spacing,
}) => {
  const [
    referenceElement,
    setReferenceElement,
  ] = useState<HTMLDivElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null,
  );
  const { attributes, styles } = usePopper(referenceElement, popperElement, {
    placement: 'bottom-end',
  });
  const [error, setError] = useState(false);
  const [visible, setVisible] = useState(false);
  const { name, value } = field;
  const [date, setDate] = useState(() => {
    if (value === '') {
      return moment().format();
    }

    return value;
  });
  const { errors, setFieldValue } = form;
  const describedBy = `${name}-error`;
  const { formatted } = formatDateTime(value);
  const selectDate = (d: string) => {
    setDate(d);
  };

  useEffect(() => {
    setFieldValue(name, date);

    const err = getIn(errors, name);

    setError(!!err);
  }, [date, errors, name, setFieldValue]);

  useOutsideClick(referenceElement, () => {
    setVisible(false);
  });

  return (
    <DatePickerWrapper ref={setReferenceElement}>
      <InputWrapper
        error={error}
        helpText={helpText}
        message={getIn(errors, name)}
        name={name}
        spacing={spacing}
      >
        <Label active htmlFor={name} error={error}>
          {label}
        </Label>

        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <input hidden id={name} {...field} />

        <LikeInput aria-describedby={error ? describedBy : undefined}>
          <DateTime value={value} />
        </LikeInput>

        <IconOuter>
          <IconButton
            type="button"
            aria-label={`Choose ${label}, selected date is ${formatted}`}
            onClick={() => setVisible(!visible)}
          >
            <FontAwesomeIcon icon={faCalendar} />
          </IconButton>
        </IconOuter>
      </InputWrapper>

      {visible && (
        <CalendarWrapper
          ref={setPopperElement}
          style={styles.popper}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...attributes.popper}
        >
          <Calendar id={name} selectedDate={value} onDateChange={selectDate} />
        </CalendarWrapper>
      )}
    </DatePickerWrapper>
  );
};

export interface IDatePicker {
  helpText?: string;
  label: string;
  name: string;
  spacing?: InputSpacing;
}

const DatePicker: FC<IDatePicker> = ({
  helpText = null,
  label,
  name,
  spacing = 'md',
}) => (
  <Field
    component={InnerDatePicker}
    helpText={helpText}
    id={name}
    label={label}
    name={name}
    spacing={spacing}
  />
);

export default memo(DatePicker);
