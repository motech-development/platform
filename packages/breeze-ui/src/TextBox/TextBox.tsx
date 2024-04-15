import { Field, FieldProps, FormikProps, FormikValues, getIn } from 'formik';
import {
  ChangeEvent,
  FC,
  FocusEvent,
  InputHTMLAttributes,
  useEffect,
  useState,
} from 'react';
import {
  NumberFormatValues,
  NumericFormat,
  PatternFormat,
} from 'react-number-format';
import styled from 'styled-components';
import useInputValidation from '../hooks/useInputValidation';
import InputWrapper from '../InputWrapper/InputWrapper';
import Label from '../Label/Label';

export type InputSpacing = 'sm' | 'md' | 'lg';

interface IBaseTextBox {
  $active: boolean;
}

const BaseTextBox = styled.input<IBaseTextBox>`
  ${({ $active }) => `
    background: #fff;
    border: none;
    color: ${$active ? '#333' : '#fff'};
    cursor: ${$active ? 'text' : 'pointer'};
    font-size: 16px;
    outline: 0;
    padding: 16px 0 10px;
    width: 100%;

    :disabled {
      color: #767676;
    }

    ::placeholder {
      color: ${$active ? '#767676' : '#fff'};
    }

    :-ms-input-placeholder {
      color: ${$active ? '#767676' : '#fff'};
    }

    ::-ms-input-placeholder {
      color: ${$active ? '#767676' : '#fff'};
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

interface IInput extends InputHTMLAttributes<HTMLInputElement> {
  active: boolean;
  describedBy: string;
  errors: boolean;
}

const Input: FC<IInput> = ({ active, describedBy, errors, ...rest }) => (
  <BaseTextBox
    $active={active}
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
  onChange(
    e: ChangeEvent<HTMLInputElement>,
    form: FormikProps<FormikValues>,
  ): Promise<void> | void;
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
  const error = useInputValidation(field.name, errors, touched);
  const describedBy = `${field.name}-error`;
  const useNumberFormat = Boolean(decimalScale || format || prefix || suffix);
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
      setFieldValue(field.name, formattedValue).catch(() => {});
    } else {
      setFieldValue(field.name, floatValue).catch(() => {});
    }
  };
  const doChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!useNumberFormat) {
      handleChange(e);
    }

    if (onChange) {
      Promise.resolve(onChange(e, form)).catch(() => {});
    }
  };

  return (
    <InputWrapper
      error={error}
      helpText={helpText}
      message={getIn(errors, field.name)}
      name={field.name}
      spacing={spacing}
    >
      <Label htmlFor={field.name} active={active} error={error}>
        {label}
      </Label>

      {/* eslint-disable react/jsx-props-no-spreading */}
      {(() => {
        if (useNumberFormat) {
          if (format) {
            return (
              <PatternFormat
                {...props}
                {...rest}
                valueIsNumericString={Boolean(prefix || suffix)}
                customInput={Input}
                format={format}
                inputMode="decimal"
                prefix={prefix}
                active={active}
                describedBy={describedBy}
                errors={error}
                onBlur={doBlur}
                onChange={doChange}
                onFocus={doFocus}
                onValueChange={doValueChange}
              />
            );
          }

          return (
            <NumericFormat
              {...props}
              {...rest}
              valueIsNumericString={Boolean(prefix || suffix)}
              customInput={Input}
              decimalScale={decimalScale}
              fixedDecimalScale={!!decimalScale}
              inputMode="decimal"
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
          );
        }

        return (
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
        );
      })()}
      {/* eslint-enable react/jsx-props-no-spreading */}
    </InputWrapper>
  );
};

export interface ITextBoxProps {
  decimalScale?: number;
  disabled?: boolean;
  format?: string;
  helpText?: string;
  label: string;
  name: string;
  placeholder?: string;
  prefix?: string;
  readOnly?: boolean;
  spacing?: InputSpacing;
  suffix?: string;
  type?: 'email' | 'number' | 'password' | 'text';
  onChange?(
    e: ChangeEvent<HTMLInputElement>,
    form: FormikProps<FormikValues>,
  ): Promise<void> | void;
}

const TextBox: FC<ITextBoxProps> = ({
  decimalScale,
  disabled = false,
  format,
  helpText = null,
  label,
  name,
  onChange,
  placeholder = '',
  prefix,
  readOnly = false,
  spacing = 'md',
  suffix,
  type = 'text',
}) => {
  const [focus, setFocus] = useState();

  return (
    <Field
      id={name}
      component={InternalTextBox}
      decimalScale={decimalScale}
      disabled={disabled}
      active={focus}
      format={format}
      helpText={helpText}
      type={type}
      name={name}
      onChange={onChange}
      placeholder={placeholder}
      prefix={prefix}
      readOnly={readOnly}
      setFocus={setFocus}
      suffix={suffix}
      label={label}
      spacing={spacing}
    />
  );
};

export default TextBox;
