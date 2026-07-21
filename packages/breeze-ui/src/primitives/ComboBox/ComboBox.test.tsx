import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { ComboBox } from './ComboBox';

describe('ComboBox', () => {
  it('renders one grouped field surface with a contextual icon-only trigger', async () => {
    const user = userEvent.setup();
    const groupRef = createRef<HTMLDivElement>();
    const triggerRef = createRef<HTMLButtonElement>();

    renderBreeze(
      <ComboBox.Root>
        <ComboBox.Label>Country</ComboBox.Label>
        <ComboBox.Group ref={groupRef} size="lg">
          <ComboBox.Input size="sm" />
          <ComboBox.Trigger ref={triggerRef} size="sm" />
        </ComboBox.Group>
        <ComboBox.Popover>
          <ComboBox.ListBox>
            <ComboBox.Item id="gb" textValue="United Kingdom">
              United Kingdom
            </ComboBox.Item>
          </ComboBox.ListBox>
        </ComboBox.Popover>
      </ComboBox.Root>,
    );

    const input = screen.getByRole('combobox', { name: 'Country' });
    const trigger = screen.getByRole('button', {
      name: 'Show suggestions Country',
    });

    expect(groupRef.current).toHaveAttribute('data-size', 'lg');
    expect(groupRef.current).toHaveAttribute('data-breeze-combobox-group');
    expect(input).toHaveClass('min-h-12', 'border-0', 'bg-transparent');
    expect(triggerRef.current).toBe(trigger);
    expect(trigger).toHaveClass(
      'min-h-12',
      'min-w-12',
      'border-0',
      'bg-transparent',
    );
    expect(trigger).not.toHaveTextContent('Open options');
    expect(trigger.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');

    await user.click(trigger);
    expect(
      screen.getByRole('option', { name: 'United Kingdom' }),
    ).toBeVisible();

    await user.keyboard('{Escape}');
    trigger.focus();
    await user.keyboard('{Enter}');
    expect(
      screen.getByRole('option', { name: 'United Kingdom' }),
    ).toBeVisible();
  });

  it('projects root disabled, read-only, and invalid state onto grouped surfaces', () => {
    renderBreeze(
      <>
        <ComboBox.Root disabled>
          <ComboBox.Label>Disabled country</ComboBox.Label>
          <ComboBox.Group>
            <ComboBox.Input />
            <ComboBox.Trigger />
          </ComboBox.Group>
        </ComboBox.Root>
        <ComboBox.Root inputValue="France" readOnly selection="fr">
          <ComboBox.Label>Read-only country</ComboBox.Label>
          <ComboBox.Group>
            <ComboBox.Input />
            <ComboBox.Trigger />
          </ComboBox.Group>
        </ComboBox.Root>
        <ComboBox.Root invalid>
          <ComboBox.Label>Invalid country</ComboBox.Label>
          <ComboBox.Group>
            <ComboBox.Input />
            <ComboBox.Trigger />
          </ComboBox.Group>
        </ComboBox.Root>
      </>,
    );

    const groups = screen
      .getAllByRole('presentation')
      .filter((element) => element.hasAttribute('data-breeze-combobox-group'));

    expect(groups).toHaveLength(3);
    expect(groups[0]).toHaveAttribute('data-disabled');
    expect(groups[1]).toHaveAttribute('data-readonly');
    expect(groups[2]).toHaveAttribute('data-invalid');
  });

  it('reports semantic input and option selection', async () => {
    const user = userEvent.setup();
    const onInputChange = vi.fn();
    const onSelectionChange = vi.fn();
    renderBreeze(
      <ComboBox.Root
        onInputChange={onInputChange}
        onSelectionChange={onSelectionChange}
      >
        <ComboBox.Label>Country</ComboBox.Label>
        <ComboBox.Input />
        <ComboBox.Trigger>Open</ComboBox.Trigger>
        <ComboBox.Popover>
          <ComboBox.ListBox>
            <ComboBox.Item id="gb" textValue="United Kingdom">
              United Kingdom
            </ComboBox.Item>
            <ComboBox.Item id="fr" textValue="France">
              France
            </ComboBox.Item>
          </ComboBox.ListBox>
        </ComboBox.Popover>
      </ComboBox.Root>,
    );
    const input = screen.getByRole('combobox', { name: 'Country' });
    await user.type(input, 'Fra');
    await user.keyboard('{ArrowDown}{Enter}');
    expect(onInputChange).toHaveBeenCalled();
    expect(onSelectionChange).toHaveBeenCalledWith('fr');
  });

  it('renders generic numeric options and preserves controlled read-only state', async () => {
    const user = userEvent.setup();
    const items = [
      { id: 1, label: 'One' },
      { id: 2, label: 'Two' },
    ];

    renderBreeze(
      <ComboBox.Root inputValue="One" readOnly selection={1}>
        <ComboBox.Label>Number</ComboBox.Label>
        <ComboBox.Input />
        <ComboBox.Trigger>Open</ComboBox.Trigger>
        <ComboBox.Popover>
          <ComboBox.ListBox items={items}>
            {(item) => (
              <ComboBox.Item id={item.id} textValue={item.label}>
                {item.label}
              </ComboBox.Item>
            )}
          </ComboBox.ListBox>
        </ComboBox.Popover>
      </ComboBox.Root>,
    );

    const input = screen.getByRole('combobox', { name: 'Number' });

    expect(input).toHaveValue('One');
    expect(input).toHaveAttribute('readonly');
    await user.type(input, 'Two');
    expect(input).toHaveValue('One');
  });

  it('preserves a controlled null selection', async () => {
    const user = userEvent.setup();
    const onInputChange = vi.fn();
    const onSelectionChange = vi.fn();

    renderBreeze(
      <ComboBox.Root
        inputValue=""
        onInputChange={onInputChange}
        onSelectionChange={onSelectionChange}
        selection={null}
      >
        <ComboBox.Label>Country</ComboBox.Label>
        <ComboBox.Input />
        <ComboBox.Trigger>Open</ComboBox.Trigger>
        <ComboBox.Popover>
          <ComboBox.ListBox>
            <ComboBox.Item id="fr" textValue="France">
              France
            </ComboBox.Item>
          </ComboBox.ListBox>
        </ComboBox.Popover>
      </ComboBox.Root>,
    );

    const trigger = screen.getByRole('button', { name: /Show suggestions/ });

    await user.click(trigger);
    await user.click(screen.getByRole('option', { name: 'France' }));
    expect(onSelectionChange).toHaveBeenLastCalledWith('fr');
    expect(screen.getByRole('combobox', { name: 'Country' })).toHaveValue('');
  });

  it('exposes disabled required invalid state and native form refs', () => {
    const rootRef = createRef<HTMLDivElement>();
    const inputRef = createRef<HTMLInputElement>();
    const { container } = renderBreeze(
      <ComboBox.Root
        defaultInputValue="United Kingdom"
        defaultSelection="gb"
        form="profile"
        invalid
        name="country"
        ref={rootRef}
        required
      >
        <ComboBox.Label>Country</ComboBox.Label>
        <ComboBox.Input ref={inputRef} />
        <ComboBox.Trigger>Open</ComboBox.Trigger>
        <ComboBox.Popover>
          <ComboBox.ListBox>
            <ComboBox.Item id="gb" textValue="United Kingdom">
              United Kingdom
            </ComboBox.Item>
          </ComboBox.ListBox>
        </ComboBox.Popover>
        <ComboBox.Description>Choose your country.</ComboBox.Description>
        <ComboBox.Error>Country is required.</ComboBox.Error>
      </ComboBox.Root>,
    );

    const input = screen.getByRole('combobox', { name: 'Country' });
    const nativeInput = container.querySelector<HTMLInputElement>(
      'input[name="country"]',
    );

    expect(rootRef.current).toBeInTheDocument();
    expect(inputRef.current).toBe(input);
    expect(input).toBeInvalid();
    expect(input).toBeRequired();
    expect(nativeInput).toHaveAttribute('form', 'profile');
    expect(nativeInput).toHaveValue('gb');
  });

  it('renders empty content and disables all interaction', async () => {
    const user = userEvent.setup();
    const emptyItems = [{ id: 'open', label: 'Open' }];
    const { unmount } = renderBreeze(
      <ComboBox.Root>
        <ComboBox.Label>Status</ComboBox.Label>
        <ComboBox.Input />
        <ComboBox.Trigger>Open</ComboBox.Trigger>
        <ComboBox.Popover>
          <ComboBox.ListBox emptyContent="No statuses" items={emptyItems}>
            {(item) => (
              <ComboBox.Item id={item.id} textValue={item.label}>
                {item.label}
              </ComboBox.Item>
            )}
          </ComboBox.ListBox>
        </ComboBox.Popover>
      </ComboBox.Root>,
    );

    await user.type(screen.getByRole('combobox', { name: 'Status' }), 'zzz');
    expect(screen.getByRole('status')).toHaveTextContent('No statuses');

    unmount();
    renderBreeze(
      <ComboBox.Root disabled>
        <ComboBox.Label>Disabled</ComboBox.Label>
        <ComboBox.Input />
        <ComboBox.Trigger>Open</ComboBox.Trigger>
        <ComboBox.Popover>
          <ComboBox.ListBox>
            <ComboBox.Item id="one" textValue="One">
              One
            </ComboBox.Item>
          </ComboBox.ListBox>
        </ComboBox.Popover>
      </ComboBox.Root>,
    );
    expect(screen.getByRole('combobox', { name: 'Disabled' })).toBeDisabled();
    expect(
      screen.getByRole('button', { name: 'Show suggestions Disabled' }),
    ).toBeDisabled();
  });

  it('commits a free-form value without selecting an option', async () => {
    const user = userEvent.setup();
    const onCommit = vi.fn();
    const onInputChange = vi.fn();
    const onSelectionChange = vi.fn();

    renderBreeze(
      <ComboBox.Root
        allowsCustomValue
        onCommit={onCommit}
        onInputChange={onInputChange}
        onSelectionChange={onSelectionChange}
      >
        <ComboBox.Label>Destination</ComboBox.Label>
        <ComboBox.Input />
        <ComboBox.Popover>
          <ComboBox.ListBox items={[] as { id: string; label: string }[]}>
            {(option) => (
              <ComboBox.Item id={option.id} textValue={option.label}>
                {option.label}
              </ComboBox.Item>
            )}
          </ComboBox.ListBox>
        </ComboBox.Popover>
      </ComboBox.Root>,
    );

    const input = screen.getByRole('combobox', { name: 'Destination' });

    await user.type(input, 'Lisbon{Enter}');

    expect(onInputChange).toHaveBeenLastCalledWith('Lisbon');
    expect(onCommit).toHaveBeenCalledWith('Lisbon');
    expect(onSelectionChange).not.toHaveBeenCalled();
    expect(input).toHaveValue('Lisbon');
  });

  it('selects a highlighted numeric option instead of committing free-form text', async () => {
    const user = userEvent.setup();
    const onCommit = vi.fn();
    const onSelectionChange = vi.fn();
    const options = [
      { id: 1, label: 'London' },
      { id: 2, label: 'Lisbon' },
    ];

    renderBreeze(
      <ComboBox.Root
        allowsCustomValue
        onCommit={onCommit}
        onSelectionChange={onSelectionChange}
      >
        <ComboBox.Label>Destination</ComboBox.Label>
        <ComboBox.Input />
        <ComboBox.Popover>
          <ComboBox.ListBox items={options}>
            {(option) => (
              <ComboBox.Item id={option.id} textValue={option.label}>
                {option.label}
              </ComboBox.Item>
            )}
          </ComboBox.ListBox>
        </ComboBox.Popover>
      </ComboBox.Root>,
    );

    const input = screen.getByRole('combobox', { name: 'Destination' });

    await user.type(input, 'Li');
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('option', { name: 'London' })).toHaveAttribute(
      'data-focused',
    );
    await user.keyboard('{Enter}');

    expect(onSelectionChange).toHaveBeenLastCalledWith(1);
    expect(onCommit).not.toHaveBeenCalled();
    expect(input).toHaveValue('London');
  });

  it('keeps controlled free-form text independent from uncontrolled selection', async () => {
    const user = userEvent.setup();
    const onInputChange = vi.fn();
    const onSelectionChange = vi.fn();

    renderBreeze(
      <ComboBox.Root
        allowsCustomValue
        inputValue="Search"
        onInputChange={onInputChange}
        onSelectionChange={onSelectionChange}
      >
        <ComboBox.Label>Destination</ComboBox.Label>
        <ComboBox.Input />
        <ComboBox.Popover>
          <ComboBox.ListBox>
            <ComboBox.Item id="london" textValue="London">
              London
            </ComboBox.Item>
          </ComboBox.ListBox>
        </ComboBox.Popover>
      </ComboBox.Root>,
    );

    const input = screen.getByRole('combobox', { name: 'Destination' });

    input.focus();
    await user.keyboard('{ArrowDown}{Enter}');

    expect(onSelectionChange).toHaveBeenLastCalledWith('london');
    expect(onInputChange).toHaveBeenCalledWith('London');
    expect(input).toHaveValue('Search');
  });

  it('keeps controlled selection independent from uncontrolled free-form text', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();

    renderBreeze(
      <ComboBox.Root
        allowsCustomValue
        defaultInputValue="London"
        onSelectionChange={onSelectionChange}
        selection="london"
      >
        <ComboBox.Label>Destination</ComboBox.Label>
        <ComboBox.Input />
        <ComboBox.Trigger>Open</ComboBox.Trigger>
        <ComboBox.Popover>
          <ComboBox.ListBox>
            <ComboBox.Item id="london" textValue="London">
              London
            </ComboBox.Item>
            <ComboBox.Item id="lisbon" textValue="Lisbon">
              Lisbon
            </ComboBox.Item>
          </ComboBox.ListBox>
        </ComboBox.Popover>
      </ComboBox.Root>,
    );

    await user.click(screen.getByRole('button', { name: /Show suggestions/ }));
    await user.click(screen.getByRole('option', { name: 'Lisbon' }));

    expect(onSelectionChange).toHaveBeenLastCalledWith('lisbon');
    expect(screen.getByRole('option', { name: 'London' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('announces application-owned option loading and errors in either mode', async () => {
    const user = userEvent.setup();
    const triggerRef = createRef<HTMLButtonElement>();
    const popoverRef = createRef<HTMLElement>();
    const listRef = createRef<HTMLDivElement>();
    const loadingRef = createRef<HTMLDivElement>();
    const optionsErrorRef = createRef<HTMLDivElement>();

    renderBreeze(
      <ComboBox.Root>
        <ComboBox.Label>Country</ComboBox.Label>
        <ComboBox.Input />
        <ComboBox.Trigger ref={triggerRef}>Open</ComboBox.Trigger>
        <ComboBox.Popover ref={popoverRef}>
          <ComboBox.Loading ref={loadingRef}>
            Loading countries
          </ComboBox.Loading>
          <ComboBox.OptionsError ref={optionsErrorRef}>
            Countries unavailable
          </ComboBox.OptionsError>
          <ComboBox.ListBox
            emptyContent={null}
            items={[] as { id: string; label: string }[]}
            ref={listRef}
          >
            {(option) => (
              <ComboBox.Item id={option.id} textValue={option.label}>
                {option.label}
              </ComboBox.Item>
            )}
          </ComboBox.ListBox>
        </ComboBox.Popover>
      </ComboBox.Root>,
    );

    expect(triggerRef.current).toBe(
      screen.getByRole('button', { name: /Show suggestions/ }),
    );
    await user.click(triggerRef.current as HTMLButtonElement);

    expect(popoverRef.current).toBeInTheDocument();
    expect(listRef.current).toBe(screen.getByRole('listbox'));
    expect(loadingRef.current).toHaveAttribute('role', 'status');
    expect(loadingRef.current).toHaveAttribute('aria-live', 'polite');
    expect(optionsErrorRef.current).toHaveAttribute('role', 'alert');
    expect(optionsErrorRef.current).toHaveAttribute('aria-live', 'assertive');
    expect(screen.queryByText('No options')).not.toBeInTheDocument();
  });

  it('submits free-form text and forwards root and input refs', () => {
    const rootRef = createRef<HTMLDivElement>();
    const inputRef = createRef<HTMLInputElement>();
    const { container } = renderBreeze(
      <ComboBox.Root
        allowsCustomValue
        defaultInputValue="Lisbon"
        form="travel"
        invalid
        name="destination"
        ref={rootRef}
        required
      >
        <ComboBox.Label>Destination</ComboBox.Label>
        <ComboBox.Input ref={inputRef} />
        <ComboBox.Popover>
          <ComboBox.ListBox>
            <ComboBox.Item id="lisbon" textValue="Lisbon">
              Lisbon
            </ComboBox.Item>
          </ComboBox.ListBox>
        </ComboBox.Popover>
        <ComboBox.Description>Enter any destination.</ComboBox.Description>
        <ComboBox.Error>A destination is required.</ComboBox.Error>
      </ComboBox.Root>,
    );

    const input = screen.getByRole('combobox', { name: 'Destination' });
    const nativeInput = container.querySelector<HTMLInputElement>(
      'input[name="destination"]',
    );

    expect(rootRef.current).toBeInTheDocument();
    expect(inputRef.current).toBe(input);
    expect(input).toBeInvalid();
    expect(input).toBeRequired();
    expect(nativeInput).toHaveAttribute('form', 'travel');
    expect(nativeInput).toHaveValue('Lisbon');
    expect(input).toHaveAccessibleDescription(
      'Enter any destination. A destination is required.',
    );
  });
});
