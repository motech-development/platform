import { act, fireEvent, render, RenderResult } from '@testing-library/react';
import { Form, Formik } from 'formik';
import { advanceTo, clear } from 'jest-date-mock';
import React from 'react';
import * as Yup from 'yup';
import DatePicker from '../DatePicker';

interface IInitialValues {
  test: string;
}

describe('DatePicker', () => {
  let component: RenderResult;
  let initialValues: IInitialValues;
  let validationSchema: Yup.ObjectSchema<{}>;
  let onSubmit: jest.Mock;

  beforeAll(() => {
    advanceTo('2015-06-06T19:45:00+00:00');
  });

  beforeEach(() => {
    onSubmit = jest.fn();

    validationSchema = Yup.object().shape({
      test: Yup.date().required(),
    });
  });

  afterAll(() => {
    clear();
  });

  describe('with no initial value set', () => {
    beforeEach(async () => {
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
              <DatePicker name="test" label="Test" />
            </Form>
          )}
        </Formik>,
      );
    });

    it('should default to current date', async () => {
      const { findByLabelText } = component;

      await expect(findByLabelText('Test')).resolves.toHaveValue(
        '2015-06-06T19:45:00+00:00',
      );
    });

    it('should display the correct button label', async () => {
      const { findByRole } = component;

      await expect(findByRole('button')).resolves.toHaveAttribute(
        'aria-label',
        'Choose Test, selected date is 06/06/2015',
      );
    });

    it('should display the calendar', async () => {
      const { findByRole } = component;

      await act(async () => {
        const button = await findByRole('button');

        fireEvent.click(button);
      });

      await expect(findByRole('grid')).resolves.toBeInTheDocument();
    });

    it('should update the date value', async () => {
      const { findByLabelText, findByRole, findByText } = component;

      await act(async () => {
        const button = await findByRole('button');

        fireEvent.click(button);

        await findByRole('grid');

        const date = await findByText('3');

        fireEvent.click(date);
      });

      await expect(findByLabelText('Test')).resolves.toHaveValue(
        '2015-06-03T19:45:00+00:00',
      );
    });
  });
});
