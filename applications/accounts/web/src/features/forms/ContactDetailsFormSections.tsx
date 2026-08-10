import { FormSection, Grid, TextField } from '@motech-development/breeze-ui';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { validationMessage } from '../form-errors';

export type EntityDetailsFieldName =
  | 'address.line1'
  | 'address.line2'
  | 'address.line3'
  | 'address.line4'
  | 'address.line5'
  | 'contact.email'
  | 'contact.telephone';

export interface DetailsFieldOptions {
  inputMode?: 'email' | 'numeric' | 'tel' | 'text';
  normalise?: (value: string) => string;
  required?: boolean;
  type?: 'email' | 'tel' | 'text';
}

export type DetailsFieldRenderer = (
  name: EntityDetailsFieldName,
  label: string,
  options?: DetailsFieldOptions,
) => ReactNode;

interface TextFieldBinding {
  handleBlur: () => void;
  handleChange: (value: string) => void;
  state: { value: string };
}

export function BoundDetailsTextField({
  binding,
  errors,
  label,
  onDirty,
  options = {},
}: Readonly<{
  binding: TextFieldBinding;
  errors: readonly unknown[];
  label: string;
  onDirty: () => void;
  options?: DetailsFieldOptions;
}>) {
  return (
    <TextField.Root
      invalid={errors.length > 0}
      onChange={(value) => {
        binding.handleChange(options.normalise?.(value) ?? value);
        onDirty();
      }}
      required={options.required}
      value={binding.state.value}
    >
      <TextField.Label>{label}</TextField.Label>
      <TextField.Input
        inputMode={options.inputMode}
        onBlur={binding.handleBlur}
        type={options.type}
      />
      <TextField.Error>{validationMessage(errors)}</TextField.Error>
    </TextField.Root>
  );
}

interface SectionProps {
  description: string;
  field: DetailsFieldRenderer;
  headingLevel: 2 | 3;
  layout: 'split' | 'stacked';
  namespace: 'clients' | 'companies';
}

export function AddressDetailsFormSection({
  description,
  field,
  headingLevel,
  layout,
  namespace,
}: Readonly<SectionProps>) {
  const { t } = useTranslation(namespace);

  return (
    <FormSection
      description={description}
      divided
      headingLevel={headingLevel}
      layout={layout}
      title={t('Address')}
    >
      <Grid columns={{ base: 1, sm: 2 }}>
        {field('address.line1', t('Address line 1'), { required: true })}
        {field('address.line2', t('Address line 2'))}
        {field('address.line3', t('Town or city'), { required: true })}
        {field('address.line4', t('County'))}
        {field('address.line5', t('Postcode'), {
          normalise: (value) => value.toUpperCase(),
          required: true,
        })}
      </Grid>
    </FormSection>
  );
}

export function ContactDetailsFormSection({
  description,
  field,
  headingLevel,
  layout,
  namespace,
}: Readonly<SectionProps>) {
  const { t } = useTranslation(namespace);

  return (
    <FormSection
      description={description}
      divided
      headingLevel={headingLevel}
      layout={layout}
      title={t('Contact details')}
    >
      <Grid columns={{ base: 1, sm: 2 }}>
        {field('contact.email', t('Email address'), {
          inputMode: 'email',
          required: true,
          type: 'email',
        })}
        {field('contact.telephone', t('Telephone number'), {
          inputMode: 'tel',
          required: true,
          type: 'tel',
        })}
      </Grid>
    </FormSection>
  );
}
