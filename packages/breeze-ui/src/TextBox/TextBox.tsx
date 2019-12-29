import { Field, FieldProps } from 'formik';
import React, { FC, memo, useEffect, useState } from 'react';
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

interface IInternalTextBox extends FieldProps {
  active: boolean;
  label: string;
  setFocus(focus: boolean): void;
  spacing: InputSpacing;
}

const InternalTextBox: FC<IInternalTextBox> = ({
  active,
  field,
  form,
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
  const { errors, touched } = form;
  const error = !!touched[field.name] && !!errors[field.name];
  const describedBy = `${field.name}-error`;

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
      spacing={spacing}
      error={error}
      tooltip={() => (
        <Tooltip
          id={describedBy}
          parent={() => <InputAlert message={errors[field.name]} />}
          colour="danger"
          placement="left"
          message={errors[field.name]}
        />
      )}
    >
      <Label htmlFor={field.name} active={active} error={error}>
        {label}
      </Label>

      <BaseTextBox
        active={active}
        aria-describedby={errors[field.name] && describedBy}
        onBlur={doBlur}
        onFocus={doFocus}
        {...rest} // eslint-disable-line react/jsx-props-no-spreading
        {...props} // eslint-disable-line react/jsx-props-no-spreading
      />
    </InputWrapper>
  );
};

export interface ITextBoxProps {
  label: string;
  name: string;
  placeholder?: string;
  spacing?: InputSpacing;
  type?: 'email' | 'password' | 'text';
}

const TextBox: FC<ITextBoxProps> = ({
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
      type={type}
      name={name}
      placeholder={placeholder}
      setFocus={setFocus}
      active={focus}
      label={label}
      spacing={spacing}
    />
  );
};

export default memo(TextBox);
