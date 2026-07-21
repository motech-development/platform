import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import StoryConstraint from '../../../.storybook/StoryConstraint';
import { Stack } from '../Stack/Stack';
import { Description, Error as ErrorPart, Label } from '../TextField/TextField';
import {
  DecrementButton,
  Group,
  IncrementButton,
  Input,
  NumberField,
  Root,
} from './NumberField';

const meta = {
  component: Root,
  decorators: [
    (Story) => {
      Object.assign(NumberField.DecrementButton, {
        displayName: 'NumberField.DecrementButton',
      });
      Object.assign(NumberField.Description, {
        displayName: 'NumberField.Description',
      });
      Object.assign(NumberField.Error, { displayName: 'NumberField.Error' });
      Object.assign(NumberField.Group, { displayName: 'NumberField.Group' });
      Object.assign(NumberField.IncrementButton, {
        displayName: 'NumberField.IncrementButton',
      });
      Object.assign(NumberField.Input, { displayName: 'NumberField.Input' });
      Object.assign(NumberField.Label, { displayName: 'NumberField.Label' });
      Object.assign(NumberField.Root, { displayName: 'NumberField.Root' });

      return <Story />;
    },
  ] satisfies Decorator[],
  subcomponents: {
    DecrementButton,
    Description,
    Error: ErrorPart,
    Group,
    IncrementButton,
    Input,
    Label,
  },
  title: 'Fields/NumberField',
} satisfies Meta<typeof Root>;
export default meta;
type Story = StoryObj<typeof meta>;

type NumberFieldSize = 'lg' | 'md' | 'sm';

interface NumberFieldSizeExpectation {
  label: string;
  size: NumberFieldSize;
}

interface SizedPartsProps {
  size: NumberFieldSize;
}

function getNumberFieldGroup(input: HTMLElement): HTMLElement {
  const group = input.closest<HTMLElement>('[data-breeze-number-field-group]');

  if (!group) {
    throw new Error('Expected a NumberField group.');
  }

  return group;
}

async function expectSingleSurface(input: HTMLElement): Promise<void> {
  const group = getNumberFieldGroup(input);
  const perimeter = getComputedStyle(group, '::after');
  const children = Array.from(group.children) as HTMLElement[];

  await expect([
    perimeter.borderTopWidth,
    perimeter.borderRightWidth,
    perimeter.borderBottomWidth,
    perimeter.borderLeftWidth,
  ]).toEqual(['1px', '1px', '1px', '1px']);

  await Promise.all(
    children.map(async (child) => {
      const childStyle = getComputedStyle(child);
      const childBounds = child.getBoundingClientRect();
      const groupBounds = group.getBoundingClientRect();

      await expect(childStyle.borderWidth).toBe('0px');
      await expect(childStyle.backgroundColor).toBe('rgba(0, 0, 0, 0)');
      await expect(childBounds.top).toBe(groupBounds.top);
      await expect(childBounds.bottom).toBe(groupBounds.bottom);
    }),
  );
}

function Parts() {
  return (
    <NumberField.Group>
      <NumberField.DecrementButton aria-label="Decrease">
        −
      </NumberField.DecrementButton>
      <NumberField.Input name="quantity" />
      <NumberField.IncrementButton aria-label="Increase">
        +
      </NumberField.IncrementButton>
    </NumberField.Group>
  );
}

function SizedParts({ size }: SizedPartsProps) {
  return (
    <NumberField.Group>
      <NumberField.DecrementButton aria-label={`Decrease ${size}`} size={size}>
        −
      </NumberField.DecrementButton>
      <NumberField.Input size={size} />
      <NumberField.IncrementButton aria-label={`Increase ${size}`} size={size}>
        +
      </NumberField.IncrementButton>
    </NumberField.Group>
  );
}
function ControlledExample() {
  const [value, setValue] = useState<number | null>(12.5);

  return (
    <NumberField.Root onChange={setValue} step={0.5} value={value}>
      <NumberField.Label>Controlled amount</NumberField.Label>
      <Parts />
      <NumberField.Description>
        Value: {value ?? 'empty'}
      </NumberField.Description>
    </NumberField.Root>
  );
}

/**
 * Composes the full labelled numeric anatomy and verifies focus-visible
 * treatment plus ArrowUp stepping within configured bounds.
 *
 * @summary complete numeric field anatomy and arrow-key stepping
 */
