import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import StoryConstraint from '../../../.storybook/StoryConstraint';
import { Checkbox } from '../Checkbox/Checkbox';
import { Stack } from '../Stack/Stack';
import {
  CheckboxGroup,
  Description,
  Error,
  Label,
  Root,
} from './CheckboxGroup';

const meta = {
  component: Root,
  decorators: [
    (Story) => {
      Object.assign(CheckboxGroup.Description, {
        displayName: 'CheckboxGroup.Description',
      });
      Object.assign(CheckboxGroup.Error, {
        displayName: 'CheckboxGroup.Error',
      });
      Object.assign(CheckboxGroup.Label, {
        displayName: 'CheckboxGroup.Label',
      });
      Object.assign(CheckboxGroup.Root, {
        displayName: 'CheckboxGroup.Root',
      });

      return <Story />;
    },
  ] satisfies Decorator[],
  subcomponents: {
    Description,
    Error,
    Label,
  },
  title: 'Selection/CheckboxGroup',
} satisfies Meta<typeof Root>;
export default meta;
type Story = StoryObj<typeof meta>;

function Option({ label, value }: { label: string; value: string }) {
  return (
    <Checkbox.Root value={value}>
      <Checkbox.Control>
        <Checkbox.Indicator />
        <Checkbox.Label>{label}</Checkbox.Label>
      </Checkbox.Control>
    </Checkbox.Root>
  );
}
function ControlledExample() {
  const [selection, setSelection] = useState(['email']);

  return (
    <CheckboxGroup.Root onSelectionChange={setSelection} selection={selection}>
      <CheckboxGroup.Label>Controlled channels</CheckboxGroup.Label>
      <Option label="Email" value="email" />
      <Option label="SMS" value="sms" />
      <CheckboxGroup.Description>
        {selection.join(', ') || 'None'}
      </CheckboxGroup.Description>
    </CheckboxGroup.Root>
  );
}

/**
 * Builds a horizontally wrapped group with a shared label, description, form
 * name, and three uncontrolled Checkbox options, then verifies selection and
 * group association.
 *
 * @summary Horizontal uncontrolled checkbox group anatomy.
 */
export const AnatomyAndUncontrolled: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const group = canvas.getByRole('group', {
      name: 'Notification channels',
    });
    const label = canvas.getByText('Notification channels');
    const description = canvas.getByText('Choose any channels.');
    const optionControls = ['Email', 'SMS', 'Push'].map((name) =>
      canvas.getByRole('checkbox', { name }).closest('label'),
    );
    const groupBounds = group.getBoundingClientRect();
    const labelBounds = label.getBoundingClientRect();
    const descriptionBounds = description.getBoundingClientRect();
    const optionBounds = optionControls.map((option) =>
      option?.getBoundingClientRect(),
    );

    await expect(labelBounds.width).toBeCloseTo(groupBounds.width, 0);
    await expect(descriptionBounds.width).toBeCloseTo(groupBounds.width, 0);
    await expect(labelBounds.bottom).toBeLessThan(descriptionBounds.top);
    await Promise.all(
      optionBounds.map(async (bounds) => {
        await expect(bounds).toBeDefined();
        await expect(bounds?.top).toBeGreaterThan(descriptionBounds.bottom);
        await expect(bounds?.top).toBeCloseTo(optionBounds[0]?.top ?? 0, 0);
      }),
    );
    await expect(optionBounds[0]?.left ?? 0).toBeLessThan(
      optionBounds[1]?.left ?? 0,
    );
    await expect(optionBounds[1]?.left ?? 0).toBeLessThan(
      optionBounds[2]?.left ?? 0,
    );
    await userEvent.click(canvas.getByRole('checkbox', { name: 'SMS' }));
    await expect(canvas.getByRole('checkbox', { name: 'SMS' })).toBeChecked();
    await expect(
      canvas.getByRole('group', { name: 'Notification channels' }),
    ).toHaveAccessibleDescription('Choose any channels.');
  },
  render: () => (
    <CheckboxGroup.Root
      defaultSelection={['email']}
      name="channels"
      orientation="horizontal"
    >
      <CheckboxGroup.Label>Notification channels</CheckboxGroup.Label>
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
      <Checkbox.Root value="push">
        <Checkbox.Control>
          <Checkbox.Indicator />
          <Checkbox.Label>Push</Checkbox.Label>
        </Checkbox.Control>
      </Checkbox.Root>
    </CheckboxGroup.Root>
  ),
};
/**
 * Stores the selected value array in application state and renders that array
 * as group guidance, demonstrating the mutable controlled multiple-selection
 * contract.
 *
 * @summary Application-controlled checkbox value array.
 */
export const Controlled: Story = {
  args: { children: null },
  render: () => <ControlledExample />,
};
/**
 * Compares an immutable selected group, a wholly disabled group, and a
 * required invalid group with associated error text so each group-level state
 * remains explicit.
 *
 * @summary Read-only, disabled, and invalid checkbox groups.
 */
export const ReadOnlyAndStates: Story = {
  args: { children: null },
  render: () => (
    <Stack gap="xl">
      <CheckboxGroup.Root readOnly selection={['email']}>
        <CheckboxGroup.Label>Read-only channels</CheckboxGroup.Label>
        <Option label="Email" value="email" />
        <Option label="SMS" value="sms" />
      </CheckboxGroup.Root>
      <CheckboxGroup.Root disabled defaultSelection={['push']}>
        <CheckboxGroup.Label>Disabled group</CheckboxGroup.Label>
        <Option label="Push" value="push" />
      </CheckboxGroup.Root>
      <CheckboxGroup.Root invalid required>
        <CheckboxGroup.Label>Required group</CheckboxGroup.Label>
        <Option label="Email" value="email" />
        <CheckboxGroup.Error>Select at least one channel.</CheckboxGroup.Error>
      </CheckboxGroup.Root>
    </Stack>
  ),
};
/**
 * Uses the default vertical arrangement and verifies Tab reaches the first
 * native checkbox and Space selects it without group-specific arrow-key
 * navigation.
 *
 * @summary Vertical checkbox group with native keyboard operation.
 */
export const VerticalKeyboard: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    await userEvent.tab();
    const first = within(canvasElement).getByRole('checkbox', { name: 'One' });
    await expect(first).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect(first).toBeChecked();
  },
  render: () => (
    <CheckboxGroup.Root orientation="vertical">
      <CheckboxGroup.Label>Vertical options</CheckboxGroup.Label>
      <Option label="One" value="one" />
      <Option label="Two" value="two" />
    </CheckboxGroup.Root>
  ),
};
/**
 * Constricts a detailed group label, shared guidance, and an unusually long
 * option label to show natural wrapping without losing group or option
 * associations.
 *
 * @summary Long checkbox-group copy in a narrow layout.
 */
export const ContentExtreme: Story = {
  args: { children: null },
  render: () => (
    <StoryConstraint size="narrow-control">
      <CheckboxGroup.Root>
        <CheckboxGroup.Label>
          A detailed group label that wraps in a constrained layout
        </CheckboxGroup.Label>
        <CheckboxGroup.Description>
          Long guidance remains associated with every option in the group.
        </CheckboxGroup.Description>
        <Option
          label="An unusually long option label that wraps naturally"
          value="long"
        />
        <Option label="Short" value="short" />
      </CheckboxGroup.Root>
    </StoryConstraint>
  ),
};
