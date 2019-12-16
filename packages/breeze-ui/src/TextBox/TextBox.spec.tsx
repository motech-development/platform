import { fireEvent, render } from '@testing-library/react';
import { Form, Formik } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import TextBox from './TextBox';

interface IInitialValues {
  test: string;
}

describe('TextBox', () => {
  let initialValues: IInitialValues;
  let validationSchema: Yup.ObjectSchema<IInitialValues>;
  let onSubmit: jest.Mock;

  beforeEach(() => {
    onSubmit = jest.fn();
  });

  describe('when there are no initial values', () => {
    beforeEach(() => {
      initialValues = {
        test: '',
      };

      validationSchema = Yup.object().shape({
        test: Yup.string().required(),
      });
    });

    it('should render the textbox with the correct colour when not active', async () => {
      const { findByPlaceholderText } = render(
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
          {() => (
            <Form>
              <TextBox label="Test" name="test" placeholder="Test" />
            </Form>
          )}
        </Formik>,
      );

      await expect(findByPlaceholderText('Test')).resolves.toHaveStyle(
        'color: #fff',
      );
    });

    it('should render the textbox with the correct colour when active', async () => {
      const { findByPlaceholderText } = render(
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
          {() => (
            <Form>
              <TextBox label="Test" name="test" placeholder="Test" />
            </Form>
          )}
        </Formik>,
      );
      const input = await findByPlaceholderText('Test');

      input.focus();

      expect(input).toHaveStyle('color: #333');
    });

    it('should display an error if input is invalid', async () => {
      const { findByPlaceholderText, findByRole } = render(
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {() => (
            <Form>
              <TextBox label="Test" name="test" placeholder="Test" />
            </Form>
          )}
        </Formik>,
      );
      const input = await findByPlaceholderText('Test');

      fireEvent.blur(input);

      const alert = await findByRole('alert');

      expect(alert).toBeDefined();
    });
  });

  describe('when there are initial values', () => {
    beforeEach(() => {
      initialValues = {
        test: 'Test value',
      };
    });

    it('should have the correct colour', async () => {
      const { findByLabelText } = render(
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
          {() => (
            <Form>
              <TextBox label="Test" name="test" />
            </Form>
          )}
        </Formik>,
      );

      await expect(findByLabelText('Test')).resolves.toHaveStyle('color: #333');
    });
  });
});
