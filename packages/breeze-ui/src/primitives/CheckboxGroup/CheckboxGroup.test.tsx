import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { Checkbox } from '../Checkbox/Checkbox';
import { CheckboxGroup } from './CheckboxGroup';

describe('CheckboxGroup', () => {
  it('associates group anatomy and reports semantic selections', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();

    renderBreeze(
      <CheckboxGroup.Root onSelectionChange={onSelectionChange}>
        <CheckboxGroup.Label>Notifications</CheckboxGroup.Label>
        <CheckboxGroup.Description>
          Choose any channels.
        </CheckboxGroup.Description>
        <Checkbox.Root value="email">
          <Checkbox.Control>
            <Checkbox.Indicator />
            <Checkbox.Label>Email</Checkbox.Label>
          </Checkbox.Control>
        </Checkbox.Root>
        <Checkbox.Root value="sms">
          <Checkbox.Control>
            <Checkbox.Indicator />
            <Checkbox.Label>SMS</Checkbox.Label>
          </Checkbox.Control>
        </Checkbox.Root>
      </CheckboxGroup.Root>,
    );

    const group = screen.getByRole('group', { name: 'Notifications' });

    expect(group).toHaveAccessibleDescription('Choose any channels.');
    expect(group).toHaveClass('flex-col', 'items-start');
    expect(screen.getByText('Notifications')).toHaveAttribute(
      'data-breeze-checkbox-group-label',
    );
    expect(screen.getByText('Choose any channels.')).toHaveAttribute(
      'data-breeze-checkbox-group-description',
    );
    await user.click(screen.getByRole('checkbox', { name: 'Email' }));
    await user.click(screen.getByRole('checkbox', { name: 'SMS' }));
    expect(onSelectionChange).toHaveBeenLastCalledWith(['email', 'sms']);
  });

  it('preserves controlled and read-only group selections', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();

    renderBreeze(
      <div>
        <CheckboxGroup.Root
          onSelectionChange={onSelectionChange}
          selection={['email']}
        >
          <CheckboxGroup.Label>Controlled</CheckboxGroup.Label>
          <Checkbox.Root value="email">
            <Checkbox.Control>
              <Checkbox.Indicator />
              <Checkbox.Label>Email</Checkbox.Label>
            </Checkbox.Control>
          </Checkbox.Root>
          <Checkbox.Root value="sms">
            <Checkbox.Control>
              <Checkbox.Indicator />
              <Checkbox.Label>SMS</Checkbox.Label>
            </Checkbox.Control>
          </Checkbox.Root>
        </CheckboxGroup.Root>
        <CheckboxGroup.Root readOnly selection={['push']}>
          <CheckboxGroup.Label>Read only</CheckboxGroup.Label>
          <Checkbox.Root value="push">
            <Checkbox.Control>
              <Checkbox.Indicator />
              <Checkbox.Label>Push</Checkbox.Label>
            </Checkbox.Control>
          </Checkbox.Root>
        </CheckboxGroup.Root>
      </div>,
    );

    await user.click(screen.getByRole('checkbox', { name: 'SMS' }));
    expect(onSelectionChange).toHaveBeenCalledWith(['email', 'sms']);
    expect(screen.getByRole('checkbox', { name: 'SMS' })).not.toBeChecked();

    await user.click(screen.getByRole('checkbox', { name: 'Push' }));
    expect(screen.getByRole('checkbox', { name: 'Push' })).toBeChecked();
  });

  it('applies required invalid group state and native form names', () => {
    const descriptionRef = createRef<HTMLElement>();
    const errorRef = createRef<HTMLElement>();
    const labelRef = createRef<HTMLLabelElement>();

    renderBreeze(
      <CheckboxGroup.Root
        invalid
        name="channels"
        orientation="horizontal"
        required
      >
        <CheckboxGroup.Label className="max-w-xl" ref={labelRef}>
          Channels
        </CheckboxGroup.Label>
        <CheckboxGroup.Description className="text-base" ref={descriptionRef}>
          Choose any channels.
        </CheckboxGroup.Description>
        <Checkbox.Root value="email">
          <Checkbox.Control>
            <Checkbox.Indicator />
            <Checkbox.Label>Email</Checkbox.Label>
          </Checkbox.Control>
        </Checkbox.Root>
        <Checkbox.Root value="sms">
          <Checkbox.Control>
            <Checkbox.Indicator />
            <Checkbox.Label>SMS</Checkbox.Label>
          </Checkbox.Control>
        </Checkbox.Root>
        <CheckboxGroup.Error className="font-bold" ref={errorRef}>
          Select a channel.
        </CheckboxGroup.Error>
      </CheckboxGroup.Root>,
    );

    const checkbox = screen.getByRole('checkbox', { name: 'Email' });

    expect(checkbox).toHaveAttribute('name', 'channels');
    expect(checkbox).toBeInvalid();
    const group = screen.getByRole('group', { name: 'Channels' });

    expect(group).toHaveAccessibleDescription(
      'Choose any channels. Select a channel.',
    );
    expect(group).toHaveClass(
      '[&>[data-breeze-checkbox-group-description]]:basis-full',
      '[&>[data-breeze-checkbox-group-error]]:basis-full',
      '[&>[data-breeze-checkbox-group-label]]:basis-full',
    );
    expect(labelRef.current).toHaveAttribute(
      'data-breeze-checkbox-group-label',
    );
    expect(labelRef.current).toHaveClass('max-w-xl');
    expect(descriptionRef.current).toHaveAttribute(
      'data-breeze-checkbox-group-description',
    );
    expect(descriptionRef.current).toHaveClass('text-base');
    expect(errorRef.current).toHaveAttribute(
      'data-breeze-checkbox-group-error',
    );
    expect(errorRef.current).toHaveClass('font-bold');
  });
});
