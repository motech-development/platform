import {
  Button,
  FormActions,
  FormSection,
  Grid,
  NumberField,
  RadioGroup,
  Select,
  TextField,
} from '@motech-development/breeze-ui';
import { useForm } from '@tanstack/react-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import {
  type CompanyEnrolment,
  type CompanyEnrolmentDraft,
  vatSettingsSchema,
  yearEndSchema,
} from './company';
import { validationMessage, visibleErrors } from './form-errors';

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

export type CompanySetupDraftValues = Pick<CompanyEnrolmentDraft, 'yearEnd'> & {
  balance: {
    balance: number | null;
    vat: { owed: number | null; paid: number | null };
  };
  vat: Omit<CompanyEnrolmentDraft['vat'], 'charge' | 'pay'> & {
    charge: number | null;
    pay: number | null;
  };
};

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function CompanySetupForm({
  initialValues,
  onBack,
  onCancel,
  onDirty,
  onSubmit,
}: Readonly<{
  initialValues: CompanySetupDraftValues;
  onBack: (value: CompanySetupDraftValues) => void;
  onCancel: () => void;
  onDirty: () => void;
  onSubmit: (value: CompanySetupValues) => Promise<void>;
}>) {
  const { t } = useTranslation('companies');
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
      onMount: setupSchema,
    },
  });
  const percentageField = (name: 'vat.charge' | 'vat.pay', label: string) => (
    <form.Field name={name}>
      {(field) => {
        const errors = visibleErrors(
          field.state.meta.errors,
          field.state.meta.isTouched,
          form.state.submissionAttempts,
        );

        return (
          <NumberField.Root
            formatOptions={{ style: 'percent' }}
            invalid={errors.length > 0}
            min={0}
            onChange={(value) => {
              field.handleChange(value === null ? null : value * 100);
              onDirty();
            }}
            required
            step={0.01}
            value={field.state.value === null ? null : field.state.value / 100}
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
  const moneyField = (
    name: 'balance.balance' | 'balance.vat.owed' | 'balance.vat.paid',
    label: string,
  ) => (
    <form.Field name={name}>
      {(field) => {
        const errors = visibleErrors(
          field.state.meta.errors,
          field.state.meta.isTouched,
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
      <FormSection
        description={t('How VAT is applied to transactions.')}
        divided
        headingLevel={3}
        layout="stacked"
        title={t('VAT settings')}
      >
        <form.Field name="vat.scheme">
          {(field) => {
            const errors = visibleErrors(
              field.state.meta.errors,
              field.state.meta.isTouched,
              form.state.submissionAttempts,
            );

            return (
              <RadioGroup.Root
                invalid={errors.length > 0}
                onSelectionChange={(value) => {
                  field.handleChange(
                    value as CompanySetupDraftValues['vat']['scheme'],
                  );
                  onDirty();
                }}
                orientation="horizontal"
                selection={field.state.value}
              >
                <RadioGroup.Label>{t('VAT scheme')}</RadioGroup.Label>
                {(['none', 'standard', 'flatRate'] as const).map((value) => (
                  <RadioGroup.Item key={value} value={value}>
                    <RadioGroup.Control>
                      <RadioGroup.Indicator />
                      <RadioGroup.ItemLabel>
                        {schemeLabels[value]}
                      </RadioGroup.ItemLabel>
                    </RadioGroup.Control>
                  </RadioGroup.Item>
                ))}
                <RadioGroup.Error>{validationMessage(errors)}</RadioGroup.Error>
              </RadioGroup.Root>
            );
          }}
        </form.Field>
        <Grid columns={{ base: 1, sm: 2 }}>
          <form.Field name="vat.registration">
            {(field) => {
              const errors = visibleErrors(
                field.state.meta.errors,
                field.state.meta.isTouched,
                form.state.submissionAttempts,
              );

              return (
                <TextField.Root
                  invalid={errors.length > 0}
                  onChange={(value) => {
                    field.handleChange(value.toUpperCase().replace(/\s/gu, ''));
                    onDirty();
                  }}
                  value={field.state.value}
                >
                  <TextField.Label>{t('VAT registration')}</TextField.Label>
                  <TextField.Input onBlur={field.handleBlur} />
                  <TextField.Error>{validationMessage(errors)}</TextField.Error>
                </TextField.Root>
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
        <Grid columns={{ base: 1, sm: 2 }}>
          <form.Field name="yearEnd.day">
            {(field) => (
              <Select.Root
                onChange={(value) => {
                  field.handleChange(Number(value));
                  onDirty();
                }}
                value={field.state.value.toString()}
              >
                <Select.Label>{t('Day')}</Select.Label>
                <Select.Trigger>
                  <Select.Value />
                </Select.Trigger>
                <Select.Popover>
                  <Select.ListBox>
                    {Array.from({ length: 31 }, (_, index) => index + 1).map(
                      (day) => (
                        <Select.Item
                          id={day.toString()}
                          key={day}
                          textValue={day.toString()}
                        >
                          {day}
                        </Select.Item>
                      ),
                    )}
                  </Select.ListBox>
                </Select.Popover>
              </Select.Root>
            )}
          </form.Field>
          <form.Field name="yearEnd.month">
            {(field) => (
              <Select.Root
                onChange={(value) => {
                  field.handleChange(Number(value));
                  onDirty();
                }}
                value={field.state.value.toString()}
              >
                <Select.Label>{t('Month')}</Select.Label>
                <Select.Trigger>
                  <Select.Value />
                </Select.Trigger>
                <Select.Popover>
                  <Select.ListBox>
                    {months.map((month, index) => (
                      <Select.Item
                        id={index.toString()}
                        key={month}
                        textValue={t(month)}
                      >
                        {t(month)}
                      </Select.Item>
                    ))}
                  </Select.ListBox>
                </Select.Popover>
              </Select.Root>
            )}
          </form.Field>
        </Grid>
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
        selector={(state) => [state.canSubmit, state.isSubmitting] as const}
      >
        {([canSubmit, isSubmitting]) => (
          <FormActions
            back={
              <Button
                appearance="outline"
                onAction={() => onBack(form.state.values)}
              >
                {t('Back')}
              </Button>
            }
            cancel={
              <Button appearance="outline" onAction={onCancel}>
                {t('Cancel')}
              </Button>
            }
            divided
            primary={
              <Button
                disabled={!canSubmit || isSubmitting}
                loading={isSubmitting}
                type="submit"
              >
                {t('Save company')}
              </Button>
            }
          />
        )}
      </form.Subscribe>
    </form>
  );
}
