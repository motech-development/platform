import {
  Button,
  FormActions,
  FormSection,
  Grid,
  NumberField,
} from '@motech-development/breeze-ui';
import { useForm } from '@tanstack/react-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import {
  schemaFieldErrors,
  schemaValuesValid,
  validationMessage,
  visibleValidationErrors,
} from '../form-errors';
import {
  type CompanyEnrolment,
  type CompanyEnrolmentDraft,
  formatVatRegistrationInput,
  vatSettingsSchema,
  yearEndSchema,
} from './company';
import {
  PercentageField,
  VatRegistrationField,
  VatSchemeField,
  YearEndFields,
} from './CompanyConfigurationFields';
import { monthNames } from './month-names';

const setupSchema = z.object({
  balance: z.object({
    balance: z.number(),
    vat: z.object({ owed: z.number(), paid: z.number() }),
  }),
  vat: vatSettingsSchema,
  yearEnd: yearEndSchema,
});

export type CompanySetupValues = Pick<
  CompanyEnrolment,
  'balance' | 'vat' | 'yearEnd'
>;

export type CompanySetupDraftValues = {
  balance: {
    balance: number | null;
    vat: { owed: number | null; paid: number | null };
  };
  vat: Omit<CompanyEnrolmentDraft['vat'], 'charge' | 'pay'> & {
    charge: number | null;
    pay: number | null;
  };
  yearEnd: Omit<CompanyEnrolmentDraft['yearEnd'], 'day'> & {
    day: number | null;
  };
};

