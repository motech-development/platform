import { useMutation, useQuery } from '@apollo/client/react';
import {
  Button,
  FormActions,
  FormSection,
  Grid,
  IconButton,
  NumberField,
  PageHeader,
  TextField,
  useToast,
} from '@motech-development/breeze-ui';
import { AddIcon, DeleteIcon } from '@motech-development/breeze-ui/icons';
import { useForm } from '@tanstack/react-form';
import { useBlocker, useNavigate } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GET_COMPANY_SETTINGS, UPDATE_SETTINGS } from '../../data/operations';
import {
  schemaFieldErrors,
  schemaValuesValid,
  validationMessage,
  visibleValidationErrors,
} from '../form-errors';
import { SettingsFormSkeleton } from '../loading/AccountsPageSkeletons';
import {
  type CompanySettings,
  formatVatRegistration,
  formatVatRegistrationInput,
  settingsSchema,
} from './company';
import {
  PercentageField,
  VatRegistrationField,
  VatSchemeField,
  YearEndFields,
} from './CompanyConfigurationFields';
import {
  CompanyFormFailureState,
  CompanyFormLoadingState,
} from './CompanyFormQueryState';
import { DiscardChangesDialog } from './DiscardChangesDialog';
import { monthNames } from './month-names';
import { QueryRefreshAlert } from './QueryRefreshAlert';

type SettingsDraft = Omit<CompanySettings, 'categories' | 'vat' | 'yearEnd'> & {
  categories: Array<
    Omit<CompanySettings['categories'][number], 'vatRate'> & {
      vatRate: number | null;
    }
  >;
  vat: Omit<CompanySettings['vat'], 'charge' | 'pay'> & {
    charge: number | null;
    pay: number | null;
  };
  yearEnd: Omit<CompanySettings['yearEnd'], 'day'> & { day: number | null };
};

