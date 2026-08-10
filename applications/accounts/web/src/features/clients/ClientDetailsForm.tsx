import {
  Button,
  FormActions,
  FormSection,
  Grid,
  TextField,
} from '@motech-development/breeze-ui';
import { useForm } from '@tanstack/react-form';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  schemaFieldErrors,
  schemaValuesValid,
  validationMessage,
  visibleValidationErrors,
} from '../form-errors';
import { type ClientDetails, clientDetailsSchema } from './client';

type ClientFieldName =
  | 'address.line1'
  | 'address.line2'
  | 'address.line3'
  | 'address.line4'
  | 'address.line5'
  | 'contact.email'
  | 'contact.telephone'
  | 'name';

function ClientTextField({
  errors,
  inputMode,
  label,
  onBlur,
  onChange,
  required = false,
  type = 'text',
  value,
}: Readonly<{
  errors: readonly unknown[];
  inputMode?: 'email' | 'tel' | 'text';
  label: string;
  onBlur: () => void;
  onChange: (value: string) => void;
  required?: boolean;
  type?: 'email' | 'tel' | 'text';
  value: string;
}>) {
  return (
    <TextField.Root
      invalid={errors.length > 0}
      onChange={onChange}
      required={required}
      value={value}
    >
      <TextField.Label>{label}</TextField.Label>
      <TextField.Input inputMode={inputMode} onBlur={onBlur} type={type} />
      <TextField.Error>{validationMessage(errors)}</TextField.Error>
    </TextField.Root>
  );
}

export function ClientDetailsForm({
  danger,
  initialValues,
  onCancel,
  onDirty,
  onSubmit,
  submitLabel,
}: Readonly<{
  danger?: ReactNode;
  initialValues: ClientDetails;
  onCancel: () => void;
  onDirty: () => void;
  onSubmit: (value: ClientDetails) => Promise<void>;
  submitLabel: string;
}>) {
  const { t } = useTranslation('clients');
  const form = useForm({
    defaultValues: initialValues,
    onSubmit: async ({ value }) => onSubmit(clientDetailsSchema.parse(value)),
    validators: { onBlur: clientDetailsSchema, onChange: clientDetailsSchema },
  });
  const field = (
    name: ClientFieldName,
    label: string,
    options: {
      inputMode?: 'email' | 'tel' | 'text';
      normalise?: (value: string) => string;
      required?: boolean;
      type?: 'email' | 'tel' | 'text';
    } = {},
  ) => (
    <form.Field key={name} name={name}>
      {(formField) => {
        const errors = visibleValidationErrors(
          schemaFieldErrors(clientDetailsSchema, form.state.values, name),
          formField.state.meta.isBlurred,
          form.state.submissionAttempts,
        );

        return (
          <ClientTextField
            errors={errors}
            inputMode={options.inputMode}
            label={label}
            onBlur={formField.handleBlur}
            onChange={(value) => {
              formField.handleChange(options.normalise?.(value) ?? value);
              onDirty();
            }}
            required={options.required}
            type={options.type}
            value={formField.state.value}
          />
        );
      }}
    </form.Field>
  );

  return (
    <form
      className="grid min-h-full gap-6"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        form.handleSubmit().catch(() => undefined);
      }}
    >
      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(submissionPending) => (
          <fieldset className="contents" disabled={submissionPending}>
            <FormSection
              description={t('The name used on sales transactions.')}
              divided
              headingLevel={3}
              layout="stacked"
              title={t('Client details')}
            >
              {field('name', t('Client name'), { required: true })}
            </FormSection>
            <FormSection
              description={t('How to contact this client.')}
              divided
              headingLevel={3}
              layout="stacked"
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
            <FormSection
              description={t('The client’s postal address.')}
              divided
              headingLevel={3}
              layout="stacked"
              title={t('Address')}
            >
              <Grid columns={{ base: 1, sm: 2 }}>
                {field('address.line1', t('Address line 1'), {
                  required: true,
                })}
                {field('address.line2', t('Address line 2'))}
                {field('address.line3', t('Town or city'), { required: true })}
                {field('address.line4', t('County'))}
                {field('address.line5', t('Postcode'), {
                  normalise: (value) => value.toUpperCase(),
                  required: true,
                })}
              </Grid>
            </FormSection>
            <form.Subscribe
              selector={(state) =>
                [
                  schemaValuesValid(clientDetailsSchema, state.values),
                  state.isSubmitting,
                ] as const
              }
            >
              {([valuesValid, isSubmitting]) => (
                <FormActions
                  cancel={
                    <Button appearance="outline" onAction={onCancel}>
                      {t('Cancel')}
                    </Button>
                  }
                  danger={danger}
                  primary={
                    <Button
                      disabled={!valuesValid || isSubmitting}
                      loading={isSubmitting}
                      type="submit"
                    >
                      {submitLabel}
                    </Button>
                  }
                />
              )}
            </form.Subscribe>
          </fieldset>
        )}
      </form.Subscribe>
    </form>
  );
}
