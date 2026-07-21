import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import {
  SharedModalContent as Content,
  SharedOverlayClose as Close,
  SharedOverlayDescription as Description,
  SharedOverlayTitle as Title,
  SharedOverlayTrigger as Trigger,
} from '../../internal/react-aria/OverlayParts';
import { ButtonGroup } from '../../patterns/ButtonGroup/ButtonGroup';
import { Stack } from '../Stack/Stack';
import { TextField } from '../TextField/TextField';
import { Typography } from '../Typography/Typography';
import { Dialog, Root } from './Dialog';

const meta = {
  component: Root,
  decorators: [
    (Story) => {
      Object.assign(Dialog.Close, { displayName: 'Dialog.Close' });
      Object.assign(Dialog.Content, { displayName: 'Dialog.Content' });
      Object.assign(Dialog.Description, {
        displayName: 'Dialog.Description',
      });
      Object.assign(Dialog.Root, { displayName: 'Dialog.Root' });
      Object.assign(Dialog.Title, { displayName: 'Dialog.Title' });
      Object.assign(Dialog.Trigger, { displayName: 'Dialog.Trigger' });
      Object.assign(TextField.Input, { displayName: 'TextField.Input' });
      Object.assign(TextField.Label, { displayName: 'TextField.Label' });
      Object.assign(TextField.Root, { displayName: 'TextField.Root' });

      return <Story />;
    },
  ] satisfies Decorator[],
  subcomponents: {
    Close,
    Content,
    Description,
    Title,
    Trigger,
  },
  title: 'Primitives/Overlays/Dialog',
} satisfies Meta<typeof Root>;
export default meta;
type Story = StoryObj<typeof meta>;

function ControlledDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root onOpenChange={setOpen} open={open}>
      <Dialog.Trigger>Open controlled dialog</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Controlled settings</Dialog.Title>
        <Dialog.Description>
          Focus is contained until this modal closes.
        </Dialog.Description>
        <Stack gap="xl">
          <TextField.Root>
            <TextField.Label>Display name</TextField.Label>
            <TextField.Input autoFocus />
          </TextField.Root>
          <ButtonGroup
            align="end"
            orientation={{ base: 'vertical', sm: 'horizontal' }}
          >
            <Dialog.Close>Save and close</Dialog.Close>
          </ButtonGroup>
        </Stack>
      </Dialog.Content>
    </Dialog.Root>
  );
}

async function openControlledDialog(canvasElement: HTMLElement) {
  const canvas = within(canvasElement);
  const trigger = canvas.getByRole('button', {
    name: 'Open controlled dialog',
  });

  await userEvent.click(trigger);

  const body = within(canvasElement.ownerDocument.body);
  const dialog = body.getByRole('dialog', { name: 'Controlled settings' });

  await waitFor(() => expect(dialog).toBeVisible());

  const input = within(dialog).getByRole('textbox', { name: 'Display name' });
  const label = within(dialog).getByText('Display name');
  const actions = within(dialog).getByRole('group');
  const save = within(actions).getByRole('button', {
    name: 'Save and close',
  });
  const inputStyle = getComputedStyle(input);
  const labelStyle = getComputedStyle(label);

  await expect(dialog).toHaveAccessibleDescription(
    'Focus is contained until this modal closes.',
  );
  await expect(input).toHaveFocus();
  await expect(input.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
  await expect(inputStyle.borderTopWidth).toBe('1px');
  await expect(inputStyle.fontFamily).toContain('Helvetica Neue');
  await expect(labelStyle.fontFamily).toContain('Cabin');
  await expect(labelStyle.fontWeight).toBe('700');
  await expect(input.getBoundingClientRect().width).toBe(
    input.parentElement!.getBoundingClientRect().width,
  );
  await expect(
    actions.getBoundingClientRect().top - input.getBoundingClientRect().bottom,
  ).toBe(24);
  await expect(dialog.scrollWidth).toBeLessThanOrEqual(dialog.clientWidth);

  return { actions, dialog, input, save, trigger };
}

async function expectDismissalAndRestoration(
  canvasElement: HTMLElement,
  trigger: HTMLElement,
) {
  await waitFor(() =>
    expect(
      within(canvasElement.ownerDocument.body).queryByRole('dialog'),
    ).not.toBeInTheDocument(),
  );
  await expect(trigger).toHaveFocus();
}

/**
 * Opens an application-controlled modal, moves focus into its form, verifies
 * accessible description and wide action layout, then tests Escape and
 * explicit close restoration.
 *
 * @summary controlled modal focus dismissal and restoration
 */
export const ControlledFocusAndDismissal: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    const { actions, save, trigger } =
      await openControlledDialog(canvasElement);
    const actionsStyle = getComputedStyle(actions);

    await expect(actionsStyle.flexDirection).toBe('row');
    await expect(actionsStyle.justifyContent).toBe('flex-end');
    await expect(save.getBoundingClientRect().width).toBeLessThan(
      actions.getBoundingClientRect().width,
    );

    await userEvent.keyboard('{Escape}');
    await expectDismissalAndRestoration(canvasElement, trigger);

    const reopened = await openControlledDialog(canvasElement);

    await userEvent.click(reopened.save);
    await expectDismissalAndRestoration(canvasElement, reopened.trigger);
  },
  render: ControlledDialog,
};

