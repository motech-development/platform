import { Field, FieldProps } from 'formik';
import React, { FC, memo, useEffect, useState } from 'react';
import styled from 'styled-components';
import InputWrapper from '../InputWrapper/InputWrapper';
import Label from '../Label/Label';

export interface IBaseTextBox {
  active: boolean;
  type?: 'email' | 'password' | 'text';
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
  setFocus(focus: boolean): void;
}

export const InternalTextBox: FC<IInternalTextBox> = ({
  field,
  form,
  setFocus,
  ...props
}) => {
  useEffect(() => {
    const focus = !!field.value;

    setFocus(focus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { onBlur, ...rest } = field;

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
    // eslint-disable-next-line react/jsx-props-no-spreading
    <BaseTextBox onBlur={doBlur} onFocus={doFocus} {...rest} {...props} />
  );
};

export interface IButtonProps extends IBaseTextBox {
  label: string;
  name: string;
  placeholder?: string;
}

const TextBox: FC<IButtonProps> = ({
  label,
  name,
  placeholder = '',
  type = 'text',
}) => {
  const [focus, setFocus] = useState();

  return (
    <InputWrapper>
      <Label htmlFor={name} active={focus}>
        {label}
      </Label>

      <Field
        id={name}
        component={InternalTextBox}
        type={type}
        name={name}
        placeholder={placeholder}
        setFocus={setFocus}
        active={focus}
      />
    </InputWrapper>
  );
};

export default memo(TextBox);
