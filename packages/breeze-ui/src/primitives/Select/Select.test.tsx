import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { Select } from './Select';

describe('Select', () => {
  it('opens by keyboard and reports a semantic value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    renderBreeze(
      <Select.Root onChange={onChange}>
        <Select.Label>Country</Select.Label>
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Popover>
          <Select.ListBox>
            <Select.Item id="gb" textValue="United Kingdom">
              United Kingdom
            </Select.Item>
            <Select.Item id="fr" textValue="France">
              France
            </Select.Item>
          </Select.ListBox>
        </Select.Popover>
      </Select.Root>,
    );

    const trigger = screen.getByRole('button', { name: /Country/ });
    const indicator = trigger.querySelector('[data-breeze-select-indicator]');

    expect(trigger).toHaveClass(
      'min-h-11',
      'px-3',
      'py-2.5',
      'font-[family-name:var(--breeze-font-body)]',
      'text-base',
      'font-normal',
      'leading-[1.4]',
      'data-[hovered]:border-[var(--breeze-primary)]',
      'data-[focus-visible]:outline-2',
    );
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveAttribute('aria-hidden', 'true');
    trigger.focus();
    await user.keyboard('{ArrowDown}{Enter}');

    expect(onChange).toHaveBeenLastCalledWith('gb');
  });

  it('renders generic numeric options and preserves controlled read-only state', async () => {
    const user = userEvent.setup();
    const items = [
      { id: 1, label: 'One' },
      { id: 2, label: 'Two' },
    ];

    renderBreeze(
      <Select.Root readOnly value={1}>
        <Select.Label>Number</Select.Label>
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Popover>
          <Select.ListBox items={items}>
            {(item) => (
              <Select.Item id={item.id} textValue={item.label}>
                {item.label}
              </Select.Item>
            )}
          </Select.ListBox>
        </Select.Popover>
      </Select.Root>,
    );

    const trigger = screen.getByRole('button', { name: /Number/ });

    expect(trigger).toBeDisabled();
    expect(trigger).toHaveClass(
      'data-[disabled]:cursor-not-allowed',
      'data-[disabled]:bg-[var(--breeze-surface-subtle)]',
    );
    expect(trigger).toHaveTextContent('One');
    await user.click(trigger);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('preserves a controlled null value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    renderBreeze(
      <Select.Root onChange={onChange} placeholder="Choose" value={null}>
        <Select.Label>Country</Select.Label>
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Popover>
          <Select.ListBox>
            <Select.Item id="fr" textValue="France">
              France
            </Select.Item>
          </Select.ListBox>
        </Select.Popover>
      </Select.Root>,
    );

    const trigger = screen.getByRole('button', { name: /Country/ });

    await user.click(trigger);
    await user.click(screen.getByRole('option', { name: 'France' }));
    expect(onChange).toHaveBeenLastCalledWith('fr');
    expect(trigger).toHaveTextContent('Choose');
    await user.click(trigger);
    expect(screen.getByRole('option', { name: 'France' })).toHaveAttribute(
      'aria-selected',
      'false',
    );
  });

  it('exposes required invalid state and participates in native forms', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = renderBreeze(
      <Select.Root
        defaultValue="gb"
        form="profile"
        invalid
        name="country"
        ref={ref}
        required
      >
        <Select.Label>Country</Select.Label>
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Popover>
          <Select.ListBox>
            <Select.Item id="gb" textValue="United Kingdom">
              United Kingdom
            </Select.Item>
          </Select.ListBox>
        </Select.Popover>
        <Select.Description>Choose your country.</Select.Description>
        <Select.Error>Country is required.</Select.Error>
      </Select.Root>,
    );

    const trigger = screen.getByRole('button', { name: /Country/ });
    const nativeSelect = container.querySelector<HTMLSelectElement>(
      'select[name="country"]',
    );

    expect(ref.current).toBeInTheDocument();
    expect(ref.current).toHaveAttribute('data-invalid');
    expect(ref.current).toHaveAttribute('data-required');
    expect(trigger).toHaveClass(
      'group-data-[invalid]/select:border-[var(--breeze-danger)]',
    );
    expect(trigger).toHaveAccessibleDescription(
      'Choose your country. Country is required.',
    );
    expect(nativeSelect).toBeInvalid();
    expect(nativeSelect).toBeRequired();
    expect(nativeSelect).toHaveAttribute('form', 'profile');
    expect(nativeSelect).toHaveValue('gb');
  });

  it('renders custom empty content after opening', async () => {
    const user = userEvent.setup();
    const items: { id: string; label: string }[] = [];

    renderBreeze(
      <Select.Root>
        <Select.Label>Status</Select.Label>
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Popover>
          <Select.ListBox emptyContent="No statuses" items={items}>
            {(item) => (
              <Select.Item id={item.id} textValue={item.label}>
                {item.label}
              </Select.Item>
            )}
          </Select.ListBox>
        </Select.Popover>
      </Select.Root>,
    );

    const trigger = screen.getByRole('button', { name: /Status/ });

    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('No statuses')).toBeVisible();
    expect(screen.getByRole('option', { name: 'No statuses' })).toBeVisible();
  });
});
