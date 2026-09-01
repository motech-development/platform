import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '../../primitives/Button/Button';
import { Drawer } from '../../primitives/Drawer/Drawer';
import { ConfirmationDialog } from './ConfirmationDialog';

const meta = {
  component: ConfirmationDialog,
  title: 'Patterns/Actions/ConfirmationDialog',
} satisfies Meta<typeof ConfirmationDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

function TriggerlessConfirmationExample() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onAction={() => setOpen(true)}>Leave editor</Button>
      <ConfirmationDialog
        cancelLabel="Keep editing"
        closeLabel="Close confirmation"
        confirmLabel="Discard changes"
        description="Your unsaved changes will be lost."
        onConfirm={() => undefined}
        onOpenChange={setOpen}
        open={open}
        title="Discard changes?"
        triggerless
        variant="warning"
      />
    </>
  );
}

function NestedConfirmationExample() {
  return (
    <Drawer.Root defaultOpen>
      <Drawer.Trigger>Open editor</Drawer.Trigger>
      <Drawer.Content placement={{ base: 'bottom', md: 'end' }} size="wide">
        <Drawer.Description>Update the record details.</Drawer.Description>
        <Drawer.Title>Record editor</Drawer.Title>
        <p>
          This parent task remains visible so the confirmation keeps its
          decision context.
        </p>
        <ConfirmationDialog
          cancelLabel="Keep editing"
          closeLabel="Close confirmation"
          confirmLabel="Discard changes"
          description="Your unsaved changes will be lost."
          nested
          onConfirm={() => undefined}
          title="Discard changes?"
          trigger="Leave editor"
          variant="warning"
        />
      </Drawer.Content>
    </Drawer.Root>
  );
}

async function verifyNestedConfirmation(canvasElement: HTMLElement) {
  const body = within(canvasElement.ownerDocument.body);
  const drawer = body.getByRole('dialog', { name: 'Record editor' });

  await userEvent.click(body.getByRole('button', { name: 'Leave editor' }));
  const dialog = body.getByRole('alertdialog', { name: 'Discard changes?' });
  const overlay = dialog.closest<HTMLElement>('.breeze-modal-overlay');
  const modal = dialog.parentElement;
  const view = canvasElement.ownerDocument.defaultView;

  await waitFor(() => expect(dialog).toBeVisible());
  await expect(overlay).toHaveAttribute('data-nested-boundary');
  await expect(overlay).toHaveClass('breeze-modal-overlay-nested');
  await expect(modal).toHaveClass('breeze-modal-nested');
  await expect(
    view?.getComputedStyle(overlay as HTMLElement).backgroundColor,
  ).toBe('rgba(0, 0, 0, 0)');
  await expect(
    view?.getComputedStyle(overlay as HTMLElement, '::before').backgroundColor,
  ).toBe('rgba(12, 18, 31, 0.68)');

  const drawerBounds = drawer.getBoundingClientRect();
  const dialogBounds = dialog.getBoundingClientRect();
  const nestedLeft = Number.parseFloat(
    overlay?.style.getPropertyValue('--breeze-nested-overlay-left') ?? '',
  );
  const nestedTop = Number.parseFloat(
    overlay?.style.getPropertyValue('--breeze-nested-overlay-top') ?? '',
  );
  const nestedWidth = Number.parseFloat(
    overlay?.style.getPropertyValue('--breeze-nested-overlay-width') ?? '',
  );
  const nestedHeight = Number.parseFloat(
    overlay?.style.getPropertyValue('--breeze-nested-overlay-height') ?? '',
  );

  await expect(nestedLeft).toBeCloseTo(drawerBounds.left, 1);
  await expect(nestedTop).toBeCloseTo(drawerBounds.top, 1);
  await expect(nestedWidth).toBeCloseTo(drawerBounds.width, 1);
  await expect(nestedHeight).toBeCloseTo(drawerBounds.height, 1);
  await expect(dialogBounds.left + dialogBounds.width / 2).toBeCloseTo(
    drawerBounds.left + drawerBounds.width / 2,
    1,
  );
  await expect(dialogBounds.top + dialogBounds.height / 2).toBeCloseTo(
    drawerBounds.top + drawerBounds.height / 2,
    1,
  );
  await expect(
    body.getByRole('button', { name: 'Keep editing' }),
  ).toHaveFocus();
}

