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
import React, { FC, Fragment, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { array, object, string } from 'yup';

export type FormSchema = {
  categories: {
    name: string;
    vatRate: number;
  }[];
  id: string;
  vat: {
    charge: number;
    pay: number;
  };
};

export interface ISettingsFormProps {
  backTo: string;
  initialValues: FormSchema;
  loading: boolean;
  onSave(value: FormSchema): void;
}

const SettingsForm: FC<ISettingsFormProps> = ({
  backTo,
  initialValues,
  loading,
  onSave,
}) => {
  const { t } = useTranslation('settings');
  const validationSchema = object().shape({
    categories: array().of(
      object().shape({
        name: string().required(
          t('settings-form.expense-categories.name.required'),
        ),
        vatRate: string().required(
          t('settings-form.expense-categories.vat-rate.required'),
        ),
      }),
    ),
    vat: object().shape({
      charge: string().required(t('settings-form.vat.charge.required')),
      pay: string().required(t('settings-form.vat.pay.required')),
    }),
  });

  return (
    <Formik
      validateOnMount
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSave}
    >
      {({ isValid, values }) => (
        <Form autoComplete="off">
          <Row>
            <Col>
              <Card padding="lg">
                <Typography rule component="h3" variant="h3">
                  {t('settings-form.vat.title')}
                </Typography>

                <TextBox
                  suffix="%"
                  name="vat.charge"
                  label={t('settings-form.vat.charge.label')}
                />

                <TextBox
                  suffix="%"
                  name="vat.pay"
                  label={t('settings-form.vat.pay.label')}
                />
              </Card>
            </Col>

            <Col>
              <Card padding="lg">
                <Typography rule component="h3" variant="h3">
                  {t('settings-form.expense-categories.title')}
                </Typography>

                <FieldArray
                  name="categories"
                  render={arrayHelpers => (
                    <Row>
                      <Col>
                        <Row>
                          {values.categories.map((_, index) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <Fragment key={index}>
                              <Col xs={7} sm={5} md={6}>
                                <TextBox
                                  spacing="sm"
                                  name={`categories.${index}.name`}
                                  label={t(
                                    'settings-form.expense-categories.name.label',
                                  )}
                                />
                              </Col>

                              <Col xs={5} sm={4}>
                                <TextBox
                                  suffix="%"
                                  spacing="sm"
                                  name={`categories.${index}.vatRate`}
                                  label={t(
                                    'settings-form.expense-categories.vat-rate.label',
                                  )}
                                />
                              </Col>

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
                              name: '',
                              vatRate: 0,
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
