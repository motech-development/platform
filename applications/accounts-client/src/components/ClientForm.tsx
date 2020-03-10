import {
  Card,
  Col,
  Form,
  LinkButton,
  Row,
  TextBox,
  Typography,
} from '@motech-development/breeze-ui';
import React, { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { object, string } from 'yup';
import regex from '../regex';
import AddressFields from './AddressFields';
import ContactDetailsFields from './ContactDetailsFields';

const formSchema = {
  address: {
    line1: '',
    line2: '',
    line3: '',
    line4: '',
    line5: '',
  },
  companyId: '',
  contact: {
    email: '',
    telephone: '',
  },
  id: '',
  name: '',
};

export type FormSchema = typeof formSchema;

export interface IClientFormProps {
  backTo: string;
  companyId?: string;
  initialValues?: FormSchema;
  loading: boolean;
  onSave(value: FormSchema): void;
}

const ClientForm: FC<IClientFormProps> = ({
  backTo,
  companyId = null,
  initialValues = {
    ...formSchema,
    companyId,
  },
  loading,
  onSave,
}) => {
  const { t } = useTranslation('clients');
  const validationSchema = object().shape({
    address: object().shape({
      line1: string().required(t('client-form.address.line1.required')),
      line2: string(),
      line3: string().required(t('client-form.address.line3.required')),
      line4: string(),
      line5: string()
        .matches(regex.address.postcode, t('client-form.address.line5.invalid'))
        .required(t('client-form.address.line5.required')),
    }),
    companyId: string().required(),
    contact: object().shape({
      email: string()
        .email(t('client-form.contact.email.invalid'))
        .required(t('client-form.contact.email.required')),
      telephone: string()
        .matches(
          regex.contact.telephone,
          t('client-form.contact.telephone.invalid'),
        )
        .required(t('client-form.contact.telephone.required')),
    }),
    name: string().required(t('client-form.client-details.name.required')),
  });

  return (
    <Form
      initialValues={initialValues}
      loading={loading}
      validationSchema={validationSchema}
      submitLabel={t('client-form.save')}
      onSubmit={onSave}
      cancel={() => (
        <LinkButton block to={backTo} colour="danger" size="lg">
          {t('client-form.cancel')}
        </LinkButton>
      )}
    >
      <Row>
        <Col xs={12} md={6}>
          <Row>
            <Col xs={12}>
              <Card padding="lg">
                <Typography rule component="h3" variant="h3">
                  {t('client-form.client-details.heading')}
                </Typography>

                <TextBox
                  name="name"
                  label={t('client-form.client-details.name.label')}
                />
              </Card>
            </Col>

            <Col xs={12}>
              <Card padding="lg">
                <Typography rule component="h3" variant="h3">
                  {t('client-form.contact.heading')}
                </Typography>

                <ContactDetailsFields />
              </Card>
            </Col>
          </Row>
        </Col>

        <Col xs={12} md={6}>
          <Row>
            <Col xs={12}>
              <Card padding="lg">
                <Typography rule component="h3" variant="h3">
                  {t('client-form.address.heading')}
                </Typography>

                <AddressFields />
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Form>
  );
};

export default memo(ClientForm);
