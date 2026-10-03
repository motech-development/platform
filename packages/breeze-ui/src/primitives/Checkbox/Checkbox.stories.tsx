import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, within } from 'storybook/test';
import { Checkbox } from './Checkbox';

const meta = {
  args: {
    label: 'Send me account notices',
  },
  component: Checkbox,
  title: 'Forms/Checkbox',
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A labelled boolean choice. */
export const Default: Story = {};

/** Supporting guidance sits under the label and is announced with the checkbox. */
export const Description: Story = {
  args: {
    description: 'We only send messages about account activity.',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole('checkbox', {
      name: 'Send me account notices',
    });
    const label = checkbox.closest('label');
    const box = label?.querySelector('span[aria-hidden="true"]');

    await expect(label).not.toBeNull();
    await expect(box).not.toBeNull();

    const labelBounds = label!.getBoundingClientRect();
    const boxBounds = box!.getBoundingClientRect();

    await expect(boxBounds.height).toBe(16);
    await expect(
      boxBounds.top +
        boxBounds.height / 2 -
        (labelBounds.top + labelBounds.height / 2),
    ).toBeCloseTo(0, 0);
  },
};

/** A visible error marks the checkbox invalid and is announced with it. */
export const Error: Story = {
  args: {
    error: 'Accept the notices to continue.',
  },
};

/** Disabled checkboxes cannot be selected. */
export const Disabled: Story = {
  args: {
    defaultSelected: true,
    disabled: true,
  },
};

/** Read-only selection retains focus without changing. */
export const ReadOnly: Story = {
  args: {
    defaultSelected: true,
    readOnly: true,
  },
};

/** Required state is exposed to assistive technology. */
export const Required: Story = {
  args: {
    required: true,
  },
};

/** Loading preserves the checkbox shape while preventing interaction. */
export const Loading: Story = {
  args: {
    defaultSelected: true,
    loading: true,
  },
};

function ControlledExample() {
  const [selected, setSelected] = useState(false);

  return (
    <div className="breeze-story-action">
      <Checkbox
        label="Send me account notices"
        onChange={setSelected}
        selected={selected}
      />
      <output>Selected: {String(selected)}</output>
    </div>
  );
}

/** The application owns the selection and receives semantic boolean changes. */
export const Controlled: Story = {
  render: () => <ControlledExample />,
};
