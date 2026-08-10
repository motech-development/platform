import {
  Button,
  FormActions,
  FormSection,
  Grid,
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
} from '../forms/ContactDetailsFormSections';
import {
  type CompanyDetails,
  companyDetailsSchema,
  formatSortCode,
  type NormalisedCompanyDetails,
} from './company';

type CompanyDetailsFieldName =
  | EntityDetailsFieldName
  | 'bank.accountNumber'
  | 'bank.sortCode'
  | 'companyNumber'
  | 'name';

export function CompanyDetailsForm({
  danger,
  initialValues,
  layout = 'split',
  onCancel,
  onDirty,
  onSubmit,
  submitLabel,
}: Readonly<{
  danger?: ReactNode;
  initialValues: CompanyDetails;
  layout?: 'split' | 'stacked';
  onCancel?: () => void;
  onDirty: () => void;
  onSubmit: (value: NormalisedCompanyDetails) => Promise<void>;
  submitLabel: string;
}>) {
  const { t } = useTranslation('companies');
  const form = useForm({
    defaultValues: initialValues,
    onSubmit: async ({ value }) => onSubmit(companyDetailsSchema.parse(value)),
    validators: {
      onBlur: companyDetailsSchema,
      onChange: companyDetailsSchema,
    },
  });
  const field = (
    name: CompanyDetailsFieldName,
    label: string,
    options: DetailsFieldOptions = {},
  ) => (
    <form.Field key={name} name={name}>
      {(formField) => {
        const errors = visibleValidationErrors(
          schemaFieldErrors(companyDetailsSchema, form.state.values, name),
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
  const bankSection = (
    <FormSection
      description={t('Used to match transactions.')}
      divided
      headingLevel={layout === 'stacked' ? 3 : 2}
      layout={layout}
      title={t('Bank account')}
    >
      <Grid columns={{ base: 1, sm: 2 }}>
        {field('bank.accountNumber', t('Account number'), {
          inputMode: 'numeric',
          normalise: (value) => value.replace(/\D/gu, '').slice(0, 8),
          required: true,
        })}
        {field('bank.sortCode', t('Sort code'), {
          inputMode: 'numeric',
          normalise: formatSortCode,
          required: true,
        })}
      </Grid>
    </FormSection>
  );

  return (
    <form
      className="grid min-w-0 gap-6"
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
              description={t('The registered company identity.')}
              divided
              headingLevel={layout === 'stacked' ? 3 : 2}
              layout={layout}
              title={t('Company details')}
            >
              <Grid columns={{ base: 1, sm: 2 }}>
                {field('name', t('Company name'), { required: true })}
                {field('companyNumber', t('Company number'), {
                  inputMode: 'numeric',
                  normalise: (value) => value.replace(/\D/gu, '').slice(0, 8),
                  required: true,
                })}
              </Grid>
            </FormSection>
            {layout === 'stacked' ? bankSection : null}
            <AddressDetailsFormSection
              description={t('The registered company address.')}
              field={field}
              headingLevel={layout === 'stacked' ? 3 : 2}
              layout={layout}
              namespace="companies"
            />
            <ContactDetailsFormSection
              description={t('Primary company contact details.')}
              field={field}
              headingLevel={layout === 'stacked' ? 3 : 2}
              layout={layout}
              namespace="companies"
            />
            {layout === 'split' ? bankSection : null}
            <form.Subscribe
              selector={(state) =>
                [
                  schemaValuesValid(companyDetailsSchema, state.values),
                  state.isSubmitting,
                ] as const
              }
            >
              {([valuesValid, isSubmitting]) => (
                <FormActions
                  cancel={
                    onCancel ? (
                      <Button appearance="outline" onAction={onCancel}>
                        {t('Cancel')}
                      </Button>
                    ) : undefined
                  }
                  danger={danger}
                  divided={layout === 'split'}
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
