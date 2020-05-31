import {
  Card,
  Col,
  DatePicker,
  Form,
  ISelectOption,
  LinkButton,
  Radio,
  Row,
  Select,
  TextBox,
  Typography,
} from '@motech-development/breeze-ui';
import { FormikProps, FormikValues, getIn } from 'formik';
import React, { ChangeEvent, FC, memo, ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { date, number, object, string } from 'yup';

const formSchema = {
  amount: '',
  attachment: '',
  category: '',
  companyId: '',
  date: '',
  description: '',
  id: '',
  name: '',
  status: '',
  vat: '',
};

export type FormSchema = {
  amount: number;
  attachment: string;
  category: string;
  companyId: string;
  date: string;
  description: string;
  id: string;
  name: string;
  status: string;
  vat: number;
};

export interface ITransactionForm {
  attachment: string;
  attachmentView: ReactNode;
  backTo: string;
  categories: ISelectOption[];
  clients: ISelectOption[];
  companyId: string;
  initialValues?: FormSchema;
  loading: boolean;
  uploader: ReactNode;
  vat: number;
  onSave(value: FormSchema): void;
}

interface IFormValues extends FormSchema {
  transaction: string;
}

const TransactionForm: FC<ITransactionForm> = ({
  attachment,
  attachmentView,
  backTo,
  categories,
  clients,
  companyId,
  initialValues = {
    ...formSchema,
    companyId,
  },
  loading,
  onSave,
  uploader,
  vat,
}) => {
  const isEmpty = initialValues.amount === '';
  const initialTransaction = initialValues.amount > 0 ? 'Sales' : 'Purchase';
  const formValues = {
    ...initialValues,
    amount: initialValues.amount
      ? Math.abs(initialValues.amount as number)
      : initialValues.amount,
    category:
      initialValues.category === ''
        ? initialValues.category
        : categories.findIndex(({ name }) => name === initialValues.category),
    ...(isEmpty
      ? {
          transaction: '',
        }
      : {
          transaction: initialTransaction,
        }),
  };

  const [transactionType, setTransactionType] = useState(
    formValues.transaction,
  );
  const [disableInput, setDisableInput] = useState(formValues.category === '');
  const { t } = useTranslation('accounts');
  const currency = t('transaction-form.currency');
  const validationSchema = object().shape({
    amount: number().required(
      t('transaction-form.transaction-amount.amount.required'),
    ),
    attachment: string(),
    category: string().required(
      t('transaction-form.transaction-amount.category.required'),
    ),
    companyId: string().required(),
    date: date().required(
      t('transaction-form.transaction-details.date.required'),
    ),
    description: string().required(
      t('transaction-form.transaction-details.description.required'),
    ),
    id: string(),
    name: string().required(
      t('transaction-form.transaction-details.name.required'),
    ),
    status: string().required(
      t('transaction-form.transaction-amount.status.required'),
    ),
    transaction: string().required(
      t('transaction-form.transaction-details.transaction.required'),
    ),
    vat: number().required(
      t('transaction-form.transaction-amount.vat.required'),
    ),
  });
  const dropdown = categories
    .map(({ name }) => name)
    .map((name, i) => ({
      name,
      value: i.toString(),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
  const transactionTypeOptions = [
    {
      name: t(
        'transaction-form.transaction-details.transaction.options.purchase',
      ),
      value: 'Purchase',
    },
    {
      name: t('transaction-form.transaction-details.transaction.options.sale'),
      value: 'Sales',
    },
  ];
  const statusOptions = [
    {
      name: t('transaction-form.transaction-amount.status.options.confirmed'),
      value: 'confirmed',
    },
    {
      name: t('transaction-form.transaction-amount.status.options.pending'),
      value: 'pending',
    },
  ];
  const onTransactionTypeChange = (
    event: ChangeEvent<HTMLInputElement>,
    form: FormikProps<FormikValues>,
  ) => {
    const { setFieldValue } = form;

    setTransactionType(event.target.value);

    setFieldValue('name', '');

    if (event.target.value === 'Sales') {
      setFieldValue('category', event.target.value);
    }
  };
  const onCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setDisableInput(event.target.value === '');
  };
  const onSaleAmountChange = (
    event: ChangeEvent<HTMLInputElement>,
    form: FormikProps<FormikValues>,
  ) => {
    const { setFieldValue } = form;
    const value = parseFloat(event.target.value.replace(currency, ''));
    const calculated = ((value / 100) * vat).toFixed(2);

    setFieldValue('vat', calculated);
  };
  const onPurchaseAmountChange = (
    event: ChangeEvent<HTMLInputElement>,
    form: FormikProps<FormikValues>,
  ) => {
    const { setFieldValue, values } = form;
    const value = parseFloat(event.target.value.replace(currency, ''));
    const i = getIn(values, 'category');
    const vatRate = parseFloat(categories[i].value);
    const rate = vatRate / 100 + 1;
    const calculated = (value - value / rate).toFixed(2);

    setFieldValue('vat', calculated);
  };
  const onPreSubmit = ({ transaction, ...value }: IFormValues) => {
    const isPurchase = transaction === 'Purchase';
    const amount = isPurchase ? -Math.abs(value.amount) : value.amount;
    const category = isPurchase ? categories[value.category].name : transaction;

    return {
      ...value,
      amount,
      attachment,
      category,
    };
  };

  return (
    <Form
      initialValues={formValues}
      loading={loading}
      validationSchema={validationSchema}
      submitLabel={t('transaction-form.save')}
      onPreSubmit={onPreSubmit}
      onSubmit={onSave}
      cancel={
        <LinkButton block to={backTo} colour="secondary" size="lg">
          {t('transaction-form.cancel')}
        </LinkButton>
      }
    >
      <Row>
        <Col xs={12} md={6}>
          <Card padding="lg">
            <Typography rule component="h3" variant="h3">
              {t('transaction-form.transaction-details.heading')}
            </Typography>

            <Radio
              name="transaction"
              label={t(
                'transaction-form.transaction-details.transaction.label',
              )}
              options={transactionTypeOptions}
              onChange={onTransactionTypeChange}
              readOnly={!!formValues.id}
            />

            {transactionType && (
              <>
                {transactionType === 'Sales' ? (
                  <Select
                    label={t('transaction-form.transaction-details.name.label')}
                    name="name"
                    options={clients}
                    placeholder={t(
                      'transaction-form.transaction-details.name.placeholder',
                    )}
                  />
                ) : (
                  <TextBox
                    label={t('transaction-form.transaction-details.name.label')}
                    name="name"
                  />
                )}

                <TextBox
                  label={t(
                    'transaction-form.transaction-details.description.label',
                  )}
                  name="description"
                />

                <DatePicker
                  label={t('transaction-form.transaction-details.date.label')}
                  name="date"
                />
              </>
            )}
          </Card>
        </Col>

        <Col xs={12} md={6}>
          <Row>
            <Col>
              <Card padding="lg">
                <Typography rule component="h3" variant="h3">
                  {t('transaction-form.transaction-amount.heading')}
                </Typography>

                <Radio
                  name="status"
                  label={t('transaction-form.transaction-amount.status.label')}
                  options={statusOptions}
                />

                {transactionType && (
                  <>
                    {transactionType === 'Purchase' ? (
                      <>
                        <Select
                          label={t(
                            'transaction-form.transaction-amount.category.label',
                          )}
                          name="category"
                          onChange={onCategoryChange}
                          options={dropdown}
                          placeholder={t(
                            'transaction-form.transaction-amount.category.placeholder',
                          )}
                        />

                        <TextBox
                          decimalScale={2}
                          disabled={disableInput}
                          label={t(
                            'transaction-form.transaction-amount.amount.label',
                          )}
                          name="amount"
                          onChange={onPurchaseAmountChange}
                          prefix={currency}
                        />

                        <TextBox
                          disabled={disableInput}
                          name="vat"
                          label={t(
                            'transaction-form.transaction-amount.vat.label',
                          )}
                          prefix={currency}
                          decimalScale={2}
                        />
                      </>
                    ) : (
                      <>
                        <TextBox
                          decimalScale={2}
                          label={t(
                            'transaction-form.transaction-amount.amount.label',
                          )}
                          name="amount"
                          onChange={onSaleAmountChange}
                          prefix={currency}
                        />

                        <TextBox
                          decimalScale={2}
                          label={t(
                            'transaction-form.transaction-amount.vat.label',
                          )}
                          name="vat"
                          prefix={currency}
                        />
                      </>
                    )}
                  </>
                )}
              </Card>
            </Col>

            {transactionType && (
              <Col>
                <Card padding="lg">
                  <Typography rule component="h3" variant="h3">
                    {transactionType === 'Purchase'
                      ? t('transaction-form.upload.purchase.heading')
                      : t('transaction-form.upload.sale.heading')}
                  </Typography>

                  {attachment ? attachmentView : uploader}
                </Card>
              </Col>
            )}
          </Row>
        </Col>
      </Row>
    </Form>
  );
};

export default memo(TransactionForm);
