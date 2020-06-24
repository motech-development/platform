import {
  act,
  fireEvent,
  render,
  RenderResult,
  wait,
} from '@testing-library/react';
import { Form, Formik } from 'formik';
import React from 'react';
import { object, ObjectSchema, string } from 'yup';
import Typeahead, { ITypeaheadSuggestion } from '../Typeahead';

interface IInitialValues {
  test: string;
}

describe('Typeahead', () => {
  let component: RenderResult;
  let suggestions: ITypeaheadSuggestion[];
  let initialValues: IInitialValues;
  let validationSchema: ObjectSchema<IInitialValues>;
  let onSubmit: jest.Mock;

  beforeEach(async () => {
    onSubmit = jest.fn();
    validationSchema = object()
      .shape({
        test: string().required(),
      })
      .required();
    initialValues = {
      test: '',
    };
    suggestions = [
      {
        name: 'Option 1',
        value: 'Option 1',
      },
      {
        name: 'Random',
        value: 'Result!',
      },
    ];

    await act(async () => {
      component = render(
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={value => onSubmit(value)}
        >
          {() => (
            <Form>
              <Typeahead
                label="Test"
                name="test"
                placeholder="Test"
                suggestions={suggestions}
              />

              <button type="submit" data-testid="submit">
                Submit
              </button>
            </Form>
          )}
        </Formik>,
      );
    });
  });

  it('should display the suggestions', async () => {
    const { findAllByRole, findByPlaceholderText } = component;

    await act(async () => {
      const input = await findByPlaceholderText('Test');

      fireEvent.change(input, {
        target: {
          focus: () => {},
          value: 'n',
        },
      });

      await wait();
    });

    await expect(findAllByRole('button')).resolves.toHaveLength(3);
  });

  it('should not display the suggestions if nothing matches', async () => {
    const { findAllByRole, findByPlaceholderText } = component;

    await act(async () => {
      const input = await findByPlaceholderText('Test');

      fireEvent.change(input, {
        target: {
          focus: () => {},
          value: 'XYZ',
        },
      });

      await wait();
    });

    await expect(findAllByRole('button')).resolves.toHaveLength(1);
  });

  it('should set the value of an option that has the same name and value', async () => {
    const { findAllByRole, findByPlaceholderText } = component;

    await act(async () => {
      const input = await findByPlaceholderText('Test');

      fireEvent.change(input, {
        target: {
          focus: () => {},
          value: 'Opt',
        },
      });

      const [option, submit] = await findAllByRole('button');

      fireEvent.click(option);

      await wait();

      fireEvent.click(submit);
    });

    expect(onSubmit).toHaveBeenCalledWith({
      test: 'Option 1',
    });
  });

  it('should set the value of an option that has a different name and value', async () => {
    const { findAllByRole, findByPlaceholderText } = component;

    await act(async () => {
      const input = await findByPlaceholderText('Test');

      fireEvent.change(input, {
        target: {
          focus: () => {},
          value: 'Ran',
        },
      });

      const [option, submit] = await findAllByRole('button');

      fireEvent.click(option);

      await wait();

      fireEvent.click(submit);
    });

    expect(onSubmit).toHaveBeenCalledWith({
      test: 'Result!',
    });
  });

  it('should set a custom value', async () => {
    const { findByPlaceholderText, findByRole } = component;

    await act(async () => {
      const input = await findByPlaceholderText('Test');

      fireEvent.change(input, {
        target: {
          focus: () => {},
          value: 'Motech Development',
        },
      });

      await wait();

      const submit = await findByRole('button');

      fireEvent.click(submit);
    });

    expect(onSubmit).toHaveBeenCalledWith({
      test: 'Motech Development',
    });
  });
});
