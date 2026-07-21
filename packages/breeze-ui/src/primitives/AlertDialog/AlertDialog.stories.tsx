import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import {
  SharedOverlayClose as Close,
  SharedOverlayDescription as Description,
  SharedOverlayTitle as Title,
  SharedOverlayTrigger as Trigger,
} from '../../internal/react-aria/OverlayParts';
import { Actions, AlertDialog, Content, Root } from './AlertDialog';

const meta = {
  component: Root,
  decorators: [
    (Story) => {
      Object.assign(AlertDialog.Actions, {
        displayName: 'AlertDialog.Actions',
      });
      Object.assign(AlertDialog.Close, { displayName: 'AlertDialog.Close' });
      Object.assign(AlertDialog.Content, {
        displayName: 'AlertDialog.Content',
      });
      Object.assign(AlertDialog.Description, {
        displayName: 'AlertDialog.Description',
      });
      Object.assign(AlertDialog.Root, { displayName: 'AlertDialog.Root' });
      Object.assign(AlertDialog.Title, { displayName: 'AlertDialog.Title' });
      Object.assign(AlertDialog.Trigger, {
        displayName: 'AlertDialog.Trigger',
      });

      return <Story />;
    },
  ] satisfies Decorator[],
  subcomponents: {
    Actions,
    Close,
    Content,
    Description,
    Title,
    Trigger,
  },
  title: 'Primitives/Overlays/AlertDialog',
} satisfies Meta<typeof Root>;
export default meta;
type Story = StoryObj<typeof meta>;

async function openExplicitDecision(canvasElement: HTMLElement) {
  const canvas = within(canvasElement);
  const trigger = canvas.getByRole('button', { name: 'Delete saved view' });

  await userEvent.click(trigger);

  const body = within(canvasElement.ownerDocument.body);
  const dialog = body.getByRole('alertdialog', {
    name: 'Delete this saved view?',
  });

  await waitFor(() => expect(dialog).toBeVisible());

  const actions = within(dialog).getByRole('group');
  const cancel = within(actions).getByRole('button', { name: 'Cancel' });
  const destructive = within(actions).getByRole('button', {
    name: 'Delete permanently',
  });

  await expect(dialog).toHaveAccessibleDescription(
    'This action permanently removes the saved view and cannot be undone.',
  );
  await expect(getComputedStyle(actions).gap).toBe('10px');
  await expect(cancel).toHaveFocus();

  return { actions, cancel, destructive, dialog, trigger };
}

async function expectCancelDismissal(
  canvasElement: HTMLElement,
  cancel: HTMLElement,
  trigger: HTMLElement,
) {
  await userEvent.click(cancel);
  await waitFor(() =>
    expect(
      within(canvasElement.ownerDocument.body).queryByRole('alertdialog'),
    ).not.toBeInTheDocument(),
  );
  await expect(trigger).toHaveFocus();
}

/**
 * Composes the required title, consequence description, grouped cancel and
 * destructive close actions, then verifies initial focus, wide-screen end
 * alignment, dismissal, and trigger focus restoration.
 *
 * @summary Wide alert-dialog decision anatomy and focus lifecycle.
 */
