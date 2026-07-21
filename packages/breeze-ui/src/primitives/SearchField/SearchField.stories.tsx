import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import StoryConstraint from '../../../.storybook/StoryConstraint';
import { Stack } from '../Stack/Stack';
import { Description, Error as ErrorPart, Label } from '../TextField/TextField';
import { ClearButton, Group, Input, Root, SearchField } from './SearchField';

const meta = {
  component: Root,
  decorators: [
    (Story) => {
      Object.assign(SearchField.ClearButton, {
        displayName: 'SearchField.ClearButton',
      });
      Object.assign(SearchField.Description, {
        displayName: 'SearchField.Description',
      });
      Object.assign(SearchField.Error, { displayName: 'SearchField.Error' });
      Object.assign(SearchField.Group, { displayName: 'SearchField.Group' });
      Object.assign(SearchField.Input, { displayName: 'SearchField.Input' });
      Object.assign(SearchField.Label, { displayName: 'SearchField.Label' });
      Object.assign(SearchField.Root, { displayName: 'SearchField.Root' });

      return <Story />;
    },
  ] satisfies Decorator[],
  subcomponents: {
    ClearButton,
    Description,
    Error: ErrorPart,
    Group,
    Input,
    Label,
  },
  title: 'Fields/SearchField',
} satisfies Meta<typeof Root>;
export default meta;
type Story = StoryObj<typeof meta>;

type SearchFieldSize = 'lg' | 'md' | 'sm';

interface SearchControlProps {
  name?: string;
  size?: SearchFieldSize;
}

interface SearchFieldSizeExpectation {
  label: string;
  size: SearchFieldSize;
}

function SearchControl({ name, size }: SearchControlProps) {
  return (
    <SearchField.Group size={size}>
      <SearchField.Input name={name} />
      <SearchField.ClearButton />
    </SearchField.Group>
  );
}

function getSearchFieldGroup(element: HTMLElement): HTMLElement {
  const group = element.closest<HTMLElement>(
    '[data-breeze-search-field-group]',
  );

  if (!group) {
    throw new Error('Expected a SearchField group.');
  }

  return group;
}

async function expectSingleSurface(
  input: HTMLElement,
  clear: HTMLElement | null,
): Promise<void> {
  const group = getSearchFieldGroup(input);
  const groupBounds = group.getBoundingClientRect();
  const inputBounds = input.getBoundingClientRect();
  const perimeter = getComputedStyle(group, '::after');

  await expect([
    perimeter.borderTopWidth,
    perimeter.borderRightWidth,
    perimeter.borderBottomWidth,
    perimeter.borderLeftWidth,
  ]).toEqual(['1px', '1px', '1px', '1px']);
  await expect(getComputedStyle(input).borderWidth).toBe('0px');
  await expect(getComputedStyle(input).backgroundColor).toBe(
    'rgba(0, 0, 0, 0)',
  );
  await expect(inputBounds.top).toBe(groupBounds.top);
  await expect(inputBounds.bottom).toBe(groupBounds.bottom);

  if (clear) {
    const clearBounds = clear.getBoundingClientRect();

    await expect(getComputedStyle(clear).borderWidth).toBe('0px');
    await expect(getComputedStyle(clear).backgroundColor).toBe(
      'rgba(0, 0, 0, 0)',
    );
    await expect(clearBounds.top).toBe(groupBounds.top);
    await expect(clearBounds.bottom).toBe(groupBounds.bottom);
    await expect(
      getComputedStyle(group).direction === 'rtl'
        ? clearBounds.right
        : inputBounds.right,
    ).toBe(
      getComputedStyle(group).direction === 'rtl'
        ? inputBounds.left
        : clearBounds.left,
    );
  }
}

function ControlledExample() {
  const [value, setValue] = useState('active');

  return (
    <SearchField.Root onChange={setValue} value={value}>
      <SearchField.Label>Controlled query</SearchField.Label>
      <SearchControl />
      <SearchField.Description>
        Query: {value || 'empty'}
      </SearchField.Description>
    </SearchField.Root>
  );
}

/**
 * Composes the full labelled search anatomy and verifies the unified surface,
 * keyboard focus treatment, Escape clearing, and conditional clear action.
 *
 * @summary complete search anatomy with keyboard clearing
 */
