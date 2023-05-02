import { Form as FormikForm, Formik, FormikValues } from 'formik';
import { FC, ReactNode } from 'react';
import { ObjectSchema } from 'yup';
import Button from '../Button/Button';
import Col from '../Col/Col';
import Row from '../Row/Row';

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && !Array.isArray(value) && value !== null;

function encodeNullValues<T extends Record<string, unknown>>(
  values: T,
): Record<string, T> {
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
  }, {});
}

function formNormaliser<T extends Record<string, unknown>>(values: T) {
  return encodeNullValues({
    ...values,
  });
}

export interface IFormProps {
  children: ReactNode;
  cancel?: ReactNode;
  initialValues: FormikValues;
  loading?: boolean;
  onPreSubmit?(values: FormikValues): FormikValues | Promise<FormikValues>;
  onSubmit(values: FormikValues): void | Promise<void>;
  submitLabel: string;
  validationSchema: ObjectSchema<FormikValues>;
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
};

export default Form;
