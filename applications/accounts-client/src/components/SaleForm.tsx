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
import React, { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { date, number, object, string } from 'yup';

const formSchema = {
  amount: '',
  companyId: '',
  date: '',
  description: '',
  name: '',
  vat: '',
};

export type FormSchema = typeof formSchema;

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
  const onPreSubmit = (values: FormSchema) => ({
    ...values,
    category: t('sales-form.category'),
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
              options={clients}
              name="name"
              label={t('sales-form.sale-details.name.label')}
              placeholder={t('sales-form.sale-details.name.placeholder')}
            />

            <TextBox
              name="description"
              label={t('sales-form.sale-details.description.label')}
            />

            <DatePicker
              name="date"
              label={t('sales-form.sale-details.date.label')}
            />
          </Card>
        </Col>

        <Col xs={12} md={6}>
          <Card padding="lg">
            <Typography rule component="h3" variant="h3">
              {t('sales-form.sale-amount.heading')}
            </Typography>

            <TextBox
              name="amount"
              label={t('sales-form.sale-amount.amount.label')}
              prefix={t('sales-form.currency')}
              decimalScale={2}
              onChange={(e, { setFieldValue }) => {
                const value = parseFloat(
                  e.target.value.replace(t('sales-form.currency'), ''),
                );
                const calculated = ((value / 100) * vat).toFixed(2);

                setFieldValue('vat', calculated);
              }}
            />

            <TextBox
              name="vat"
              label={t('sales-form.sale-amount.vat.label')}
              prefix={t('sales-form.currency')}
              decimalScale={2}
            />
          </Card>
        </Col>
      </Row>
    </Form>
  );
};

export default memo(SaleForm);
