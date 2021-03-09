import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Field, FieldProps, FormikProps, FormikValues, getIn } from 'formik';
import {
  ChangeEvent,
  FC,
  FocusEvent,
  memo,
  SelectHTMLAttributes,
  useEffect,
  useState,
} from 'react';
import styled from 'styled-components';
import useInputValidation from '../hooks/useInputValidation';
import InputWrapper from '../InputWrapper/InputWrapper';
import Label from '../Label/Label';

type SelectSpacing = 'sm' | 'md' | 'lg';

export interface ISelectOption {
  name: string;
  value: string;
}

interface IBaseSelectInput {
  $active: boolean;
  $readOnly: boolean;
}

const BaseSelectInput = styled.select<IBaseSelectInput>`
  ${({ $active, $readOnly }) => `
    appearance: none;
    background: #fff;
    border: none;
    color: ${$active ? '#333' : '#fff'};
    cursor: pointer;
    font-size: 16px;
    outline: 0;
    padding: 16px 0 10px;
    width: 100%;

    ${
      $readOnly
        ? `
      :disabled {
        color: ${$active ? '#333' : '#fff'};
      }
    `
        : `
      :disabled {
        color: ${$active ? '#767676' : '#fff'};
      }
    `
    }
  `}
`;

interface ISelectInput extends SelectHTMLAttributes<HTMLSelectElement> {
  active: boolean;
  describedBy: string;
  errors: boolean;
  readOnly: boolean;
}

const SelectInput: FC<ISelectInput> = ({
  active,
  describedBy,
  errors,
  readOnly,
  ...rest
}) => (
  <BaseSelectInput
    $active={active}
    $readOnly={readOnly}
    aria-describedby={errors ? describedBy : undefined}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest}
  />
);

const IconOuter = styled.div`
  margin-top: -21px;
  pointer-events: none;
  position: absolute;
  right: 38px;
  top: 50%;
  z-index: 1;
`;

const IconInner = styled.div`
  color: #767676;
  cursor: pointer;
  display: block;
  height: 42px;
  line-height: 42px;
  text-align: center;
  width: 42px;
`;

interface IInternalSelect extends FieldProps {
  active: boolean;
  disabled: boolean;
  helpText: string;
  label: string;
  onChange(
    e: ChangeEvent<HTMLSelectElement>,
    form: FormikProps<FormikValues>,
  ): void;
  options: ISelectOption[];
  placeholder: string;
  readOnly: boolean;
  setFocus(focus: boolean): void;
  spacing: SelectSpacing;
}

const InternalSelect: FC<IInternalSelect> = ({
  active,
  disabled,
  field,
  form,
  helpText,
  label,
  onChange,
  options,
  readOnly,
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
  const error = useInputValidation(field.name, errors, touched);
  const markAsDisabled = disabled || readOnly;
  const describedBy = `${field.name}-error`;
  const doBlur = (e: FocusEvent<HTMLSelectElement>) => {
    handleBlur(e);

    if (!field.value && field.value !== 0) {
      setFocus(false);
    }

    onBlur(e);
  };
  const doChange = (e: ChangeEvent<HTMLSelectElement>) => {
    handleChange(e);

    if (onChange) {
      onChange(e, form);
    }
  };
  const doFocus = () => {
    if (!field.value && field.value !== 0) {
      setFocus(true);
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
      <SelectInput
        {...props}
        {...rest}
        active={active}
        describedBy={describedBy}
        disabled={markAsDisabled}
        errors={error}
        onBlur={doBlur}
        onChange={doChange}
        onFocus={doFocus}
        readOnly={readOnly}
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
          <FontAwesomeIcon icon={faAngleDown} />
        </IconInner>
      </IconOuter>

      {readOnly && <input type="hidden" {...field} />}
      {/* eslint-enable react/jsx-props-no-spreading */}
    </InputWrapper>
  );
};

export interface ISelectProps {
  disabled?: boolean;
  helpText?: string;
  label: string;
  name: string;
  options: ISelectOption[];
  placeholder: string;
  readOnly?: boolean;
  spacing?: SelectSpacing;
  onChange?(
    e: ChangeEvent<HTMLSelectElement>,
    form: FormikProps<FormikValues>,
  ): void;
}

const Select: FC<ISelectProps> = ({
  disabled = false,
  helpText = null,
  label,
  name,
  onChange,
  options,
  placeholder,
  readOnly = false,
  spacing = 'md',
}) => {
  const [focus, setFocus] = useState();

  return (
    <Field
      id={name}
      component={InternalSelect}
      active={focus}
      disabled={disabled}
      helpText={helpText}
      name={name}
      onChange={onChange}
      options={options}
      placeholder={placeholder}
      readOnly={readOnly}
      setFocus={setFocus}
      label={label}
      spacing={spacing}
    />
  );
};

export default memo(Select);
