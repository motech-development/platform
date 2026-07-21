import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import StoryConstraint from '../../../.storybook/StoryConstraint';
import { Button } from '../Button/Button';
import { Stack } from '../Stack/Stack';
import { TextField } from '../TextField/TextField';
import { Addon, InputGroup, Root } from './InputGroup';

const meta = {
  component: Root,
  decorators: [
    (Story) => {
      Object.assign(InputGroup.Addon, { displayName: 'InputGroup.Addon' });
      Object.assign(InputGroup.Root, { displayName: 'InputGroup.Root' });

      return <Story />;
    },
  ] satisfies Decorator[],
  subcomponents: { Addon },
  title: 'Fields/InputGroup',
} satisfies Meta<typeof Root>;
export default meta;
type Story = StoryObj<typeof meta>;

function getInputGroup(element: HTMLElement): HTMLElement {
  const group = element.closest<HTMLElement>('[data-breeze-input-group]');

  if (!group) {
    throw new Error('Expected an InputGroup root.');
  }

  return group;
}

async function expectUniformPerimeter(group: HTMLElement): Promise<void> {
  const perimeter = getComputedStyle(group, '::after');

  await expect([
    perimeter.borderTopWidth,
    perimeter.borderRightWidth,
    perimeter.borderBottomWidth,
    perimeter.borderLeftWidth,
  ]).toEqual(['1px', '1px', '1px', '1px']);
  await expect([
    perimeter.borderTopColor,
    perimeter.borderRightColor,
    perimeter.borderBottomColor,
    perimeter.borderLeftColor,
  ]).toEqual([
    perimeter.borderTopColor,
    perimeter.borderTopColor,
    perimeter.borderTopColor,
    perimeter.borderTopColor,
  ]);
}

async function expectIntegralAddonSpacing(
  group: HTMLElement,
  expectedPadding: number,
): Promise<void> {
  const input = group.querySelector<HTMLInputElement>('input');
  const addons = Array.from(
    group.querySelectorAll<HTMLElement>('[data-breeze-input-group-addon]'),
  );

  if (!input || addons.length === 0) {
    throw new Error('Expected an input and at least one InputGroup addon.');
  }

  const inputStyle = getComputedStyle(input);

  await expect(Number.parseFloat(inputStyle.paddingInlineStart)).toBe(
    expectedPadding,
  );
  await expect(Number.parseFloat(inputStyle.paddingInlineEnd)).toBe(
    expectedPadding,
  );

  await Promise.all(
    addons.map(async (addon) => {
      const addonStyle = getComputedStyle(addon);
      const expectedStartPadding = addon.previousElementSibling
        ? 0
        : expectedPadding;
      const expectedEndPadding = addon.nextElementSibling ? 0 : expectedPadding;

      await expect(Number.parseFloat(addonStyle.paddingInlineStart)).toBe(
        expectedStartPadding,
      );
      await expect(Number.parseFloat(addonStyle.paddingInlineEnd)).toBe(
        expectedEndPadding,
      );

      if (addon.nextElementSibling === input) {
        await expect(
          Number.parseFloat(addonStyle.paddingInlineEnd) +
            Number.parseFloat(inputStyle.paddingInlineStart),
        ).toBe(expectedPadding);
      }

      if (addon.previousElementSibling === input) {
        await expect(
          Number.parseFloat(inputStyle.paddingInlineEnd) +
            Number.parseFloat(addonStyle.paddingInlineStart),
        ).toBe(expectedPadding);
      }
    }),
  );
}

/**
 * Composes a currency prefix and suffix around an editable text field, then
 * verifies unified focus treatment and the field's native text entry.
 *
 * @summary currency addons around an editable field control
 */
