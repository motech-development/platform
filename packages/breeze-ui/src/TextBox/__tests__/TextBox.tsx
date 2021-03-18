import { act, fireEvent, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import TextBox from '../TextBox';

interface IInitialValues {
  test: string;
}

describe('TextBox', () => {
  let initialValues: IInitialValues;
  let validationSchema: Yup.ObjectSchema<IInitialValues>;
  let onChange: jest.Mock;
  let onSubmit: jest.Mock;

  beforeEach(() => {
    onChange = jest.fn();
    onSubmit = jest.fn();

    validationSchema = Yup.object()
      .shape({
        test: Yup.string().required(),
      })
      .required();
  });

  describe('with no format is set', () => {
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
                <TextBox label="Test" name="test" placeholder="Test" />
              </Form>
            )}
          </Formik>,
        );

        await expect(findByPlaceholderText('Test')).resolves.toHaveStyle(`
          color: #fff;
          cursor: pointer;
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

        const input = await findByPlaceholderText('Test');

        await act(async () => {
          fireEvent.focus(input);
        });

        await waitFor(() =>
          expect(input).toHaveStyle(`
        color: #333;
        cursor: text;
      `),
        );
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

      it('should call onChange if set', async () => {
        const { findByLabelText } = render(
          <Formik initialValues={initialValues} onSubmit={onSubmit}>
            {() => (
              <Form>
                <TextBox label="Test" name="test" onChange={onChange} />
              </Form>
            )}
          </Formik>,
        );

        await act(async () => {
          const input = await findByLabelText('Test');

          fireEvent.change(input, {
            target: {
              focus: () => {},
              value: 'Test',
            },
          });
        });

        expect(onChange).toHaveBeenCalled();
      });

      it('should render the textbox with the correct colour when disabled', async () => {
        const { findByPlaceholderText } = render(
          <Formik initialValues={initialValues} onSubmit={onSubmit}>
            {() => (
              <Form>
                <TextBox disabled label="Test" name="test" placeholder="Test" />
              </Form>
            )}
          </Formik>,
        );

        await expect(findByPlaceholderText('Test')).resolves.toHaveStyle(
          'color: #767676;',
        );
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
          color: #007fa8;
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

        const input = await findByPlaceholderText('Test');

        await act(async () => {
          fireEvent.focus(input);
        });

        await waitFor(() =>
          expect(input).toHaveStyle(`
        color: #333;
        cursor: text;
      `),
        );
      });

      it('should call onChange if set', async () => {
        const { findByLabelText } = render(
          <Formik initialValues={initialValues} onSubmit={onSubmit}>
            {() => (
              <Form>
                <TextBox label="Test" name="test" onChange={onChange} />
              </Form>
            )}
          </Formik>,
        );

        await act(async () => {
          const input = await findByLabelText('Test');

          fireEvent.change(input, {
            target: {
              focus: () => {},
              value: 'Test',
            },
          });
        });

        expect(onChange).toHaveBeenCalled();
      });

      it('should render the textbox with the correct colour when disabled', async () => {
        const { findByPlaceholderText } = render(
          <Formik initialValues={initialValues} onSubmit={onSubmit}>
            {() => (
              <Form>
                <TextBox disabled label="Test" name="test" placeholder="Test" />
              </Form>
            )}
          </Formik>,
        );

        await expect(findByPlaceholderText('Test')).resolves.toHaveStyle(
          'color: #767676;',
        );
      });
    });
  });

  describe('with a format set', () => {
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
                  label="Test"
                  name="test"
                  placeholder="Test"
                  format="##-##-##"
                />
              </Form>
            )}
          </Formik>,
        );

        await expect(findByPlaceholderText('Test')).resolves.toHaveStyle(`
          color: #fff;
          cursor: pointer;
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

        const input = await findByPlaceholderText('Test');

        await act(async () => {
          fireEvent.focus(input);
        });

        await waitFor(() =>
          expect(input).toHaveStyle(`
        color: #333;
        cursor: text;
      `),
        );
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

      it('should call onChange if set', async () => {
        const { findByLabelText } = render(
          <Formik initialValues={initialValues} onSubmit={onSubmit}>
            {() => (
              <Form>
                <TextBox
                  label="Test"
                  name="test"
                  format="##-##-##"
                  onChange={onChange}
                />
              </Form>
            )}
          </Formik>,
        );

        await act(async () => {
          const input = await findByLabelText('Test');

          fireEvent.change(input, {
            target: {
              focus: () => {},
              value: '000000',
            },
          });
        });

        expect(onChange).toHaveBeenCalled();
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
          color: #007fa8;
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

        const input = await findByPlaceholderText('Test');

        await act(async () => {
          fireEvent.focus(input);
        });

        await waitFor(() =>
          expect(input).toHaveStyle(`
        color: #333;
        cursor: text;
      `),
        );
      });
    });

    it('should call onChange if set', async () => {
      const { findByLabelText } = render(
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
          {() => (
            <Form>
              <TextBox
                label="Test"
                name="test"
                format="##-##-##"
                onChange={onChange}
              />
            </Form>
          )}
        </Formik>,
      );

      await act(async () => {
        const input = await findByLabelText('Test');

        fireEvent.change(input, {
          target: {
            focus: () => {},
            value: '000000',
          },
        });
      });

      expect(onChange).toHaveBeenCalled();
    });
  });
});
