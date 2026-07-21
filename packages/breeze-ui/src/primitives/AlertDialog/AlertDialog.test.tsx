import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { AlertDialog } from './AlertDialog';

describe('AlertDialog', () => {
  it('requires explicit action rather than outside dismissal', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();

    renderBreeze(
      <AlertDialog.Root defaultOpen>
        <AlertDialog.Trigger>Delete</AlertDialog.Trigger>
        <AlertDialog.Content>
          <AlertDialog.Title>Delete account?</AlertDialog.Title>
          <AlertDialog.Description>
            This cannot be undone.
          </AlertDialog.Description>
          <AlertDialog.Actions>
            <AlertDialog.Close onAction={onAction}>Cancel</AlertDialog.Close>
          </AlertDialog.Actions>
        </AlertDialog.Content>
      </AlertDialog.Root>,
    );
    const dialog = screen.getByRole('alertdialog', {
      name: 'Delete account?',
    });
    const overlay = dialog.closest('.breeze-modal-overlay');

    expect(overlay).not.toBeNull();
    fireEvent.pointerDown(overlay!);
    fireEvent.pointerUp(overlay!);
    fireEvent.click(overlay!);

    expect(dialog).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onAction).toHaveBeenCalledOnce();
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('owns the responsive semantic action region and forwards native props', () => {
    const ref = createRef<HTMLDivElement>();

    renderBreeze(
      <AlertDialog.Actions
        aria-label="Decision actions"
        className="application-actions"
        ref={ref}
        title="Choose an action"
      >
        <button type="button">Cancel</button>
        <button type="button">Continue</button>
      </AlertDialog.Actions>,
    );

    const actions = screen.getByRole('group', {
      name: 'Decision actions',
    });

    expect(actions.tagName).toBe('DIV');
    expect(actions).toHaveAttribute('title', 'Choose an action');
    expect(actions).toHaveClass('application-actions');
    expect(ref.current).toBe(actions);
  });

  it('requires the shared Breeze environment for the action region', () => {
    expect(() =>
      render(
        <AlertDialog.Actions>
          <button type="button">Continue</button>
        </AlertDialog.Actions>,
      ),
    ).toThrow('Breeze components must be rendered within BreezeProvider.');
  });
});
