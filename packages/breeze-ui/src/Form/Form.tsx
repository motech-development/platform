import { Form as FormikForm, Formik, FormikValues } from 'formik';
import React, { ElementType, FC, memo, ReactNode } from 'react';
import Button from '../Button/Button';
import Col from '../Col/Col';
import Row from '../Row/Row';

function isObject(value: unknown) {
  return typeof value === 'object' && !Array.isArray(value) && value !== null;
}

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

export interface IFormProps<T extends FormikValues = FormikValues> {
  children: ReactNode;
  cancel?: ElementType;
  initialValues: T;
  onSubmit(value: T): void;
  submitLabel: string;
  validationSchema: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

const Form: FC<IFormProps> = ({
  children,
  cancel: Cancel = undefined,
  initialValues,
  onSubmit,
  submitLabel,
  validationSchema,
}) => (
  <Formik
    validateOnMount
    initialValues={formNormaliser(initialValues)}
    validationSchema={validationSchema}
    onSubmit={onSubmit}
  >
    {({ isValid }) => (
      <FormikForm autoComplete="off">
        <Row>
          <Col>{children}</Col>

          <Col>
            <Row>
              <Col xs={12} md={Cancel ? 3 : 6} mdOffset={7}>
                <Button block type="submit" disabled={!isValid} size="lg">
                  {submitLabel}
                </Button>
              </Col>

              {Cancel && (
                <Col xs={12} md={3}>
                  <Cancel />
                </Col>
              )}
            </Row>
          </Col>
        </Row>
      </FormikForm>
    )}
  </Formik>
);

export default memo(Form);
