import {
  Button,
  FormActions,
  FormSection,
} from '@motech-development/breeze-ui';
import { useForm } from '@tanstack/react-form';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  schemaFieldErrors,
  schemaValuesValid,
  visibleValidationErrors,
} from '../form-errors';
import {
  AddressDetailsFormSection,
  BoundDetailsTextField,
  ContactDetailsFormSection,
  type DetailsFieldOptions,
  type EntityDetailsFieldName,
} from '../forms/EntityDetailsFormSections';
import { SubmittingForm } from '../forms/SubmittingForm';
import { type ClientDetails, clientDetailsSchema } from './client';

type ClientFieldName = EntityDetailsFieldName | 'name';

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
    options: DetailsFieldOptions = {},
  ) => (
    <form.Field key={name} name={name}>
      {(formField) => {
        const errors = visibleValidationErrors(
          schemaFieldErrors(clientDetailsSchema, form.state.values, name),
          formField.state.meta.isBlurred,
          form.state.submissionAttempts,
        );

        return (
          <BoundDetailsTextField
            binding={formField}
            errors={errors}
            label={label}
            onDirty={onDirty}
            options={options}
          />
        );
      }}
    </form.Field>
  );

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(submissionPending) => (
        <SubmittingForm
          className="grid min-h-full gap-6"
          onSubmit={() => form.handleSubmit()}
          submissionPending={submissionPending}
        >
          <FormSection
            description={t('The name used on sales transactions.')}
            divided
            headingLevel={3}
            layout="stacked"
            title={t('Client details')}
          >
            {field('name', t('Client name'), { required: true })}
          </FormSection>
          <ContactDetailsFormSection
            description={t('How to contact this client.')}
            field={field}
            headingLevel={3}
            layout="stacked"
            namespace="clients"
          />
          <AddressDetailsFormSection
            description={t('The client’s postal address.')}
            field={field}
            headingLevel={3}
            layout="stacked"
            namespace="clients"
          />
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
        </SubmittingForm>
      )}
    </form.Subscribe>
  );
}