function SettingsForm({
  companyId,
  initialValues,
}: Readonly<{ companyId: string; initialValues: CompanySettings }>) {
  const { i18n, t } = useTranslation('companies');
  const months = monthNames(i18n.resolvedLanguage ?? i18n.language);
  const navigate = useNavigate();
  const schemeLabels = {
    flatRate: t('Flat rate'),
    none: t('None'),
    standard: t('Standard'),
  };
  const toast = useToast();
  const [dirty, setDirty] = useState(false);
  const [discardOpen, setDiscardOpen] = useState(false);
  const allowNavigation = useRef(false);
  const keyCounter = useRef(initialValues.categories.length);
  const [categoryKeys, setCategoryKeys] = useState(() =>
    initialValues.categories.map(
      (category, index) => `${category.name}-${index}`,
    ),
  );
  const blocker = useBlocker({
    enableBeforeUnload: dirty,
    shouldBlockFn: () => dirty && !allowNavigation.current,
    withResolver: true,
  });
  const [updateSettings] = useMutation(UPDATE_SETTINGS);
  const defaultValues: SettingsDraft = initialValues;
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      try {
        const result = await updateSettings({
          variables: { input: settingsSchema.parse(value) },
        });

        if (!result.data?.updateSettings)
          throw new Error('No settings returned');
      } catch {
        allowNavigation.current = false;
        toast.show({
          description: t(
            'Your changes are still here. Check them and try again.',
          ),
          title: t('Settings could not be saved'),
          variant: 'danger',
        });

        return;
      }

      allowNavigation.current = true;
      setDirty(false);
      toast.show({ title: t('Settings saved'), variant: 'success' });
      await navigate({
        params: { companyId },
        to: '/my-companies/dashboard/$companyId',
      }).catch(() => {
        allowNavigation.current = false;
      });
    },
    validators: {
      onBlur: settingsSchema,
      onChange: settingsSchema,
    },
  });
  const markDirty = () => setDirty(true);
  const removeCategory = (index: number) => {
    form.setFieldValue(
      'categories',
      form
        .getFieldValue('categories')
        .filter((_, itemIndex) => itemIndex !== index),
    );
    setCategoryKeys((keys) =>
      keys.filter((_, itemIndex) => itemIndex !== index),
    );
    markDirty();
  };

  useEffect(() => {
    if (blocker.status === 'blocked') setDiscardOpen(true);
  }, [blocker.status]);

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
        action={
          <Button
            aria-label={t('Add a new category')}
            appearance="text"
            onAction={() => {
              form.setFieldValue('categories', [
                ...form.getFieldValue('categories'),
                { name: '', protect: false, vatRate: 20 },
              ]);
              const nextKey = `category-${keyCounter.current}`;
              keyCounter.current += 1;
              setCategoryKeys((keys) => [...keys, nextKey]);
              markDirty();
            }}
          >
            <AddIcon />
            {t('Add category')}
          </Button>
        }
        description={t('Applied when purchases are recorded.')}
        divided
        title={t('Expense categories')}
      >
        <form.Subscribe selector={(state) => state.values.categories}>
          {(categories) => (
            <div className="grid gap-3">
              {categories.map((category, index) => {
                const categoryNumber = index + 1;
                const categoryLabel =
                  category.name ||
                  t('new category {{number}}', { number: categoryNumber });

                return (
                  <div
                    className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(10rem,13rem)_auto]"
                    key={categoryKeys[index]}
                  >
                    <form.Field name={`categories[${index}].name`}>
                      {(field) => {
                        const errors = visibleValidationErrors(
                          schemaFieldErrors(
                            settingsSchema,
                            form.state.values,
                            `categories[${index}].name`,
                          ),
                          field.state.meta.isBlurred,
                          form.state.submissionAttempts,
                        );

                        if (category.protect) {
                          return (
                            <TextField.Root readOnly value={field.state.value}>
                              <TextField.Label>
                                {t('{{name}} name', { name: category.name })}
                              </TextField.Label>
                              <TextField.Input />
                            </TextField.Root>
                          );
                        }

                        return (
                          <TextField.Root
                            invalid={errors.length > 0}
                            onChange={(value) => {
                              field.handleChange(value);
                              markDirty();
                            }}
                            value={field.state.value}
                          >
                            <TextField.Label>
                              {category.name
                                ? t('{{name}} name', { name: category.name })
                                : t('New category name {{number}}', {
                                    number: categoryNumber,
                                  })}
                            </TextField.Label>
                            <TextField.Input onBlur={field.handleBlur} />
                            <TextField.Error>
                              {validationMessage(errors)}
                            </TextField.Error>
                          </TextField.Root>
                        );
                      }}
                    </form.Field>
                    <form.Field name={`categories[${index}].vatRate`}>
                      {(field) => {
                        const errors = visibleValidationErrors(
                          schemaFieldErrors(
                            settingsSchema,
                            form.state.values,
                            `categories[${index}].vatRate`,
                          ),
                          field.state.meta.isBlurred,
                          form.state.submissionAttempts,
                        );
                        const label = t('VAT rate for {{name}}', {
                          name: categoryLabel,
                        });
                        const contents = (
                          <>
                            <NumberField.Label>{label}</NumberField.Label>
                            <NumberField.Group>
                              <NumberField.Input onBlur={field.handleBlur} />
                            </NumberField.Group>
                            <NumberField.Error>
                              {validationMessage(errors)}
                            </NumberField.Error>
                          </>
                        );

                        if (category.protect) {
                          return (
                            <NumberField.Root
                              formatOptions={{
                                maximumFractionDigits: 2,
                                style: 'percent',
                              }}
                              min={0}
                              readOnly
                              value={
                                field.state.value === null
                                  ? null
                                  : field.state.value / 100
                              }
                            >
                              {contents}
                            </NumberField.Root>
                          );
                        }

                        return (
                          <NumberField.Root
                            formatOptions={{
                              maximumFractionDigits: 2,
                              style: 'percent',
                            }}
                            invalid={errors.length > 0}
                            min={0}
                            onChange={(value) => {
                              field.handleChange(
                                value === null ? null : value * 100,
                              );
                              markDirty();
                            }}
                            required
                            step={0.0001}
                            value={
                              field.state.value === null
                                ? null
                                : field.state.value / 100
                            }
                          >
                            {contents}
                          </NumberField.Root>
                        );
                      }}
                    </form.Field>
                    {category.protect ? null : (
                      <IconButton
                        aria-label={t('Remove {{name}}', {
                          name: categoryLabel,
                        })}
                        className="self-end"
                        onAction={() => removeCategory(index)}
                        variant="danger"
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </form.Subscribe>
      </FormSection>
      <FormSection
        description={t('Used when creating annual reports.')}
        divided
        title={t('Financial year end')}
      >
        <form.Field name="yearEnd.day">
          {(dayField) => (
            <form.Field name="yearEnd.month">
              {(monthField) => {
                const errors = visibleValidationErrors(
                  schemaFieldErrors(
                    settingsSchema,
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
                      markDirty();
                    }}
                    onMonthChange={(value) => {
                      monthField.handleChange(value);
                      dayField.handleBlur();
                      markDirty();
                    }}
                  />
                );
              }}
            </form.Field>
          )}
        </form.Field>
      </FormSection>
      <FormSection
        description={t('Rates applied to sales and purchases.')}
        divided
        title={t('VAT settings')}
      >
        <form.Field name="vat.scheme">
          {(field) => (
            <VatSchemeField
              label={t('VAT scheme')}
              labels={schemeLabels}
              onChange={(value) => {
                field.handleChange(value);
                markDirty();
              }}
              selection={field.state.value}
            />
          )}
        </form.Field>
        <Grid columns={{ base: 1, sm: 2 }}>
          <form.Field name="vat.registration">
            {(field) => {
              const errors = visibleValidationErrors(
                schemaFieldErrors(
                  settingsSchema,
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
                  label={t('Registration number')}
                  onBlur={field.handleBlur}
                  onChange={(value) => {
                    field.handleChange(formatVatRegistrationInput(value));
                    markDirty();
                  }}
                  value={field.state.value}
                />
              );
            }}
          </form.Field>
          {(['charge', 'pay'] as const).map((name) => (
            <form.Field key={name} name={`vat.${name}`}>
              {(field) => {
                const errors = visibleValidationErrors(
                  schemaFieldErrors(
                    settingsSchema,
                    form.state.values,
                    `vat.${name}`,
                  ),
                  field.state.meta.isBlurred,
                  form.state.submissionAttempts,
                );

                return (
                  <PercentageField
                    error={validationMessage(errors)}
                    invalid={errors.length > 0}
                    label={t(name === 'charge' ? 'Charge rate' : 'Pay rate')}
                    onBlur={field.handleBlur}
                    onChange={(value) => {
                      field.handleChange(value);
                      markDirty();
                    }}
                    value={field.state.value}
                  />
                );
              }}
            </form.Field>
          ))}
        </Grid>
      </FormSection>
      <form.Subscribe
        selector={(state) =>
          [
            schemaValuesValid(settingsSchema, state.values),
            state.isSubmitting,
          ] as const
        }
      >
        {([valuesValid, isSubmitting]) => (
          <FormActions
            divided
            primary={
              <Button
                disabled={!valuesValid || isSubmitting}
                loading={isSubmitting}
                type="submit"
              >
                {t('Save settings')}
              </Button>
            }
          />
        )}
      </form.Subscribe>
      <DiscardChangesDialog
        blocker={blocker}
        closeLabel={t('Close discard confirmation')}
        description={t('The unsaved settings changes will be lost.')}
        onDiscard={() => {
          allowNavigation.current = true;
          setDirty(false);
          setDiscardOpen(false);
        }}
        onOpenChange={setDiscardOpen}
        open={discardOpen}
        title={t('Discard settings changes?')}
        trigger={t('Discard settings changes')}
      />
    </form>
  );
}

export function SettingsPage({ companyId }: Readonly<{ companyId: string }>) {
  const { t } = useTranslation(['companies', 'routing']);
  const { data, error, loading, refetch } = useQuery(GET_COMPANY_SETTINGS, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    variables: { id: companyId },
  });
  const pageHeader = (
    <PageHeader
      description={t('VAT, financial year, and transaction category defaults.')}
      title={t('Settings')}
    />
  );

  if (loading && !data) {
    return (
      <CompanyFormLoadingState
        loadingLabel={t('Loading settings')}
        pageHeader={pageHeader}
      >
        <SettingsFormSkeleton />
      </CompanyFormLoadingState>
    );
  }

  if (!data?.getSettings) {
    return (
      <CompanyFormFailureState
        onRetry={() => {
          refetch().catch(() => undefined);
        }}
        pageHeader={pageHeader}
        title={t('Settings could not be loaded')}
      />
    );
  }

  return (
    <div className="min-w-0">
      {pageHeader}
      {error ? (
        <QueryRefreshAlert
          onRetry={() => {
            refetch().catch(() => undefined);
          }}
          retryLabel={t('Try again', { ns: 'routing' })}
        >
          {t(
            'Settings could not be refreshed. Check your connection, then try again.',
          )}
        </QueryRefreshAlert>
      ) : null}
      <SettingsForm
        companyId={companyId}
        initialValues={{
          ...data.getSettings,
          vat: {
            ...data.getSettings.vat,
            registration: formatVatRegistration(
              data.getSettings.vat.registration ?? '',
            ),
          },
        }}
        key={companyId}
      />
    </div>
  );
}
