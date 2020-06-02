import {
  Card,
  Col,
  Form,
  LinkButton,
  Row,
  Typography,
} from '@motech-development/breeze-ui';
import React, { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { object } from 'yup';
import {
  useAddress,
  useBank,
  useCompanyDetails,
  useContactDetails,
} from '../hooks/schema';
import {
  AddressFields,
  BankFields,
  CompanyDetailsFields,
  ContactDetailsFields,
} from './CommonFields';

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
  onSave(value: FormSchema): Promise<void>;
}

const CompanyForm: FC<ICompanyFormProps> = ({
  backTo,
  initialValues = formSchema,
  loading,
  onSave,
}) => {
  const { t } = useTranslation('my-companies');
  const address = useAddress();
  const bank = useBank();
  const company = useCompanyDetails();
  const contact = useContactDetails();
  const validationSchema = object()
    .concat(company)
    .shape({
      address,
      bank,
      contact,
    });

  return (
    <Form
      initialValues={initialValues}
      loading={loading}
      validationSchema={validationSchema}
      submitLabel={t('company-form.save')}
      onSubmit={onSave}
      cancel={
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

                <CompanyDetailsFields />
              </Card>
            </Col>

            <Col xs={12}>
              <Card padding="lg">
                <Typography rule component="h3" variant="h3">
                  {t('company-form.bank.heading')}
                </Typography>

                <BankFields />
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
