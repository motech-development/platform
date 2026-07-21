import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import StoryConstraint from '../../../.storybook/StoryConstraint';
import { Stack } from '../Stack/Stack';
import { Description as ItemDescription } from '../TextField/TextField';
import {
  Control,
  Description,
  Error,
  Indicator,
  Item,
  ItemLabel,
  Label,
  RadioGroup,
  Root,
} from './RadioGroup';

const meta = {
  component: Root,
  decorators: [
    (Story) => {
      Object.assign(RadioGroup.Control, {
        displayName: 'RadioGroup.Control',
      });
      Object.assign(RadioGroup.Description, {
        displayName: 'RadioGroup.Description',
      });
      Object.assign(RadioGroup.Error, { displayName: 'RadioGroup.Error' });
      Object.assign(RadioGroup.Indicator, {
        displayName: 'RadioGroup.Indicator',
      });
      Object.assign(RadioGroup.Item, { displayName: 'RadioGroup.Item' });
      Object.assign(RadioGroup.ItemDescription, {
        displayName: 'RadioGroup.ItemDescription',
      });
      Object.assign(RadioGroup.ItemLabel, {
        displayName: 'RadioGroup.ItemLabel',
      });
      Object.assign(RadioGroup.Label, { displayName: 'RadioGroup.Label' });
      Object.assign(RadioGroup.Root, { displayName: 'RadioGroup.Root' });

      return <Story />;
    },
  ] satisfies Decorator[],
  subcomponents: {
    Control,
    Description,
    Error,
    Indicator,
    Item,
    ItemDescription,
    ItemLabel,
    Label,
  },
  title: 'Selection/RadioGroup',
} satisfies Meta<typeof Root>;
export default meta;
type Story = StoryObj<typeof meta>;

function Option({
  description,
  label,
  value,
}: {
  description?: string;
  label: string;
  value: string;
}) {
  return (
    <RadioGroup.Item value={value}>
      <RadioGroup.Control>
        <RadioGroup.Indicator />
        <RadioGroup.ItemLabel>{label}</RadioGroup.ItemLabel>
      </RadioGroup.Control>
      {description ? (
        <RadioGroup.ItemDescription>{description}</RadioGroup.ItemDescription>
      ) : null}
    </RadioGroup.Item>
  );
}
function ControlledExample() {
  const [selection, setSelection] = useState<string | null>('email');

  return (
    <RadioGroup.Root onSelectionChange={setSelection} selection={selection}>
      <RadioGroup.Label>Controlled method</RadioGroup.Label>
      <Option label="Email" value="email" />
      <Option label="SMS" value="sms" />
      <RadioGroup.Description>{selection ?? 'None'}</RadioGroup.Description>
    </RadioGroup.Root>
  );
}

/**
 * Composes the complete horizontal group anatomy and verifies full-width
 * guidance rows, canonical indicators, and ArrowRight selection movement.
 *
 * @summary horizontal radio anatomy with arrow-key selection
 */