export const AnatomyAndKeyboard: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('searchbox', { name: 'Search items' });
    const clear = canvas.getByRole('button', { name: 'Clear' });
    const group = getSearchFieldGroup(input);

    await expectSingleSurface(input, clear);
    await expect(group.getBoundingClientRect().height).toBeGreaterThanOrEqual(
      44,
    );
    await userEvent.click(input);
    await expect(group).not.toHaveAttribute('data-focus-visible');
    await expect(getComputedStyle(group).outlineStyle).toBe('none');
    input.blur();
    await userEvent.tab();
    await expect(input).toHaveFocus();
    await expect(group).toHaveAttribute('data-focus-visible');
    await expect(getComputedStyle(group).outlineStyle).toBe('solid');
    await expect(getComputedStyle(group).outlineWidth).toBe('2px');
    await userEvent.keyboard('{Escape}');
    await expect(input).toHaveValue('');
    await expect(canvas.queryByRole('button', { name: 'Clear' })).toBeNull();
    await expect(group.getBoundingClientRect().height).toBeGreaterThanOrEqual(
      44,
    );
  },
  render: () => (
    <SearchField.Root defaultValue="quarterly" onSubmit={fn()}>
      <SearchField.Label>Search items</SearchField.Label>
      <SearchField.Group>
        <SearchField.Input name="query" />
        <SearchField.ClearButton />
      </SearchField.Group>
      <SearchField.Description>
        Press Enter to search or Escape to clear.
      </SearchField.Description>
    </SearchField.Root>
  ),
};

/**
 * Stores the query in application state, exercises pointer clearing and new
 * typing, and reflects each controlled value through associated guidance.
 *
 * @summary controlled query with clear and re-entry behavior
 */
export const Controlled: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('searchbox', { name: 'Controlled query' });
    const clear = canvas.getByRole('button', { name: 'Clear' });
    const group = getSearchFieldGroup(input);

    await expectSingleSurface(input, clear);
    await userEvent.click(clear);
    await expect(input).toHaveValue('');
    await expect(canvas.queryByRole('button', { name: 'Clear' })).toBeNull();
    await expect(canvas.getByText('Query: empty')).toBeVisible();
    await expect(group.scrollWidth).toBe(group.clientWidth);
    await userEvent.type(input, 'open');
    await expect(canvas.getByRole('button', { name: 'Clear' })).toBeVisible();
    await expect(canvas.getByText('Query: open')).toBeVisible();
  },
  render: () => <ControlledExample />,
};

/**
 * Starts from an internally managed query and verifies the clear action resets
 * the native searchbox without requiring application-owned state.
 *
 * @summary uncontrolled query cleared through the field action
 */
export const Uncontrolled: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('searchbox', {
      name: 'Uncontrolled query',
    });
    const clear = canvas.getByRole('button', { name: 'Clear' });

    await expectSingleSurface(input, clear);
    await userEvent.click(clear);
    await expect(input).toHaveValue('');
    await expect(canvas.queryByRole('button', { name: 'Clear' })).toBeNull();
  },
  render: () => (
    <SearchField.Root defaultValue="draft">
      <SearchField.Label>Uncontrolled query</SearchField.Label>
      <SearchControl />
    </SearchField.Root>
  ),
};

/**
 * Compares read-only, disabled, and invalid fields to verify their distinct
 * clear-action visibility, native state, and single-surface styling.
 *
 * @summary read-only disabled and invalid search states
 */
