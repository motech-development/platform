import {
  Button,
  Card,
  Col,
  LinkButton,
  Row,
  TextBox,
  Typography,
} from '@motech-development/breeze-ui';
import { FieldArray, Form, Formik } from 'formik';
import { FC, Fragment, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { array, boolean, object, string } from 'yup';
import { useVatSettings, useYearEnd } from '../hooks/schema';
import { VatSettingsFields, YearEndFields } from './CommonFields';

export type FormSchema = {
  categories: {
    name: string;
    protect: boolean;
    vatRate: number;
  }[];
  id: string;
  vat: {
    charge: number;
    pay: number;
    registration: string;
    scheme: string;
  };
  yearEnd: {
    day: number;
    month: number;
  };
};

export interface ISettingsFormProps {
  backTo: string;
  bank: {
    connected: boolean;
    disconnectLoading: boolean;
    link: string;
    name: string;
    onDisconnect(): void;
  };
  initialValues: FormSchema;
  loading: boolean;
  onSave(value: FormSchema): void;
}

const SettingsForm: FC<ISettingsFormProps> = ({
  backTo,
  bank,
  initialValues,
  loading,
  onSave,
}) => {
  const { t } = useTranslation('settings');
  const { connected, disconnectLoading, link, name, onDisconnect } = bank;
  const vat = useVatSettings();
  const yearEnd = useYearEnd();
  const validationSchema = object<FormSchema>()
    .shape({
      categories: array().of(
        object()
          .shape({
            name: string().required(
              t('settings-form.expense-categories.name.required'),
            ),
            protect: boolean().required(),
            vatRate: string().required(
              t('settings-form.expense-categories.vat-rate.required'),
            ),
          })
          .required(),
      ),
      id: string().required(),
      vat,
      yearEnd,
    })
    .required();

  return (
    <Formik
      validateOnMount
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSave}
    >
      {({ isValid, values }) => (
        <Form autoComplete="off" aria-label="form">
          <Row>
            <Col>
              <Card padding="lg">
                <Typography rule component="h3" variant="h3">
                  {t('settings-form.expense-categories.title')}
                </Typography>

                <FieldArray
                  name="categories"
                  render={(arrayHelpers) => (
                    <Row>
                      <Col>
                        <Row>
                          {values.categories.map(({ protect }, index) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <Fragment key={index}>
                              <Col xs={7} sm={5} md={6}>
                                <TextBox
                                  spacing="sm"
                                  name={`categories.${index}.name`}
                                  label={t(
                                    'settings-form.expense-categories.name.label',
                                  )}
                                  readOnly={protect}
                                />

                                <input
                                  type="hidden"
                                  name={`categories.${index}.protect`}
                                />
                              </Col>

                              <Col
                                xs={5}
                                sm={protect ? 7 : 4}
                                md={protect ? 6 : 4}
                              >
                                <TextBox
                                  suffix="%"
                                  spacing="sm"
                                  name={`categories.${index}.vatRate`}
                                  label={t(
                                    'settings-form.expense-categories.vat-rate.label',
                                  )}
                                  readOnly={protect}
                                />
                              </Col>

                              {!protect && (
                                <Col sm={3} md={2}>
                                  <Button
                                    block
                                    size="lg"
                                    colour="danger"
                                    onClick={() => arrayHelpers.remove(index)}
                                  >
                                    {t(
                                      'settings-form.expense-categories.remove-category',
                                    )}
                                  </Button>
                                </Col>
                              )}
                            </Fragment>
                          ))}
                        </Row>
                      </Col>

                      <Col>
                        <Button
                          block
                          size="lg"
                          onClick={() =>
                            arrayHelpers.push({
                              __typename: 'ExpenseCategory',
                              name: '',
                              protect: false,
                              vatRate: 20,
                            })
                          }
                        >
                          {t('settings-form.expense-categories.add-category')}
                        </Button>
                      </Col>
                    </Row>
                  )}
                />
              </Card>
            </Col>

            <Col xs={12} md={6}>
              <Row>
                <Col>
                  <Card padding="lg">
                    <Typography rule component="h3" variant="h3">
                      {t('settings-form.year-end.title')}
                    </Typography>

                    <YearEndFields prefix="yearEnd" />
                  </Card>
                </Col>

                <Col>
                  <Card padding="lg">
                    <Typography rule component="h3" variant="h3">
                      {t('settings-form.bank.title')}
                    </Typography>

                    {connected ? (
                      <Typography component="p" variant="lead" margin="none">
                        {t('settings-form.bank.lead-connected', {
                          name,
                        })}
                      </Typography>
                    ) : (
                      <Typography component="p" variant="lead" margin="none">
                        {t('settings-form.bank.lead-connect')}
                      </Typography>
                    )}
                  </Card>

                  {connected ? (
                    <Button
                      block
                      size="lg"
                      colour="danger"
                      loading={disconnectLoading}
                      onClick={onDisconnect}
                    >
                      {t('settings-form.bank.disconnect')}
                    </Button>
                  ) : (
                    <LinkButton block size="lg" to={link}>
                      {t('settings-form.bank.connect')}
                    </LinkButton>
                  )}
                </Col>
              </Row>
            </Col>

            <Col xs={12} md={6}>
              <Card padding="lg">
                <Typography rule component="h3" variant="h3">
                  {t('settings-form.vat.title')}
                </Typography>

                <VatSettingsFields prefix="vat" />
              </Card>
            </Col>

            <Col>
              <Row>
                <Col xs={12} md={3} mdOffset={7}>
                  <Button
                    block
                    type="submit"
                    colour="success"
                    disabled={!isValid}
                    size="lg"
                    loading={loading}
                  >
                    {t('settings-form.save')}
                  </Button>
                </Col>

                <Col xs={12} md={3}>
                  <LinkButton block to={backTo} colour="secondary" size="lg">
                    {t('settings-form.cancel')}
                  </LinkButton>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default memo(SettingsForm);
