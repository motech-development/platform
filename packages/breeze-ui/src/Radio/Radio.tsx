import { Field, FieldProps, FormikProps, FormikValues, getIn } from 'formik';
import React, { ChangeEvent, FC, memo } from 'react';
import styled from 'styled-components';
import useInputValidation from '../hooks/useInputValidation';
import FieldSet from '../FieldSet/FieldSet';
import Legend from '../Legend/Legend';
import OptionLabel from '../OptionLabel/OptionLabel';
import OptionLabelText from '../OptionLabelText/OptionLabelText';

const BaseRadio = styled.input`
  cursor: pointer;
  height: 100%;
  left: 0;
  margin: 0;
  padding: 0;
  position: absolute;
  opacity: 0;
  top: 0;
  width: 100%;
  z-index: 1;
`;

type RadioSpacing = 'sm' | 'md' | 'lg';

export interface IRadioOption {
  name: string;
  value: string;
}

interface IInternalRadio extends FieldProps {
  disabled: boolean;
  helpText: string;
  label: string;
  onChange(
    e: ChangeEvent<HTMLInputElement>,
    form: FormikProps<FormikValues>,
  ): void;
  options: IRadioOption[];
  readOnly: boolean;
  spacing: RadioSpacing;
}

const InternalRadio: FC<IInternalRadio> = ({
  disabled,
  field,
  form,
  helpText,
  label,
  onChange,
  options,
  readOnly,
  spacing,
}) => {
  const { errors, handleChange, setFieldValue, touched } = form;
  const error = useInputValidation(field.name, errors, touched);
  const markAsDisabled = disabled || readOnly;
  const doChange = (e: ChangeEvent<HTMLInputElement>, value: string) => {
    handleChange(e);

    setFieldValue(field.name, value);

    if (onChange) {
      onChange(e, form);
    }
  };

  return (
    <FieldSet
      error={error}
      helpText={helpText}
      message={getIn(errors, field.name)}
      name={field.name}
      spacing={spacing}
    >
      <Legend error={error}>{label}</Legend>

      {options.map(({ name, value }) => (
        <OptionLabel
          key={value}
          disabled={disabled}
          selected={field.value === value}
        >
          <BaseRadio
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...field}
            disabled={markAsDisabled}
            readOnly={readOnly}
            type="radio"
            value={value}
            onChange={e => doChange(e, value)}
          />

          <OptionLabelText>{name}</OptionLabelText>
        </OptionLabel>
      ))}

      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      {readOnly && <input type="hidden" {...field} />}
    </FieldSet>
  );
};

export interface IRadioProps {
  disabled?: boolean;
  helpText?: string;
  label: string;
  name: string;
  options: IRadioOption[];
  readOnly?: boolean;
  spacing?: RadioSpacing;
  onChange?(
    e: ChangeEvent<HTMLInputElement>,
    form: FormikProps<FormikValues>,
  ): void;
}

const Radio: FC<IRadioProps> = ({
  disabled = false,
  helpText = null,
  label,
  name,
  onChange = undefined,
  options,
  readOnly = false,
  spacing = 'md',
}) => (
  <Field
    id={name}
    component={InternalRadio}
    disabled={disabled}
    helpText={helpText}
    name={name}
    onChange={onChange}
    options={options}
    readOnly={readOnly}
    label={label}
    spacing={spacing}
  />
);

export default memo(Radio);
