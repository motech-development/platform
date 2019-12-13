// TODO: Textbox size
import { Field, FieldProps } from 'formik';
import React, { FC, memo, useEffect, useState } from 'react';
import styled from 'styled-components';
import InputAlert from '../InputAlert/InputAlert';
import InputWrapper from '../InputWrapper/InputWrapper';
import Label from '../Label/Label';
import Tooltip from '../Tooltip/Tooltip';

export interface IBaseTextBox {
  active: boolean;
}

export const BaseTextBox = styled.input<IBaseTextBox>`
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

export interface IInternalTextBox extends FieldProps {
  active: boolean;
  label: string;
  setFocus(focus: boolean): void;
}

export const InternalTextBox: FC<IInternalTextBox> = ({
  active,
  field,
  form,
  setFocus,
  label,
  ...props
}) => {
  useEffect(() => {
    const focus = !!field.value;

    setFocus(focus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { onBlur, ...rest } = field;
  const { errors, touched } = form;
  const error = !!touched[field.name] && !!errors[field.name];

  function doBlur(e: unknown) {
    if (!field.value) {
      setFocus(false);
    }

    onBlur(e);
  }

  function doFocus() {
    if (!field.value) {
      setFocus(true);
    }
  }

  return (
    <InputWrapper
      error={error}
      tooltip={() => (
        <Tooltip parent={() => <InputAlert />} colour="danger" placement="left">
          {errors[field.name]}
        </Tooltip>
      )}
    >
      <Label htmlFor={field.name} active={active} error={error}>
        {label}
      </Label>

      <BaseTextBox
        active={active}
        onBlur={doBlur}
        onFocus={doFocus}
        {...rest} // eslint-disable-line react/jsx-props-no-spreading
        {...props} // eslint-disable-line react/jsx-props-no-spreading
      />
    </InputWrapper>
  );
};

export interface IButtonProps {
  label: string;
  name: string;
  placeholder?: string;
  type?: 'email' | 'password' | 'text';
}

const TextBox: FC<IButtonProps> = ({
  label,
  name,
  placeholder = '',
  type = 'text',
}) => {
  const [focus, setFocus] = useState();

  return (
    <Field
      id={name}
      component={InternalTextBox}
      type={type}
      name={name}
      placeholder={placeholder}
      setFocus={setFocus}
      active={focus}
      label={label}
    />
  );
};

export default memo(TextBox);
