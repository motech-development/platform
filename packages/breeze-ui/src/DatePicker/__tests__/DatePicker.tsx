import { act, fireEvent, render, RenderResult } from '@testing-library/react';
import { Form, Formik } from 'formik';
import { advanceTo, clear } from 'jest-date-mock';
import * as Yup from 'yup';
import DatePicker from '../DatePicker';

interface IInitialValues {
  test: string;
}

describe('DatePicker', () => {
  let component: RenderResult;
  let initialValues: IInitialValues;
  let validationSchema: Yup.ObjectSchema<{
    test: Date;
  }>;
  let onSubmit: jest.Mock;

  beforeAll(() => {
    advanceTo('2015-06-06T19:45:00+00:00');
  });

  beforeEach(() => {
    onSubmit = jest.fn();

    validationSchema = Yup.object()
      .shape({
        test: Yup.date().min('2015-06-03T19:45:00+00:00').required(),
      })
      .required();
  });

  afterAll(() => {
    clear();
  });

  describe('with no initial value set', () => {
    beforeEach(async () => {
      initialValues = {
        test: '',
      };

      await act(async () => {
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

        await Promise.resolve();
      });
    });

    it('should default to current date', async () => {
      const { findByLabelText } = component;

      await expect(findByLabelText('Test')).resolves.toHaveValue(
        '2015-06-06T19:45:00.000Z',
      );
    });

    it('should display the correct button label', async () => {
      const { findByRole } = component;

      await expect(findByRole('button')).resolves.toHaveAttribute(
        'aria-label',
        'Choose Test, selected date is 06/06/2015',
      );
    });

    it('should show and hide the calendar', async () => {
      const { findByRole, queryByRole } = component;
      const button = await findByRole('button');

      await act(async () => {
        fireEvent.click(button);

        await Promise.resolve();
      });

      await expect(findByRole('grid')).resolves.toBeInTheDocument();

      await act(async () => {
        fireEvent.click(button);

        await Promise.resolve();
      });

      expect(queryByRole('grid')).not.toBeInTheDocument();
    });

    it('should hide the calendar when clicking elsewhere', async () => {
      const { container, findByRole, queryByRole } = component;
      const button = await findByRole('button');
      const body = container.firstChild as ChildNode;

      await act(async () => {
        fireEvent.click(button);

        await Promise.resolve();
      });

      await expect(findByRole('grid')).resolves.toBeInTheDocument();

      await act(async () => {
        fireEvent.mouseDown(body);

        await Promise.resolve();
      });

      expect(queryByRole('grid')).not.toBeInTheDocument();
    });

    it('should update the date value', async () => {
      const { findAllByText, findByLabelText, findByRole } = component;

      await act(async () => {
        const button = await findByRole('button');

        fireEvent.click(button);
      });

      await act(async () => {
        await findByRole('grid');

        const [date] = await findAllByText('3');

        fireEvent.click(date);
      });

      await expect(findByLabelText('Test')).resolves.toHaveValue(
        '2015-06-03T19:45:00.000Z',
      );
    });

    it('should display validation error', async () => {
      const { findAllByText, findByRole } = component;

      await act(async () => {
        const button = await findByRole('button');

        fireEvent.click(button);
      });

      await act(async () => {
        await findByRole('grid');

        const [date] = await findAllByText('1');

        fireEvent.click(date);
      });

      await expect(findByRole('alert')).resolves.toBeInTheDocument();
    });
  });

  describe('with an initial value set', () => {
    beforeEach(async () => {
      initialValues = {
        test: '2015-06-03T19:45:00.000Z',
      };

      await act(async () => {
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

        await Promise.resolve();
      });
    });

    it('should default to current date', async () => {
      const { findByLabelText } = component;

      await expect(findByLabelText('Test')).resolves.toHaveValue(
        '2015-06-03T19:45:00.000Z',
      );
    });

    it('should display the correct button label', async () => {
      const { findByRole } = component;

      await expect(findByRole('button')).resolves.toHaveAttribute(
        'aria-label',
        'Choose Test, selected date is 03/06/2015',
      );
    });

    it('should show and hide the calendar', async () => {
      const { findByRole, queryByRole } = component;
      const button = await findByRole('button');

      await act(async () => {
        fireEvent.click(button);

        await Promise.resolve();
      });

      await expect(findByRole('grid')).resolves.toBeInTheDocument();

      await act(async () => {
        fireEvent.click(button);

        await Promise.resolve();
      });

      expect(queryByRole('grid')).not.toBeInTheDocument();
    });

    it('should hide the calendar when clicking elsewhere', async () => {
      const { container, findByRole, queryByRole } = component;
      const button = await findByRole('button');
      const body = container.firstChild as ChildNode;

      await act(async () => {
        fireEvent.click(button);

        await Promise.resolve();
      });

      await expect(findByRole('grid')).resolves.toBeInTheDocument();

      await act(async () => {
        fireEvent.mouseDown(body);

        await Promise.resolve();
      });

      expect(queryByRole('grid')).not.toBeInTheDocument();
    });

    it('should update the date value', async () => {
      const { findByLabelText, findByRole, findByText } = component;

      await act(async () => {
        const button = await findByRole('button');

        fireEvent.click(button);
      });

      await act(async () => {
        await findByRole('grid');

        const date = await findByText('20');

        fireEvent.click(date);
      });

      await expect(findByLabelText('Test')).resolves.toHaveValue(
        '2015-06-20T19:45:00.000Z',
      );
    });

    it('should display validation error', async () => {
      const { findAllByText, findByRole } = component;

      await act(async () => {
        const button = await findByRole('button');

        fireEvent.click(button);
      });

      await act(async () => {
        await findByRole('grid');

        const [date] = await findAllByText('1');

        fireEvent.click(date);
      });

      await expect(findByRole('alert')).resolves.toBeInTheDocument();
    });
  });

  describe('when disabled', () => {
    beforeEach(async () => {
      initialValues = {
        test: '2015-06-03T19:45:00.000Z',
      };

      await act(async () => {
        component = render(
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {() => (
              <Form>
                <DatePicker disabled name="test" label="Test" />
              </Form>
            )}
          </Formik>,
        );

        await Promise.resolve();
      });
    });

    it('should have the correct styles', () => {
      const { container } = component;
      const [, , likeInput] = container.querySelectorAll('div');

      expect(likeInput).toHaveStyle('color: #767676;');
    });

    it('should disable the button', async () => {
      const { findByRole } = component;

      await expect(findByRole('button')).resolves.toHaveAttribute('disabled');
    });
  });

  describe('when read only', () => {
    beforeEach(async () => {
      initialValues = {
        test: '2015-06-03T19:45:00.000Z',
      };

      await act(async () => {
        component = render(
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {() => (
              <Form>
                <DatePicker readOnly name="test" label="Test" />
              </Form>
            )}
          </Formik>,
        );

        await Promise.resolve();
      });
    });

    it('should have the correct styles', () => {
      const { container } = component;
      const [, , likeInput] = container.querySelectorAll('div');

      expect(likeInput).toHaveStyle('color: #333;');
    });

    it('should disable the button', async () => {
      const { findByRole } = component;

      await expect(findByRole('button')).resolves.toHaveAttribute('disabled');
    });
  });
});
