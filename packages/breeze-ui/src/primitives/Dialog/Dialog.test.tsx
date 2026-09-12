import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import renderBreeze from '../../../test/render';
import { BreezeProvider } from '../../provider/BreezeProvider';
import { Button } from '../Button/Button';
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

  it('keeps focus in the dialog when loading removes the focused content', async () => {
    let startLoading = () => {};
    function Example() {
      const [loading, setLoading] = useState(false);
      startLoading = () => setLoading(true);
      return (
        <Dialog
          defaultOpen
          loading={loading}
          title="Confirm change"
          trigger="Open dialog"
        >
          <Button onAction={() => setLoading(true)}>Load details</Button>
        </Dialog>
      );
    }

    renderBreeze(<Example />);
    const dialog = screen.getByRole('dialog', { name: 'Confirm change' });
    const loadButton = within(dialog).getByRole('button', {
      name: 'Load details',
    });
    loadButton.focus();
    act(startLoading);
    expect(dialog).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
  });
});
