import { Field, FieldProps, FormikProps, getIn } from 'formik';
import React, {
  ChangeEvent,
  FC,
  FocusEvent,
  HTMLAttributes,
  memo,
  useEffect,
  useState,
} from 'react';
import NumberFormat, { NumberFormatValues } from 'react-number-format';
import styled from 'styled-components';
import InputAlert from '../InputAlert/InputAlert';
import InputWrapper from '../InputWrapper/InputWrapper';
import Label from '../Label/Label';
import Tooltip from '../Tooltip/Tooltip';

type InputSpacing = 'sm' | 'md' | 'lg';

interface IBaseTextBox {
  active: boolean;
}

const BaseTextBox = styled.input<IBaseTextBox>`
  ${({ active }) => `
    background: #fff;
    border: none;
    color: ${active ? '#333' : '#fff'};
    cursor: ${active ? 'text' : 'pointer'};
    font-size: 16px;
    outline: 0;
    padding: 16px 0 10px;
    width: 100%;

    ::placeholder {
      color: ${active ? '#aaa' : '#fff'};
    }

    :-ms-input-placeholder {
      color: ${active ? '#aaa' : '#fff'};
    }

    ::-ms-input-placeholder {
      color: ${active ? '#aaa' : '#fff'};
    }

    ::-webkit-outer-spin-button,
    ::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    [type="number"] {
      -moz-appearance: textfield;
    }
  `}
`;

interface IInput extends HTMLAttributes<HTMLInputElement> {
  active: boolean;
  describedBy: string;
  errors: boolean;
}

const Input: FC<IInput> = ({ active, describedBy, errors, ...rest }) => (
  <BaseTextBox
    active={active}
    aria-describedby={errors ? describedBy : undefined}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest}
  />
);

interface IInternalTextBox extends FieldProps {
  active: boolean;
  decimalScale: number;
  format: string;
  helpText: string;
  label: string;
  onChange(e: ChangeEvent<HTMLInputElement>, form: FormikProps<{}>): void;
  prefix: string;
  setFocus(focus: boolean): void;
  spacing: InputSpacing;
  suffix: string;
}

const InternalTextBox: FC<IInternalTextBox> = ({
  active,
  decimalScale,
  field,
  format,
  form,
  helpText,
  label,
  onChange,
  prefix,
  setFocus,
  spacing,
  suffix,
  ...props
}) => {
  useEffect(() => {
    const focus = !!field.value || field.value === 0;

    setFocus(focus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field.value]);

  const { onBlur, ...rest } = field;
  const { errors, handleBlur, handleChange, setFieldValue, touched } = form;
  const describedBy = `${field.name}-error`;
  const useNumberFormat = Boolean(decimalScale || format || prefix || suffix);
  const [error, setError] = useState(false);
  const doBlur = (e: FocusEvent<HTMLInputElement>) => {
    handleBlur(e);

    if (!field.value && field.value !== 0) {
      setFocus(false);
    }

    onBlur(e);
  };
  const doFocus = () => {
    if (!field.value && field.value !== 0) {
      setFocus(true);
    }
  };
  const doValueChange = ({
    floatValue,
    formattedValue,
  }: NumberFormatValues) => {
    if (format) {
      setFieldValue(field.name, formattedValue);
    } else {
      setFieldValue(field.name, floatValue);
    }
  };
  const doChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleChange(e);

    if (onChange) {
      onChange(e, form);
    }
  };

  useEffect(() => {
    const touch = getIn(touched, field.name);
    const err = getIn(errors, field.name);

    setError(!!touch && !!err);
  }, [errors, touched, field.name]);

  return (
    <InputWrapper
      spacing={spacing}
      helpText={helpText}
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
      <Label htmlFor={field.name} active={active} error={error}>
        {label}
      </Label>

      {/* eslint-disable react/jsx-props-no-spreading */}
      {useNumberFormat ? (
        <NumberFormat
          {...props}
          {...rest}
          isNumericString={Boolean(prefix || suffix)}
          customInput={Input}
          decimalScale={decimalScale}
          fixedDecimalScale={!!decimalScale}
          format={format}
          prefix={prefix}
          suffix={suffix}
          active={active}
          describedBy={describedBy}
          errors={error}
          onBlur={doBlur}
          onChange={doChange}
          onFocus={doFocus}
          onValueChange={doValueChange}
        />
      ) : (
        <Input
          {...props}
          {...rest}
          active={active}
          describedBy={describedBy}
          errors={error}
          onBlur={doBlur}
          onChange={doChange}
          onFocus={doFocus}
        />
      )}
      {/* eslint-enable react/jsx-props-no-spreading */}
    </InputWrapper>
  );
};

export interface ITextBoxProps {
  decimalScale?: number;
  format?: string;
  helpText?: string;
  label: string;
  name: string;
  placeholder?: string;
  prefix?: string;
  spacing?: InputSpacing;
  suffix?: string;
  type?: 'email' | 'number' | 'password' | 'text';
  onChange?(e: ChangeEvent<HTMLInputElement>, form: FormikProps<{}>): void;
}

const TextBox: FC<ITextBoxProps> = ({
  decimalScale = undefined,
  format = undefined,
  helpText = null,
  label,
  name,
  onChange = undefined,
  placeholder = '',
  prefix = undefined,
  spacing = 'md',
  suffix = undefined,
  type = 'text',
}) => {
  const [focus, setFocus] = useState();

  return (
    <Field
      id={name}
      component={InternalTextBox}
      decimalScale={decimalScale}
      active={focus}
      format={format}
      helpText={helpText}
      type={type}
      name={name}
      onChange={onChange}
      placeholder={placeholder}
      prefix={prefix}
      setFocus={setFocus}
      suffix={suffix}
      label={label}
      spacing={spacing}
    />
  );
};

export default memo(TextBox);
