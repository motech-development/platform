import {
  Card,
  Col,
  Form,
  LinkButton,
  Row,
  TextBox,
  Typography,
} from '@motech-development/breeze-ui';
import { useTranslation } from 'react-i18next';
import { object, string } from 'yup';
import { GetClientQuery } from '../graphql/graphql';
import { useAddress, useContactDetails } from '../hooks/schema';
import { AddressFields, ContactDetailsFields } from './CommonFields';

const formSchema = {
  address: {
    line1: '',
    line2: undefined,
    line3: '',
    line4: undefined,
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

export type FormSchema = GetClientQuery['getClient'];

export interface IClientFormProps {
  backTo: string;
  companyId?: string;
  initialValues?: FormSchema;
  loading: boolean;
  onSave(value: FormSchema): void;
}

function ClientForm({
  backTo,
  companyId = '',
  initialValues = {
    ...formSchema,
    companyId,
  },
  loading,
  onSave,
}: IClientFormProps) {
  const { t } = useTranslation('clients');
  const address = useAddress();
  const contact = useContactDetails();
  const validationSchema = object<FormSchema>()
    .shape({
      address,
      companyId: string().required(),
      contact,
      name: string().required(t('client-form.client-details.name.required')),
    })
    .required();

  return (
    <Form
      initialValues={initialValues}
      loading={loading}
      validationSchema={validationSchema}
      submitLabel={t('client-form.save')}
      onSubmit={onSave}
      cancel={
        <LinkButton block to={backTo} colour="secondary" size="lg">
          {t('client-form.cancel')}
        </LinkButton>
      }
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
}

export default ClientForm;
