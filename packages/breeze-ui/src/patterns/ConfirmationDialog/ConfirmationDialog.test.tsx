import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createElement, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { Drawer } from '../../primitives/Drawer/Drawer';
import {
  ConfirmationDialog,
  type ConfirmationDialogProps,
} from './ConfirmationDialog';

describe('ConfirmationDialog', () => {
  it('supports externally controlled triggerless confirmation', async () => {
    const user = userEvent.setup();

    function ControlledConfirmation() {
      const [open, setOpen] = useState(false);

      return (
        <>
          <button onClick={() => setOpen(true)} type="button">
            Leave editor
          </button>
          <ConfirmationDialog
            cancelLabel="Keep editing"
            closeLabel="Close confirmation"
            confirmLabel="Discard changes"
            description="Unsaved changes will be lost."
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

    renderBreeze(<ControlledConfirmation />);

    const externalTrigger = screen.getByRole('button', {
      name: 'Leave editor',
    });

    await user.click(externalTrigger);
    expect(
      screen.getByRole('alertdialog', { name: 'Discard changes?' }),
    ).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Keep editing' }));

    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    await waitFor(() => expect(externalTrigger).toHaveFocus());
  });

  it('reports confirmation, closes, and restores trigger focus', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();

    renderBreeze(
      <ConfirmationDialog
        cancelLabel="Cancel"
        closeLabel="Close confirmation"
        confirmLabel="Delete record"
        description="This cannot be undone."
        onConfirm={onConfirm}
        title="Delete this record?"
        trigger="Delete record"
      />,
    );

    const trigger = screen.getByRole('button', { name: 'Delete record' });

    await user.click(trigger);
    const dialog = screen.getByRole('alertdialog');

    expect(dialog).toBeVisible();
    expect(dialog).toHaveClass('breeze-confirmation-dialog');
    expect(
      screen.getByRole('button', { name: 'Close confirmation' }),
    ).toBeVisible();
    expect(dialog.querySelector('[data-confirmation-icon]')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
    await user.click(screen.getByRole('button', { name: 'Delete record' }));

    expect(onConfirm).toHaveBeenCalledOnce();
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('supports default-open cancellation and reports the state request', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    renderBreeze(
      <ConfirmationDialog
        cancelLabel="Keep item"
        closeLabel="Close confirmation"
        confirmLabel="Delete item"
        defaultOpen
        description="This cannot be undone."
        onConfirm={() => undefined}
        onOpenChange={onOpenChange}
        title="Delete this item?"
        trigger="Delete item"
      />,
    );

    expect(screen.getByRole('alertdialog')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Keep item' }));

    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('reports controlled closure without mutating parent-owned open state', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    renderBreeze(
      <ConfirmationDialog
        cancelLabel="Cancel"
        closeLabel="Dismiss confirmation"
        confirmLabel="Archive item"
        description="The item can be restored later."
        onConfirm={() => undefined}
        onOpenChange={onOpenChange}
        open
        title="Archive this item?"
        trigger="Archive item"
      />,
    );

    await user.click(
      screen.getByRole('button', { name: 'Dismiss confirmation' }),
    );

    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(screen.getByRole('alertdialog')).toBeVisible();
  });

  it('rejects mutable controlled state without a change callback at runtime', () => {
    const invalidProps = {
      cancelLabel: 'Cancel',
      closeLabel: 'Close confirmation',
      confirmLabel: 'Archive item',
      description: 'The item can be restored later.',
      onConfirm: () => undefined,
      open: true,
      title: 'Archive this item?',
      trigger: 'Archive item',
    } as ConfirmationDialogProps;

    expect(() =>
      renderBreeze(createElement(ConfirmationDialog, invalidProps)),
    ).toThrow('Controlled ConfirmationDialog requires onOpenChange.');
  });

  it('keeps read-only state open when dismissal is requested', async () => {
    const user = userEvent.setup();

    renderBreeze(
      <ConfirmationDialog
        cancelLabel="Cancel"
        closeLabel="Close confirmation"
        confirmLabel="Archive item"
        description="The item can be restored later."
        onConfirm={() => undefined}
        open
        readOnly
        title="Archive this item?"
        trigger="Archive item"
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.getByRole('alertdialog')).toBeVisible();
  });

  it('prevents disabled confirmation while retaining cancellation', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();

    renderBreeze(
      <ConfirmationDialog
        cancelLabel="Cancel"
        closeLabel="Close confirmation"
        confirmLabel="Delete item"
        defaultOpen
        description="This cannot be undone."
        disabled
        onConfirm={onConfirm}
        title="Delete this item?"
        trigger="Delete item"
      />,
    );

    const confirm = within(screen.getByRole('alertdialog')).getByRole(
      'button',
      {
        name: 'Delete item',
      },
    );

    expect(confirm).toBeDisabled();
    await user.click(confirm);
    expect(onConfirm).not.toHaveBeenCalled();
    expect(screen.getByRole('alertdialog')).toBeVisible();
  });

  it('preserves the parent task and focus behavior when nested', async () => {
    const user = userEvent.setup();

    renderBreeze(
      <Drawer.Root defaultOpen>
        <Drawer.Trigger>Open editor</Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Description>Edit the item.</Drawer.Description>
          <Drawer.Title>Item editor</Drawer.Title>
          <ConfirmationDialog
            cancelLabel="Keep editing"
            closeLabel="Close confirmation"
            confirmLabel="Discard changes"
            description="Unsaved changes will be lost."
            nested
            onConfirm={() => undefined}
            title="Discard changes?"
            trigger="Leave editor"
          />
        </Drawer.Content>
      </Drawer.Root>,
    );

    const trigger = screen.getByRole('button', { name: 'Leave editor' });

    await user.click(trigger);
    const dialog = screen.getByRole('alertdialog', {
      name: 'Discard changes?',
    });

    expect(dialog).toBeVisible();
    expect(screen.getByText('Item editor')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Keep editing' })).toHaveFocus();
    await user.click(screen.getByRole('button', { name: 'Keep editing' }));
    await waitFor(() => expect(trigger).toHaveFocus());
  });
});
