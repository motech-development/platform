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
  bank: {
    accountNumber: '',
    sortCode: '',
  },
  companyNumber: '',
  contact: {
    email: '',
    telephone: '',
  },
  id: '',
  name: '',
  vatRegistration: '',
};

export type FormSchema = typeof formSchema;

export interface ICompanyFormProps {
  backTo: string;
  initialValues?: FormSchema;
  loading: boolean;
  onSave(value: FormSchema): void;
}

const CompanyForm: FC<ICompanyFormProps> = ({
  backTo,
  initialValues = formSchema,
  loading,
  onSave,
}) => {
  const { t } = useTranslation('my-companies');
  const validationSchema = object().shape({
    address: object().shape({
      line1: string().required(t('company-form.address.line1.required')),
      line2: string(),
      line3: string().required(t('company-form.address.line3.required')),
      line4: string(),
      line5: string()
        .matches(
          regex.address.postcode,
          t('company-form.address.line5.invalid'),
        )
        .required(t('company-form.address.line5.required')),
    }),
    bank: object().shape({
      accountNumber: string()
        .matches(
          regex.bank.accountNumber,
          t('company-form.bank.account-number.invalid'),
        )
        .required(t('company-form.bank.account-number.required')),
      sortCode: string()
        .matches(regex.bank.sortCode, t('company-form.bank.sort-code.invalid'))
        .required(t('company-form.bank.sort-code.required')),
    }),
    companyNumber: string()
      .matches(
        regex.companyNumber,
        t('company-form.company-details.company-number.invalid'),
      )
      .required(t('company-form.company-details.company-number.required')),
    contact: object().shape({
      email: string()
        .email(t('company-form.contact.email.invalid'))
        .required(t('company-form.contact.email.required')),
      telephone: string()
        .matches(
          regex.contact.telephone,
          t('company-form.contact.telephone.invalid'),
        )
        .required(t('company-form.contact.telephone.required')),
    }),
    name: string().required(t('company-form.company-details.name.required')),
    vatRegistration: string().matches(
      regex.vatRegistration,
      t('company-form.company-details.vat-registration.invalid'),
    ),
  });

  return (
    <Form
      initialValues={initialValues}
      loading={loading}
      validationSchema={validationSchema}
      submitLabel={t('company-form.save')}
      onSubmit={onSave}
      cancel={() => (
        <LinkButton block to={backTo} colour="danger" size="lg">
          {t('company-form.cancel')}
        </LinkButton>
      )}
    >
      <Row>
        <Col xs={12} md={6}>
          <Row>
            <Col xs={12}>
              <Card padding="lg">
                <Typography rule component="h3" variant="h3">
                  {t('company-form.company-details.heading')}
                </Typography>

                <TextBox
                  name="name"
                  label={t('company-form.company-details.name.label')}
                />

                <TextBox
                  name="companyNumber"
                  label={t('company-form.company-details.company-number.label')}
                  format="########"
                />

                <TextBox
                  name="vatRegistration"
                  label={t(
                    'company-form.company-details.vat-registration.label',
                  )}
                  format="GB#########"
                />
              </Card>
            </Col>

            <Col xs={12}>
              <Card padding="lg">
                <Typography rule component="h3" variant="h3">
                  {t('company-form.bank.heading')}
                </Typography>

                <TextBox
                  name="bank.accountNumber"
                  label={t('company-form.bank.account-number.label')}
                  format="########"
                />

                <TextBox
                  name="bank.sortCode"
                  label={t('company-form.bank.sort-code.label')}
                  format="##-##-##"
                />
              </Card>
            </Col>
          </Row>
        </Col>

        <Col xs={12} md={6}>
          <Row>
            <Col xs={12}>
              <Card padding="lg">
                <Typography rule component="h3" variant="h3">
                  {t('company-form.address.heading')}
                </Typography>

                <AddressFields />
              </Card>
            </Col>

            <Col xs={12}>
              <Card padding="lg">
                <Typography rule component="h3" variant="h3">
                  {t('company-form.contact.heading')}
                </Typography>

                <ContactDetailsFields />
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Form>
  );
};

export default memo(CompanyForm);
