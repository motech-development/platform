import { Field, FieldProps, getIn } from 'formik';
import React, {
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

type InputSpacing = 'md' | 'lg';

interface IBaseTextBox {
  active: boolean;
}

const BaseTextBox = styled.input<IBaseTextBox>`
  ${({ active }) => `
    background: #fff;
    border: none;
    color: ${active ? '#333' : '#fff'};
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
  format: string;
  helpText: string;
  label: string;
  setFocus(focus: boolean): void;
  spacing: InputSpacing;
}

const InternalTextBox: FC<IInternalTextBox> = ({
  active,
  field,
  format,
  form,
  helpText,
  label,
  setFocus,
  spacing,
  ...props
}) => {
  useEffect(() => {
    const focus = !!field.value;

    setFocus(focus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { onBlur, ...rest } = field;
  const { errors, handleBlur, setFieldValue, touched } = form;
  const describedBy = `${field.name}-error`;
  const [error, setError] = useState(false);
  const doBlur = (e: FocusEvent<HTMLInputElement>) => {
    handleBlur(e);

    if (!field.value) {
      setFocus(false);
    }

    onBlur(e);
  };
  const doFocus = () => {
    if (!field.value) {
      setFocus(true);
    }
  };
  const doValueChange = ({ formattedValue }: NumberFormatValues) => {
    setFieldValue(field.name, formattedValue);
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
      tooltip={() => (
        <Tooltip
          id={describedBy}
          parent={() => <InputAlert message={getIn(errors, field.name)} />}
          colour="danger"
          placement="left"
          message={getIn(errors, field.name)}
        />
      )}
    >
      <Label htmlFor={field.name} active={active} error={error}>
        {label}
      </Label>

      {/* eslint-disable react/jsx-props-no-spreading */}
      {format ? (
        <NumberFormat
          {...props}
          {...rest}
          customInput={Input}
          format={format}
          active={active}
          describedBy={describedBy}
          errors={error}
          onBlur={doBlur}
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
          onFocus={doFocus}
        />
      )}
      {/* eslint-enable react/jsx-props-no-spreading */}
    </InputWrapper>
  );
};

export interface ITextBoxProps {
  format?: string;
  helpText?: string;
  label: string;
  name: string;
  placeholder?: string;
  spacing?: InputSpacing;
  type?: 'email' | 'password' | 'text';
}

const TextBox: FC<ITextBoxProps> = ({
  format = null,
  helpText = null,
  label,
  name,
  placeholder = '',
  spacing = 'md',
  type = 'text',
}) => {
  const [focus, setFocus] = useState();

  return (
    <Field
      id={name}
      component={InternalTextBox}
      active={focus}
      format={format}
      helpText={helpText}
      type={type}
      name={name}
      placeholder={placeholder}
      setFocus={setFocus}
      label={label}
      spacing={spacing}
    />
  );
};

export default memo(TextBox);
