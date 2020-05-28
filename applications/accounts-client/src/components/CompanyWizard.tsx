import {
  Button,
  Card,
  Col,
  LinkButton,
  Row,
  Stepper,
  TextBox,
  Typography,
} from '@motech-development/breeze-ui';
import { Form, Formik } from 'formik';
import React, { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { number, object, string } from 'yup';
import regex from '../regex';
import AddressFields from './AddressFields';
import ContactDetailsFields from './ContactDetailsFields';

const formSchema = {
  balance: {
    balance: 0,
    vat: {
      owed: 0,
      paid: 0,
    },
  },
  company: {
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
  },
  vat: {
    charge: 20,
    pay: 20,
  },
};

export type FormSchema = typeof formSchema;

export interface ICompanyWizardProps {
  backTo: string;
  loading: boolean;
  onSave(value: FormSchema): void;
}

const CompanyWizard: FC<ICompanyWizardProps> = ({
  backTo,
  loading,
  onSave,
}) => {
  const { t } = useTranslation('my-companies');
  const currency = t('company-form.currency');
  const validationSchema = object().shape({
    balance: object().shape({
      balance: number().required(
        t('company-form.accounts-settings.balance.required'),
      ),
      vat: object().shape({
        owed: number().required(
          t('company-form.accounts-settings.vat-owed.required'),
        ),
        paid: number().required(
          t('company-form.accounts-settings.vat-paid.required'),
        ),
      }),
    }),
    company: object().shape({
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
          .matches(
            regex.bank.sortCode,
            t('company-form.bank.sort-code.invalid'),
          )
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
    }),
    vat: object().shape({
      charge: number().required(t('company-form.vat-settings.charge.required')),
      pay: number().required(t('company-form.vat-settings.pay.required')),
    }),
  });

  return (
    <Formik
      enableReinitialize={false}
      validateOnMount
      initialValues={formSchema}
      validationSchema={validationSchema}
      onSubmit={onSave}
    >
      {({ isValid }) => (
        <Form>
          <Stepper
            previousLabel={t('company-form.details')}
            nextLabel={t('company-form.settings')}
            onComplete={
              <Button
                block
                type="submit"
                colour="success"
                disabled={!isValid}
                loading={loading}
                size="lg"
              >
                {t('company-form.save')}
              </Button>
            }
            onStart={
              <LinkButton block to={backTo} colour="secondary" size="lg">
                {t('company-form.cancel')}
              </LinkButton>
            }
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
                        name="company.name"
                        label={t('company-form.company-details.name.label')}
                      />

                      <TextBox
                        name="company.companyNumber"
                        label={t(
                          'company-form.company-details.company-number.label',
                        )}
                        format="########"
                      />

                      <TextBox
                        name="company.vatRegistration"
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
                        name="company.bank.accountNumber"
                        label={t('company-form.bank.account-number.label')}
                        format="########"
                      />

                      <TextBox
                        name="company.bank.sortCode"
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

                      <AddressFields prefix="company" />
                    </Card>
                  </Col>

                  <Col xs={12}>
                    <Card padding="lg">
                      <Typography rule component="h3" variant="h3">
                        {t('company-form.contact.heading')}
                      </Typography>

                      <ContactDetailsFields prefix="company" />
                    </Card>
                  </Col>
                </Row>
              </Col>
            </Row>

            <Row>
              <Col xs={12} md={6}>
                <Card padding="lg">
                  <Typography rule component="h3" variant="h3">
                    {t('company-form.vat-settings.heading')}
                  </Typography>

                  <TextBox
                    suffix="%"
                    name="vat.charge"
                    label={t('company-form.vat-settings.charge.label')}
                  />

                  <TextBox
                    suffix="%"
                    name="vat.pay"
                    label={t('company-form.vat-settings.pay.label')}
                  />
                </Card>
              </Col>

              <Col xs={12} md={6}>
                <Card padding="lg">
                  <Typography rule component="h3" variant="h3">
                    {t('company-form.accounts-settings.heading')}
                  </Typography>

                  <TextBox
                    decimalScale={2}
                    name="balance.balance"
                    label={t('company-form.accounts-settings.balance.label')}
                    prefix={currency}
                  />

                  <TextBox
                    decimalScale={2}
                    name="balance.vat.owed"
                    label={t('company-form.accounts-settings.vat-owed.label')}
                    prefix={currency}
                  />

                  <TextBox
                    decimalScale={2}
                    name="balance.vat.paid"
                    label={t('company-form.accounts-settings.vat-paid.label')}
                    prefix={currency}
                  />
                </Card>
              </Col>
            </Row>
          </Stepper>
        </Form>
      )}
    </Formik>
  );
};

export default memo(CompanyWizard);
