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
import { FormikProps, FormikValues } from 'formik';
import React, { ChangeEvent, FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { date, number, object, string } from 'yup';

const formSchema = {
  amount: '',
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
  category: string;
  companyId: string;
  date: string;
  description: string;
  id: string;
  name: string;
  status: string;
  vat: number;
};

export interface ISaleFormProps {
  backTo: string;
  clients: ISelectOption[];
  companyId?: string;
  initialValues?: FormSchema;
  loading: boolean;
  vat: number;
  onSave(value: FormSchema): void;
}

const SaleForm: FC<ISaleFormProps> = ({
  backTo,
  clients,
  companyId = null,
  initialValues = {
    ...formSchema,
    companyId,
    status: 'confirmed', // TODO: This needs to be a option
  },
  loading,
  onSave,
  vat,
}) => {
  const { t } = useTranslation('accounts');
  const validationSchema = object().shape({
    amount: number().required(t('sales-form.sale-amount.amount.required')),
    companyId: string().required(),
    date: date().required(t('sales-form.sale-details.date.required')),
    description: string().required(
      t('sales-form.sale-details.description.required'),
    ),
    name: string().required(t('sales-form.sale-details.name.required')),
    vat: number().required(t('sales-form.sale-amount.vat.required')),
  });
  const onInputValue = (
    event: ChangeEvent<HTMLInputElement>,
    form: FormikProps<FormikValues>,
  ) => {
    const { setFieldValue } = form;
    const value = parseFloat(
      event.target.value.replace(t('sales-form.currency'), ''),
    );
    const calculated = ((value / 100) * vat).toFixed(2);

    setFieldValue('vat', calculated);
  };
  const onPreSubmit = (values: FormSchema) => ({
    ...values,
    category: t('sales-form.category'), // TODO: Handle this API side
  });

  return (
    <Form
      initialValues={initialValues}
      loading={loading}
      validationSchema={validationSchema}
      submitLabel={t('sales-form.save')}
      onPreSubmit={onPreSubmit}
      onSubmit={onSave}
      cancel={
        <LinkButton block to={backTo} colour="secondary" size="lg">
          {t('sales-form.cancel')}
        </LinkButton>
      }
    >
      <Row>
        <Col xs={12} md={6}>
          <Card padding="lg">
            <Typography rule component="h3" variant="h3">
              {t('sales-form.sale-details.heading')}
            </Typography>

            <Select
              label={t('sales-form.sale-details.name.label')}
              name="name"
              options={clients}
              placeholder={t('sales-form.sale-details.name.placeholder')}
            />

            <TextBox
              label={t('sales-form.sale-details.description.label')}
              name="description"
            />

            <DatePicker
              label={t('sales-form.sale-details.date.label')}
              name="date"
            />
          </Card>
        </Col>

        <Col xs={12} md={6}>
          <Card padding="lg">
            <Typography rule component="h3" variant="h3">
              {t('sales-form.sale-amount.heading')}
            </Typography>

            <TextBox
              decimalScale={2}
              label={t('sales-form.sale-amount.amount.label')}
              name="amount"
              onChange={onInputValue}
              prefix={t('sales-form.currency')}
            />

            <TextBox
              decimalScale={2}
              label={t('sales-form.sale-amount.vat.label')}
              name="vat"
              prefix={t('sales-form.currency')}
            />
          </Card>
        </Col>
      </Row>
    </Form>
  );
};

export default memo(SaleForm);