export const PrefixAndSuffix: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', {
      name: 'Budget',
    });
    await userEvent.clear(input);
    await userEvent.type(input, '250');
    await expect(input).toHaveValue('250');
    const group = getInputGroup(input);
    const [prefix, , suffix] = Array.from(group.children) as HTMLElement[];
    const inputStyle = getComputedStyle(input);

    await expectUniformPerimeter(group);
    await expectIntegralAddonSpacing(group, 12);
    await expect(group).toHaveAttribute('data-focus-within');
    await expect(prefix).toHaveAttribute('data-breeze-input-group-addon');
    await expect(suffix).toHaveAttribute('data-breeze-input-group-addon');
    await expect(getComputedStyle(prefix).backgroundColor).toBe(
      'rgba(0, 0, 0, 0)',
    );
    await expect(getComputedStyle(suffix).backgroundColor).toBe(
      'rgba(0, 0, 0, 0)',
    );
    await expect(getComputedStyle(prefix).borderWidth).toBe('0px');
    await expect(inputStyle.borderTopWidth).toBe('0px');
    await expect(inputStyle.borderRightWidth).toBe('0px');
    await expect(inputStyle.borderBottomWidth).toBe('0px');
    await expect(inputStyle.borderLeftWidth).toBe('0px');
    await expect(getComputedStyle(suffix).borderWidth).toBe('0px');
    input.blur();
    await userEvent.click(input);
    await expect(input).not.toHaveAttribute('data-focus-visible');
    await expect(getComputedStyle(group).outlineStyle).toBe('none');
    input.blur();
    await userEvent.tab();
    await expect(input).toHaveFocus();
    await expect(input).toHaveAttribute('data-focus-visible');
    await expect(getComputedStyle(group).outlineStyle).toBe('solid');
    await expect(getComputedStyle(group).outlineWidth).toBe('2px');
  },
  render: () => (
    <TextField.Root defaultValue="100">
      <TextField.Label>Budget</TextField.Label>
      <InputGroup.Root>
        <InputGroup.Addon aria-hidden="true">£</InputGroup.Addon>
        <TextField.Input name="budget" inputMode="decimal" />
        <InputGroup.Addon>GBP</InputGroup.Addon>
      </InputGroup.Root>
      <TextField.Description>
        Submitted as the numeric text value.
      </TextField.Description>
    </TextField.Root>
  ),
};
/**
 * Places a related Add action beside an email input while preserving one
 * visual perimeter and matching control heights.
 *
 * @summary input and related action on one unified surface
 */
export const RelatedAction: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: 'Invitee' });
    const button = canvas.getByRole('button', { name: 'Add' });
    const group = getInputGroup(input);
    const inputBounds = input.getBoundingClientRect();
    const buttonBounds = button.getBoundingClientRect();

    await expectUniformPerimeter(group);
    await expect(inputBounds.height).toBeGreaterThanOrEqual(44);
    await expect(buttonBounds.height).toBe(inputBounds.height);
    await expect(inputBounds.right).toBe(buttonBounds.left);
    await expect(getComputedStyle(button).borderLeftWidth).toBe('1px');
    await expect(getComputedStyle(button).paddingInlineStart).toBe('16px');
    await expect(getComputedStyle(button).paddingInlineEnd).toBe('16px');
  },
  render: () => (
    <TextField.Root>
      <TextField.Label>Invitee</TextField.Label>
      <InputGroup.Root>
        <TextField.Input type="email" />
        <Button size="md">Add</Button>
      </InputGroup.Root>
    </TextField.Root>
  ),
};
/**
 * Repeats the related-action composition in right-to-left direction to show
 * that logical borders, spacing, and action placement reverse correctly.
 *
 * @summary right-to-left input and related action composition
 */
export const RightToLeftRelatedAction: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: 'Invitee' });
    const button = canvas.getByRole('button', { name: 'Add' });
    const inputBounds = input.getBoundingClientRect();
    const buttonBounds = button.getBoundingClientRect();
    const buttonStyle = getComputedStyle(button);

    await expect(buttonBounds.right).toBe(inputBounds.left);
    await expect(buttonStyle.borderInlineStartWidth).toBe('1px');
    await expect(buttonStyle.borderRightWidth).toBe('1px');
    await expect(buttonStyle.borderLeftWidth).toBe('0px');
    await expect(buttonStyle.paddingInlineStart).toBe('16px');
    await expect(buttonStyle.paddingInlineEnd).toBe('16px');
  },
  render: () => (
    <div dir="rtl">
      <TextField.Root>
        <TextField.Label>Invitee</TextField.Label>
        <InputGroup.Root>
          <TextField.Input type="email" />
          <Button size="md">Add</Button>
        </InputGroup.Root>
      </TextField.Root>
    </div>
  ),
};
/**
 * Aligns addon and field sizes while comparing disabled and invalid groups,
 * including the shared disabled surface and invalid perimeter.
 *
 * @summary matched addon sizes with disabled and invalid states
 */
