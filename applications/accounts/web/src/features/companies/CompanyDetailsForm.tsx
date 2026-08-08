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
import { validationMessage, visibleValidationErrors } from '../form-errors';
import {
  type CompanyDetails,
  companyDetailsSchema,
  formatSortCode,
  type NormalisedCompanyDetails,
} from './company';

function CompanyTextField({
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
  inputMode?: 'email' | 'numeric' | 'tel' | 'text';
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
      onMount: companyDetailsSchema,
    },
  });
  const field = (
    name:
      | 'address.line1'
      | 'address.line2'
      | 'address.line3'
      | 'address.line4'
      | 'address.line5'
      | 'bank.accountNumber'
      | 'bank.sortCode'
      | 'companyNumber'
      | 'contact.email'
      | 'contact.telephone'
      | 'name',
    label: string,
    options: {
      inputMode?: 'email' | 'numeric' | 'tel' | 'text';
      normalise?: (value: string) => string;
      required?: boolean;
      type?: 'email' | 'tel' | 'text';
    } = {},
  ) => (
    <form.Field key={name} name={name}>
      {(formField) => {
        const errors = visibleValidationErrors(
          formField.state.meta.errors,
          formField.state.meta.isTouched,
          form.state.submissionAttempts,
        );

        return (
          <CompanyTextField
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
      <FormSection
        description={t('The registered company identity.')}
        divided
        headingLevel={layout === 'stacked' ? 3 : 2}
        layout={layout}
        title={t(layout === 'stacked' ? 'Company details' : 'Identity')}
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
      <FormSection
        description={t('The registered company address.')}
        divided
        headingLevel={layout === 'stacked' ? 3 : 2}
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
      <FormSection
        description={t('Primary company contact details.')}
        divided
        headingLevel={layout === 'stacked' ? 3 : 2}
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
      {layout === 'split' ? bankSection : null}
      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting] as const}
      >
        {([canSubmit, isSubmitting]) => (
          <FormActions
            cancel={
              onCancel ? (
                <Button appearance="outline" onAction={onCancel}>
                  {t('Cancel')}
                </Button>
              ) : undefined
            }
            danger={danger}
            divided
            primary={
              <Button
                disabled={!canSubmit || isSubmitting}
                loading={isSubmitting}
                type="submit"
              >
                {submitLabel}
              </Button>
            }
          />
        )}
      </form.Subscribe>
    </form>
  );
}
