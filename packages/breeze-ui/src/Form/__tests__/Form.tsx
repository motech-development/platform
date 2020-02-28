import { act, fireEvent, render, RenderResult } from '@testing-library/react';
import React from 'react';
import { object, ObjectSchema, string } from 'yup';
import TextBox from '../../TextBox/TextBox';
import Form from '../Form';

interface IInitialValues {
  test: string;
}

describe('Form', () => {
  let component: RenderResult;
  let initialValues: IInitialValues;
  let validationSchema: ObjectSchema<IInitialValues>;
  let onSubmit: jest.Mock;

  beforeEach(() => {
    onSubmit = jest.fn();
    initialValues = {
      test: '',
    };
    validationSchema = object().shape({
      test: string().required(),
    });
  });

  describe('without a cancel option', () => {
    beforeEach(() => {
      component = render(
        <Form
          submitLabel="Submit"
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={value => onSubmit(value)}
        >
          <TextBox label="Test" name="test" />
        </Form>,
      );
    });

    it('should disable save button if form is invalid', async () => {
      const { findByRole } = component;

      await expect(findByRole('button')).resolves.toHaveAttribute('disabled');
    });

    it('should enable save button if for is valid', async () => {
      const { findByLabelText, findByRole } = component;
      const input = await findByLabelText('Test');

      fireEvent.change(input, { target: { value: 'Hello world' } });

      await expect(findByRole('button')).resolves.not.toHaveAttribute(
        'disabled',
      );
    });

    it('should submit with the correct values', async () => {
      const { findByLabelText, findByRole } = component;

      await act(async () => {
        const input = await findByLabelText('Test');

        fireEvent.change(input, { target: { value: 'Hello world' } });

        const button = await findByRole('button');

        fireEvent.click(button);
      });

      expect(onSubmit).toHaveBeenCalledWith({
        test: 'Hello world',
      });
    });
  });

  describe('with a cancel option', () => {
    beforeEach(() => {
      component = render(
        <Form
          cancel={() => (
            <button type="button" data-testid="cancel-button">
              Cancel
            </button>
          )}
          submitLabel="Submit"
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={value => onSubmit(value)}
        >
          <TextBox label="Test" name="test" />
        </Form>,
      );
    });

    it('should render the cancel button', async () => {
      const { findByTestId } = component;

      await expect(findByTestId('cancel-button')).resolves.toBeInTheDocument();
    });
  });

  describe('with formatting', () => {
    beforeEach(() => {
      component = render(
        <Form
          submitLabel="Submit"
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={value => onSubmit(value)}
        >
          <TextBox label="Test" name="test" format="##-##-##" />
        </Form>,
      );
    });

    it('should submit with the correct values', async () => {
      const { findByLabelText, findByRole } = component;

      await act(async () => {
        const input = await findByLabelText('Test');

        fireEvent.change(input, {
          target: { focus: () => {}, value: '000000' },
        });

        const button = await findByRole('button');

        fireEvent.click(button);
      });

      expect(onSubmit).toHaveBeenCalledWith({
        test: '00-00-00',
      });
    });
  });
});
