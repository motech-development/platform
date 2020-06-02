import {
  act,
  fireEvent,
  render,
  RenderResult,
  wait,
} from '@testing-library/react';
import { Form, Formik } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import Radio, { IRadioOption } from '../Radio';

interface IInitialValues {
  test: string;
}

describe('Radio', () => {
  let component: RenderResult;
  let initialValues: IInitialValues;
  let validationSchema: Yup.ObjectSchema<IInitialValues>;
  let onChange: jest.Mock;
  let onSubmit: jest.Mock;
  let options: IRadioOption[];

  beforeEach(() => {
    onChange = jest.fn();
    onSubmit = jest.fn();
    options = [
      {
        name: 'Option 1',
        value: 'option 1',
      },
      {
        name: 'Option 2',
        value: 'option 2',
      },
    ];
    validationSchema = Yup.object().shape({
      test: Yup.string().required(),
    });
  });

  describe('disabled', () => {
    beforeEach(() => {
      initialValues = {
        test: '',
      };

      component = render(
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
          {() => (
            <Form>
              <Radio disabled options={options} label="Test" name="test" />
            </Form>
          )}
        </Formik>,
      );
    });

    it('should should be disabled', async () => {
      const { findByLabelText } = component;

      await expect(findByLabelText('Option 1')).resolves.toHaveAttribute(
        'disabled',
      );
    });

    it('should render the correct styles', () => {
      const { container } = component;
      const [label] = container.querySelectorAll('label');

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
        test: 'option 2',
      };

      component = render(
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
          {() => (
            <Form>
              <Radio readOnly options={options} label="Test" name="test" />
            </Form>
          )}
        </Formik>,
      );
    });

    it('should should be disabled', async () => {
      const { findByLabelText } = component;

      await expect(findByLabelText('Option 1')).resolves.toHaveAttribute(
        'disabled',
      );
    });

    it('should render the correct styles', () => {
      const { container } = component;
      const [unselected, selected] = container.querySelectorAll('label');

      expect(unselected).toHaveStyle(`
        background: #fff;
        border-bottom: 2px solid #eee;
        color: #000;
      `);

      expect(selected).toHaveStyle(`
        background: #007fa8;
        border-bottom: 2px solid #00779e;
        color: #fff;
      `);
    });
  });

  describe('validation', () => {
    beforeEach(() => {
      initialValues = {
        test: '',
      };

      component = render(
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {() => (
            <Form>
              <Radio readOnly options={options} label="Test" name="test" />
            </Form>
          )}
        </Formik>,
      );
    });

    it('should have the correct colour legend when input is valid', async () => {
      const { findByLabelText, findByText } = component;

      await act(async () => {
        const option = await findByLabelText('Option 1');

        fireEvent.click(option);

        fireEvent.blur(option);

        await wait();
      });

      await expect(findByText('Test')).resolves.toHaveStyle(`
        color: #007aa3;
        font-size: 16px;
        margin-bottom: 10px;
      `);
    });

    it('should have the correct colour legend when input is invalid', async () => {
      const { findByLabelText, findByText } = component;

      await act(async () => {
        const option = await findByLabelText('Option 1');

        fireEvent.focus(option);

        fireEvent.blur(option);

        await wait();
      });

      await expect(findByText('Test')).resolves.toHaveStyleRule(
        'color',
        'rgb(199,56,79)',
      );
    });

    it('should display an error if input is invalid', async () => {
      const { findByLabelText, findByRole } = component;

      await act(async () => {
        const option = await findByLabelText('Option 1');

        fireEvent.focus(option);

        fireEvent.blur(option);

        await wait();
      });

      await expect(findByRole('alert')).resolves.toBeInTheDocument();
    });
  });

  it('should not show the help text if not set', () => {
    initialValues = {
      test: 'option 2',
    };

    const { queryByText } = render(
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {() => (
          <Form>
            <Radio options={options} label="Test" name="test" />
          </Form>
        )}
      </Formik>,
    );

    expect(queryByText('This is help text')).not.toBeInTheDocument();
  });

  it('should show the help text', async () => {
    initialValues = {
      test: 'option 2',
    };

    const { findByText } = render(
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {() => (
          <Form>
            <Radio
              options={options}
              label="Test"
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
            <Radio
              onChange={onChange}
              options={options}
              label="Test"
              name="test"
              helpText="This is help text"
            />
          </Form>
        )}
      </Formik>,
    );

    await act(async () => {
      const option = await findByLabelText('Option 1');

      fireEvent.click(option);

      await wait();
    });

    expect(onChange).toHaveBeenCalled();
  });
});