export const AnatomyAndKeyboard: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', {
      name: 'Quantity',
    });
    const group = getNumberFieldGroup(input);

    await expectSingleSurface(input);
    await userEvent.click(input);
    await expect(input).not.toHaveAttribute('data-focus-visible');
    await expect(getComputedStyle(group).outlineStyle).toBe('none');
    input.blur();
    await userEvent.tab();
    await expect(input).toHaveFocus();
    await expect(getComputedStyle(group).outlineStyle).toBe('solid');
    await expect(getComputedStyle(group).outlineWidth).toBe('2px');
    input.focus();
    await userEvent.keyboard('{ArrowUp}');
    await expect(input).toHaveValue('2');
  },
  render: () => (
    <NumberField.Root defaultValue={1} max={5} min={0}>
      <NumberField.Label>Quantity</NumberField.Label>
      <NumberField.Group>
        <NumberField.DecrementButton aria-label="Decrease">
          −
        </NumberField.DecrementButton>
        <NumberField.Input name="quantity" />
        <NumberField.IncrementButton aria-label="Increase">
          +
        </NumberField.IncrementButton>
      </NumberField.Group>
      <NumberField.Description>
        Use Arrow Up or Arrow Down, or the step buttons.
      </NumberField.Description>
    </NumberField.Root>
  ),
};
/**
 * Keeps a nullable decimal value in application state and reports the current
 * controlled value through associated supporting text.
 *
 * @summary application-controlled nullable decimal value
 */
export const Controlled: Story = {
  args: { children: null },
  render: () => <ControlledExample />,
};
/**
 * Starts with an uncontrolled decimal value and delegates locale-sensitive
 * grouping and fractional display to the provider locale.
 *
 * @summary uncontrolled value with locale-aware number formatting
 */
export const UncontrolledAndLocaleFormatting: Story = {
  args: { children: null },
  render: () => (
    <NumberField.Root
      defaultValue={1234.5}
      formatOptions={{ maximumFractionDigits: 2 }}
    >
      <NumberField.Label>Uncontrolled amount</NumberField.Label>
      <Parts />
    </NumberField.Root>
  ),
};
/**
 * Compares immutable, disabled, and required invalid numeric fields to expose
 * their distinct interaction, surface, and validation contracts.
 *
 * @summary read-only disabled and invalid numeric field states
 */
export const ReadOnlyAndStates: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readOnlyInput = canvas.getByRole('textbox', { name: 'Read-only' });
    const disabledInput = canvas.getByRole('textbox', { name: 'Disabled' });
    const invalidInput = canvas.getByRole('textbox', { name: 'Invalid' });
    const readOnlyGroup = getNumberFieldGroup(readOnlyInput);
    const disabledGroup = getNumberFieldGroup(disabledInput);
    const invalidGroup = getNumberFieldGroup(invalidInput);
    const invalidPerimeter = getComputedStyle(invalidGroup, '::after');
    const regularPerimeter = getComputedStyle(readOnlyGroup, '::after');

    await Promise.all([
      expectSingleSurface(readOnlyInput),
      expectSingleSurface(disabledInput),
      expectSingleSurface(invalidInput),
    ]);
    await expect(readOnlyInput).toHaveAttribute('readonly');
    await expect(getComputedStyle(readOnlyGroup).backgroundColor).not.toBe(
      'rgba(0, 0, 0, 0)',
    );
    await expect(disabledGroup).toHaveAttribute('data-disabled');
    await expect(getComputedStyle(disabledGroup).opacity).toBe('0.7');
    await expect(invalidGroup).toHaveAttribute('data-invalid');
    await expect(invalidPerimeter.borderTopColor).not.toBe(
      regularPerimeter.borderTopColor,
    );
  },
  render: () => (
    <StoryConstraint size="bounded">
      <Stack gap="lg">
        <NumberField.Root readOnly value={42}>
          <NumberField.Label>Read-only</NumberField.Label>
          <NumberField.Group>
            <NumberField.Input />
          </NumberField.Group>
        </NumberField.Root>
        <NumberField.Root disabled defaultValue={7}>
          <NumberField.Label>Disabled</NumberField.Label>
          <Parts />
        </NumberField.Root>
        <NumberField.Root
          invalid
          required
          value={null}
          onChange={() => undefined}
        >
          <NumberField.Label>Invalid</NumberField.Label>
          <Parts />
          <NumberField.Error>Enter a number.</NumberField.Error>
        </NumberField.Root>
      </Stack>
    </StoryConstraint>
  ),
};
/**
 * Shows input-only, two-stepper, decrement-only, and increment-only groups so
 * applications can choose only the numeric actions their workflow requires.
 *
 * @summary supported input and stepper button compositions
 */