/**
 * Repeats the controlled focus and dismissal workflow at the compact viewport,
 * where the action group stacks and its close action fills the available
 * width.
 *
 * @summary compact controlled modal action layout
 */
export const ControlledFocusAndDismissalCompact: Story = {
  ...ControlledFocusAndDismissal,
  globals: { viewport: { value: 'mobile1' } },
  play: async ({ canvasElement }) => {
    const { actions, save, trigger } =
      await openControlledDialog(canvasElement);
    const actionsStyle = getComputedStyle(actions);

    await expect(actionsStyle.flexDirection).toBe('column');
    await expect(save.getBoundingClientRect().width).toBe(
      actions.getBoundingClientRect().width,
    );

    await userEvent.keyboard('{Escape}');
    await expectDismissalAndRestoration(canvasElement, trigger);

    const reopened = await openControlledDialog(canvasElement);

    await userEvent.click(reopened.save);
    await expectDismissalAndRestoration(canvasElement, reopened.trigger);
  },
};
/**
 * Presents a long accessible title and enough body copy to exercise the modal
 * height boundary and internal scrolling without unlocking the underlying
 * page.
 *
 * @summary scrollable modal with extreme content
 */
export const LongExtremeContent: Story = {
  args: {
    children: (
      <>
        <Dialog.Trigger>Open long dialog</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>
            A deliberately long accessible title that remains readable at narrow
            widths
          </Dialog.Title>
          <Dialog.Description>
            Long content scrolls inside the dialog while the page remains
            locked.
          </Dialog.Description>
          <Typography>Scrollable paragraph 1</Typography>
          <Typography>Scrollable paragraph 2</Typography>
          <Typography>Scrollable paragraph 3</Typography>
          <Typography>Scrollable paragraph 4</Typography>
          <Typography>Scrollable paragraph 5</Typography>
          <Typography>Scrollable paragraph 6</Typography>
          <Typography>Scrollable paragraph 7</Typography>
          <Typography>Scrollable paragraph 8</Typography>
          <Typography>Scrollable paragraph 9</Typography>
          <Typography>Scrollable paragraph 10</Typography>
          <Typography>Scrollable paragraph 11</Typography>
          <Typography>Scrollable paragraph 12</Typography>
          <Dialog.Close>Close</Dialog.Close>
        </Dialog.Content>
      </>
    ),
  },
};
/**
 * Keeps controlled dialog state intentionally immutable so dismissal actions
 * may be requested while the application-supplied open state remains visible.
 *
 * @summary immutable controlled open dialog
 */
export const ReadOnlyOpen: Story = {
  args: {
    children: (
      <>
        <Dialog.Trigger>Persistent</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Read-only state</Dialog.Title>
          <Dialog.Description>
            Escape requests dismissal, but application state remains open.
          </Dialog.Description>
          <Dialog.Close>Request close</Dialog.Close>
        </Dialog.Content>
      </>
    ),
    open: true,
    readOnly: true,
  },
};
