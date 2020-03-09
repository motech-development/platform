import { Button, Col, Row, TextBox } from '@motech-development/breeze-ui';
import { Form, Formik } from 'formik';
import React, { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { object, string } from 'yup';

const formSchema = {
  name: '',
};

export type FormSchema = typeof formSchema;

export interface IConfirmDeleteProps {
  loading: boolean;
  name: string;
  onCancel(): void;
  onDelete(input: FormSchema): void;
}

const ConfirmDelete: FC<IConfirmDeleteProps> = ({
  loading,
  name,
  onCancel,
  onDelete,
}) => {
  const { t } = useTranslation('confirm-delete');
  const validationSchema = object().shape({
    name: string()
      .oneOf(
        [name],
        t('does-not-match', {
          name,
        }),
      )
      .required(t('required')),
  });

  return (
    <Formik
      validateOnMount
      initialValues={formSchema}
      validationSchema={validationSchema}
      onSubmit={onDelete}
    >
      {({ isValid }) => (
        <Form autoComplete="off">
          <TextBox
            name="name"
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
                disabled={!isValid}
              >
                {t('delete')}
              </Button>
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default memo(ConfirmDelete);
