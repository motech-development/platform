import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { RadioGroup } from './RadioGroup';

describe('RadioGroup', () => {
  it('reports semantic selection and follows orientation-aware arrow keys', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    const descriptionRef = createRef<HTMLElement>();
    const labelRef = createRef<HTMLLabelElement>();

    renderBreeze(
      <RadioGroup.Root
        defaultSelection="email"
        onSelectionChange={onSelectionChange}
        orientation="horizontal"
      >
        <RadioGroup.Label className="max-w-xl" ref={labelRef}>
          Contact method
        </RadioGroup.Label>
        <RadioGroup.Description className="text-base" ref={descriptionRef}>
          Choose one channel.
        </RadioGroup.Description>
        <RadioGroup.Item value="email">
          <RadioGroup.Control>
            <RadioGroup.Indicator />
            <RadioGroup.ItemLabel>Email</RadioGroup.ItemLabel>
          </RadioGroup.Control>
          <RadioGroup.ItemDescription>
            Fastest response.
          </RadioGroup.ItemDescription>
        </RadioGroup.Item>
        <RadioGroup.Item value="sms">
          <RadioGroup.Control>
            <RadioGroup.Indicator />
            <RadioGroup.ItemLabel>SMS</RadioGroup.ItemLabel>
          </RadioGroup.Control>
        </RadioGroup.Item>
      </RadioGroup.Root>,
    );

    const group = screen.getByRole('radiogroup', { name: 'Contact method' });
    const email = screen.getByRole('radio', { name: 'Email' });
    const sms = screen.getByRole('radio', { name: 'SMS' });
    const emailControl = email.closest('label');
    const emailIndicator = emailControl?.querySelector('[aria-hidden="true"]');

    expect(group).toHaveAccessibleDescription('Choose one channel.');
    expect(group).toHaveClass(
      '[&>[data-breeze-radio-group-description]]:basis-full',
      '[&>[data-breeze-radio-group-error]]:basis-full',
      '[&>[data-breeze-radio-group-label]]:basis-full',
    );
    expect(labelRef.current).toHaveAttribute('data-breeze-radio-group-label');
    expect(labelRef.current).toHaveClass('leading-[1.4]', 'max-w-xl');
    expect(descriptionRef.current).toHaveAttribute(
      'data-breeze-radio-group-description',
    );
    expect(descriptionRef.current).toHaveClass('text-base');
    expect(screen.getByText('Fastest response.')).not.toHaveAttribute(
      'data-breeze-radio-group-description',
    );
    expect(email).toHaveAccessibleDescription(
      'Fastest response. Choose one channel.',
    );
    expect(emailControl).not.toHaveClass('min-h-11');
    expect(emailControl).toHaveClass(
      'font-[family-name:var(--breeze-font-body)]',
      'text-base',
      'font-normal',
      'leading-[1.4]',
    );
    expect(emailIndicator).toHaveClass('size-5', 'after:size-2');
    email.focus();
    await user.keyboard('{ArrowRight}');
    expect(sms).toHaveFocus();
    expect(sms).toBeChecked();
    expect(onSelectionChange).toHaveBeenLastCalledWith('sms');
  });

  it('skips disabled options during vertical keyboard navigation', async () => {
    const user = userEvent.setup();

    renderBreeze(
      <RadioGroup.Root defaultSelection="one" orientation="vertical">
        <RadioGroup.Label>Priority</RadioGroup.Label>
        <RadioGroup.Item value="one">
          <RadioGroup.Control>
            <RadioGroup.Indicator />
            <RadioGroup.ItemLabel>One</RadioGroup.ItemLabel>
          </RadioGroup.Control>
        </RadioGroup.Item>
        <RadioGroup.Item disabled value="two">
          <RadioGroup.Control>
            <RadioGroup.Indicator />
            <RadioGroup.ItemLabel>Two</RadioGroup.ItemLabel>
          </RadioGroup.Control>
        </RadioGroup.Item>
        <RadioGroup.Item value="three">
          <RadioGroup.Control>
            <RadioGroup.Indicator />
            <RadioGroup.ItemLabel>Three</RadioGroup.ItemLabel>
          </RadioGroup.Control>
        </RadioGroup.Item>
      </RadioGroup.Root>,
    );

    screen.getByRole('radio', { name: 'One' }).focus();
    await user.keyboard('{ArrowDown}');

    expect(screen.getByRole('radio', { name: 'Three' })).toHaveFocus();
    expect(screen.getByRole('radio', { name: 'Three' })).toBeChecked();
  });

  it('preserves controlled and read-only selections', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();

    renderBreeze(
      <div>
        <RadioGroup.Root
          onSelectionChange={onSelectionChange}
          selection="email"
        >
          <RadioGroup.Label>Controlled</RadioGroup.Label>
          <RadioGroup.Item value="email">
            <RadioGroup.Control>
              <RadioGroup.Indicator />
              <RadioGroup.ItemLabel>Email</RadioGroup.ItemLabel>
            </RadioGroup.Control>
          </RadioGroup.Item>
          <RadioGroup.Item value="sms">
            <RadioGroup.Control>
              <RadioGroup.Indicator />
              <RadioGroup.ItemLabel>SMS</RadioGroup.ItemLabel>
            </RadioGroup.Control>
          </RadioGroup.Item>
        </RadioGroup.Root>
        <RadioGroup.Root readOnly selection="push">
          <RadioGroup.Label>Read only</RadioGroup.Label>
          <RadioGroup.Item value="push">
            <RadioGroup.Control>
              <RadioGroup.Indicator />
              <RadioGroup.ItemLabel>Push</RadioGroup.ItemLabel>
            </RadioGroup.Control>
          </RadioGroup.Item>
          <RadioGroup.Item value="none">
            <RadioGroup.Control>
              <RadioGroup.Indicator />
              <RadioGroup.ItemLabel>None</RadioGroup.ItemLabel>
            </RadioGroup.Control>
          </RadioGroup.Item>
        </RadioGroup.Root>
      </div>,
    );

    await user.click(screen.getByRole('radio', { name: 'SMS' }));
    expect(onSelectionChange).toHaveBeenCalledWith('sms');
    expect(screen.getByRole('radio', { name: 'Email' })).toBeChecked();

    await user.click(screen.getByRole('radio', { name: 'None' }));
    expect(screen.getByRole('radio', { name: 'Push' })).toBeChecked();
  });

  it('preserves a controlled null selection', () => {
    renderBreeze(
      <RadioGroup.Root onSelectionChange={() => undefined} selection={null}>
        <RadioGroup.Label>Unselected method</RadioGroup.Label>
        <RadioGroup.Item value="email">
          <RadioGroup.Control>
            <RadioGroup.Indicator />
            <RadioGroup.ItemLabel>Email</RadioGroup.ItemLabel>
          </RadioGroup.Control>
        </RadioGroup.Item>
      </RadioGroup.Root>,
    );

    expect(screen.getByRole('radio', { name: 'Email' })).not.toBeChecked();
  });

  it('shows a visible outline for keyboard focus', async () => {
    const user = userEvent.setup();

    renderBreeze(
      <RadioGroup.Root>
        <RadioGroup.Label>Contact method</RadioGroup.Label>
        <RadioGroup.Item value="email">
          <RadioGroup.Control>
            <RadioGroup.Indicator />
            <RadioGroup.ItemLabel>Email</RadioGroup.ItemLabel>
          </RadioGroup.Control>
        </RadioGroup.Item>
      </RadioGroup.Root>,
    );

    await user.tab();

    const control = screen
      .getByRole('radio', { name: 'Email' })
      .closest('label');

    expect(control).toHaveAttribute('data-focus-visible', 'true');
    expect(control).toHaveClass(
      'data-[focus-visible]:outline-2',
      'data-[focus-visible]:outline-offset-2',
      'data-[focus-visible]:outline-[var(--breeze-focus)]',
    );
  });

  it('forwards native input refs, names, required and invalid state', () => {
    const descriptionRef = createRef<HTMLElement>();
    const errorRef = createRef<HTMLElement>();
    const inputRef = createRef<HTMLInputElement>();

    renderBreeze(
      <RadioGroup.Root invalid name="delivery" required>
        <RadioGroup.Label>Delivery</RadioGroup.Label>
        <RadioGroup.Description ref={descriptionRef}>
          Choose one delivery method.
        </RadioGroup.Description>
        <RadioGroup.Item inputRef={inputRef} value="post">
          <RadioGroup.Control>
            <RadioGroup.Indicator />
            <RadioGroup.ItemLabel>Post</RadioGroup.ItemLabel>
          </RadioGroup.Control>
        </RadioGroup.Item>
        <RadioGroup.Error className="font-bold" ref={errorRef}>
          Select a delivery method.
        </RadioGroup.Error>
      </RadioGroup.Root>,
    );

    expect(inputRef.current).toBe(screen.getByRole('radio', { name: 'Post' }));
    expect(inputRef.current).toHaveAttribute('name', 'delivery');
    expect(inputRef.current).toBeRequired();
    expect(inputRef.current).toBeInvalid();
    expect(
      screen.getByRole('radiogroup', { name: 'Delivery' }),
    ).toHaveAccessibleDescription(
      'Choose one delivery method. Select a delivery method.',
    );
    expect(descriptionRef.current).toHaveAttribute(
      'data-breeze-radio-group-description',
    );
    expect(errorRef.current).toHaveAttribute('data-breeze-radio-group-error');
    expect(errorRef.current).toHaveClass('font-bold');
  });
});