export const ReadOnlyAndStates: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readOnlyInput = canvas.getByRole('searchbox', { name: 'Read-only' });
    const disabledInput = canvas.getByRole('searchbox', { name: 'Disabled' });
    const invalidInput = canvas.getByRole('searchbox', {
      name: 'Invalid search',
    });
    const readOnlyGroup = getSearchFieldGroup(readOnlyInput);
    const disabledGroup = getSearchFieldGroup(disabledInput);
    const invalidGroup = getSearchFieldGroup(invalidInput);
    const invalidPerimeter = getComputedStyle(invalidGroup, '::after');
    const regularPerimeter = getComputedStyle(readOnlyGroup, '::after');

    await Promise.all([
      expectSingleSurface(readOnlyInput, null),
      expectSingleSurface(disabledInput, null),
      expectSingleSurface(invalidInput, null),
    ]);
    await expect(canvas.queryByRole('button')).toBeNull();
    await expect(readOnlyInput).toHaveAttribute('readonly');
    await expect(readOnlyGroup).toHaveAttribute('data-readonly');
    await expect(disabledInput).toBeDisabled();
    await expect(disabledGroup).toHaveAttribute('data-disabled');
    await expect(invalidInput).toBeInvalid();
    await expect(invalidGroup).toHaveAttribute('data-invalid');
    await expect(invalidPerimeter.borderTopColor).not.toBe(
      regularPerimeter.borderTopColor,
    );
    await Promise.all(
      [readOnlyGroup, disabledGroup, invalidGroup].map((group) =>
        expect(group.getBoundingClientRect().height).toBeGreaterThanOrEqual(44),
      ),
    );
  },
  render: () => (
    <StoryConstraint size="bounded">
      <Stack gap="lg">
        <SearchField.Root readOnly value="locked">
          <SearchField.Label>Read-only</SearchField.Label>
          <SearchControl />
        </SearchField.Root>
        <SearchField.Root disabled defaultValue="disabled">
          <SearchField.Label>Disabled</SearchField.Label>
          <SearchControl />
        </SearchField.Root>
        <SearchField.Root invalid>
          <SearchField.Label>Invalid search</SearchField.Label>
          <SearchControl />
          <SearchField.Error>Revise the query.</SearchField.Error>
        </SearchField.Root>
      </Stack>
    </StoryConstraint>
  ),
};

/**
 * Renders every canonical group size in right-to-left direction and verifies
 * size precedence plus logical clear-button placement.
 *
 * @summary right-to-left search controls across all sizes
 */
export const SizesAndRightToLeft: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const expectations: Array<SearchFieldSizeExpectation> = [
      { label: 'Small search', size: 'sm' },
      { label: 'Medium search', size: 'md' },
      { label: 'Large search', size: 'lg' },
    ];
    const heights = expectations.map(
      ({ label }) =>
        getSearchFieldGroup(
          canvas.getByRole('searchbox', { name: label }),
        ).getBoundingClientRect().height,
    );

    await Promise.all(
      expectations.map(async ({ label, size }) => {
        const input = canvas.getByRole('searchbox', { name: label });
        const group = getSearchFieldGroup(input);
        const clear = within(group).getByRole('button', { name: 'Clear' });
        const inputBounds = input.getBoundingClientRect();
        const clearBounds = clear.getBoundingClientRect();

        await expectSingleSurface(input, clear);
        await expect(group).toHaveAttribute('data-size', size);
        await expect(clearBounds.right).toBe(inputBounds.left);
      }),
    );
    await expect(heights[0]).toBeLessThan(heights[1]);
    await expect(heights[1]).toBeGreaterThanOrEqual(44);
    await expect(heights[2]).toBeGreaterThanOrEqual(heights[1]);
  },
  render: () => (
    <StoryConstraint size="bounded">
      <Stack dir="rtl" gap="lg">
        <SearchField.Root defaultValue="small">
          <SearchField.Label>Small search</SearchField.Label>
          <SearchControl size="sm" />
        </SearchField.Root>
        <SearchField.Root defaultValue="medium">
          <SearchField.Label>Medium search</SearchField.Label>
          <SearchControl size="md" />
        </SearchField.Root>
        <SearchField.Root defaultValue="large">
          <SearchField.Label>Large search</SearchField.Label>
          <SearchControl size="lg" />
        </SearchField.Root>
      </Stack>
    </StoryConstraint>
  ),
};

/**
 * Places a long query and persistent guidance in a narrow host to verify the
 * input scrolls internally while the combined control retains its width.
 *
 * @summary long search query constrained to a narrow field
 */
export const ContentExtreme: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('searchbox', {
      name: 'Search across all archived projects and documents',
    });
    const clear = canvas.getByRole('button', { name: 'Clear' });
    const group = getSearchFieldGroup(input);

    await expectSingleSurface(input, clear);
    await expect(group.getBoundingClientRect().width).toBe(256);
    await expect(group.scrollWidth).toBe(group.clientWidth);
    await expect(input.scrollWidth).toBeGreaterThan(input.clientWidth);
  },
  render: () => (
    <StoryConstraint size="narrow-control">
      <SearchField.Root defaultValue="An unusually long query that exceeds the visible control width">
        <SearchField.Label>
          Search across all archived projects and documents
        </SearchField.Label>
        <SearchControl />
        <SearchField.Description>
          The query scrolls while persistent guidance wraps.
        </SearchField.Description>
      </SearchField.Root>
    </StoryConstraint>
  ),
};
