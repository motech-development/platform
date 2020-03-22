import { act, fireEvent, render } from '@testing-library/react';
import { Form, Formik } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import TextBox from '../TextBox';

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

  describe('with no format is set', () => {
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

        await act(async () => {
          const input = await findByPlaceholderText('Test');

          fireEvent.focus(input);
        });

        const input = await findByPlaceholderText('Test');

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

        await act(async () => {
          const input = await findByPlaceholderText('Test');

          fireEvent.blur(input);
        });

        const alert = await findByRole('alert');

        expect(alert).toBeDefined();
      });

      it('should have no placeholder when one is not set', async () => {
        const { findByLabelText } = render(
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {() => (
              <Form>
                <TextBox label="Test" name="test" />
              </Form>
            )}
          </Formik>,
        );
        const input = await findByLabelText('Test');

        expect(input.getAttribute('placeholder')).toBeDefined();
      });

      it('should have a placeholder when one is set', async () => {
        const { findByLabelText } = render(
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
        const input = await findByLabelText('Test');

        expect(input.getAttribute('placeholder')).toEqual('Test');
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
                <TextBox label="Test" name="test" />
              </Form>
            )}
          </Formik>,
        );

        await act(async () => {
          const input = await findByLabelText('Test');

          fireEvent.blur(input);
        });

        await expect(findByText('Test')).resolves.toHaveStyle(`
          color: rgb(199,56,79);
          transform: translate(0,16px) scale(1);
        `);
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

        await expect(findByLabelText('Test')).resolves.toHaveStyle(
          'color: #333',
        );
      });

      it('should have the correct styled label', async () => {
        const { findByLabelText, findByText } = render(
          <Formik initialValues={initialValues} onSubmit={onSubmit}>
            {() => (
              <Form>
                <TextBox label="Test" name="test" />
              </Form>
            )}
          </Formik>,
        );

        await act(async () => {
          const input = await findByLabelText('Test');

          fireEvent.blur(input);
        });

        await expect(findByText('Test')).resolves.toHaveStyle(`
          color: #2e9dc8;
          transform: translate(0,4px) scale(.75);
        `);
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

        await act(async () => {
          const input = await findByPlaceholderText('Test');

          fireEvent.focus(input);
        });

        const input = await findByPlaceholderText('Test');

        expect(input).toHaveStyle('color: #333');
      });
    });
  });

  describe('with a format set', () => {
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
                <TextBox
                  label="Test"
                  name="test"
                  placeholder="Test"
                  format="##-##-##"
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
                  label="Test"
                  name="test"
                  placeholder="Test"
                  format="##-##-##"
                />
              </Form>
            )}
          </Formik>,
        );

        await act(async () => {
          const input = await findByPlaceholderText('Test');

          fireEvent.focus(input);
        });

        const input = await findByPlaceholderText('Test');

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
                <TextBox
                  label="Test"
                  name="test"
                  placeholder="Test"
                  format="##-##-##"
                />
              </Form>
            )}
          </Formik>,
        );

        await act(async () => {
          const input = await findByPlaceholderText('Test');

          fireEvent.blur(input);
        });

        const alert = await findByRole('alert');

        expect(alert).toBeDefined();
      });

      it('should have no placeholder when one is not set', async () => {
        const { findByLabelText } = render(
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {() => (
              <Form>
                <TextBox label="Test" name="test" format="##-##-##" />
              </Form>
            )}
          </Formik>,
        );
        const input = await findByLabelText('Test');

        expect(input.getAttribute('placeholder')).toBeDefined();
      });

      it('should have a placeholder when one is set', async () => {
        const { findByLabelText } = render(
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {() => (
              <Form>
                <TextBox
                  label="Test"
                  name="test"
                  placeholder="Test"
                  format="##-##-##"
                />
              </Form>
            )}
          </Formik>,
        );
        const input = await findByLabelText('Test');

        expect(input.getAttribute('placeholder')).toEqual('Test');
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
                <TextBox label="Test" name="test" format="##-##-##" />
              </Form>
            )}
          </Formik>,
        );

        await act(async () => {
          const input = await findByLabelText('Test');

          fireEvent.blur(input);
        });

        await expect(findByText('Test')).resolves.toHaveStyle(`
          color: rgb(199,56,79);
          transform: translate(0,16px) scale(1);
        `);
      });
    });

    describe('when there are initial values', () => {
      beforeEach(() => {
        initialValues = {
          test: '00-00-00',
        };
      });

      it('should have the correct colour', async () => {
        const { findByLabelText } = render(
          <Formik initialValues={initialValues} onSubmit={onSubmit}>
            {() => (
              <Form>
                <TextBox label="Test" name="test" format="##-##-##" />
              </Form>
            )}
          </Formik>,
        );

        await expect(findByLabelText('Test')).resolves.toHaveStyle(
          'color: #333',
        );
      });

      it('should have the correct styled label', async () => {
        const { findByLabelText, findByText } = render(
          <Formik initialValues={initialValues} onSubmit={onSubmit}>
            {() => (
              <Form>
                <TextBox label="Test" name="test" format="##-##-##" />
              </Form>
            )}
          </Formik>,
        );

        await act(async () => {
          const input = await findByLabelText('Test');

          fireEvent.blur(input);
        });

        await expect(findByText('Test')).resolves.toHaveStyle(`
          color: #2e9dc8;
          transform: translate(0,4px) scale(.75);
        `);
      });

      it('should render the textbox with the correct colour when active', async () => {
        const { findByPlaceholderText } = render(
          <Formik initialValues={initialValues} onSubmit={onSubmit}>
            {() => (
              <Form>
                <TextBox
                  label="Test"
                  name="test"
                  placeholder="Test"
                  format="##-##-##"
                />
              </Form>
            )}
          </Formik>,
        );

        await act(async () => {
          const input = await findByPlaceholderText('Test');

          fireEvent.focus(input);
        });

        const input = await findByPlaceholderText('Test');

        expect(input).toHaveStyle('color: #333');
      });
    });
  });
});
