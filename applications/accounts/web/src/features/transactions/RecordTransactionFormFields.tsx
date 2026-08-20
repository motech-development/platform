import {
  ComboBox,
  DatePicker,
  FormSection,
  Grid,
  NumberField,
  RadioGroup,
  Select,
} from '@motech-development/breeze-ui';
import { useSelector } from '@tanstack/react-form';
import { type ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { validationMessage, visibleValidationErrors } from '../form-errors';
import {
  type AttachmentTransferResult,
  AttachmentUpload,
} from './AttachmentUpload';
import {
  calculatePurchaseVat,
  calculateSaleVat,
  isSaleTransactionCategory,
} from './transaction';
import { TransactionAttachment } from './TransactionAttachment';
import type { TransactionForm } from './useTransactionForm';

function representsSameAmount(current: string, next: string) {
  if (current === next) return true;

  return (
    current !== '' &&
    next !== '' &&
    Number.isFinite(Number(current)) &&
    Number.isFinite(Number(next)) &&
    Number(current) === Number(next)
  );
}

function RadioOptions({
  labels,
}: Readonly<{ labels: readonly { label: string; value: string }[] }>) {
  return labels.map(({ label, value }) => (
    <RadioGroup.Item key={value} value={value}>
      <RadioGroup.Control>
        <RadioGroup.Indicator />
        <RadioGroup.ItemLabel>{label}</RadioGroup.ItemLabel>
      </RadioGroup.Control>
    </RadioGroup.Item>
  ));
}

function ControlledRadioGroup({
  children,
  invalid,
  onSelectionChange,
  readOnly = false,
  selection,
}: Readonly<{
  children: ReactNode;
  invalid?: boolean;
  onSelectionChange: (selection: string) => void;
  readOnly?: boolean;
  selection: string | null;
}>) {
  if (readOnly) {
    return (
      <RadioGroup.Root
        invalid={invalid}
        orientation="horizontal"
        readOnly
        selection={selection}
      >
        {children}
      </RadioGroup.Root>
    );
  }

  return (
    <RadioGroup.Root
      invalid={invalid}
      onSelectionChange={onSelectionChange}
      orientation="horizontal"
      selection={selection}
    >
      {children}
    </RadioGroup.Root>
  );
}

function SuggestionField({
  error,
  invalid,
  label,
  onBlur,
  onChange,
  onCommit,
  placeholder,
  suggestions,
  value,
}: Readonly<{
  error: string;
  invalid: boolean;
  label: string;
  onBlur: () => void;
  onChange: (value: string) => void;
  onCommit: () => void;
  placeholder?: string;
  suggestions: readonly string[];
  value: string;
}>) {
  return (
    <ComboBox.Root
      allowsCustomValue
      inputValue={value}
      invalid={invalid}
      onCommit={(nextValue) => {
        onChange(nextValue);
        onCommit();
      }}
      onInputChange={onChange}
      onSelectionChange={(selection) => {
        onChange(String(selection ?? ''));
        onCommit();
      }}
      selection={suggestions.includes(value) ? value : null}
    >
      <ComboBox.Label>{label}</ComboBox.Label>
      <ComboBox.Group>
        <ComboBox.Input onBlur={onBlur} placeholder={placeholder} />
        <ComboBox.Trigger />
      </ComboBox.Group>
      <ComboBox.Popover>
        <ComboBox.ListBox>
          {suggestions.map((suggestion) => (
            <ComboBox.Item
              id={suggestion}
              key={suggestion}
              textValue={suggestion}
            >
              {suggestion}
            </ComboBox.Item>
          ))}
        </ComboBox.ListBox>
      </ComboBox.Popover>
      <ComboBox.Error>{error}</ComboBox.Error>
    </ComboBox.Root>
  );
}

export function RecordTransactionFormFields({
  categories,
  clients,
  companyId,
  currency,
  editing,
  form,
  markDirty,
  online,
  removeAttachment,
  suggestions,
  trackAttachmentTransfer,
  vatRate,
}: Readonly<{
  categories: readonly { name: string; vatRate: number }[];
  clients: readonly { id: string; name: string }[];
  companyId: string;
  currency: string;
  editing: boolean;
  form: TransactionForm;
  markDirty: () => void;
  online: boolean;
  removeAttachment: (path: string) => Promise<boolean>;
  suggestions?: Readonly<{
    purchases?: readonly string[] | null;
    sales?: readonly string[] | null;
    suppliers?: readonly string[] | null;
  }>;
  trackAttachmentTransfer: (
    transfer: Promise<AttachmentTransferResult>,
  ) => void;
  vatRate: number;
}>) {
  const { t } = useTranslation('transactions');
  const selectedTransactionType = useSelector(
    form.store,
    (state) => state.values.transactionType,
  );
  const selectedCategory = useSelector(
    form.store,
    (state) => state.values.category,
  );
  const [selectedCategorySourceIndex, setSelectedCategorySourceIndex] =
    useState<number>();

  useEffect(() => {
    setSelectedCategorySourceIndex((current) => {
      if (
        current !== undefined &&
        categories[current]?.name === selectedCategory
      ) {
        return current;
      }

      const sourceIndex = categories.findIndex(
        ({ name }) => name === selectedCategory,
      );

      return sourceIndex >= 0 ? sourceIndex : undefined;
    });
  }, [categories, selectedCategory]);

  const purchaseCategories = categories
    .map((category, sourceIndex) => ({ ...category, sourceIndex }))
    .filter(({ name }) => !isSaleTransactionCategory(name))
    .sort((left, right) => left.name.localeCompare(right.name));
  const touch = () => {
    markDirty();
    Promise.resolve(form.validate('blur')).catch(() => undefined);
  };
  const errorsFor = (
    errors: Parameters<typeof visibleValidationErrors>[0],
    blurred: boolean,
  ) => visibleValidationErrors(errors, blurred, form.state.submissionAttempts);
  const updateCalculatedVat = (
    amount: string,
    transactionType: '' | 'purchase' | 'sale',
    category: string,
    categorySourceIndex = selectedCategorySourceIndex,
  ) => {
    if (!transactionType || !amount || !Number.isFinite(Number(amount))) {
      form.setFieldValue('vat', '');
      return;
    }

    let rate: number | undefined;

    if (transactionType === 'sale') {
      rate = vatRate;
    } else if (categorySourceIndex === undefined) {
      rate = categories.find(({ name }) => name === category)?.vatRate;
    } else {
      rate = categories[categorySourceIndex]?.vatRate;
    }

    if (rate === undefined) {
      form.setFieldValue('vat', '');
      return;
    }

    const vat =
      transactionType === 'sale'
        ? calculateSaleVat(amount, rate)
        : calculatePurchaseVat(amount, rate);

    form.setFieldValue('vat', vat.toFixed(2));
  };

  return (
    <>
      <FormSection
        description={t(
          editing
            ? 'Transaction type cannot be changed after creation.'
            : 'Identify who the transaction is with and when it occurred.',
        )}
        divided
        headingLevel={3}
        layout="stacked"
        title={t('Transaction details')}
      >
        <form.Field name="transactionType">
          {(field) => {
            const errors = errorsFor(
              field.state.meta.errors,
              field.state.meta.isBlurred,
            );

            return (
              <ControlledRadioGroup
                invalid={errors.length > 0}
                onSelectionChange={(selection) => {
                  if (selection !== 'purchase' && selection !== 'sale') return;

                  field.handleChange(selection);
                  form.setFieldValue('name', '');
                  form.setFieldValue('refund', false);
                  if (selection === 'sale') {
                    form.setFieldValue('category', '');
                  }
                  updateCalculatedVat(
                    form.getFieldValue('amount'),
                    selection,
                    form.getFieldValue('category'),
                  );
                  touch();
                }}
                readOnly={editing}
                selection={field.state.value || null}
              >
                <RadioGroup.Label>{t('Transaction type')}</RadioGroup.Label>
                <RadioOptions
                  labels={[
                    { label: t('Purchase'), value: 'purchase' },
                    { label: t('Sale'), value: 'sale' },
                  ]}
                />
                <RadioGroup.Error>
                  {validationMessage(errors, t('Check this value'))}
                </RadioGroup.Error>
              </ControlledRadioGroup>
            );
          }}
        </form.Field>
        {selectedTransactionType ? (
          <>
            <form.Field name="name">
              {(field) => {
                const errors = errorsFor(
                  field.state.meta.errors,
                  field.state.meta.isBlurred,
                );

                return selectedTransactionType === 'sale' ? (
                  <Select.Root
                    invalid={errors.length > 0}
                    onBlur={field.handleBlur}
                    onChange={(clientId) => {
                      field.handleChange(
                        clients.find(({ id }) => id === clientId)?.name ?? '',
                      );
                      touch();
                    }}
                    placeholder={t('Select client')}
                    required
                    value={
                      clients.find(({ name }) => name === field.state.value)
                        ?.id ?? null
                    }
                  >
                    <Select.Label>{t('Client')}</Select.Label>
                    <Select.Trigger>
                      <Select.Value />
                    </Select.Trigger>
                    <Select.Popover>
                      <Select.ListBox>
                        {clients.map((client) => (
                          <Select.Item
                            id={client.id}
                            key={client.id}
                            textValue={client.name}
                          >
                            {client.name}
                          </Select.Item>
                        ))}
                      </Select.ListBox>
                    </Select.Popover>
                    <Select.Error>
                      {validationMessage(errors, t('Check this value'))}
                    </Select.Error>
                  </Select.Root>
                ) : (
                  <SuggestionField
                    error={validationMessage(errors, t('Check this value'))}
                    invalid={errors.length > 0}
                    label={t('Supplier')}
                    onBlur={field.handleBlur}
                    onChange={(value) => {
                      field.handleChange(value);
                      markDirty();
                    }}
                    onCommit={touch}
                    suggestions={suggestions?.suppliers ?? []}
                    value={field.state.value}
                  />
                );
              }}
            </form.Field>
            <form.Field name="description">
              {(field) => {
                const errors = errorsFor(
                  field.state.meta.errors,
                  field.state.meta.isBlurred,
                );

                return (
                  <SuggestionField
                    error={validationMessage(errors, t('Check this value'))}
                    invalid={errors.length > 0}
                    label={t('Description')}
                    onBlur={field.handleBlur}
                    onChange={(value) => {
                      field.handleChange(value);
                      markDirty();
                    }}
                    onCommit={touch}
                    placeholder={t('What was this for?')}
                    suggestions={
                      (selectedTransactionType === 'sale'
                        ? suggestions?.sales
                        : suggestions?.purchases) ?? []
                    }
                    value={field.state.value}
                  />
                );
              }}
            </form.Field>
            <form.Field name="date">
              {(field) => {
                const errors = errorsFor(
                  field.state.meta.errors,
                  field.state.meta.isBlurred,
                );

                return (
                  <DatePicker.Root
                    invalid={errors.length > 0}
                    onBlur={field.handleBlur}
                    onChange={(value) => {
                      field.handleChange(value ?? '');
                      touch();
                    }}
                    required
                    value={field.state.value || null}
                  >
                    <DatePicker.Label>{t('Date')}</DatePicker.Label>
                    <DatePicker.Group>
                      <DatePicker.Input />
                      <DatePicker.Trigger />
                    </DatePicker.Group>
                    <DatePicker.Popover>
                      <DatePicker.Calendar />
                    </DatePicker.Popover>
                    <DatePicker.Error>
                      {validationMessage(errors, t('Check this value'))}
                    </DatePicker.Error>
                  </DatePicker.Root>
                );
              }}
            </form.Field>
          </>
        ) : null}
      </FormSection>
      <FormSection
        description={t('Status determines when the balance is updated.')}
        divided
        headingLevel={3}
        layout="stacked"
        title={t('Transaction amount')}
      >
        <form.Field name="status">
          {(field) => {
            const errors = errorsFor(
              field.state.meta.errors,
              field.state.meta.isBlurred,
            );

            return (
              <RadioGroup.Root
                invalid={errors.length > 0}
                onSelectionChange={(selection) => {
                  field.handleChange(selection);
                  if (selection === 'confirmed') {
                    form.setFieldValue('scheduled', false);
                  }
                  touch();
                }}
                orientation="horizontal"
                selection={field.state.value || null}
              >
                <RadioGroup.Label>{t('Status')}</RadioGroup.Label>
                <RadioOptions
                  labels={[
                    { label: t('Confirmed'), value: 'confirmed' },
                    { label: t('Pending'), value: 'pending' },
                  ]}
                />
                <RadioGroup.Error>
                  {validationMessage(errors, t('Check this value'))}
                </RadioGroup.Error>
              </RadioGroup.Root>
            );
          }}
        </form.Field>
        {selectedTransactionType ? (
          <>
            <form.Subscribe selector={(state) => state.values.category}>
              {(category) => (
                <>
                  {selectedTransactionType === 'purchase' ? (
                    <form.Field name="category">
                      {(field) => {
                        const errors = errorsFor(
                          field.state.meta.errors,
                          field.state.meta.isBlurred,
                        );

                        return (
                          <Select.Root
                            invalid={errors.length > 0}
                            onBlur={field.handleBlur}
                            onChange={(value) => {
                              const sourceIndex =
                                value === null ? undefined : Number(value);
                              const selected =
                                sourceIndex === undefined
                                  ? undefined
                                  : categories[sourceIndex];
                              const nextCategory = selected?.name ?? '';

                              setSelectedCategorySourceIndex(
                                selected ? sourceIndex : undefined,
                              );
                              field.handleChange(nextCategory);
                              updateCalculatedVat(
                                form.getFieldValue('amount'),
                                'purchase',
                                nextCategory,
                                selected ? sourceIndex : undefined,
                              );
                              touch();
                            }}
                            placeholder={t('Select category')}
                            required
                            value={
                              selectedCategorySourceIndex?.toString() ?? null
                            }
                          >
                            <Select.Label>{t('Category')}</Select.Label>
                            <Select.Trigger>
                              <Select.Value />
                            </Select.Trigger>
                            <Select.Popover>
                              <Select.ListBox>
                                {purchaseCategories.map(
                                  ({ name, sourceIndex }) => (
                                    <Select.Item
                                      data-category-index={sourceIndex}
                                      id={sourceIndex.toString()}
                                      key={sourceIndex}
                                      textValue={name}
                                    >
                                      {name}
                                    </Select.Item>
                                  ),
                                )}
                              </Select.ListBox>
                            </Select.Popover>
                            <Select.Error>
                              {validationMessage(errors, t('Check this value'))}
                            </Select.Error>
                          </Select.Root>
                        );
                      }}
                    </form.Field>
                  ) : null}
                  <Grid columns={{ base: 1, sm: 2 }}>
                    <form.Field name="amount">
                      {(field) => {
                        const errors = errorsFor(
                          field.state.meta.errors,
                          field.state.meta.isBlurred,
                        );
                        const updateAmount = (amount: string) => {
                          field.handleChange(amount);
                          updateCalculatedVat(
                            amount,
                            selectedTransactionType,
                            category,
                          );
                          touch();
                        };

                        return (
                          <NumberField.Root
                            disabled={
                              selectedTransactionType === 'purchase' &&
                              !category
                            }
                            formatOptions={{ currency, style: 'currency' }}
                            invalid={errors.length > 0}
                            min={0.01}
                            onChange={(value) => {
                              updateAmount(value?.toString() ?? '');
                            }}
                            required
                            step={0.01}
                            value={
                              field.state.value
                                ? Number(field.state.value)
                                : null
                            }
                          >
                            <NumberField.Label>{t('Amount')}</NumberField.Label>
                            <NumberField.Group>
                              <NumberField.Input
                                onBlur={field.handleBlur}
                                onInput={(event) => {
                                  const amount =
                                    event.currentTarget.value.replace(
                                      /[^\d.-]/gu,
                                      '',
                                    );
                                  const { nativeEvent: inputEvent } = event;

                                  if (
                                    inputEvent.inputType === 'insertText' &&
                                    inputEvent.data?.length === 1
                                  ) {
                                    updateCalculatedVat(
                                      amount,
                                      selectedTransactionType,
                                      category,
                                    );
                                    markDirty();
                                    return;
                                  }

                                  queueMicrotask(() => {
                                    if (
                                      !representsSameAmount(
                                        form.getFieldValue('amount'),
                                        amount,
                                      )
                                    ) {
                                      updateAmount(amount);
                                    }
                                  });
                                }}
                              />
                            </NumberField.Group>
                            <NumberField.Error>
                              {validationMessage(errors, t('Check this value'))}
                            </NumberField.Error>
                          </NumberField.Root>
                        );
                      }}
                    </form.Field>
                    <form.Field name="vat">
                      {(field) => {
                        const errors = errorsFor(
                          field.state.meta.errors,
                          field.state.meta.isBlurred,
                        );

                        return (
                          <NumberField.Root
                            disabled={
                              selectedTransactionType === 'purchase' &&
                              !category
                            }
                            formatOptions={{ currency, style: 'currency' }}
                            invalid={errors.length > 0}
                            min={0}
                            onChange={(value) => {
                              field.handleChange(value?.toString() ?? '');
                              touch();
                            }}
                            required
                            step={0.01}
                            value={
                              field.state.value
                                ? Number(field.state.value)
                                : null
                            }
                          >
                            <NumberField.Label>{t('VAT')}</NumberField.Label>
                            <NumberField.Group>
                              <NumberField.Input onBlur={field.handleBlur} />
                            </NumberField.Group>
                            <NumberField.Error>
                              {validationMessage(errors, t('Check this value'))}
                            </NumberField.Error>
                          </NumberField.Root>
                        );
                      }}
                    </form.Field>
                  </Grid>
                </>
              )}
            </form.Subscribe>
            <form.Field name="refund">
              {(field) => (
                <ControlledRadioGroup
                  onSelectionChange={(selection) => {
                    field.handleChange(selection === 'yes');
                    touch();
                  }}
                  readOnly={editing}
                  selection={field.state.value ? 'yes' : 'no'}
                >
                  <RadioGroup.Label>{t('Refund')}</RadioGroup.Label>
                  <RadioOptions
                    labels={[
                      { label: t('No'), value: 'no' },
                      { label: t('Yes'), value: 'yes' },
                    ]}
                  />
                </ControlledRadioGroup>
              )}
            </form.Field>
          </>
        ) : null}
        <form.Subscribe selector={(state) => state.values.status}>
          {(status) =>
            status === 'pending' ? (
              <form.Field name="scheduled">
                {(field) => (
                  <RadioGroup.Root
                    onSelectionChange={(selection) => {
                      field.handleChange(selection === 'yes');
                      touch();
                    }}
                    orientation="horizontal"
                    selection={field.state.value ? 'yes' : 'no'}
                  >
                    <RadioGroup.Label>
                      {t('Schedule transaction')}
                    </RadioGroup.Label>
                    <RadioOptions
                      labels={[
                        { label: t('No'), value: 'no' },
                        { label: t('Yes'), value: 'yes' },
                      ]}
                    />
                  </RadioGroup.Root>
                )}
              </form.Field>
            ) : null
          }
        </form.Subscribe>
      </FormSection>
      {selectedTransactionType ? (
        <form.Subscribe selector={(state) => state.values.attachment}>
          {(attachment) => (
            <FormSection
              description={t(
                attachment
                  ? 'View, replace, or delete the attached file.'
                  : 'Attach an invoice or receipt to this transaction.',
              )}
              divided
              headingLevel={3}
              layout="stacked"
              title={t('Invoice or receipt')}
            >
              <form.Subscribe selector={(state) => state.isSubmitting}>
                {(isSubmitting) => (
                  <form.Field name="attachment">
                    {(field) =>
                      field.state.value ? (
                        <TransactionAttachment
                          companyId={companyId}
                          disabled={isSubmitting}
                          onDeleted={async () => {
                            const removed = await removeAttachment(
                              field.state.value,
                            );

                            if (removed) {
                              field.handleChange('');
                              markDirty();
                            }

                            return removed;
                          }}
                          path={field.state.value}
                        />
                      ) : (
                        <AttachmentUpload
                          companyId={companyId}
                          disabled={!online || isSubmitting}
                          onTransfer={trackAttachmentTransfer}
                          onUploaded={(path) => {
                            field.handleChange(path);
                            markDirty();
                          }}
                          transactionId={form.getFieldValue('id') || undefined}
                        />
                      )
                    }
                  </form.Field>
                )}
              </form.Subscribe>
            </FormSection>
          )}
        </form.Subscribe>
      ) : null}
    </>
  );
}
