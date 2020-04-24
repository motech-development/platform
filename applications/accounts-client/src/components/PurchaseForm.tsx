import {
  Card,
  Col,
  DatePicker,
  Form,
  ISelectOption,
  LinkButton,
  Row,
  Select,
  TextBox,
  Typography,
} from '@motech-development/breeze-ui';
import { FormikProps, FormikValues, getIn } from 'formik';
import React, { ChangeEvent, FC, memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { date, number, object, string } from 'yup';

const formSchema = {
  amount: '',
  category: '',
  companyId: '',
  date: '',
  description: '',
  name: '',
};

export type FormSchema = typeof formSchema;

export interface IPurchaseFormProps {
  backTo: string;
  categories: ISelectOption[];
  companyId?: string;
  initialValues?: FormSchema;
  loading: boolean;
  onSave(value: FormSchema): void;
}

const PurchaseForm: FC<IPurchaseFormProps> = ({
  backTo,
  categories,
  companyId = null,
  initialValues = {
    ...formSchema,
    companyId,
  },
  loading,
  onSave,
}) => {
  const [disableInput, setDisableInput] = useState(true);
  const { t } = useTranslation('accounts');
  const validationSchema = object().shape({
    amount: number().required(
      t('purchase-form.purchase-amount.amount.required'),
    ),
    category: string().required(
      t('purchase-form.purchase-amount.category.required'),
    ),
    companyId: string().required(),
    date: date().required(t('purchase-form.purchase-details.date.required')),
    description: string().required(
      t('purchase-form.purchase-details.description.required'),
    ),
    name: string().required(t('purchase-form.purchase-details.name.required')),
    vat: number().required(t('purchase-form.purchase-amount.vat.required')),
  });
  const dropdown = categories
    .map(({ name }) => name)
    .map((name, i) => ({
      name,
      value: i.toString(),
    }));
  const onChangeSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    setDisableInput(event.target.value === '');
  };
  const onInputValue = (
    event: ChangeEvent<HTMLInputElement>,
    form: FormikProps<FormikValues>,
  ) => {
    const { setFieldValue, values } = form;
    const value = parseFloat(
      event.target.value.replace(t('purchase-form.currency'), ''),
    );
    const i = getIn(values, 'category');
    const vat = parseFloat(categories[i].value);
    const rate = vat / 100 + 1;
    const calculated = (value - value / rate).toFixed(2);

    setFieldValue('vat', calculated);
  };
  const onPreSubmit = (value: FormSchema) => {
    const category = categories[value.category].name;

    return {
      ...value,
      category,
    };
  };

  return (
    <Form
      initialValues={initialValues}
      loading={loading}
      validationSchema={validationSchema}
      submitLabel={t('purchase-form.save')}
      onPreSubmit={onPreSubmit}
      onSubmit={onSave}
      cancel={
        <LinkButton block to={backTo} colour="secondary" size="lg">
          {t('purchase-form.cancel')}
        </LinkButton>
      }
    >
      <Row>
        <Col xs={12} md={6}>
          <Card padding="lg">
            <Typography rule component="h3" variant="h3">
              {t('purchase-form.purchase-details.heading')}
            </Typography>

            <TextBox
              label={t('purchase-form.purchase-details.name.label')}
              name="name"
            />

            <TextBox
              label={t('purchase-form.purchase-details.description.label')}
              name="description"
            />

            <DatePicker
              label={t('purchase-form.purchase-details.date.label')}
              name="date"
            />
          </Card>
        </Col>

        <Col xs={12} md={6}>
          <Card padding="lg">
            <Typography rule component="h3" variant="h3">
              {t('purchase-form.purchase-amount.heading')}
            </Typography>

            <Select
              label={t('purchase-form.purchase-amount.category.label')}
              name="category"
              onChange={onChangeSelect}
              options={dropdown}
              placeholder={t(
                'purchase-form.purchase-amount.category.placeholder',
              )}
            />

            <TextBox
              decimalScale={2}
              disabled={disableInput}
              label={t('purchase-form.purchase-amount.amount.label')}
              name="amount"
              onChange={onInputValue}
              prefix={t('purchase-form.currency')}
            />

            <TextBox
              disabled={disableInput}
              name="vat"
              label={t('purchase-form.purchase-amount.vat.label')}
              prefix={t('purchase-form.currency')}
              decimalScale={2}
            />
          </Card>
        </Col>
      </Row>
    </Form>
  );
};

export default memo(PurchaseForm);
