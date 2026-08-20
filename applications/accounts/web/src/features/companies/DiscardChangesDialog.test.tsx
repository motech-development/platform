import { BreezeProvider } from '@motech-development/breeze-ui';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DiscardChangesDialog } from './DiscardChangesDialog';

function renderDialog({
  blocker = {
    proceed: vi.fn(),
    reset: vi.fn(),
    status: 'blocked',
  },
  onDiscard = vi.fn(),
  onOpenChange = vi.fn(),
} = {}) {
  render(
    <BreezeProvider locale="en-GB">
      <DiscardChangesDialog
        blocker={blocker}
        closeLabel="Close discard confirmation"
        description="Unsaved changes will be lost."
        onDiscard={onDiscard}
        onOpenChange={onOpenChange}
        open
        title="Discard changes?"
        trigger="Discard changes"
      />
    </BreezeProvider>,
  );

  return { blocker, onDiscard, onOpenChange };
}

describe('DiscardChangesDialog', () => {
  it('resets blocked navigation when the user keeps editing', async () => {
    const user = userEvent.setup();
    const { blocker, onDiscard, onOpenChange } = renderDialog();

    await user.click(screen.getByRole('button', { name: 'Keep editing' }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(blocker.reset).toHaveBeenCalledOnce();
    expect(blocker.proceed).not.toHaveBeenCalled();
    expect(onDiscard).not.toHaveBeenCalled();
  });

  it('allows and proceeds with blocked navigation after confirmation', async () => {
    const user = userEvent.setup();
    const { blocker, onDiscard } = renderDialog();

    await user.click(screen.getByRole('button', { name: 'Discard changes' }));

    expect(onDiscard).toHaveBeenCalledOnce();
    expect(blocker.proceed).toHaveBeenCalledOnce();
    expect(blocker.reset).not.toHaveBeenCalled();
  });

  it('waits for discard cleanup before proceeding with blocked navigation', async () => {
    let finishCleanup: (discarded: boolean) => void = () => undefined;
    const onDiscard = vi.fn(
      () =>
        new Promise<boolean>((resolve) => {
          finishCleanup = resolve;
        }),
    );
    const { blocker } = renderDialog({ onDiscard });

    await userEvent.click(
      screen.getByRole('button', { name: 'Discard changes' }),
    );

    expect(onDiscard).toHaveBeenCalledOnce();
    expect(blocker.proceed).not.toHaveBeenCalled();

    finishCleanup(true);

    await waitFor(() => expect(blocker.proceed).toHaveBeenCalledOnce());
    expect(blocker.reset).not.toHaveBeenCalled();
  });

  it('cancels blocked navigation when discard cleanup fails', async () => {
    const onDiscard = vi.fn().mockResolvedValue(false);
    const { blocker } = renderDialog({ onDiscard });

    await userEvent.click(
      screen.getByRole('button', { name: 'Discard changes' }),
    );

    await waitFor(() => expect(blocker.reset).toHaveBeenCalledOnce());
    expect(blocker.proceed).not.toHaveBeenCalled();
  });
});
