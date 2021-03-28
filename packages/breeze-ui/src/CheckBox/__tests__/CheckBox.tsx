import { act, fireEvent, render, RenderResult } from '@testing-library/react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import CheckBox from '../CheckBox';

interface IInitialValues {
  test: boolean;
}

describe('CheckBox', () => {
  let component: RenderResult;
  let initialValues: IInitialValues;
  let validationSchema: Yup.ObjectSchema<IInitialValues>;
  let onChange: jest.Mock;
  let onSubmit: jest.Mock;

  beforeEach(() => {
    onChange = jest.fn();
    onSubmit = jest.fn();
    validationSchema = Yup.object()
      .shape({
        test: Yup.boolean().oneOf([true]).required(),
      })
      .required();
  });

  describe('disabled', () => {
    beforeEach(() => {
      initialValues = {
        test: false,
      };

      component = render(
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
          {() => (
            <Form>
              <CheckBox disabled label="Test" legend="Tick this" name="test" />
            </Form>
          )}
        </Formik>,
      );
    });

    it('should should be disabled', async () => {
      const { findByLabelText } = component;

      await expect(findByLabelText('Test')).resolves.toHaveAttribute(
        'disabled',
      );
    });

    it('should render the correct styles', () => {
      const { container } = component;
      const label = container.querySelector('label');

      expect(label).toHaveStyle(`
        background: #fff;
        border-bottom: 2px solid #eee;
        color: #767676;
      `);
    });
  });

  describe('read only', () => {
    beforeEach(() => {
      initialValues = {
        test: true,
      };

      component = render(
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
          {() => (
            <Form>
              <CheckBox readOnly label="Test" legend="Tick this" name="test" />
            </Form>
          )}
        </Formik>,
      );
    });

    it('should should be disabled', async () => {
      const { findByLabelText } = component;

      await expect(findByLabelText('Test')).resolves.toHaveAttribute(
        'disabled',
      );
    });

    it('should render the correct styles', () => {
      const { container } = component;
      const label = container.querySelector('label');

      expect(label).toHaveStyle(`
        background: #007fa8;
        border-bottom: 2px solid #00779e;
        color: #fff;
      `);
    });
  });

  describe('validation', () => {
    beforeEach(() => {
      initialValues = {
        test: false,
      };

      component = render(
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {() => (
            <Form>
              <CheckBox readOnly label="Test" legend="Tick this" name="test" />
            </Form>
          )}
        </Formik>,
      );
    });

    it('should have the correct colour legend when input is valid', async () => {
      const { findByLabelText, findByText } = component;

      await act(async () => {
        const option = await findByLabelText('Test');

        fireEvent.click(option);

        fireEvent.blur(option);
      });

      await expect(findByText('Tick this')).resolves.toHaveStyle(`
        color: #007aa3;
        font-size: 16px;
        margin-bottom: 10px;
      `);
    });

    it('should have the correct colour legend when input is invalid', async () => {
      const { findByLabelText, findByText } = component;

      await act(async () => {
        const option = await findByLabelText('Test');

        fireEvent.focus(option);

        fireEvent.blur(option);
      });

      await expect(findByText('Tick this')).resolves.toHaveStyleRule(
        'color',
        'rgb(199,56,79)',
      );
    });

    it('should display an error if input is invalid', async () => {
      const { findByLabelText, findByRole } = component;

      await act(async () => {
        const option = await findByLabelText('Test');

        fireEvent.focus(option);

        fireEvent.blur(option);
      });

      await expect(findByRole('alert')).resolves.toBeInTheDocument();
    });
  });

  it('should not show the help text if not set', () => {
    initialValues = {
      test: true,
    };

    const { queryByText } = render(
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {() => (
          <Form>
            <CheckBox label="Test" legend="Tick this" name="test" />
          </Form>
        )}
      </Formik>,
    );

    expect(queryByText('This is help text')).not.toBeInTheDocument();
  });

  it('should show the help text', async () => {
    initialValues = {
      test: true,
    };

    const { findByText } = render(
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {() => (
          <Form>
            <CheckBox
              label="Test"
              legend="Tick this"
              name="test"
              helpText="This is help text"
            />
          </Form>
        )}
      </Formik>,
    );

    await expect(findByText('This is help text')).resolves.toBeInTheDocument();
  });

  it('should call on change when set', async () => {
    const { findByLabelText } = render(
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {() => (
          <Form>
            <CheckBox
              onChange={onChange}
              label="Test"
              legend="Tick this"
              name="test"
              helpText="This is help text"
            />
          </Form>
        )}
      </Formik>,
    );

    await act(async () => {
      const option = await findByLabelText('Test');

      fireEvent.click(option);
    });

    expect(onChange).toHaveBeenCalled();
  });
});
