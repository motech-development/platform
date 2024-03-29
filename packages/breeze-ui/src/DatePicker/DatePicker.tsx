import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Field, FieldProps, getIn } from 'formik';
import { DateTime as Luxon } from 'luxon';
import { FC, useEffect, useState } from 'react';
import { usePopper } from 'react-popper';
import styled from 'styled-components';
import Calendar from '../Calendar/Calendar';
import DateTime, { formatDateTime } from '../DateTime/DateTime';
import useOutsideClick from '../hooks/useOutsideClick';
import InputWrapper from '../InputWrapper/InputWrapper';
import Label from '../Label/Label';
import LikeInput from '../LikeInput/LikeInput';
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
  color: #767676;
  cursor: pointer;
  display: block;
  height: 42px;
  line-height: 42px;
  padding: 0;
  text-align: center;
  width: 42px;
`;

const DatePickerWrapper = styled.div`
  position: relative;
`;

const CalendarWrapper = styled.div`
  z-index: 1000;
`;

interface IInnerDatePicker extends FieldProps<string, string> {
  disabled: boolean;
  helpText: string;
  label: string;
  readOnly: boolean;
  spacing: InputSpacing;
}

const InnerDatePicker: FC<IInnerDatePicker> = ({
  disabled,
  field,
  form,
  helpText,
  label,
  readOnly,
  spacing,
}) => {
  const [referenceElement, setReferenceElement] =
    useState<HTMLDivElement | null>(null);
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
      return Luxon.utc().toISO();
    }

    return Luxon.fromISO(value).toUTC().toISO();
  });
  const { errors, setFieldValue } = form;
  const markAsDisabled = disabled || readOnly;
  const describedBy = `${name}-error`;
  const { formatted } = formatDateTime(value);
  const selectDate = (d: string) => {
    setDate(d);
  };

  useEffect(() => {
    setFieldValue(name, date).catch(() => {});
    setVisible(false);

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

        <input
          hidden
          id={name}
          disabled={disabled}
          readOnly={readOnly}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...field}
        />

        <LikeInput
          aria-describedby={error ? describedBy : undefined}
          $disabled={disabled}
        >
          <DateTime value={value} />
        </LikeInput>

        <IconOuter>
          <IconButton
            data-testid="date-picker"
            disabled={markAsDisabled}
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

export interface IDatePickerProps {
  disabled?: boolean;
  helpText?: string;
  label: string;
  name: string;
  readOnly?: boolean;
  spacing?: InputSpacing;
}

const DatePicker: FC<IDatePickerProps> = ({
  disabled = false,
  helpText = null,
  label,
  name,
  readOnly = false,
  spacing = 'md',
}) => (
  <Field
    component={InnerDatePicker}
    disabled={disabled}
    helpText={helpText}
    id={name}
    label={label}
    name={name}
    readOnly={readOnly}
    spacing={spacing}
  />
);

export default DatePicker;
