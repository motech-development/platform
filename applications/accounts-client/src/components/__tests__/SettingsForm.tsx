import {
  act,
  fireEvent,
  render,
  RenderResult,
  wait,
} from '@testing-library/react';
import React from 'react';
import TestProvider from '../../utils/TestProvider';
import SettingsForm, { FormSchema } from '../SettingsForm';

describe('SettingsForm', () => {
  let initialValues: FormSchema;
  let onSave: jest.Mock;
  let component: RenderResult;

  beforeEach(() => {
    initialValues = {
      categories: [
        {
          name: 'Sustenance',
          vatRate: 20,
        },
        {
          name: 'Travel',
          vatRate: 0,
        },
      ],
      id: 'company-id',
      vat: {
        charge: 20,
        pay: 15.5,
      },
    };

    onSave = jest.fn();

    component = render(
      <TestProvider>
        <SettingsForm
          backTo="/test"
          bankConnect="/connect-to-bank"
          loading={false}
          initialValues={initialValues}
          onSave={value => onSave(value)}
        />
      </TestProvider>,
    );
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
          name: 'Travel',
          vatRate: 0,
        },
      ],
    });
  });

  it('should add a category', async () => {
    const { findByRole } = component;

    await expect(findByRole('form')).resolves.toBeInTheDocument();
  });

  it('should submit the form with the correct data', async () => {
    const { findAllByRole, findAllByLabelText } = component;

    await act(async () => {
      const [, , add, submit] = await findAllByRole('button');

      fireEvent.click(add);

      const [, , name] = await findAllByLabelText(
        'settings-form.expense-categories.name.label',
      );
      const [, , vatRate] = await findAllByLabelText(
        'settings-form.expense-categories.vat-rate.label',
      );

      fireEvent.change(vatRate, {
        target: {
          focus: () => {},
          value: '5%',
        },
      });

      fireEvent.change(name, {
        target: {
          focus: () => {},
          value: 'Utilities',
        },
      });

      await wait();

      fireEvent.click(submit);
    });

    expect(onSave).toHaveBeenCalledWith({
      ...initialValues,
      categories: [
        ...initialValues.categories,
        {
          __typename: 'ExpenseCategory',
          name: 'Utilities',
          vatRate: '5%',
        },
      ],
    });
  });

  it('should contain a link to connect to a bank', async () => {
    const { findByText } = component;

    await expect(
      findByText('settings-form.bank.connect'),
    ).resolves.toHaveAttribute('href', '/connect-to-bank');
  });
});
