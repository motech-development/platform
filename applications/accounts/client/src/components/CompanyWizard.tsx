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
import { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { number, object } from 'yup';
import {
  useAddress,
  useBank,
  useCompanyDetails,
  useContactDetails,
  useVatSettings,
  useYearEnd,
} from '../hooks/schema';
import {
  AddressFields,
  BankFields,
  CompanyDetailsFields,
  ContactDetailsFields,
  VatSettingsFields,
  YearEndFields,
} from './CommonFields';

const today = new Date();

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
  },
  vat: {
    charge: 20,
    pay: 20,
    registration: '',
    scheme: '',
  },
  yearEnd: {
    day: today.getDate(),
    month: today.getMonth(),
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
  const address = useAddress();
  const bank = useBank();
  const company = useCompanyDetails();
  const contact = useContactDetails();
  const vat = useVatSettings();
  const yearEnd = useYearEnd();
  const validationSchema = object<FormSchema>()
    .shape({
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
      company: object().concat(company).shape({
        address,
        bank,
        contact,
      }),
      vat,
      yearEnd,
    })
    .required();

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

                      <CompanyDetailsFields prefix="company" />
                    </Card>
                  </Col>

                  <Col xs={12}>
                    <Card padding="lg">
                      <Typography rule component="h3" variant="h3">
                        {t('company-form.bank.heading')}
                      </Typography>

                      <Typography component="p" variant="lead">
                        {t('company-form.bank.description')}
                      </Typography>

                      <BankFields prefix="company" />
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

                  <VatSettingsFields prefix="vat" />
                </Card>
              </Col>

              <Col xs={12} md={6}>
                <Row>
                  <Col>
                    <Card padding="lg">
                      <Typography rule component="h3" variant="h3">
                        {t('company-form.year-end-settings.heading')}
                      </Typography>

                      <YearEndFields prefix="yearEnd" />
                    </Card>
                  </Col>

                  <Col>
                    <Card padding="lg">
                      <Typography rule component="h3" variant="h3">
                        {t('company-form.accounts-settings.heading')}
                      </Typography>

                      <TextBox
                        decimalScale={2}
                        name="balance.balance"
                        label={t(
                          'company-form.accounts-settings.balance.label',
                        )}
                        prefix={currency}
                      />

                      <TextBox
                        decimalScale={2}
                        name="balance.vat.owed"
                        label={t(
                          'company-form.accounts-settings.vat-owed.label',
                        )}
                        prefix={currency}
                      />

                      <TextBox
                        decimalScale={2}
                        name="balance.vat.paid"
                        label={t(
                          'company-form.accounts-settings.vat-paid.label',
                        )}
                        prefix={currency}
                      />
                    </Card>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Stepper>
        </Form>
      )}
    </Formik>
  );
};

export default memo(CompanyWizard);
