import {
  act,
  fireEvent,
  render,
  RenderResult,
  waitFor,
} from '@testing-library/react';
import { VatScheme } from '../../graphql/graphql';
import TestProvider from '../../utils/TestProvider';
import SettingsForm, { FormSchema } from '../SettingsForm';

describe('SettingsForm', () => {
  let initialValues: FormSchema;
  let onSave: jest.Mock<unknown>;
  let component: RenderResult;

  beforeEach(async () => {
    initialValues = {
      categories: [
        {
          name: 'Salary',
          protect: true,
          vatRate: 0,
        },
        {
          name: 'Sustenance',
          protect: false,
          vatRate: 20,
        },
        {
          name: 'Travel',
          protect: false,
          vatRate: 0,
        },
      ],
      id: 'company-id',
      vat: {
        charge: 20,
        pay: 15.5,
        registration: '',
        scheme: VatScheme.FlatRate,
      },
      yearEnd: {
        day: 5,
        month: 3,
      },
    };

    onSave = jest.fn();

    await act(async () => {
      component = render(
        <TestProvider>
          <SettingsForm
            backTo="/test"
            loading={false}
            initialValues={initialValues}
            onSave={(value) => onSave(value)}
          />
        </TestProvider>,
      );

      await Promise.resolve();
    });
  });

  it('should render the form', async () => {
    const { findByRole } = component;

    await expect(findByRole('form')).resolves.toBeInTheDocument();
  });

  it('should submit the form with the correct data', async () => {
    const { findAllByRole } = component;

    await act(async () => {
      const [, , , button] = await findAllByRole('button');

      fireEvent.click(button);
    });

    expect(onSave).toHaveBeenCalledWith(initialValues);
  });

  it('should remove a category', async () => {
    const { findAllByRole } = component;

    await act(async () => {
      const [remove, , , submit] = await findAllByRole('button');

      fireEvent.click(remove);

      fireEvent.click(submit);
    });

    expect(onSave).toHaveBeenCalledWith({
      ...initialValues,
      categories: [
        {
          name: 'Salary',
          protect: true,
          vatRate: 0,
        },
        {
          name: 'Travel',
          protect: false,
          vatRate: 0,
        },
      ],
    });
  });

  it('should add a category', async () => {
    const { findByRole } = component;

    await expect(findByRole('form')).resolves.toBeInTheDocument();
  });

  it('should submit the form with the updated data', async () => {
    const { findAllByRole, findAllByLabelText } = component;

    await act(async () => {
      const [, , add] = await findAllByRole('button');

      fireEvent.click(add);
    });

    await act(async () => {
      const [, , , vatRate] = await findAllByLabelText(
        'settings-form.expense-categories.vat-rate.label',
      );

      fireEvent.change(vatRate, {
        target: {
          focus: () => {},
          value: '5%',
        },
      });
    });

    await act(async () => {
      const [, , , name] = await findAllByLabelText(
        'settings-form.expense-categories.name.label',
      );

      fireEvent.change(name, {
        target: {
          focus: () => {},
          value: 'Utilities',
        },
      });
    });

    await act(async () => {
      const [, , , , submit] = await findAllByRole('button');

      await waitFor(() => expect(submit).not.toBeDisabled());

      fireEvent.click(submit);
    });

    expect(onSave).toHaveBeenCalledWith({
      ...initialValues,
      categories: [
        ...initialValues.categories,
        {
          __typename: 'ExpenseCategory',
          name: 'Utilities',
          protect: false,
          vatRate: 5,
        },
      ],
    });
  });
});