export const SizesAndStates: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const disabledInput = canvas.getByRole('textbox', {
      name: 'Small disabled',
    });
    const invalidInput = canvas.getByRole('textbox', {
      name: 'Large invalid',
    });
    const disabledGroup = getInputGroup(disabledInput);
    const invalidGroup = getInputGroup(invalidInput);
    const disabledAddon = disabledGroup.querySelector<HTMLElement>(
      '[data-breeze-input-group-addon]',
    );
    const invalidPerimeter = getComputedStyle(invalidGroup, '::after');

    if (!disabledAddon) {
      throw new Error('Expected the disabled InputGroup addon.');
    }

    await expectUniformPerimeter(disabledGroup);
    await expectUniformPerimeter(invalidGroup);
    await expectIntegralAddonSpacing(disabledGroup, 10);
    await expectIntegralAddonSpacing(invalidGroup, 16);
    await expect(disabledGroup).toHaveAttribute('data-disabled');
    await expect(disabledGroup.getBoundingClientRect().height).toBe(32);
    await expect(getComputedStyle(disabledAddon).backgroundColor).toBe(
      'rgba(0, 0, 0, 0)',
    );
    await expect(invalidGroup).toHaveAttribute('data-invalid');
    await expect(invalidGroup.getBoundingClientRect().height).toBe(48);
    await expect(invalidPerimeter.borderTopColor).toBe(
      getComputedStyle(invalidInput).borderTopColor,
    );
  },
  render: () => (
    <StoryConstraint size="bounded">
      <Stack gap="lg">
        <TextField.Root disabled defaultValue="disabled">
          <TextField.Label>Small disabled</TextField.Label>
          <InputGroup.Root>
            <InputGroup.Addon size="sm">ID</InputGroup.Addon>
            <TextField.Input size="sm" />
            <InputGroup.Addon size="sm">code</InputGroup.Addon>
          </InputGroup.Root>
        </TextField.Root>
        <TextField.Root invalid>
          <TextField.Label>Large invalid</TextField.Label>
          <InputGroup.Root>
            <InputGroup.Addon size="lg">https://</InputGroup.Addon>
            <TextField.Input size="lg" />
            <InputGroup.Addon size="lg">.example</InputGroup.Addon>
          </InputGroup.Root>
          <TextField.Error>Enter a valid host.</TextField.Error>
        </TextField.Root>
      </Stack>
    </StoryConstraint>
  ),
};
/**
 * Opts into an explicitly named group when the protocol and input must be
 * announced as one composition rather than remaining presentation-only.
 *
 * @summary explicitly labelled semantic input group
 */
export const ExplicitGroupSemantics: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    const group = within(canvasElement).getByRole('group', {
      name: 'Website address with protocol',
    });

    await expect(group).toHaveAttribute('data-breeze-input-group');
    await expectUniformPerimeter(group);
    await expectIntegralAddonSpacing(group, 12);
  },
  render: () => (
    <TextField.Root>
      <TextField.Label>Website</TextField.Label>
      <InputGroup.Root aria-label="Website address with protocol" role="group">
        <InputGroup.Addon>https://</InputGroup.Addon>
        <TextField.Input />
      </InputGroup.Root>
    </TextField.Root>
  ),
};
/**
 * Constrains a long address and two addons to a narrow host to demonstrate
 * overflow-safe composition without breaking the shared perimeter.
 *
 * @summary long address content in a constrained input group
 */
export const ContentExtreme: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', {
      name: 'Constrained address',
    });
    const group = getInputGroup(input);

    await expectUniformPerimeter(group);
    await expectIntegralAddonSpacing(group, 12);
    await expect(group.getBoundingClientRect().width).toBe(256);
    await expect(group.scrollWidth).toBe(group.clientWidth);
  },
  render: () => (
    <StoryConstraint size="narrow-control">
      <TextField.Root defaultValue="very-long-host-name-that-overflows-the-visible-control.example">
        <TextField.Label>Constrained address</TextField.Label>
        <InputGroup.Root>
          <InputGroup.Addon>https://</InputGroup.Addon>
          <TextField.Input />
          <InputGroup.Addon>.example</InputGroup.Addon>
        </InputGroup.Root>
      </TextField.Root>
    </StoryConstraint>
  ),
};
/**
 * Places protocol and domain addons around a field in right-to-left direction
 * to verify logical addon padding follows the authored order.
 *
 * @summary right-to-left prefix and suffix addon spacing
 */
export const RightToLeftPrefixAndSuffix: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', {
      name: 'Website',
    });
    const group = getInputGroup(input);
    const [prefix, , suffix] = Array.from(group.children) as HTMLElement[];
    const prefixStyle = getComputedStyle(prefix);
    const suffixStyle = getComputedStyle(suffix);

    await expect(getComputedStyle(group).direction).toBe('rtl');
    await expectIntegralAddonSpacing(group, 12);
    await expect(prefixStyle.paddingRight).toBe('12px');
    await expect(prefixStyle.paddingLeft).toBe('0px');
    await expect(suffixStyle.paddingRight).toBe('0px');
    await expect(suffixStyle.paddingLeft).toBe('12px');
  },
  render: () => (
    <div dir="rtl">
      <TextField.Root>
        <TextField.Label>Website</TextField.Label>
        <InputGroup.Root>
          <InputGroup.Addon>https://</InputGroup.Addon>
          <TextField.Input />
          <InputGroup.Addon>.example</InputGroup.Addon>
        </InputGroup.Root>
      </TextField.Root>
    </div>
  ),
};
