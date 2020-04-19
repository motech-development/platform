import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Field, FieldProps, getIn } from 'formik';
import React, {
  FC,
  FocusEvent,
  HTMLAttributes,
  memo,
  useEffect,
  useState,
} from 'react';
import styled from 'styled-components';
import InputAlert from '../InputAlert/InputAlert';
import InputWrapper from '../InputWrapper/InputWrapper';
import Label from '../Label/Label';
import Tooltip from '../Tooltip/Tooltip';

type SelectSpacing = 'sm' | 'md' | 'lg';

export interface ISelectOptions {
  name: string;
  value: string;
}

interface IBaseSelectInput {
  active: boolean;
}

const BaseSelectInput = styled.select<IBaseSelectInput>`
  ${({ active }) => `
    appearance: none;
    background: #fff;
    border: none;
    color: ${active ? '#333' : '#fff'};
    cursor: pointer;
    font-size: 16px;
    outline: 0;
    padding: 16px 0 10px;
    width: 100%;
  `}
`;

interface ISelectInput extends HTMLAttributes<HTMLSelectElement> {
  active: boolean;
  describedBy: string;
  errors: boolean;
}

const SelectInput: FC<ISelectInput> = ({
  active,
  describedBy,
  errors,
  ...rest
}) => (
  <BaseSelectInput
    active={active}
    aria-describedby={errors ? describedBy : undefined}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest}
  />
);

const IconOuter = styled.div`
  margin-top: -11px;
  pointer-events: none;
  position: absolute;
  right: 38px;
  top: 50%;
  z-index: 1;
`;

const IconInner = styled.div`
  color: #aaa;
  cursor: pointer;
  display: block;
  height: 22px;
  line-height: 22px;
  text-align: center;
  width: 22px;
`;

interface IInternalSelect extends FieldProps {
  active: boolean;
  helpText: string;
  label: string;
  options: ISelectOptions[];
  placeholder: string;
  setFocus(focus: boolean): void;
  spacing: SelectSpacing;
}

const InternalSelect: FC<IInternalSelect> = ({
  active,
  field,
  form,
  helpText,
  label,
  options,
  placeholder,
  setFocus,
  spacing,
  ...props
}) => {
  useEffect(() => {
    const focus = !!field.value || field.value === 0;

    setFocus(focus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { onBlur, ...rest } = field;
  const { errors, handleBlur, handleChange, touched } = form;
  const describedBy = `${field.name}-error`;
  const [error, setError] = useState(false);
  const doBlur = (e: FocusEvent<HTMLSelectElement>) => {
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
      <SelectInput
        {...props}
        {...rest}
        active={active}
        describedBy={describedBy}
        errors={error}
        onBlur={doBlur}
        onChange={handleChange}
        onFocus={doFocus}
      >
        <option disabled value="">
          {placeholder}
        </option>
        {options.map(({ name, value }) => (
          <option key={value} value={value}>
            {name}
          </option>
        ))}
      </SelectInput>

      <IconOuter>
        <IconInner>
          <FontAwesomeIcon icon={faChevronDown} />
        </IconInner>
      </IconOuter>
      {/* eslint-enable react/jsx-props-no-spreading */}
    </InputWrapper>
  );
};

export interface ISelectProps {
  helpText?: string;
  label: string;
  name: string;
  options: ISelectOptions[];
  placeholder: string;
  spacing?: SelectSpacing;
}

const Select: FC<ISelectProps> = ({
  helpText = null,
  label,
  name,
  options,
  placeholder,
  spacing = 'md',
}) => {
  const [focus, setFocus] = useState();

  return (
    <Field
      id={name}
      component={InternalSelect}
      active={focus}
      helpText={helpText}
      name={name}
      options={options}
      placeholder={placeholder}
      setFocus={setFocus}
      label={label}
      spacing={spacing}
    />
  );
};

export default memo(Select);
