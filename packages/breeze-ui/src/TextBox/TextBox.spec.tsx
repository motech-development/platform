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
    initialValues = {
      test: '',
    };
    onSubmit = jest.fn();
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
