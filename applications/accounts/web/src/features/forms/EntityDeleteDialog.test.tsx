import { BreezeProvider } from '@motech-development/breeze-ui';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EntityDeleteDialog } from './EntityDeleteDialog';

vi.mock('@motech-development/breeze-ui/icons', async (importOriginal) => ({
  ...(await importOriginal<
    typeof import('@motech-development/breeze-ui/icons')
  >()),
  CloseIcon: () => <span aria-hidden="true">close</span>,
  WarningIcon: () => <span aria-hidden="true">warning</span>,
}));

function renderDialog(onDelete: () => Promise<boolean>) {
  render(
    <BreezeProvider locale="en-GB">
      <EntityDeleteDialog
        cancelLabel="Cancel"
        closeLabel="Close delete confirmation"
        confirmationError="The name must match."
        confirmationLabel="Type Example to confirm"
        confirmLabel="Permanently delete"
        deleting={false}
        description="This entity will be removed."
        entityName="Example"
        onDelete={onDelete}
        title="Delete Example?"
        triggerLabel="Delete entity"
      />
    </BreezeProvider>,
  );
}

describe('EntityDeleteDialog', () => {
  it('does not open while deletion is unavailable', async () => {
    render(
      <BreezeProvider locale="en-GB">
        <EntityDeleteDialog
          cancelLabel="Cancel"
          closeLabel="Close delete confirmation"
          confirmationError="The name must match."
          confirmationLabel="Type Example to confirm"
          confirmLabel="Permanently delete"
          deleting={false}
          description="This entity will be removed."
          disabled
          entityName="Example"
          onDelete={vi.fn().mockResolvedValue(true)}
          title="Delete Example?"
          triggerLabel="Delete entity"
        />
      </BreezeProvider>,
    );

    const trigger = screen.getByRole('button', { name: 'Delete entity' });

    expect(trigger).toBeDisabled();
    await userEvent.click(trigger);
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('closes and resets after a successful deletion', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn().mockResolvedValue(true);

    renderDialog(onDelete);
    await user.click(screen.getByRole('button', { name: 'Delete entity' }));
    await user.type(
      screen.getByLabelText('Type Example to confirm'),
      'Example',
    );
    await user.click(
      screen.getByRole('button', { name: 'Permanently delete' }),
    );

    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
    expect(onDelete).toHaveBeenCalledOnce();

    await user.click(screen.getByRole('button', { name: 'Delete entity' }));
    expect(screen.getByLabelText('Type Example to confirm')).toHaveValue('');
  });

  it('stays open after a failed deletion so it can be retried', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn().mockResolvedValue(false);

    renderDialog(onDelete);
    await user.click(screen.getByRole('button', { name: 'Delete entity' }));
    await user.type(
      screen.getByLabelText('Type Example to confirm'),
      'Example',
    );
    await user.click(
      screen.getByRole('button', { name: 'Permanently delete' }),
    );

    await waitFor(() => expect(onDelete).toHaveBeenCalledOnce());
    expect(screen.getByRole('alertdialog')).toBeVisible();
    expect(screen.getByLabelText('Type Example to confirm')).toHaveValue(
      'Example',
    );
  });

  it('stays open when deletion rejects unexpectedly', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn().mockRejectedValue(new Error('Unavailable'));

    renderDialog(onDelete);
    await user.click(screen.getByRole('button', { name: 'Delete entity' }));
    await user.type(
      screen.getByLabelText('Type Example to confirm'),
      'Example',
    );
    await user.click(
      screen.getByRole('button', { name: 'Permanently delete' }),
    );

    await waitFor(() => expect(onDelete).toHaveBeenCalledOnce());
    expect(screen.getByRole('alertdialog')).toBeVisible();
  });

  it('provides a close control for nested confirmation', async () => {
    const user = userEvent.setup();

    render(
      <BreezeProvider locale="en-GB">
        <EntityDeleteDialog
          cancelLabel="Cancel"
          closeLabel="Close delete confirmation"
          confirmationError="The name must match."
          confirmationLabel="Type Example to confirm"
          confirmLabel="Permanently delete"
          deleting={false}
          description="This entity will be removed."
          entityName="Example"
          nested
          onDelete={vi.fn().mockResolvedValue(true)}
          title="Delete Example?"
          triggerLabel="Delete entity"
        />
      </BreezeProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Delete entity' }));

    expect(
      screen.getByRole('button', { name: 'Close delete confirmation' }),
    ).toBeVisible();
  });
});
