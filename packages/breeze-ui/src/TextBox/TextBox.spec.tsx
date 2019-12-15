import { render } from '@testing-library/react';
import { Form, Formik } from 'formik';
import React from 'react';
import TextBox from './TextBox';

interface IInitialValues {
  test: string;
}

describe('TextBox', () => {
  let initialValues: IInitialValues;
  let onSubmit: jest.Mock;

  beforeEach(() => {
    onSubmit = jest.fn();
  });

  describe('when there are no initial values', () => {
    beforeEach(() => {
      initialValues = {
        test: '',
      };
    });

    it('should render the textbox with the correct colour when not active', async () => {
      const { findByPlaceholderText } = render(
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
          {() => (
            <Form>
              <TextBox
                data-testid="Textbox"
                label="Test"
                name="test"
                placeholder="Test"
              />
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
              <TextBox
                data-testid="Textbox"
                label="Test"
                name="test"
                placeholder="Test"
              />
            </Form>
          )}
        </Formik>,
      );
      const input = await findByPlaceholderText('Test');

      input.focus();

      expect(input).toHaveStyle('color: #333');
    });
  });

  describe('when there are initial values', () => {
    beforeEach(() => {
      initialValues = {
        test: 'Test value',
      };
    });

    it('should have the correct colour', async () => {
      const { findByPlaceholderText } = render(
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
          {() => (
            <Form>
              <TextBox
                data-testid="Textbox"
                label="Test"
                name="test"
                placeholder="Test"
              />
            </Form>
          )}
        </Formik>,
      );

      await expect(findByPlaceholderText('Test')).resolves.toHaveStyle(
        'color: #333',
      );
    });
  });
});
