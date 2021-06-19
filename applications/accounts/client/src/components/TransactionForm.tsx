import {
  Card,
  Col,
  DatePicker,
  Form,
  IRadioOption,
  ISelectOption,
  LinkButton,
  Radio,
  Row,
  Select,
  TextBox,
  Typeahead,
  Typography,
} from '@motech-development/breeze-ui';
import { Decimal } from 'decimal.js';
import { FormikProps, FormikValues, getIn } from 'formik';
import { ChangeEvent, FC, ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { boolean, date, number, object, string } from 'yup';

const formSchema = {
  amount: '',
  attachment: '',
  category: '',
  companyId: '',
  date: '',
  description: '',
  id: '',
  name: '',
  refund: false,
  scheduled: false,
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
  refund: boolean;
  scheduled: boolean;
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
  purchases?: string[] | null;
  sales?: string[] | null;
  suppliers?: string[] | null;
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
  purchases,
  sales,
  suppliers,
  uploader,
  vat,
}) => {
  const isEmpty = initialValues.amount === '';
  const initialTransaction =
    !initialValues.refund && initialValues.amount > 0 ? 'Sales' : 'Purchase';
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
    refund: initialValues.refund === null ? false : initialValues.refund,
    scheduled:
      initialValues.scheduled === null ? false : initialValues.scheduled,
    vat: initialValues.vat
      ? Math.abs(initialValues.vat as number)
      : initialValues.vat,
  };
  const [transactionType, setTransactionType] = useState(
    formValues.transaction,
  );
  const [disableInput, setDisableInput] = useState(formValues.category === '');
  const [typeahead, setTypeahead] = useState({
    descriptions: [] as string[],
    suppliers: [] as string[],
  });
  const [pending, setPending] = useState(initialValues.status === 'pending');
  const { t } = useTranslation('accounts');
  const currency = t('transaction-form.currency');
  const validationSchema = object<FormSchema>()
    .shape({
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
      refund: boolean().required(),
      scheduled: boolean().required(),
      status: string().required(
        t('transaction-form.transaction-amount.status.required'),
      ),
      transaction: string().required(
        t('transaction-form.transaction-details.transaction.required'),
      ),
      vat: number().required(
        t('transaction-form.transaction-amount.vat.required'),
      ),
    })
    .required();
  const dropdown = categories
    .map(({ name }) => name)
    .map((name, i) => ({
      name,
      value: i.toString(),
    }));
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
  const refundOptions = [
    {
      name: t('transaction-form.transaction-amount.refund.options.no'),
      value: false,
    },
    {
      name: t('transaction-form.transaction-amount.refund.options.yes'),
      value: true,
    },
  ] as unknown as IRadioOption[];
  const scheduleOptions = [
    {
      name: t('transaction-form.transaction-amount.schedule.options.yes'),
      value: true,
    },
    {
      name: t('transaction-form.transaction-amount.schedule.options.no'),
      value: false,
    },
  ] as unknown as IRadioOption[];
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

    setFieldValue('refund', false);
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
    const calculated = new Decimal(value).dividedBy(100).times(vat).toFixed(2);

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
    const rate = new Decimal(vatRate).dividedBy(100).plus(1);
    const calculated = new Decimal(value)
      .minus(new Decimal(value).dividedBy(rate))
      .toFixed(2);

    setFieldValue('vat', calculated);
  };
  const onStatusChange = (
    event: ChangeEvent<HTMLInputElement>,
    form: FormikProps<FormikValues>,
  ) => {
    const { value } = event.target;
    const { setFieldValue } = form;
    const isPending = value === 'pending';

    setPending(isPending);
    setFieldValue('status', value);

    if (!isPending) {
      setFieldValue('scheduled', false);
    }
  };
  const onRadioChange =
    (name: string) =>
    (event: ChangeEvent<HTMLInputElement>, form: FormikProps<FormikValues>) => {
      const { value } = event.target;
      const { setFieldValue } = form;

      setFieldValue(name, value === 'true');
    };
  const onPreSubmit = ({ transaction, ...value }: IFormValues) => {
    const isPurchase = transaction === 'Purchase';
    const category = isPurchase ? categories[value.category].name : transaction;

    let amount: number;

    if (isPurchase) {
      if (value.refund) {
        amount = value.amount;
      } else {
        amount = -Math.abs(value.amount);
      }
    } else if (value.refund) {
      amount = -Math.abs(value.amount);
    } else {
      amount = value.amount;
    }

    return {
      ...value,
      amount,
      attachment,
      category,
      vat: value.refund ? -Math.abs(value.vat) : value.vat,
    };
  };

  useEffect(() => {
    const descriptions = transactionType === 'Sales' ? sales : purchases;

    setTypeahead({
      descriptions: !descriptions ? [] : descriptions,
      suppliers: !suppliers ? [] : suppliers,
    });
  }, [purchases, sales, suppliers, transactionType]);

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
                  <Typeahead
                    label={t('transaction-form.transaction-details.name.label')}
                    name="name"
                    suggestions={typeahead.suppliers.map((supplier) => ({
                      name: supplier,
                      value: supplier,
                    }))}
                  />
                )}

                <Typeahead
                  label={t(
                    'transaction-form.transaction-details.description.label',
                  )}
                  name="description"
                  suggestions={typeahead.descriptions.map((description) => ({
                    name: description,
                    value: description,
                  }))}
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
                  onChange={onStatusChange}
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
                          options={[...dropdown].sort((a, b) =>
                            a.name.localeCompare(b.name),
                          )}
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

                        <Radio
                          name="refund"
                          label={t(
                            'transaction-form.transaction-amount.refund.label',
                          )}
                          options={refundOptions}
                          readOnly={!!formValues.id}
                        />

                        <TextBox
                          decimalScale={2}
                          disabled={disableInput}
                          name="vat"
                          label={t(
                            'transaction-form.transaction-amount.vat.label',
                          )}
                          prefix={currency}
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

                        <Radio
                          name="refund"
                          label={t(
                            'transaction-form.transaction-amount.refund.label',
                          )}
                          options={refundOptions}
                          readOnly={!!formValues.id}
                          onChange={onRadioChange('refund')}
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

                {pending && (
                  <Radio
                    name="scheduled"
                    label={t(
                      'transaction-form.transaction-amount.schedule.label',
                    )}
                    options={scheduleOptions}
                    onChange={onRadioChange('scheduled')}
                  />
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

export default TransactionForm;