export const AnatomyAndHorizontalKeyboard: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const group = canvas.getByRole('radiogroup', {
      name: 'Contact method',
    });
    const label = canvas.getByText('Contact method');
    const description = canvas.getByText('Choose one channel.');
    const email = canvas.getByRole('radio', { name: 'Email' });
    const emailControl = email.closest('label');
    const emailIndicator = emailControl?.querySelector('[aria-hidden="true"]');
    const optionItems = ['Email', 'SMS', 'Post'].map((name) =>
      canvas.getByRole('radio', { name }).closest('[data-rac]'),
    );
    const groupBounds = group.getBoundingClientRect();
    const labelBounds = label.getBoundingClientRect();
    const descriptionBounds = description.getBoundingClientRect();
    const optionBounds = optionItems.map((option) =>
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
    await expect(emailControl).not.toBeNull();
    await expect(emailControl!.getBoundingClientRect().height).toBeCloseTo(
      22.4,
      1,
    );
    await expect(getComputedStyle(emailControl!).fontSize).toBe('16px');
    await expect(getComputedStyle(emailControl!).lineHeight).toBe('22.4px');
    await expect(emailIndicator?.getBoundingClientRect().width).toBeGreaterThan(
      8,
    );
    await expect(getComputedStyle(emailIndicator!, '::after').width).toBe(
      '8px',
    );

    email.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('radio', { name: 'SMS' })).toBeChecked();
  },
  render: () => (
    <RadioGroup.Root
      defaultSelection="email"
      name="contact"
      orientation="horizontal"
    >
      <RadioGroup.Label>Contact method</RadioGroup.Label>
      <RadioGroup.Description>Choose one channel.</RadioGroup.Description>
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
      <RadioGroup.Item value="post">
        <RadioGroup.Control>
          <RadioGroup.Indicator />
          <RadioGroup.ItemLabel>Post</RadioGroup.ItemLabel>
        </RadioGroup.Control>
      </RadioGroup.Item>
    </RadioGroup.Root>
  ),
};
/**
 * Keeps the selected contact method in application state and reports the
 * current controlled value through associated group guidance.
 *
 * @summary application-controlled exclusive selection
 */
export const Controlled: Story = {
  args: { children: null },
  render: () => <ControlledExample />,
};
/**
 * Compares vertically arranged read-only, disabled, and required invalid
 * groups so their distinct selection and validation contracts remain clear.
 *
 * @summary vertical read-only disabled and invalid group states
 */
export const VerticalReadOnlyAndStates: Story = {
  args: { children: null },
  render: () => (
    <Stack gap="xl">
      <RadioGroup.Root readOnly selection="email">
        <RadioGroup.Label>Read-only</RadioGroup.Label>
        <Option label="Email" value="email" />
        <Option label="SMS" value="sms" />
      </RadioGroup.Root>
      <RadioGroup.Root disabled defaultSelection="post">
        <RadioGroup.Label>Disabled</RadioGroup.Label>
        <Option label="Post" value="post" />
      </RadioGroup.Root>
      <RadioGroup.Root invalid required>
        <RadioGroup.Label>Required</RadioGroup.Label>
        <Option label="Standard" value="standard" />
        <RadioGroup.Error>Select a method.</RadioGroup.Error>
      </RadioGroup.Root>
    </Stack>
  ),
};
/**
 * Places a disabled option between enabled choices and verifies ArrowDown
 * skips it while moving focus and selection to the next available radio.
 *
 * @summary vertical keyboard navigation skipping a disabled option
 */
export const DisabledOptionKeyboard: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByRole('radio', { name: 'First' }).focus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByRole('radio', { name: 'Third' })).toHaveFocus();
  },
  render: () => (
    <RadioGroup.Root defaultSelection="first" orientation="vertical">
      <RadioGroup.Label>Priority</RadioGroup.Label>
      <Option label="First" value="first" />
      <RadioGroup.Item disabled value="second">
        <RadioGroup.Control>
          <RadioGroup.Indicator />
          <RadioGroup.ItemLabel>Second</RadioGroup.ItemLabel>
        </RadioGroup.Control>
      </RadioGroup.Item>
      <Option label="Third" value="third" />
    </RadioGroup.Root>
  ),
};
/**
 * Constrains a long group label, option label, and item description to show
 * how exclusive choices wrap without losing their accessible relationships.
 *
 * @summary long radio-group and option content in a narrow column
 */
export const ContentExtreme: Story = {
  args: { children: null },
  render: () => (
    <StoryConstraint size="narrow-control">
      <RadioGroup.Root>
        <RadioGroup.Label>
          A long exclusive-choice label in a constrained column
        </RadioGroup.Label>
        <Option
          description="Supporting option guidance remains associated."
          label="An unusually detailed radio option that wraps naturally"
          value="long"
        />
        <Option label="Short" value="short" />
      </RadioGroup.Root>
    </StoryConstraint>
  ),
};
