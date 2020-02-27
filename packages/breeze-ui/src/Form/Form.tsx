import { Form as FormikForm, Formik, FormikValues } from 'formik';
import React, { ElementType, FC, memo, ReactNode } from 'react';
import Button from '../Button/Button';
import Col from '../Col/Col';
import Row from '../Row/Row';

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
    initialValues={initialValues}
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
