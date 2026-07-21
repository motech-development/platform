import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Inline } from '../Inline/Inline';
import { ToggleButton } from '../ToggleButton/ToggleButton';
import { ToggleGroup } from './ToggleGroup';

const meta = {
  component: ToggleGroup,
  title: 'Actions/ToggleGroup',
} satisfies Meta<typeof ToggleGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

function ControlledToggleGroupExample() {
  const [selection, setSelection] = useState(['grid']);

  return (
    <ToggleGroup
      aria-label="Controlled view mode"
      onSelectionChange={setSelection}
      selection={selection}
    >
      <ToggleButton value="grid">Grid</ToggleButton>
      <ToggleButton value="list">List</ToggleButton>
    </ToggleGroup>
  );
}

/**
 * Coordinates two valued ToggleButtons as a labelled radio-style group and
 * verifies the semantic callback reports the newly selected stable value.
 *
 * @summary single-selection toggle group with stable values
 */
export const SingleSelection: Story = {
  args: {
    'aria-label': 'View mode',
    children: (
      <>
        <ToggleButton value="grid">Grid</ToggleButton>
        <ToggleButton value="list">List</ToggleButton>
      </>
    ),
    onSelectionChange: fn(),
  },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('radio', { name: 'List' }),
    );
    await expect(args.onSelectionChange).toHaveBeenCalledWith(['list']);
  },
};
/**
 * Enables multiple selection for independent formatting toggles and starts
 * from one uncontrolled selected value.
 *
 * @summary uncontrolled multiple-selection formatting toggles
 */
export const MultipleSelection: Story = {
  args: {
    'aria-label': 'Text formatting',
    children: (
      <>
        <ToggleButton value="bold">Bold</ToggleButton>
        <ToggleButton value="italic">Italic</ToggleButton>
        <ToggleButton value="underline">Underline</ToggleButton>
      </>
    ),
    defaultSelection: ['bold'],
    multiple: true,
  },
};
/**
 * Stacks the group on its vertical navigation axis while disabling every
 * contained toggle, documenting both orientation and group-wide state.
 *
 * @summary vertical toggle group with all interaction disabled
 */
export const VerticalDisabled: Story = {
  args: {
    'aria-label': 'Disabled view mode',
    children: (
      <>
        <ToggleButton value="grid">Grid</ToggleButton>
        <ToggleButton value="list">List</ToggleButton>
      </>
    ),
    disabled: true,
    orientation: 'vertical',
  },
};
/**
 * Compares application-controlled selection with an intentionally immutable
 * selection so consumers can distinguish the two ownership contracts.
 *
 * @summary controlled and read-only toggle-group selections
 */
export const ControlledAndReadOnly: Story = {
  args: {
    'aria-label': 'Controlled view mode',
    children: (
      <>
        <ToggleButton value="grid">Grid</ToggleButton>
        <ToggleButton value="list">List</ToggleButton>
      </>
    ),
    onSelectionChange: fn(),
    selection: ['grid'],
  },
  render: () => (
    <Inline align="stretch" gap="xl" wrap={false}>
      <ControlledToggleGroupExample />
      <ToggleGroup
        aria-label="Read-only view mode"
        readOnly
        selection={['list']}
      >
        <ToggleButton value="grid">Grid</ToggleButton>
        <ToggleButton value="list">List</ToggleButton>
      </ToggleGroup>
    </Inline>
  ),
};
