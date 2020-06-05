import { Field, FieldProps, FormikProps, FormikValues, getIn } from 'formik';
import React, { ChangeEvent, FC, memo, useEffect, useState } from 'react';
import styled from 'styled-components';
import Button from '../Button/Button';
import useInputValidation from '../hooks/useInputValidation';
import InputWrapper from '../InputWrapper/InputWrapper';
import Label from '../Label/Label';
import LikeInput from '../LikeInput/LikeInput';

export type FileUploadSpacing = 'sm' | 'md' | 'lg';

interface IUploadInput {
  $active: boolean;
}

const UploadInput = styled.input<IUploadInput>`
  ${({ $active }) => `
    cursor: ${$active ? 'text' : 'pointer'};
    height: 44px;
    left: 0;
    opacity: 0;
    position: absolute;
    top: 0;
    width: 100%;
  `}
`;

const InnerFileUpload = styled.div`
  display: flex;
`;

const UploadButton = styled(Button)`
  height: 44px;
`;

const InputContainer = styled.div`
  flex-grow: 1;
  position: relative;
`;

interface IInternalFileUpload extends FieldProps {
  accept: string;
  buttonText: string;
  disabled: boolean;
  helpText: string;
  label: string;
  loading: boolean;
  spacing: FileUploadSpacing;
  onSelect(file: File, form: FormikProps<FormikValues>): void | Promise<void>;
}

const InternalFileUpload: FC<IInternalFileUpload> = ({
  accept,
  buttonText,
  disabled,
  field,
  form,
  helpText,
  label,
  loading,
  onSelect,
  spacing,
}) => {
  const [active, setActive] = useState(false);
  const { errors, touched } = form;
  const { name } = field;
  const [fileName, setFileName] = useState('');
  const error = useInputValidation(name, errors, touched);
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      setFileName(file.name);

      form.setFieldTouched(name, true);

      (async () => onSelect(file, form))();
    }
  };
  const onClick = () => {
    const input = document.getElementById(name) as HTMLInputElement;

    input.click();
  };

  useEffect(() => {
    setActive(!!fileName);
  }, [fileName]);

  return (
    <InputWrapper
      error={error}
      helpText={helpText}
      message={getIn(errors, name)}
      name={name}
      spacing={spacing}
    >
      <InnerFileUpload>
        <InputContainer>
          <Label htmlFor={name} active={active} error={error}>
            {label}
          </Label>

          <LikeInput $disabled={disabled}>{fileName}</LikeInput>

          <UploadInput
            $active={active}
            id={name}
            disabled={disabled}
            type="file"
            accept={accept}
            onChange={onChange}
          />

          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <input {...field} type="hidden" disabled={disabled} />
        </InputContainer>

        <UploadButton
          colour="secondary"
          disabled={disabled}
          loading={loading}
          onClick={onClick}
        >
          {buttonText}
        </UploadButton>
      </InnerFileUpload>
    </InputWrapper>
  );
};

export interface IFileUploadProps {
  accept?: string;
  buttonText: string;
  disabled?: boolean;
  helpText?: string;
  label: string;
  loading?: boolean;
  name: string;
  spacing?: FileUploadSpacing;
  onSelect(file: File, form: FormikProps<FormikValues>): void | Promise<void>;
}

const FileUpload: FC<IFileUploadProps> = ({
  accept = undefined,
  buttonText,
  disabled = false,
  helpText = undefined,
  label,
  loading = false,
  name,
  onSelect,
  spacing = 'md',
}) => (
  <Field
    component={InternalFileUpload}
    accept={accept}
    buttonText={buttonText}
    disabled={disabled}
    helpText={helpText}
    label={label}
    loading={loading}
    name={name}
    onSelect={onSelect}
    spacing={spacing}
  />
);

export default memo(FileUpload);
