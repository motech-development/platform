import { act, fireEvent, render, wait } from '@testing-library/react';
import { Form, Formik } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import Select, { ISelectOption } from '../Select';

interface IInitialValues {
  test: string;
}

describe('Select', () => {
  let initialValues: IInitialValues;
  let validationSchema: Yup.ObjectSchema<IInitialValues>;
  let onSubmit: jest.Mock;
  let options: ISelectOption[];

  beforeEach(() => {
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

  describe('when there are no initial values', () => {
    beforeEach(() => {
      initialValues = {
        test: '',
      };
    });

    it('should render the dropdown with the correct colour when not active', async () => {
      const { findByLabelText } = render(
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
          {() => (
            <Form>
              <Select
                options={options}
                label="Test"
                name="test"
                placeholder="Select something"
              />
            </Form>
          )}
        </Formik>,
      );

      await expect(findByLabelText('Test')).resolves.toHaveStyle(
        'color: #fff;',
      );
    });

    it('should render the dropdown with the correct colour when active', async () => {
      const { findByLabelText } = render(
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
          {() => (
            <Form>
              <Select
                options={options}
                label="Test"
                name="test"
                placeholder="Select something"
              />
            </Form>
          )}
        </Formik>,
      );

      await act(async () => {
        const input = await findByLabelText('Test');

        fireEvent.focus(input);

        await wait();
      });

      const input = await findByLabelText('Test');

      expect(input).toHaveStyle('color: #333;');
    });

    it('should display an error if input is invalid', async () => {
      const { findByLabelText, findByRole } = render(
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {() => (
            <Form>
              <Select
                options={options}
                label="Test"
                name="test"
                placeholder="Select something"
              />
            </Form>
          )}
        </Formik>,
      );

      await act(async () => {
        const input = await findByLabelText('Test');

        fireEvent.blur(input);

        await wait();
      });

      const alert = await findByRole('alert');

      expect(alert).toBeDefined();
    });

    it('should pre-select the placeholder value', async () => {
      const { findByLabelText } = render(
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
          {() => (
            <Form>
              <Select
                options={options}
                label="Test"
                name="test"
                placeholder="Select something"
              />
            </Form>
          )}
        </Formik>,
      );

      await expect(findByLabelText('Test')).resolves.toHaveValue('');
    });

    it('should have the correct styled label', async () => {
      const { findByLabelText, findByText } = render(
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {() => (
            <Form>
              <Select
                options={options}
                label="Test"
                name="test"
                placeholder="Select something"
              />
            </Form>
          )}
        </Formik>,
      );

      await act(async () => {
        const input = await findByLabelText('Test');

        fireEvent.blur(input);

        await wait();
      });

      await expect(findByText('Test')).resolves.toHaveStyle(`
        color: rgb(199,56,79);
        transform: translate(0,16px) scale(1);
      `);
    });

    it('should have the correct options', async () => {
      const { findAllByRole } = render(
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
          {() => (
            <Form>
              <Select
                options={options}
                label="Test"
                name="test"
                placeholder="Select something"
              />
            </Form>
          )}
        </Formik>,
      );

      const opts = await findAllByRole('option');

      expect(opts).toHaveLength(3);
      expect(opts[0]).toHaveValue('');
      expect(opts[1]).toHaveValue('option 1');
      expect(opts[2]).toHaveValue('option 2');
    });
  });

  describe('when there are initial values', () => {
    beforeEach(() => {
      initialValues = {
        test: 'option 1',
      };
    });

    it('should render the dropdown with the correct colour when not active', async () => {
      const { findByLabelText } = render(
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
          {() => (
            <Form>
              <Select
                options={options}
                label="Test"
                name="test"
                placeholder="Select something"
              />
            </Form>
          )}
        </Formik>,
      );

      await expect(findByLabelText('Test')).resolves.toHaveStyle(
        'color: #333;',
      );
    });

    it('should render the dropdown with the correct colour when active', async () => {
      const { findByLabelText } = render(
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
          {() => (
            <Form>
              <Select
                options={options}
                label="Test"
                name="test"
                placeholder="Select something"
              />
            </Form>
          )}
        </Formik>,
      );

      await act(async () => {
        const input = await findByLabelText('Test');

        fireEvent.focus(input);

        await wait();
      });

      const input = await findByLabelText('Test');

      expect(input).toHaveStyle('color: #333;');
    });

    it('should pre-select the set value', async () => {
      const { findByLabelText } = render(
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
          {() => (
            <Form>
              <Select
                options={options}
                label="Test"
                name="test"
                placeholder="Select something"
              />
            </Form>
          )}
        </Formik>,
      );

      await expect(findByLabelText('Test')).resolves.toHaveValue('option 1');
    });

    it('should have the correct styled label', async () => {
      const { findByLabelText, findByText } = render(
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {() => (
            <Form>
              <Select
                options={options}
                label="Test"
                name="test"
                placeholder="Select something"
              />
            </Form>
          )}
        </Formik>,
      );

      await act(async () => {
        const input = await findByLabelText('Test');

        fireEvent.blur(input);

        await wait();
      });

      await expect(findByText('Test')).resolves.toHaveStyle(`
        color: rgb(46, 157, 200);
        transform: translate(0,4px) scale(.75);
      `);
    });

    it('should have the correct options', async () => {
      const { findAllByRole } = render(
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
          {() => (
            <Form>
              <Select
                options={options}
                label="Test"
                name="test"
                placeholder="Select something"
              />
            </Form>
          )}
        </Formik>,
      );

      const opts = await findAllByRole('option');

      expect(opts).toHaveLength(3);
      expect(opts[0]).toHaveValue('');
      expect(opts[1]).toHaveValue('option 1');
      expect(opts[2]).toHaveValue('option 2');
    });
  });
});
