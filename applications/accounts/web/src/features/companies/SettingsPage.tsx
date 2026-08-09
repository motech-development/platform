import { useMutation, useQuery } from '@apollo/client/react';
import {
  Button,
  ConfirmationDialog,
  FormActions,
  FormSection,
  Grid,
  IconButton,
  NumberField,
  PageHeader,
  RadioGroup,
  Select,
  StatePanel,
  TextField,
  useToast,
} from '@motech-development/breeze-ui';
import {
  AddIcon,
  DeleteIcon,
  WarningIcon,
} from '@motech-development/breeze-ui/icons';
import { useForm } from '@tanstack/react-form';
import { useBlocker, useNavigate } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GET_COMPANY_SETTINGS, UPDATE_SETTINGS } from '../../data/operations';
import { validationMessage, visibleValidationErrors } from '../form-errors';
import { type CompanySettings, settingsSchema } from './company';
import { monthNames } from './month-names';

type SettingsDraft = Omit<CompanySettings, 'categories' | 'vat'> & {
  categories: Array<
    Omit<CompanySettings['categories'][number], 'vatRate'> & {
      vatRate: number | null;
    }
  >;
  vat: Omit<CompanySettings['vat'], 'charge' | 'pay'> & {
    charge: number | null;
    pay: number | null;
  };
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
        allowNavigation.current = true;
        setDirty(false);
        toast.show({ title: t('Settings saved'), variant: 'success' });
        await navigate({
          params: { companyId },
          to: '/my-companies/dashboard/$companyId',
        });
      } catch {
        allowNavigation.current = false;
        toast.show({
          description: t(
            'Your changes are still here. Check them and try again.',
          ),
          title: t('Settings could not be saved'),
          variant: 'danger',
        });
      }
    },
    validators: {
      onBlur: settingsSchema,
      onChange: settingsSchema,
      onMount: settingsSchema,
    },
  });
  const markDirty = () => setDirty(true);

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
                const categoryLabel = category.name || t('new category');

                return (
                  <div
                    className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(10rem,13rem)_auto]"
                    key={categoryKeys[index]}
                  >
                    <form.Field name={`categories[${index}].name`}>
                      {(field) => {
                        const errors = visibleValidationErrors(
                          field.state.meta.errors,
                          field.state.meta.isTouched,
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
                                : t('New category name')}
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
                          field.state.meta.errors,
                          field.state.meta.isTouched,
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
                        onAction={() => {
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
                        }}
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
        <Grid columns={{ base: 1, sm: 2 }}>
          <form.Field name="yearEnd.day">
            {(field) => (
              <Select.Root
                onChange={(value) => {
                  field.handleChange(Number(value));
                  markDirty();
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
                  markDirty();
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
                        textValue={month}
                      >
                        {month}
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
        description={t('Rates applied to sales and purchases.')}
        divided
        title={t('VAT settings')}
      >
        <form.Field name="vat.scheme">
          {(field) => (
            <RadioGroup.Root
              onSelectionChange={(value) => {
                field.handleChange(value as CompanySettings['vat']['scheme']);
                markDirty();
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
            </RadioGroup.Root>
          )}
        </form.Field>
        <Grid columns={{ base: 1, sm: 2 }}>
          <form.Field name="vat.registration">
            {(field) => {
              const errors = visibleValidationErrors(
                field.state.meta.errors,
                field.state.meta.isTouched,
                form.state.submissionAttempts,
              );

              return (
                <TextField.Root
                  invalid={errors.length > 0}
                  onChange={(value) => {
                    field.handleChange(value.toUpperCase().replace(/\s/gu, ''));
                    markDirty();
                  }}
                  value={field.state.value}
                >
                  <TextField.Label>{t('Registration number')}</TextField.Label>
                  <TextField.Input onBlur={field.handleBlur} />
                  <TextField.Error>{validationMessage(errors)}</TextField.Error>
                </TextField.Root>
              );
            }}
          </form.Field>
          {(['charge', 'pay'] as const).map((name) => (
            <form.Field key={name} name={`vat.${name}`}>
              {(field) => {
                const errors = visibleValidationErrors(
                  field.state.meta.errors,
                  field.state.meta.isTouched,
                  form.state.submissionAttempts,
                );

                return (
                  <NumberField.Root
                    formatOptions={{
                      maximumFractionDigits: 2,
                      style: 'percent',
                    }}
                    invalid={errors.length > 0}
                    min={0}
                    onChange={(value) => {
                      field.handleChange(value === null ? null : value * 100);
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
                    <NumberField.Label>
                      {t(name === 'charge' ? 'Charge rate' : 'Pay rate')}
                    </NumberField.Label>
                    <NumberField.Group>
                      <NumberField.Input onBlur={field.handleBlur} />
                    </NumberField.Group>
                    <NumberField.Error>
                      {validationMessage(errors)}
                    </NumberField.Error>
                  </NumberField.Root>
                );
              }}
            </form.Field>
          ))}
        </Grid>
      </FormSection>
      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting] as const}
      >
        {([canSubmit, isSubmitting]) => (
          <FormActions
            divided
            primary={
              <Button
                disabled={!canSubmit || isSubmitting}
                loading={isSubmitting}
                type="submit"
              >
                {t('Save settings')}
              </Button>
            }
          />
        )}
      </form.Subscribe>
      <span hidden>
        <ConfirmationDialog
          cancelLabel={t('Keep editing')}
          closeLabel={t('Close discard confirmation')}
          confirmLabel={t('Discard changes')}
          description={t('The unsaved settings changes will be lost.')}
          onConfirm={() => {
            allowNavigation.current = true;
            setDirty(false);
            setDiscardOpen(false);
            blocker.proceed?.();
          }}
          onOpenChange={(open) => {
            setDiscardOpen(open);
            if (
              !open &&
              !allowNavigation.current &&
              blocker.status === 'blocked'
            ) {
              blocker.reset();
            }
          }}
          open={discardOpen}
          title={t('Discard settings changes?')}
          trigger={t('Discard settings changes')}
          variant="warning"
        />
      </span>
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

  if (loading && !data)
    return <p aria-live="polite">{t('Loading settings')}</p>;
  if (error || !data?.getSettings) {
    return (
      <StatePanel
        action={
          <Button
            onAction={() => {
              refetch().catch(() => undefined);
            }}
          >
            {t('Try again', { ns: 'routing' })}
          </Button>
        }
        description={t('Check your connection, then try again.', {
          ns: 'routing',
        })}
        icon={<WarningIcon />}
        title={t('Settings could not be loaded')}
        variant="danger"
      />
    );
  }

  return (
    <div className="min-w-0">
      <PageHeader
        description={t(
          'VAT, financial year, and transaction category defaults.',
        )}
        title={t('Settings')}
      />
      <SettingsForm
        companyId={companyId}
        initialValues={{
          ...data.getSettings,
          vat: {
            ...data.getSettings.vat,
            registration: data.getSettings.vat.registration ?? '',
          },
        }}
      />
    </div>
  );
}
