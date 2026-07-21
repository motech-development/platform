import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { Dialog } from './Dialog';

describe('Dialog', () => {
  it('uses and scopes an application-supplied portal host', () => {
    const portalContainer = document.createElement('div');
    document.body.append(portalContainer);

    renderBreeze(
      <Dialog.Root defaultOpen>
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Supplied host</Dialog.Title>
          <Dialog.Description>Portalled externally.</Dialog.Description>
          <Dialog.Close>Close</Dialog.Close>
        </Dialog.Content>
      </Dialog.Root>,
      { portalContainer },
    );

    expect(portalContainer).toHaveAttribute('data-breeze-portal-root', '');
    expect(portalContainer).toHaveAttribute('data-breeze-root', '');
    expect(portalContainer).toContainElement(
      screen.getByRole('dialog', { name: 'Supplied host' }),
    );

    portalContainer.remove();
  });
  it('opens a labelled modal, traps focus, dismisses with Escape, and restores focus', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    renderBreeze(
      <Dialog.Root onOpenChange={onOpenChange}>
        <Dialog.Trigger>Open dialog</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Account settings</Dialog.Title>
          <Dialog.Description>Update your preferences.</Dialog.Description>
          <Dialog.Close>Close</Dialog.Close>
        </Dialog.Content>
      </Dialog.Root>,
    );
    const trigger = screen.getByRole('button', { name: 'Open dialog' });
    await user.click(trigger);

    const dialog = screen.getByRole('dialog', { name: 'Account settings' });

    expect(dialog).toHaveAccessibleDescription('Update your preferences.');
    expect(dialog.closest('[data-breeze-portal-root]')).not.toHaveAttribute(
      'aria-hidden',
    );
    expect(
      screen.getByRole('dialog', { name: 'Account settings' }),
    ).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await waitFor(() => expect(trigger).toHaveFocus());
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it('keeps controlled read-only state open', async () => {
    const user = userEvent.setup();

    renderBreeze(
      <Dialog.Root open readOnly>
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Persistent</Dialog.Title>
          <Dialog.Description>Cannot dismiss.</Dialog.Description>
          <Dialog.Close>Close</Dialog.Close>
        </Dialog.Content>
      </Dialog.Root>,
    );
    await user.keyboard('{Escape}');

    expect(screen.getByRole('dialog', { name: 'Persistent' })).toBeVisible();
  });
});