export const InputAndStepperCompositions: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    const inputs = within(canvasElement).getAllByRole('textbox');
    const [inputOnly, ...steppedInputs] = inputs;

    await Promise.all(inputs.map(expectSingleSurface));
    await expect(getComputedStyle(inputOnly).textAlign).toBe('left');
    await Promise.all(
      steppedInputs.map((input) =>
        expect(getComputedStyle(input).textAlign).toBe('center'),
      ),
    );
    await Promise.all(
      inputs.map(async (input) => {
        const group = getNumberFieldGroup(input);
        const children = Array.from(group.children) as HTMLElement[];

        await Promise.all(
          children.slice(1).map(async (child, index) => {
            const previousBounds = children[index].getBoundingClientRect();
            const childBounds = child.getBoundingClientRect();

            await expect(previousBounds.right).toBe(childBounds.left);
          }),
        );
      }),
    );
  },
  render: () => (
    <StoryConstraint size="bounded">
      <Stack gap="lg">
        <NumberField.Root>
          <NumberField.Label>Input only</NumberField.Label>
          <NumberField.Group>
            <NumberField.Input />
          </NumberField.Group>
        </NumberField.Root>
        <NumberField.Root>
          <NumberField.Label>Both steppers</NumberField.Label>
          <NumberField.Group>
            <NumberField.DecrementButton aria-label="Decrease">
              −
            </NumberField.DecrementButton>
            <NumberField.Input />
            <NumberField.IncrementButton aria-label="Increase">
              +
            </NumberField.IncrementButton>
          </NumberField.Group>
        </NumberField.Root>
        <NumberField.Root>
          <NumberField.Label>Decrement only</NumberField.Label>
          <NumberField.Group>
            <NumberField.DecrementButton aria-label="Decrease">
              −
            </NumberField.DecrementButton>
            <NumberField.Input />
          </NumberField.Group>
        </NumberField.Root>
        <NumberField.Root>
          <NumberField.Label>Increment only</NumberField.Label>
          <NumberField.Group>
            <NumberField.Input />
            <NumberField.IncrementButton aria-label="Increase">
              +
            </NumberField.IncrementButton>
          </NumberField.Group>
        </NumberField.Root>
      </Stack>
    </StoryConstraint>
  ),
};
/**
 * Places a long bounded decimal in a narrow host and verifies the increment
 * action disables exactly at the configured maximum.
 *
 * @summary constrained long decimal at its maximum boundary
 */
export const ConstraintExtremes: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', {
      name: 'Long bounded decimal value',
    });
    const increment = canvas.getByRole('button', { name: /Increase/ });
    const group = getNumberFieldGroup(input);

    await expectSingleSurface(input);
    await expect(increment).toBeDisabled();
    await expect(group.scrollWidth).toBeLessThanOrEqual(group.clientWidth);
  },
  render: () => (
    <StoryConstraint size="narrow-control">
      <NumberField.Root
        defaultValue={999999999.99}
        formatOptions={{ maximumFractionDigits: 2 }}
        max={999999999.99}
        min={-999999999.99}
        step={0.01}
      >
        <NumberField.Label>Long bounded decimal value</NumberField.Label>
        <Parts />
        <NumberField.Description>
          Stepper actions disable at the configured boundary.
        </NumberField.Description>
      </NumberField.Root>
    </StoryConstraint>
  ),
};

/**
 * Compares all canonical control sizes in right-to-left direction, including
 * reversed logical placement of increment and decrement actions.
 *
 * @summary right-to-left stepper layout across control sizes
 */
export const SizesAndRightToLeft: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const expectations: Array<NumberFieldSizeExpectation> = [
      { label: 'Small', size: 'sm' },
      { label: 'Medium', size: 'md' },
      { label: 'Large', size: 'lg' },
    ];
    const heights = expectations.map(
      ({ label }) =>
        getNumberFieldGroup(
          canvas.getByRole('textbox', { name: label }),
        ).getBoundingClientRect().height,
    );

    await Promise.all(
      expectations.map(async ({ label, size }) => {
        const input = canvas.getByRole('textbox', { name: label });
        const decrement = canvas.getByRole('button', {
          name: new RegExp(`^Decrease ${size} `),
        });
        const increment = canvas.getByRole('button', {
          name: new RegExp(`^Increase ${size} `),
        });
        const inputBounds = input.getBoundingClientRect();
        const decrementBounds = decrement.getBoundingClientRect();
        const incrementBounds = increment.getBoundingClientRect();

        await expectSingleSurface(input);
        await expect(decrementBounds.left).toBe(inputBounds.right);
        await expect(incrementBounds.right).toBe(inputBounds.left);
      }),
    );
    await expect(heights[0]).toBeLessThan(heights[1]);
    await expect(heights[1]).toBeGreaterThanOrEqual(44);
    await expect(heights[2]).toBeGreaterThanOrEqual(heights[1]);
  },
  render: () => (
    <StoryConstraint size="bounded">
      <Stack dir="rtl" gap="lg">
        <NumberField.Root defaultValue={1}>
          <NumberField.Label>Small</NumberField.Label>
          <SizedParts size="sm" />
        </NumberField.Root>
        <NumberField.Root defaultValue={2}>
          <NumberField.Label>Medium</NumberField.Label>
          <SizedParts size="md" />
        </NumberField.Root>
        <NumberField.Root defaultValue={3}>
          <NumberField.Label>Large</NumberField.Label>
          <SizedParts size="lg" />
        </NumberField.Root>
      </Stack>
    </StoryConstraint>
  ),
};
