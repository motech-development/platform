import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, within } from 'storybook/test';
import { TextField } from './TextField';

const meta = {
  args: {
    label: 'Display name',
  },
  component: TextField,
  title: 'Forms/TextField',
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A single-line text input with a persistent accessible label. */
export const Default: Story = {};

/** Supporting guidance is announced with the input. */
export const Description: Story = {
  args: {
    description: 'Use the name shown to other members of your team.',
  },
};

/** A visible error marks the field invalid and is announced with the input. */
export const Error: Story = {
  args: {
    error: 'Enter a display name.',
  },
};

/** A visually hidden label for a repeated row under a column heading; the error stays visible. */
export const HiddenLabel: Story = {
  args: {
    error: 'Enter a category name.',
    label: 'Category name',
    labelHidden: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: 'Category name' });

    await expect(
      canvas.getByText('Category name').getBoundingClientRect().height,
    ).toBeLessThanOrEqual(1);
    await expect(canvas.getByText('Enter a category name.')).toBeVisible();
    await expect(input).toHaveAccessibleDescription('Enter a category name.');
    await expect(input.closest('div')?.getBoundingClientRect().top).toBe(
      input.getBoundingClientRect().top,
    );
  },
};

/** Disabled fields cannot receive input. */
export const Disabled: Story = {
  args: {
    defaultValue: 'Unavailable',
    disabled: true,
  },
};

/** Read-only fields retain focus and form participation without editing. */
export const ReadOnly: Story = {
  args: {
    defaultValue: 'Application-owned value',
    readOnly: true,
  },
};

/** Required state is exposed to assistive technology. */
export const Required: Story = {
  args: {
    required: true,
  },
};

/** Loading preserves the input shape while preventing interaction. */
export const Loading: Story = {
  args: {
    defaultValue: 'Loading value',
    loading: true,
  },
};

function ControlledExample() {
  const [value, setValue] = useState('Ada Lovelace');

  return (
    <div className="breeze-story-action">
      <TextField label="Display name" onChange={setValue} value={value} />
      <output>Current value: {value}</output>
    </div>
  );
}

/** The application owns the value and receives semantic string changes. */
export const Controlled: Story = {
  render: () => <ControlledExample />,
};

function BlurExample() {
  const [blurCount, setBlurCount] = useState(0);

  return (
    <div className="breeze-story-action">
      <TextField
        label="Display name"
        onBlur={() => setBlurCount((count) => count + 1)}
      />
      <output>Times left: {blurCount}</output>
    </div>
  );
}

/** `onBlur` reports each time focus leaves the field. */
export const Blur: Story = {
  render: () => <BlurExample />,
};
