import {
  Card,
  Col,
  Form,
  LinkButton,
  Row,
  Typography,
} from '@motech-development/breeze-ui';
import { useTranslation } from 'react-i18next';
import { object } from 'yup';
import { GetCompanyQuery } from '../graphql/graphql';
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

export type FormSchema = GetCompanyQuery['getCompany'];

export interface ICompanyFormProps {
  backTo: string;
  initialValues: FormSchema;
  loading: boolean;
  onSave(value: FormSchema): void;
}

function CompanyForm({
  backTo,
  initialValues,
  loading,
  onSave,
}: ICompanyFormProps) {
  const { t } = useTranslation('my-companies');
  const address = useAddress();
  const bank = useBank();
  const company = useCompanyDetails();
  const contact = useContactDetails();
  const validationSchema = object<FormSchema>()
    .concat(company)
    .shape({
      address,
      bank,
      contact,
    })
    .required();

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
}

export default CompanyForm;
