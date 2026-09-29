import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { Button } from '../../primitives/Button/Button';
import { TextField } from '../../primitives/TextField/TextField';
import { FormActions, type FormActionsProps } from './FormActions';

function FormActionsExample({
  align = 'end',
}: Readonly<Pick<FormActionsProps, 'align'>>) {
  const [status, setStatus] = useState('Changes are ready to save.');

  return (
    <div className="breeze-story-stack">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setStatus('Changes saved.');
        }}
      >
        <TextField defaultValue="Alex Morgan" label="Display name" />
        <FormActions align={align}>
          <Button
            onAction={() => setStatus('Changes discarded.')}
            variant="secondary"
          >
            Cancel
          </Button>
          <Button type="submit">Save changes</Button>
        </FormActions>
      </form>
      <p role="status">{status}</p>
    </div>
  );
}

const meta = {
  args: {
    align: 'end',
    children: null,
  },
  component: FormActions,
  title: 'Forms/FormActions',
} satisfies Meta<typeof FormActions>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default end alignment with working cancel and native submit actions. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Cancel' }));
    await expect(canvas.getByRole('status')).toHaveTextContent(
      'Changes discarded.',
    );

    await userEvent.click(canvas.getByRole('button', { name: 'Save changes' }));
    await expect(canvas.getByRole('status')).toHaveTextContent(
      'Changes saved.',
    );
  },
  render: ({ align }) => <FormActionsExample align={align} />,
};

/** Start alignment for forms whose action placement follows surrounding content. */
export const StartAligned: Story = {
  args: {
    align: 'start',
  },
  render: ({ align }) => <FormActionsExample align={align} />,
};
