import { Field, FieldProps, FormikProps, FormikValues, getIn } from 'formik';
import { ChangeEvent, FC } from 'react';
import CheckableInput from '../CheckableInput/CheckableInput';
import useInputValidation from '../hooks/useInputValidation';
import FieldSet from '../FieldSet/FieldSet';
import Legend from '../Legend/Legend';
import OptionLabel from '../OptionLabel/OptionLabel';
import OptionLabelText from '../OptionLabelText/OptionLabelText';

type RadioSpacing = 'sm' | 'md' | 'lg';

export interface IRadioOption {
  name: string;
  value: string;
}

interface IInternalRadio extends FieldProps {
  disabled: boolean;
  helpText: string;
  label: string;
  options: IRadioOption[];
  readOnly: boolean;
  spacing: RadioSpacing;
  onChange(
    e: ChangeEvent<HTMLInputElement>,
    form: FormikProps<FormikValues>,
  ): void;
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

    setFieldValue(field.name, value).catch(() => {});

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
          <CheckableInput
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...field}
            checked={field.value === value}
            disabled={markAsDisabled}
            readOnly={readOnly}
            type="radio"
            value={value}
            onChange={(e) => doChange(e, value)}
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
  onChange,
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

export default Radio;