/**
 * Opens an uncontrolled destructive confirmation, activates the explicit
 * confirming action, and verifies the application-owned callback is invoked
 * once.
 *
 * @summary uncontrolled destructive decision and confirmation
 */
export const Destructive: Story = {
  args: {
    cancelLabel: 'Cancel',
    closeLabel: 'Close confirmation',
    confirmLabel: 'Delete item',
    description: 'The item and its linked files will be permanently removed.',
    onConfirm: fn(),
    title: 'Delete this item?',
    trigger: 'Delete item',
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Delete item' }));
    const dialog = within(document.body).getByRole('alertdialog');

    await waitFor(() => expect(dialog).toBeVisible());
    await userEvent.click(
      within(dialog).getByRole('button', { name: 'Delete item' }),
    );
    await expect(args.onConfirm).toHaveBeenCalledOnce();
  },
};

/**
 * Presents an application-controlled warning decision already open, with the
 * parent responsible for accepting every subsequent open-state request.
 *
 * @summary controlled open warning confirmation
 */
export const ControlledOpen: Story = {
  args: {
    cancelLabel: 'Keep item',
    closeLabel: 'Close confirmation',
    confirmLabel: 'Archive item',
    description: 'The item can be restored later.',
    onConfirm: fn(),
    onOpenChange: fn(),
    open: true,
    title: 'Archive this item?',
    trigger: 'Archive item',
    variant: 'warning',
  },
};

/**
 * Opens a controlled warning confirmation from an application-owned action
 * outside the fixed pattern and restores focus there after cancellation.
 *
 * @summary externally triggered controlled confirmation
 */
export const TriggerlessControlled: Story = {
  args: {
    cancelLabel: 'Keep editing',
    closeLabel: 'Close confirmation',
    confirmLabel: 'Discard changes',
    description: 'Your unsaved changes will be lost.',
    onConfirm: fn(),
    onOpenChange: fn(),
    open: false,
    title: 'Discard changes?',
    triggerless: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const externalTrigger = canvas.getByRole('button', {
      name: 'Leave editor',
    });

    await userEvent.click(externalTrigger);
    const body = within(canvasElement.ownerDocument.body);
    const dialog = body.getByRole('alertdialog', { name: 'Discard changes?' });

    await waitFor(() => expect(dialog).toBeVisible());
    await userEvent.click(body.getByRole('button', { name: 'Keep editing' }));
    await waitFor(() => expect(externalTrigger).toHaveFocus());
  },
  render: TriggerlessConfirmationExample,
};

/**
 * Opens a warning confirmation inside a desktop drawer and limits the new
 * dimming layer and dialog centring to that parent task surface.
 *
 * @summary drawer-scoped nested confirmation backdrop
 */
export const NestedInDrawer: Story = {
  args: {
    cancelLabel: 'Keep editing',
    closeLabel: 'Close confirmation',
    confirmLabel: 'Discard changes',
    description: 'Your unsaved changes will be lost.',
    onConfirm: fn(),
    title: 'Discard changes?',
    trigger: 'Leave editor',
  },
  play: async ({ canvasElement }) => verifyNestedConfirmation(canvasElement),
  render: NestedConfirmationExample,
};

/**
 * Exercises the same nested decision in the compact full-screen drawer, where
 * the scoped dimming layer naturally fills the mobile task surface.
 *
 * @summary compact full-screen nested confirmation backdrop
 */
export const NestedInDrawerCompact: Story = {
  ...NestedInDrawer,
  globals: { viewport: { value: 'mobile1' } },
};

/**
 * Keeps a destructive confirmation immutably open to document its complete
 * alert-dialog anatomy, initial cancel focus, typography, icon, and action
 * styling.
 *
 * @summary read-only open destructive confirmation anatomy
 */
