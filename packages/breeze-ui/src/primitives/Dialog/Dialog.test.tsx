import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import renderBreeze from '../../../test/render';
import { BreezeProvider } from '../../provider/BreezeProvider';
import { Dialog } from './Dialog';

describe('Dialog', () => {
  it('uses and cleans up a dedicated host inside a custom container', async () => {
    const container = document.createElement('section');
    document.body.append(container);
    const { unmount } = render(
      <BreezeProvider locale="fr-FR" portalContainer={container}>
        <Dialog title="Details" trigger="Open" defaultOpen>
          Content
        </Dialog>
      </BreezeProvider>,
    );
    const dialog = await screen.findByRole('dialog', { name: 'Details' });
    expect(container).toContainElement(dialog);
    expect(dialog.closest('[data-breeze-portal]')).toHaveAttribute(
      'lang',
      'fr-FR',
    );
    unmount();
    expect(container).toBeEmptyDOMElement();
    container.remove();
  });

  it('opens a labelled dialog in the marked provider portal and restores focus', async () => {
    renderBreeze(
      <Dialog title="Confirm change" trigger="Open dialog">
        Review the change.
      </Dialog>,
    );
    const trigger = screen.getByRole('button', { name: 'Open dialog' });

    await userEvent.click(trigger);

    const dialog = screen.getByRole('dialog', { name: 'Confirm change' });
    expect(dialog.closest('[data-breeze-portal]')).toHaveAttribute(
      'data-breeze-root',
    );

    await userEvent.click(screen.getByRole('button', { name: 'Close' }));

    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
    await waitFor(() => expect(trigger).toHaveFocus());
  });
});
