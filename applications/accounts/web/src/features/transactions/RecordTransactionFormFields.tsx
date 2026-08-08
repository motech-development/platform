import {
  DatePicker,
  FormSection,
  Grid,
  NumberField,
  RadioGroup,
  Select,
  TextField,
} from '@motech-development/breeze-ui';
import { useTranslation } from 'react-i18next';
import { validationMessage, visibleValidationErrors } from '../form-errors';
import {
  type AttachmentTransferResult,
  AttachmentUpload,
} from './AttachmentUpload';
import { calculateSaleVat } from './sale';
import type { ConfirmedSaleForm } from './useConfirmedSaleForm';

function representsSameAmount(current: string, next: string) {
  if (current === next) {
    return true;
  }

  const currentNumber = Number(current);
  const nextNumber = Number(next);

  return (
    current !== '' &&
    next !== '' &&
    Number.isFinite(currentNumber) &&
    Number.isFinite(nextNumber) &&
    currentNumber === nextNumber
  );
}

export function RecordTransactionFormFields({
  clients,
  companyId,
  form,
  markDirty,
  online,
  trackAttachmentTransfer,
  vatRate,
}: Readonly<{
  clients: readonly { id: string; name: string }[];
  companyId: string;
  form: ConfirmedSaleForm;
  markDirty: () => void;
  online: boolean;
  trackAttachmentTransfer: (
    transfer: Promise<AttachmentTransferResult>,
  ) => void;
  vatRate: number;
}>) {
  const { t } = useTranslation('transactions');
  const revalidateVisibleErrors = (touched: boolean) => {
    if (touched || form.state.submissionAttempts > 0) {
      Promise.resolve(form.validate('blur')).catch(() => undefined);
    }
  };
  const changeStringField = (
    handleChange: (value: string) => void,
    value: string,
    touched: boolean,
  ) => {
    handleChange(value);
    revalidateVisibleErrors(touched);
    markDirty();
  };

  return (
    <>
      <FormSection
        description={t(
          'Identify who the transaction is with and when it occurred.',
        )}
        divided
        headingLevel={3}
        layout="stacked"
        title={t('Transaction details')}
      >
        <RadioGroup.Root orientation="horizontal" readOnly selection="sale">
          <RadioGroup.Label>{t('Transaction type')}</RadioGroup.Label>
          <RadioGroup.Item value="sale">
            <RadioGroup.Control>
              <RadioGroup.Indicator />
              <RadioGroup.ItemLabel>{t('Sale')}</RadioGroup.ItemLabel>
            </RadioGroup.Control>
          </RadioGroup.Item>
        </RadioGroup.Root>
        <form.Field name="client">
          {(field) => {
            const errors = visibleValidationErrors(
              field.state.meta.errors,
              field.state.meta.isTouched,
              form.state.submissionAttempts,
            );

            return (
              <Select.Root
                invalid={errors.length > 0}
                onBlur={field.handleBlur}
                onChange={(value) => {
                  const client = clients.find(({ id }) => id === value);

                  changeStringField(
                    field.handleChange,
                    client?.name ?? '',
                    field.state.meta.isTouched,
                  );
                }}
                placeholder={t('Select client')}
                required
                value={
                  clients.find(({ name }) => name === field.state.value)?.id ??
                  null
                }
              >
                <Select.Label>{t('Supplier')}</Select.Label>
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
            );
          }}
        </form.Field>
        <form.Field name="description">
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
                  changeStringField(
                    field.handleChange,
                    value,
                    field.state.meta.isTouched,
                  );
                }}
                required
                value={field.state.value}
              >
                <TextField.Label>{t('Description')}</TextField.Label>
                <TextField.Input
                  onBlur={field.handleBlur}
                  placeholder={t('What was this for?')}
                />
                <TextField.Error>
                  {validationMessage(errors, t('Check this value'))}
                </TextField.Error>
              </TextField.Root>
            );
          }}
        </form.Field>
        <form.Field name="date">
          {(field) => {
            const errors = visibleValidationErrors(
              field.state.meta.errors,
              field.state.meta.isTouched,
              form.state.submissionAttempts,
            );

            return (
              <DatePicker.Root
                invalid={errors.length > 0}
                onBlur={field.handleBlur}
                onChange={(value) => {
                  changeStringField(
                    field.handleChange,
                    value ?? '',
                    field.state.meta.isTouched,
                  );
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
      </FormSection>
      <FormSection
        description={t('Enter the confirmed sale amount and VAT.')}
        divided
        headingLevel={3}
        layout="stacked"
        title={t('Status and totals')}
      >
        <RadioGroup.Root
          orientation="horizontal"
          readOnly
          selection="confirmed"
        >
          <RadioGroup.Label>{t('Status')}</RadioGroup.Label>
          <RadioGroup.Item value="confirmed">
            <RadioGroup.Control>
              <RadioGroup.Indicator />
              <RadioGroup.ItemLabel>{t('Confirmed')}</RadioGroup.ItemLabel>
            </RadioGroup.Control>
          </RadioGroup.Item>
        </RadioGroup.Root>
        <Grid columns={{ base: 1, sm: 2 }}>
          <form.Field name="amount">
            {(field) => {
              const errors = visibleValidationErrors(
                field.state.meta.errors,
                field.state.meta.isTouched,
                form.state.submissionAttempts,
              );
              const numericValue = field.state.value
                ? Number(field.state.value)
                : null;
              const updateVat = (amount: string) => {
                if (amount && Number.isFinite(Number(amount))) {
                  form.setFieldValue(
                    'vat',
                    calculateSaleVat(amount, vatRate).toFixed(2),
                  );
                } else if (!amount) {
                  form.setFieldValue('vat', '');
                }
              };
              const updateAmount = (amount: string) => {
                field.handleChange(amount);
                updateVat(amount);
                Promise.resolve(form.validate('blur')).catch(() => undefined);
                markDirty();
              };

              return (
                <NumberField.Root
                  formatOptions={{ currency: 'GBP', style: 'currency' }}
                  min={0.01}
                  invalid={errors.length > 0}
                  onChange={(value) => updateAmount(value?.toString() ?? '')}
                  required
                  step={0.01}
                  value={numericValue}
                >
                  <NumberField.Label>{t('Amount')}</NumberField.Label>
                  <NumberField.Group>
                    <NumberField.Input
                      onBlur={field.handleBlur}
                      onInput={(event) => {
                        const amount = event.currentTarget.value.replace(
                          /[^\d.-]/gu,
                          '',
                        );
                        const { nativeEvent: inputEvent } = event;

                        if (
                          inputEvent.inputType === 'insertText' &&
                          inputEvent.data?.length === 1
                        ) {
                          // React Aria owns incremental keyboard editing.
                          updateVat(amount);
                          markDirty();
                          return;
                        }

                        // Input-only replacements (including browser automation
                        // and autofill) may not commit a semantic NumberField
                        // value until blur.
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
              const errors = visibleValidationErrors(
                field.state.meta.errors,
                field.state.meta.isTouched,
                form.state.submissionAttempts,
              );

              return (
                <NumberField.Root
                  formatOptions={{ currency: 'GBP', style: 'currency' }}
                  min={0}
                  invalid={errors.length > 0}
                  onChange={(value) => {
                    changeStringField(
                      field.handleChange,
                      value?.toString() ?? '',
                      field.state.meta.isTouched,
                    );
                  }}
                  required
                  step={0.01}
                  value={field.state.value ? Number(field.state.value) : null}
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
      </FormSection>
      <FormSection
        description={t('Attach an invoice to this transaction.')}
        divided
        headingLevel={3}
        layout="stacked"
        title={t('Invoice')}
      >
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <form.Field name="attachment">
              {(field) => (
                <AttachmentUpload
                  companyId={companyId}
                  disabled={!online || isSubmitting}
                  onTransfer={trackAttachmentTransfer}
                  onUploaded={(path) => {
                    field.handleChange(path);
                    markDirty();
                  }}
                />
              )}
            </form.Field>
          )}
        </form.Subscribe>
      </FormSection>
    </>
  );
}
