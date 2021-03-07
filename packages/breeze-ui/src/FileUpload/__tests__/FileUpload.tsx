import { act, fireEvent, render, RenderResult } from '@testing-library/react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import FileUpload from '../FileUpload';

interface IInitialValues {
  test: string;
}

describe('FileUpload', () => {
  let component: RenderResult;
  let initialValues: IInitialValues;
  let validationSchema: Yup.ObjectSchema<IInitialValues>;
  let onSelect: jest.Mock;
  let onSubmit: jest.Mock;

  beforeEach(() => {
    onSubmit = jest.fn();
    onSelect = jest.fn();
    validationSchema = Yup.object()
      .shape({
        test: Yup.string().required(),
      })
      .required();
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
              <FileUpload
                disabled
                buttonText="Browse"
                label="Test"
                name="test"
                onSelect={onSelect}
              />
            </Form>
          )}
        </Formik>,
      );
    });

    it('should have a disabled browse button', async () => {
      const { findByRole } = component;

      await expect(findByRole('button')).resolves.toHaveAttribute('disabled');
    });

    it('should have a disabled file input', async () => {
      const { findByLabelText } = component;

      await expect(findByLabelText('Test')).resolves.toHaveAttribute(
        'disabled',
      );
    });

    it('should have a disabled hidden input', () => {
      const { container } = component;
      const hidden = container.querySelector('input[type="hidden"]');

      expect(hidden).toHaveAttribute('disabled');
    });
  });

  describe('validation', () => {
    let file: File;

    beforeEach(() => {
      file = new File(['dummy content'], 'example.png', {
        type: 'image/png',
      });
      initialValues = {
        test: '',
      };
    });

    describe('when valid', () => {
      beforeEach(() => {
        component = render(
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {() => (
              <Form>
                <FileUpload
                  disabled
                  buttonText="Browse"
                  label="Test"
                  name="test"
                  onSelect={(upload, form) =>
                    form.setFieldValue('test', upload.name)
                  }
                />
              </Form>
            )}
          </Formik>,
        );
      });

      it('should have the correct colour label', async () => {
        const { findByLabelText, findByText } = component;

        await act(async () => {
          const upload = (await findByLabelText('Test')) as HTMLInputElement;

          Object.defineProperty(upload, 'files', {
            value: [file],
          });

          fireEvent.change(upload);
        });

        await expect(findByText('Test')).resolves.toHaveStyleRule(
          'color',
          '#007fa8',
        );
      });
    });

    describe('when invalid', () => {
      beforeEach(() => {
        component = render(
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {() => (
              <Form>
                <FileUpload
                  disabled
                  buttonText="Browse"
                  label="Test"
                  name="test"
                  onSelect={(_, form) => form.setFieldValue('test', '')}
                />
              </Form>
            )}
          </Formik>,
        );
      });

      it('should have the correct colour label', async () => {
        const { findByLabelText, findByText } = component;

        await act(async () => {
          const upload = (await findByLabelText('Test')) as HTMLInputElement;

          Object.defineProperty(upload, 'files', {
            value: [file],
          });

          fireEvent.change(upload);
        });

        await expect(findByText('Test')).resolves.toHaveStyleRule(
          'color',
          'rgb(199,56,79)',
        );
      });

      it('should display an error if input is invalid', async () => {
        const { findByLabelText, findByRole } = component;

        await act(async () => {
          const upload = (await findByLabelText('Test')) as HTMLInputElement;

          Object.defineProperty(upload, 'files', {
            value: [file],
          });

          fireEvent.change(upload);
        });

        await expect(findByRole('alert')).resolves.toBeInTheDocument();
      });
    });
  });

  describe('help text', () => {
    beforeEach(() => {
      initialValues = {
        test: 'upload.png',
      };
    });

    it('should show the help text', async () => {
      const { findByText } = render(
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
          {() => (
            <Form>
              <FileUpload
                helpText="This is help text"
                buttonText="Browse"
                label="Test"
                name="test"
                onSelect={onSelect}
              />
            </Form>
          )}
        </Formik>,
      );

      await expect(
        findByText('This is help text'),
      ).resolves.toBeInTheDocument();
    });

    it('should not show the help text if not set', () => {
      const { queryByText } = render(
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
          {() => (
            <Form>
              <FileUpload
                buttonText="Browse"
                label="Test"
                name="test"
                onSelect={onSelect}
              />
            </Form>
          )}
        </Formik>,
      );

      expect(queryByText('This is help text')).not.toBeInTheDocument();
    });
  });

  describe('when uploading', () => {
    beforeEach(() => {
      initialValues = {
        test: '',
      };

      component = render(
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
          {() => (
            <Form>
              <FileUpload
                buttonText="Browse"
                label="Test"
                name="test"
                onSelect={onSelect}
              />
            </Form>
          )}
        </Formik>,
      );
    });

    it('should do nothing if no file selected', async () => {
      const { findByLabelText } = component;

      await act(async () => {
        const upload = (await findByLabelText('Test')) as HTMLInputElement;

        Object.defineProperty(upload, 'files', {
          value: [],
        });

        fireEvent.change(upload);
      });

      expect(onSelect).not.toHaveBeenCalled();
    });

    it('should trigger file upload when clicking the browse button', async () => {
      const { findByLabelText, findByRole } = component;
      const upload = (await findByLabelText('Test')) as HTMLInputElement;

      upload.click = jest.fn();

      await act(async () => {
        const button = await findByRole('button');

        fireEvent.click(button);
      });

      expect(upload.click).toHaveBeenCalled();
    });
  });
});
