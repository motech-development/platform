import { Field, FieldProps, getIn } from 'formik';
import React, { FC, memo, useEffect, useState } from 'react';
import styled from 'styled-components';
import Calendar from '../Calendar/Calendar';
import DateTime from '../DateTime/DateTime';
import InputAlert from '../InputAlert/InputAlert';
import InputWrapper from '../InputWrapper/InputWrapper';
import Label from '../Label/Label';
import { InputSpacing } from '../TextBox/TextBox';
import Tooltip from '../Tooltip/Tooltip';

const LinkInput = styled.div`
  background: #fff;
  border: none;
  color: #333;
  font-size: 16px;
  outline: 0;
  padding: 16px 0 10px;
  width: 100%;
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
  const [date, setDate] = useState('');
  const [error, setError] = useState(false);
  const { name, value } = field;
  const { errors, setFieldValue } = form;
  const describedBy = `${field.name}-error`;

  useEffect(() => {
    setFieldValue(name, date);

    const err = getIn(errors, name);

    setError(!!err);
  }, [date, errors, name, setFieldValue]);

  return (
    <>
      <InputWrapper
        helpText={helpText}
        spacing={spacing}
        error={error}
        tooltip={
          <Tooltip
            id={describedBy}
            parent={<InputAlert message={getIn(errors, field.name)} />}
            colour="danger"
            placement="left"
            message={getIn(errors, field.name)}
          />
        }
      >
        <Label active htmlFor={name} error={error}>
          {label}
        </Label>

        <LinkInput aria-describedby={error ? describedBy : undefined}>
          <DateTime value={value} />
        </LinkInput>
      </InputWrapper>

      <Calendar onDateChange={setDate} />
    </>
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
