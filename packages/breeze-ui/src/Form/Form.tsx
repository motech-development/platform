import { Form as FormikForm, Formik, FormikValues } from 'formik';
import React, { FC, memo, ReactNode } from 'react';
import Button from '../Button/Button';
import Col from '../Col/Col';
import Row from '../Row/Row';

const isObject = (value: unknown) => {
  return typeof value === 'object' && !Array.isArray(value) && value !== null;
};

function encodeNullValues<T>(values: T) {
  const initialValues = {
    ...values,
  };

  Object.keys(initialValues).forEach(key => {
    const value = initialValues[key];

    if (value === null) {
      initialValues[key] = '';
    } else if (isObject(value)) {
      initialValues[key] = encodeNullValues(value);
    }
  });

  return initialValues;
}

function formNormaliser<T>(values: T) {
  let initialValues = {
    ...values,
  };

  initialValues = encodeNullValues(initialValues);

  return initialValues;
}

export interface IFormProps {
  children: ReactNode;
  cancel?: ReactNode;
  initialValues: FormikValues;
  loading?: boolean;
  onPreSubmit?(values: FormikValues): FormikValues | Promise<FormikValues>;
  onSubmit(values: FormikValues): void | Promise<void>;
  submitLabel: string;
  validationSchema: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

const Form: FC<IFormProps> = ({
  children,
  cancel = null,
  initialValues,
  loading = false,
  onPreSubmit = null,
  onSubmit,
  submitLabel,
  validationSchema,
}) => {
  const doSubmit = async (values: FormikValues) => {
    const payload = onPreSubmit ? await onPreSubmit(values) : values;

    await onSubmit(payload);
  };

  return (
    <Formik
      validateOnMount
      initialValues={formNormaliser(initialValues)}
      validationSchema={validationSchema}
      onSubmit={doSubmit}
    >
      {({ isValid }) => (
        <FormikForm autoComplete="off">
          <Row>
            <Col>{children}</Col>

            <Col>
              <Row>
                <Col xs={12} md={cancel ? 3 : 6} mdOffset={7}>
                  <Button
                    block
                    type="submit"
                    colour="success"
                    disabled={!isValid}
                    size="lg"
                    loading={loading}
                  >
                    {submitLabel}
                  </Button>
                </Col>

                {cancel && (
                  <Col xs={12} md={3}>
                    {cancel}
                  </Col>
                )}
              </Row>
            </Col>
          </Row>
        </FormikForm>
      )}
    </Formik>
  );
};

export default memo(Form);