export function CompanySetupForm({
  initialValues,
  onBack,
  onCancel,
  onDirty,
  onSubmit,
  submitDisabled = false,
}: Readonly<{
  initialValues: CompanySetupDraftValues;
  onBack: (value: CompanySetupDraftValues) => void;
  onCancel: () => void;
  onDirty: () => void;
  onSubmit: (value: CompanySetupValues) => Promise<void>;
  submitDisabled?: boolean;
}>) {
  const { i18n, t } = useTranslation('companies');
  const months = monthNames(i18n.resolvedLanguage ?? i18n.language);
  const schemeLabels = {
    flatRate: t('Flat rate'),
    none: t('None'),
    standard: t('Standard'),
  };
  const form = useForm({
    defaultValues: initialValues,
    onSubmit: async ({ value }) => onSubmit(setupSchema.parse(value)),
    validators: {
      onBlur: setupSchema,
      onChange: setupSchema,
    },
  });
  const percentageField = (name: 'vat.charge' | 'vat.pay', label: string) => (
    <form.Field name={name}>
      {(field) => {
        const errors = visibleValidationErrors(
          schemaFieldErrors(setupSchema, form.state.values, name),
          field.state.meta.isBlurred,
          form.state.submissionAttempts,
        );

        return (
          <PercentageField
            error={validationMessage(errors)}
            invalid={errors.length > 0}
            label={label}
            onBlur={field.handleBlur}
            onChange={(value) => {
              field.handleChange(value);
              onDirty();
            }}
            value={field.state.value}
          />
        );
      }}
    </form.Field>
  );
  const moneyField = (
    name: 'balance.balance' | 'balance.vat.owed' | 'balance.vat.paid',
    label: string,
  ) => (
    <form.Field name={name}>
      {(field) => {
        const errors = visibleValidationErrors(
          schemaFieldErrors(setupSchema, form.state.values, name),
          field.state.meta.isBlurred,
          form.state.submissionAttempts,
        );

        return (
          <NumberField.Root
            formatOptions={{ currency: 'GBP', style: 'currency' }}
            invalid={errors.length > 0}
            onChange={(value) => {
              field.handleChange(value);
              onDirty();
            }}
            required
            step={0.01}
            value={field.state.value}
          >
            <NumberField.Label>{label}</NumberField.Label>
            <NumberField.Group>
              <NumberField.Input onBlur={field.handleBlur} />
            </NumberField.Group>
            <NumberField.Error>{validationMessage(errors)}</NumberField.Error>
          </NumberField.Root>
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
              description={t('How VAT is applied to transactions.')}
              divided
              headingLevel={3}
              layout="stacked"
              title={t('VAT settings')}
            >
              <form.Field name="vat.scheme">
                {(field) => {
                  const errors = visibleValidationErrors(
                    schemaFieldErrors(
                      setupSchema,
                      form.state.values,
                      'vat.scheme',
                    ),
                    field.state.meta.isBlurred,
                    form.state.submissionAttempts,
                  );

                  return (
                    <VatSchemeField
                      error={validationMessage(errors)}
                      invalid={errors.length > 0}
                      label={t('VAT scheme')}
                      labels={schemeLabels}
                      onChange={(value) => {
                        field.handleChange(value);
                        onDirty();
                      }}
                      selection={field.state.value}
                    />
                  );
                }}
              </form.Field>
              <Grid columns={{ base: 1, sm: 2 }}>
                <form.Field name="vat.registration">
                  {(field) => {
                    const errors = visibleValidationErrors(
                      schemaFieldErrors(
                        setupSchema,
                        form.state.values,
                        'vat.registration',
                      ),
                      field.state.meta.isBlurred,
                      form.state.submissionAttempts,
                    );

                    return (
                      <VatRegistrationField
                        error={validationMessage(errors)}
                        invalid={errors.length > 0}
                        label={t('VAT registration')}
                        onBlur={field.handleBlur}
                        onChange={(value) => {
                          field.handleChange(formatVatRegistrationInput(value));
                          onDirty();
                        }}
                        value={field.state.value}
                      />
                    );
                  }}
                </form.Field>
                {percentageField('vat.charge', t('Charge rate'))}
                {percentageField('vat.pay', t('Pay rate'))}
              </Grid>
            </FormSection>
            <FormSection
              description={t('Used for annual reports.')}
              divided
              headingLevel={3}
              layout="stacked"
              title={t('Financial year end')}
            >
              <form.Field name="yearEnd.day">
                {(dayField) => (
                  <form.Field name="yearEnd.month">
                    {(monthField) => {
                      const errors = visibleValidationErrors(
                        schemaFieldErrors(
                          setupSchema,
                          form.state.values,
                          'yearEnd.day',
                        ),
                        dayField.state.meta.isBlurred,
                        form.state.submissionAttempts,
                      );

                      return (
                        <YearEndFields
                          day={dayField.state.value}
                          dayError={validationMessage(errors)}
                          dayInvalid={errors.length > 0}
                          dayLabel={t('Day')}
                          month={monthField.state.value}
                          monthLabel={t('Month')}
                          months={months}
                          onDayBlur={dayField.handleBlur}
                          onDayChange={(value) => {
                            dayField.handleChange(value);
                            onDirty();
                          }}
                          onMonthChange={(value) => {
                            monthField.handleChange(value);
                            dayField.handleBlur();
                            onDirty();
                          }}
                        />
                      );
                    }}
                  </form.Field>
                )}
              </form.Field>
            </FormSection>
            <FormSection
              description={t('Starting values used by the account balance.')}
              divided
              headingLevel={3}
              layout="stacked"
              title={t('Opening accounts')}
            >
              <Grid columns={{ base: 1, sm: 2 }}>
                {moneyField('balance.balance', t('Opening balance'))}
                {moneyField('balance.vat.owed', t('VAT owed'))}
                {moneyField('balance.vat.paid', t('VAT paid'))}
              </Grid>
            </FormSection>
            <form.Subscribe
              selector={(state) =>
                [
                  schemaValuesValid(setupSchema, state.values),
                  state.isSubmitting,
                ] as const
              }
            >
              {([valuesValid, isSubmitting]) => (
                <FormActions
                  back={
                    <Button
                      appearance="outline"
                      disabled={isSubmitting}
                      onAction={() => onBack(form.state.values)}
                    >
                      {t('Back')}
                    </Button>
                  }
                  cancel={
                    <Button
                      appearance="outline"
                      disabled={isSubmitting}
                      onAction={onCancel}
                    >
                      {t('Cancel')}
                    </Button>
                  }
                  primary={
                    <Button
                      disabled={!valuesValid || isSubmitting || submitDisabled}
                      loading={isSubmitting}
                      type="submit"
                    >
                      {t('Save company')}
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
