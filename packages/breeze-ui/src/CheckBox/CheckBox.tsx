import { Field, FieldProps, FormikProps, FormikValues, getIn } from 'formik';
import { ChangeEvent, FC, memo } from 'react';
import CheckableInput from '../CheckableInput/CheckableInput';
import useInputValidation from '../hooks/useInputValidation';
import FieldSet from '../FieldSet/FieldSet';
import Legend from '../Legend/Legend';
import OptionLabel from '../OptionLabel/OptionLabel';
import OptionLabelText from '../OptionLabelText/OptionLabelText';

type CheckBoxSpacing = 'sm' | 'md' | 'lg';

interface IInternalCheckBox extends FieldProps {
  disabled: boolean;
  helpText: string;
  label: string;
  legend: string;
  readOnly: boolean;
  spacing: CheckBoxSpacing;
  onChange(
    e: ChangeEvent<HTMLInputElement>,
    form: FormikProps<FormikValues>,
  ): void;
}

const InternalCheckBox: FC<IInternalCheckBox> = ({
  disabled,
  field,
  form,
  helpText,
  label,
  legend,
  onChange,
  readOnly,
  spacing,
}) => {
  const { errors, handleChange, touched } = form;
  const error = useInputValidation(field.name, errors, touched);
  const markAsDisabled = disabled || readOnly;
  const doChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleChange(e);

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
      <Legend error={error}>{legend}</Legend>

      <OptionLabel disabled={disabled} selected={field.value}>
        <CheckableInput
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...field}
          checked={field.value}
          disabled={markAsDisabled}
          readOnly={readOnly}
          type="checkbox"
          onChange={doChange}
        />

        <OptionLabelText>{label}</OptionLabelText>
      </OptionLabel>

      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      {readOnly && <input type="hidden" {...field} />}
    </FieldSet>
  );
};

export interface ICheckBoxProps {
  disabled?: boolean;
  helpText?: string;
  label: string;
  legend: string;
  name: string;
  readOnly?: boolean;
  spacing?: CheckBoxSpacing;
  onChange?(
    e: ChangeEvent<HTMLInputElement>,
    form: FormikProps<FormikValues>,
  ): void;
}

const CheckBox: FC<ICheckBoxProps> = ({
  disabled = false,
  helpText = null,
  label,
  legend,
  name,
  onChange = undefined,
  readOnly = false,
  spacing = 'md',
}) => (
  <Field
    id={name}
    component={InternalCheckBox}
    disabled={disabled}
    helpText={helpText}
    label={label}
    legend={legend}
    name={name}
    onChange={onChange}
    readOnly={readOnly}
    spacing={spacing}
  />
);

export default memo(CheckBox);