export const DestructiveOpen: Story = {
  args: {
    cancelLabel: 'Cancel',
    closeLabel: 'Close confirmation',
    confirmLabel: 'Delete configuration',
    description:
      'The legacy configuration and its linked file will be permanently removed.',
    onConfirm: fn(),
    open: true,
    readOnly: true,
    title: 'Delete configuration?',
    trigger: 'Delete configuration',
  },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    const dialog = body.getByRole('alertdialog', {
      name: 'Delete configuration?',
    });
    const heading = body.getByRole('heading', {
      name: 'Delete configuration?',
    });
    const header = heading.parentElement?.parentElement;
    const icon = dialog.querySelector<HTMLElement>('[data-confirmation-icon]');
    const description = body.getByText(
      'The legacy configuration and its linked file will be permanently removed.',
    );
    const actions = body.getByRole('group');
    const cancel = body.getByRole('button', { name: 'Cancel' });
    const close = body.getByRole('button', { name: 'Close confirmation' });
    const warningIcon = icon?.querySelector('.lucide-triangle-alert');
    const view = canvasElement.ownerDocument.defaultView;
    const cancelStyle = view?.getComputedStyle(cancel);
    const dialogStyle = view?.getComputedStyle(dialog);
    const closeStyle = view?.getComputedStyle(close);
    const titleStyle = view?.getComputedStyle(heading);

    await expect(dialog.getBoundingClientRect().width).toBeLessThanOrEqual(
      canvasElement.getBoundingClientRect().width,
    );
    await expect(dialogStyle?.borderTopWidth).toBe('0px');
    await expect(dialogStyle?.borderRightWidth).toBe('0px');
    await expect(dialogStyle?.borderBottomWidth).toBe('2px');
    await expect(dialogStyle?.borderLeftWidth).toBe('0px');
    await expect(dialogStyle?.padding).toBe('0px');
    await expect(dialogStyle?.boxShadow).toContain(
      'rgba(6, 12, 24, 0.22) 0px 8px 0px 0px',
    );
    await expect(header?.getBoundingClientRect().height).toBeGreaterThan(0);
    await expect(icon?.getBoundingClientRect().width).toBe(
      icon?.getBoundingClientRect().height,
    );
    await expect(
      view?.getComputedStyle(icon as HTMLElement).borderTopWidth,
    ).toBe('0px');
    await expect(warningIcon).toBeInTheDocument();
    await expect(titleStyle?.fontFamily).toContain('Cabin');
    await expect(titleStyle?.fontSize).toBe('24px');
    await expect(Number.parseFloat(titleStyle?.lineHeight ?? '0')).toBeCloseTo(
      28.8,
      4,
    );
    await expect(view?.getComputedStyle(description).fontSize).toBe('16px');
    await expect(view?.getComputedStyle(actions).gap).toBe('10px');
    await expect(closeStyle?.borderTopWidth).toBe('0px');
    await expect(closeStyle?.borderRightWidth).toBe('0px');
    await expect(closeStyle?.borderBottomWidth).toBe('0px');
    await expect(closeStyle?.borderLeftWidth).toBe('0px');
    await expect(cancelStyle?.color).toBe('rgb(24, 32, 51)');
    await expect(cancelStyle?.borderColor).toBe('rgb(189, 197, 210)');
    await expect(cancel).toHaveFocus();
  },
};

/**
 * Exercises the destructive confirmation at the canonical compact viewport,
 * where actions stack in a safe visual order and remain within the modal
 * surface.
 *
 * @summary compact stacked destructive confirmation actions
 */
export const DestructiveCompact: Story = {
  ...DestructiveOpen,
  globals: { viewport: { value: 'mobile1' } },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    const dialog = body.getByRole('alertdialog', {
      name: 'Delete configuration?',
    });
    const heading = body.getByRole('heading', {
      name: 'Delete configuration?',
    });
    const header = heading.parentElement?.parentElement;
    const actions = body.getByRole('group');
    const actionButtons = within(actions).getAllByRole('button');
    const view = canvasElement.ownerDocument.defaultView;

    await expect(dialog.getBoundingClientRect().width).toBeLessThanOrEqual(
      canvasElement.getBoundingClientRect().width,
    );
    await expect(header?.getBoundingClientRect().height).toBeGreaterThan(0);
    await expect(view?.getComputedStyle(actions).flexDirection).toBe(
      'column-reverse',
    );
    await expect(actionButtons[1].getBoundingClientRect().top).toBeLessThan(
      actionButtons[0].getBoundingClientRect().top,
    );
    await Promise.all(
      actionButtons.map((button) =>
        expect(button.getBoundingClientRect().width).toBeLessThanOrEqual(
          dialog.getBoundingClientRect().width,
        ),
      ),
    );
    await expect(body.getByRole('button', { name: 'Cancel' })).toHaveFocus();
  },
};