export const ExplicitDecision: Story = {
  args: {
    children: (
      <>
        <AlertDialog.Trigger variant="danger">
          Delete saved view
        </AlertDialog.Trigger>
        <AlertDialog.Content>
          <AlertDialog.Title>Delete this saved view?</AlertDialog.Title>
          <AlertDialog.Description>
            This action permanently removes the saved view and cannot be undone.
          </AlertDialog.Description>
          <AlertDialog.Actions>
            <AlertDialog.Close appearance="outline" autoFocus>
              Cancel
            </AlertDialog.Close>
            <AlertDialog.Close variant="danger">
              Delete permanently
            </AlertDialog.Close>
          </AlertDialog.Actions>
        </AlertDialog.Content>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const { actions, cancel, destructive, trigger } =
      await openExplicitDecision(canvasElement);
    const actionsStyle = getComputedStyle(actions);

    await expect(actionsStyle.flexDirection).toBe('row');
    await expect(actionsStyle.justifyContent).toBe('flex-end');
    await expect(cancel.getBoundingClientRect().left).toBeLessThan(
      destructive.getBoundingClientRect().left,
    );
    await expect(cancel.getBoundingClientRect().width).toBeLessThan(
      actions.getBoundingClientRect().width,
    );
    await expect(destructive.getBoundingClientRect().width).toBeLessThan(
      actions.getBoundingClientRect().width,
    );
    await expectCancelDismissal(canvasElement, cancel, trigger);
  },
};

/**
 * Reuses the explicit destructive decision at the compact viewport, proving
 * both actions become full width while visual order keeps the destructive
 * choice above cancel and keyboard order remains logical.
 *
 * @summary Compact full-width alert-dialog action ordering.
 */
export const ExplicitDecisionCompact: Story = {
  ...ExplicitDecision,
  globals: { viewport: { value: 'mobile1' } },
  play: async ({ canvasElement }) => {
    const { actions, cancel, destructive, trigger } =
      await openExplicitDecision(canvasElement);
    const actionsStyle = getComputedStyle(actions);

    await expect(actionsStyle.flexDirection).toBe('column-reverse');
    await expect(destructive.getBoundingClientRect().top).toBeLessThan(
      cancel.getBoundingClientRect().top,
    );
    await expect(cancel.getBoundingClientRect().width).toBe(
      actions.getBoundingClientRect().width,
    );
    await expect(destructive.getBoundingClientRect().width).toBe(
      actions.getBoundingClientRect().width,
    );
    await expectCancelDismissal(canvasElement, cancel, trigger);
  },
};
/**
 * Sets `keyboardDismissDisabled` on Content for a protected interruption that
 * can close only through its explicit Continue action, while verifying focus
 * starts on that action and returns to the trigger.
 *
 * @summary Explicit-only dismissal with Escape disabled.
 */
export const KeyboardDismissDisabled: Story = {
  args: {
    children: (
      <>
        <AlertDialog.Trigger>Open protected alert</AlertDialog.Trigger>
        <AlertDialog.Content keyboardDismissDisabled>
          <AlertDialog.Title>Resolve the interruption</AlertDialog.Title>
          <AlertDialog.Description>
            Escape is disabled; choose the explicit action.
          </AlertDialog.Description>
          <AlertDialog.Actions>
            <AlertDialog.Close autoFocus>Continue</AlertDialog.Close>
          </AlertDialog.Actions>
        </AlertDialog.Content>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', {
      name: 'Open protected alert',
    });

    await userEvent.click(trigger);

    const body = within(canvasElement.ownerDocument.body);
    const dialog = body.getByRole('alertdialog', {
      name: 'Resolve the interruption',
    });
    const actions = within(dialog).getByRole('group');
    const action = within(actions).getByRole('button', { name: 'Continue' });
    const actionsStyle = getComputedStyle(actions);

    await expect(action).toHaveFocus();
    await expect(actionsStyle.gap).toBe('10px');
    await expect(actionsStyle.flexDirection).toBe('row');
    await expect(actionsStyle.justifyContent).toBe('flex-end');
    await expect(action.getBoundingClientRect().width).toBeLessThan(
      actions.getBoundingClientRect().width,
    );
    await userEvent.click(action);
    await waitFor(() => expect(dialog).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
  },
};

/**
 * Exercises the Escape-disabled protected interruption at compact width,
 * confirming its single explicit action expands to the available width without
 * weakening focus restoration.
 *
 * @summary Compact explicit-only alert-dialog dismissal.
 */
export const KeyboardDismissDisabledCompact: Story = {
  ...KeyboardDismissDisabled,
  globals: { viewport: { value: 'mobile1' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', {
      name: 'Open protected alert',
    });

    await userEvent.click(trigger);

    const body = within(canvasElement.ownerDocument.body);
    const dialog = body.getByRole('alertdialog', {
      name: 'Resolve the interruption',
    });
    const actions = within(dialog).getByRole('group');
    const action = within(actions).getByRole('button', { name: 'Continue' });
    const actionsStyle = getComputedStyle(actions);

    await expect(actionsStyle.flexDirection).toBe('column-reverse');
    await expect(actionsStyle.gap).toBe('10px');
    await expect(action.getBoundingClientRect().width).toBe(
      actions.getBoundingClientRect().width,
    );
    await expect(action).toHaveFocus();
    await userEvent.click(action);
    await waitFor(() => expect(dialog).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
  },
};
