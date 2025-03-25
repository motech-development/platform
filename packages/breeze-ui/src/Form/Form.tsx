import { Form as FormikForm, Formik, FormikValues } from 'formik';
import { ReactNode } from 'react';
import { ObjectSchema } from 'yup';
import Button from '../Button/Button';
import Col from '../Col/Col';
import Row from '../Row/Row';

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && !Array.isArray(value) && value !== null;

function encodeNullValues<T extends Record<string, unknown>>(values: T): T {
  const initialValues = {
    ...values,
  };

  return Object.keys(initialValues).reduce((aggregate, key) => {
    const value = initialValues[key];

    if (value === null) {
      return {
        ...aggregate,
        [key]: '',
      };
    }

    if (isObject(value)) {
      return {
        ...aggregate,
        [key]: encodeNullValues(value),
      };
    }

    return {
      ...aggregate,
      [key]: value,
    };
  }, {} as T);
}

function formNormaliser<T extends Record<string, object>>(values: T) {
  return encodeNullValues({
    ...values,
  });
}

export interface IFormProps<T extends FormikValues = FormikValues> {
  children: ReactNode;
  cancel?: ReactNode;
  initialValues: T;
  loading?: boolean;
  onPreSubmit?: (values: T) => T | Promise<T>;
  onSubmit: (values: T) => void | Promise<void>;
  submitLabel: string;
  validationSchema: ObjectSchema<T>;
}

function Form<T extends FormikValues = FormikValues>({
  children,
  cancel = null,
  initialValues,
  loading = false,
  onPreSubmit,
  onSubmit,
  submitLabel,
  validationSchema,
}: IFormProps<T>) {
  const doSubmit = async (values: T) => {
    const payload = onPreSubmit
      ? await Promise.resolve(onPreSubmit(values))
      : values;

    await Promise.resolve(onSubmit(payload));
  };

  return (
    <Formik
      validateOnMount
      initialValues={formNormaliser(initialValues)}
      validationSchema={validationSchema}
      onSubmit={doSubmit}
    >
      {({ isValid }) => (
        <FormikForm autoComplete="off" aria-label="form">
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
}

export default Form;
