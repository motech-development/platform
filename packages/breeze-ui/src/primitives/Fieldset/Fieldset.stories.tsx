import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import StoryConstraint from '../../../.storybook/StoryConstraint';
import { TextField } from '../TextField/TextField';
import { Description, Error, Fieldset, Legend, Root } from './Fieldset';

const meta = {
  component: Root,
  decorators: [
    (Story) => {
      Object.assign(Fieldset.Description, {
        displayName: 'Fieldset.Description',
      });
      Object.assign(Fieldset.Error, { displayName: 'Fieldset.Error' });
      Object.assign(Fieldset.Legend, { displayName: 'Fieldset.Legend' });
      Object.assign(Fieldset.Root, { displayName: 'Fieldset.Root' });

      return <Story />;
    },
  ] satisfies Decorator[],
  subcomponents: {
    Description,
    Error,
    Legend,
  },
  title: 'Fields/Fieldset',
} satisfies Meta<typeof Root>;
export default meta;
type Story = StoryObj<typeof meta>;

function ContactFields() {
  return (
    <>
      <TextField.Root>
        <TextField.Label>Email</TextField.Label>
        <TextField.Input name="email" />
      </TextField.Root>
      <TextField.Root>
        <TextField.Label>Telephone</TextField.Label>
        <TextField.Input name="telephone" type="tel" />
      </TextField.Root>
    </>
  );
}

/**
 * Associates a native legend and description with two related controls and
 * verifies that Tab follows the form controls' document order.
 *
 * @summary labelled fieldset anatomy and native keyboard order
 */
export const AnatomyAndKeyboard: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('group', { name: 'Contact details' }),
    ).toHaveAccessibleDescription('Provide at least one contact method.');
    await userEvent.tab();
    await expect(canvas.getByRole('textbox', { name: 'Email' })).toHaveFocus();
  },
  render: () => (
    <Fieldset.Root>
      <Fieldset.Legend>Contact details</Fieldset.Legend>
      <Fieldset.Description>
        Provide at least one contact method.
      </Fieldset.Description>
      <TextField.Root>
        <TextField.Label>Email</TextField.Label>
        <TextField.Input name="email" />
      </TextField.Root>
      <TextField.Root>
        <TextField.Label>Telephone</TextField.Label>
        <TextField.Input name="telephone" type="tel" />
      </TextField.Root>
    </Fieldset.Root>
  ),
};
/**
 * Exposes group-level invalid state and associates a persistent validation
 * message with the fieldset alongside its supporting description.
 *
 * @summary invalid fieldset with associated error feedback
 */
export const Invalid: Story = {
  args: { children: null },
  render: () => (
    <Fieldset.Root invalid>
      <Fieldset.Legend>Notification details</Fieldset.Legend>
      <Fieldset.Description>Supply one route.</Fieldset.Description>
      <ContactFields />
      <Fieldset.Error>A contact route is required.</Fieldset.Error>
    </Fieldset.Root>
  ),
};
/**
 * Uses native fieldset disabling to prevent interaction with every descendant
 * form control while preserving group context and guidance.
 *
 * @summary native disabling of all descendant controls
 */
export const Disabled: Story = {
  args: { children: null },
  render: () => (
    <Fieldset.Root disabled>
      <Fieldset.Legend>Archived details</Fieldset.Legend>
      <Fieldset.Description>
        This native fieldset disables all descendant controls.
      </Fieldset.Description>
      <ContactFields />
    </Fieldset.Root>
  ),
};
/**
 * Places the fieldset and named descendant inputs inside a native form without
 * taking ownership of submission or application validation.
 *
 * @summary native form composition for grouped fields
 */
export const NativeFormParticipation: Story = {
  args: { children: null },
  render: () => (
    <form onSubmit={(event) => event.preventDefault()}>
      <Fieldset.Root name="contact">
        <Fieldset.Legend>Form fields</Fieldset.Legend>
        <ContactFields />
      </Fieldset.Root>
    </form>
  ),
};
/**
 * Constrains a long legend and description to a narrow host to demonstrate
 * wrapping without losing the fieldset's accessible relationships.
 *
 * @summary long fieldset content in a narrow layout
 */
export const ContentExtreme: Story = {
  args: { children: null },
  render: () => (
    <StoryConstraint size="narrow-control">
      <Fieldset.Root>
        <Fieldset.Legend>
          A long legend describing a tightly constrained group of related
          controls
        </Fieldset.Legend>
        <Fieldset.Description>
          Long explanatory content wraps while retaining one group-level
          accessible description.
        </Fieldset.Description>
        <ContactFields />
      </Fieldset.Root>
    </StoryConstraint>
  ),
};
