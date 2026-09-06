import { Button, Col, Row, TextBox } from '@motech-development/breeze-ui';
import { Form, Formik, FormikProps } from 'formik';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { object, string } from 'yup';

const formSchema = {
  confirmation: '',
};

export type FormSchema = typeof formSchema;

export interface IConfirmDeleteProps {
  loading: boolean;
  name: string;
  onCancel: () => void;
  onDelete: (input: FormSchema) => void;
}

function ConfirmDelete({
  loading,
  name,
  onCancel,
  onDelete,
}: IConfirmDeleteProps) {
  const { t } = useTranslation('confirm-delete');
  const form = useRef<FormikProps<FormSchema>>(null);
  useEffect(() => {
    form.current?.validateForm().catch(() => {});
  }, [name]);
  const validationSchema = object<FormSchema>()
    .shape({
      confirmation: string()
        .oneOf(
          [name],
          t('does-not-match', {
            name,
          }),
        )
        .required(t('required')),
    })
    .required();

  return (
    <Formik
      validateOnMount
      initialValues={formSchema}
      innerRef={form}
      validationSchema={validationSchema}
      onSubmit={onDelete}
    >
      {({ isValid, values }) => (
        <Form autoComplete="off">
          <TextBox
            name="confirmation"
            label={t('confirm-delete', {
              name,
            })}
          />

          <Row>
            <Col xs={6}>
              <Button block colour="secondary" size="lg" onClick={onCancel}>
                {t('cancel')}
              </Button>
            </Col>
            <Col xs={6}>
              <Button
                block
                type="submit"
                colour="danger"
                size="lg"
                loading={loading}
                disabled={!isValid || values.confirmation !== name}
              >
                {t('delete')}
              </Button>
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  );
}

export default ConfirmDelete;
