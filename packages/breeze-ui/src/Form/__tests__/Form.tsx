import {
  act,
  fireEvent,
  render,
  RenderResult,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormikValues } from 'formik';
import { object, ObjectSchema, string } from 'yup';
import TextBox from '../../TextBox/TextBox';
import Form from '../Form';

interface IInitialValues {
  empty?: string | null;
  obj: {
    empty?: string | null;
    test?: string;
  };
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
      empty: null,
      obj: {
        empty: null,
        test: '',
      },
      test: '',
    };
    validationSchema = object()
      .shape({
        empty: string(),
        obj: object()
          .shape({
            empty: string(),
            test: string(),
          })
          .required(),
        test: string().required(),
      })
      .required();
  });

  describe('without a cancel option', () => {
    beforeEach(async () => {
      await act(async () => {
        component = render(
          <Form
            submitLabel="Submit"
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(value) => onSubmit(value)}
          >
            <TextBox label="Empty" name="empty" />
            <TextBox label="Object empty" name="obj.empty" />
            <TextBox label="Object test" name="obj.test" />
            <TextBox label="Test" name="test" />
          </Form>,
        );

        await Promise.resolve();
      });
    });

    it('should disable save button if form is invalid', async () => {
      const { findByRole } = component;

      await expect(findByRole('button')).resolves.toHaveAttribute('disabled');
    });

    it('should enable save button if for is valid', async () => {
      const input = screen.getByLabelText('Test');

      userEvent.type(input, 'Hello world');

      await waitFor(() =>
        expect(screen.getByRole('button')).toHaveAttribute('disabled'),
      );
    });

    it('should submit with the correct values', async () => {
      const { findByLabelText, findByRole } = component;

      await act(async () => {
        const input = await findByLabelText('Test');

        userEvent.type(input, 'Hello world');

        fireEvent.change(input, { target: { value: 'Hello world' } });

        const button = await findByRole('button');

        await waitFor(() => expect(button).not.toBeDisabled());

        fireEvent.click(button);
      });

      expect(onSubmit).toHaveBeenCalledWith({
        empty: '',
        obj: {
          empty: '',
          test: '',
        },
        test: 'Hello world',
      });
    });
  });

  describe('with a cancel option', () => {
    beforeEach(async () => {
      await act(async () => {
        component = render(
          <Form
            cancel={
              <button type="button" data-testid="cancel-button">
                Cancel
              </button>
            }
            submitLabel="Submit"
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(value) => onSubmit(value)}
          >
            <TextBox label="Test" name="test" />
          </Form>,
        );

        await Promise.resolve();
      });
    });

    it('should render the cancel button', async () => {
      const { findByTestId } = component;

      await expect(findByTestId('cancel-button')).resolves.toBeInTheDocument();
    });
  });

  describe('with formatting', () => {
    beforeEach(async () => {
      await act(async () => {
        component = render(
          <Form
            submitLabel="Submit"
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(value) => onSubmit(value)}
          >
            <TextBox label="Test" name="test" format="##-##-##" />
          </Form>,
        );

        await Promise.resolve();
      });
    });

    it('should submit with the correct values', async () => {
      const { findByLabelText, findByRole } = component;

      await act(async () => {
        const input = await findByLabelText('Test');

        fireEvent.change(input, {
          target: { focus: () => {}, value: '000000' },
        });

        const button = await findByRole('button');

        await waitFor(() => expect(button).not.toBeDisabled());

        fireEvent.click(button);
      });

      expect(onSubmit).toHaveBeenCalledWith({
        empty: '',
        obj: {
          empty: '',
          test: '',
        },
        test: '00-00-00',
      });
    });
  });

  describe('with a suffix', () => {
    beforeEach(async () => {
      await act(async () => {
        component = render(
          <Form
            submitLabel="Submit"
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(value) => onSubmit(value)}
          >
            <TextBox label="Test" name="test" suffix="%" />
          </Form>,
        );

        await Promise.resolve();
      });
    });

    it('should submit with the correct values', async () => {
      const { findByLabelText, findByRole } = component;

      await act(async () => {
        const input = await findByLabelText('Test');

        fireEvent.change(input, {
          target: { focus: () => {}, value: '20' },
        });

        const button = await findByRole('button');

        await waitFor(() => expect(button).not.toBeDisabled());

        fireEvent.click(button);
      });

      expect(onSubmit).toHaveBeenCalledWith({
        empty: '',
        obj: {
          empty: '',
          test: '',
        },
        test: 20,
      });
    });
  });

  describe('with a prefix', () => {
    beforeEach(async () => {
      await act(async () => {
        component = render(
          <Form
            submitLabel="Submit"
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(value) => onSubmit(value)}
          >
            <TextBox label="Test" name="test" prefix="£" />
          </Form>,
        );

        await Promise.resolve();
      });
    });

    it('should submit with the correct values', async () => {
      const { findByLabelText, findByRole } = component;

      await act(async () => {
        const input = await findByLabelText('Test');

        fireEvent.change(input, {
          target: { focus: () => {}, value: '20' },
        });

        const button = await findByRole('button');

        await waitFor(() => expect(button).not.toBeDisabled());

        fireEvent.click(button);
      });

      expect(onSubmit).toHaveBeenCalledWith({
        empty: '',
        obj: {
          empty: '',
          test: '',
        },
        test: 20,
      });
    });
  });

  describe('when loading', () => {
    beforeEach(async () => {
      await act(async () => {
        component = render(
          <Form
            loading
            submitLabel="Submit"
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(value) => onSubmit(value)}
          >
            <TextBox label="Test" name="test" format="##-##-##" />
          </Form>,
        );

        await Promise.resolve();
      });
    });

    it('should have a disabled submit button', async () => {
      const { findByRole } = component;

      await expect(findByRole('button')).resolves.toHaveAttribute('disabled');
    });
  });

  describe('with onPreSumbit hook', () => {
    let onPreSumbit: (value: FormikValues) => object;

    beforeEach(async () => {
      onPreSumbit = (values: FormikValues) => ({
        ...values,
        obj: {
          ...values.obj,
          test: 'Hello',
        },
      });

      await act(async () => {
        component = render(
          <Form
            submitLabel="Submit"
            initialValues={initialValues}
            validationSchema={validationSchema}
            onPreSubmit={onPreSumbit}
            onSubmit={(value) => onSubmit(value)}
          >
            <TextBox label="Test" name="test" prefix="£" />
          </Form>,
        );

        await Promise.resolve();
      });
    });

    it('should alter the response before submitting', async () => {
      const { findByLabelText, findByRole } = component;

      await act(async () => {
        const input = await findByLabelText('Test');

        fireEvent.change(input, {
          target: { focus: () => {}, value: '20' },
        });

        const button = await findByRole('button');

        await waitFor(() => expect(button).not.toBeDisabled());

        fireEvent.click(button);
      });

      expect(onSubmit).toHaveBeenCalledWith({
        empty: '',
        obj: {
          empty: '',
          test: 'Hello',
        },
        test: 20,
      });
    });
  });
});
