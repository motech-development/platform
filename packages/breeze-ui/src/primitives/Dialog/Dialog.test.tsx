import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { BreezeProvider } from '../../provider/BreezeProvider';
import { Button } from '../Button/Button';
import { Dialog } from './Dialog';

describe('Dialog', () => {
  it('places an initially open child above its initially open parent', async () => {
    renderBreeze(
      <Dialog defaultOpen title="Outer" trigger="Open outer">
        <Dialog defaultOpen title="Inner" trigger="Open inner">
          Content
        </Dialog>
      </Dialog>,
    );
    const inner = await screen.findByRole('dialog', { name: 'Inner' });
    expect(inner.closest('[data-breeze-overlay]')).toHaveAttribute(
      'data-breeze-topmost',
      'true',
    );
    expect(
      document.querySelectorAll('[data-breeze-scrim="true"]'),
    ).toHaveLength(1);
    await userEvent.keyboard('{Escape}');
    expect(screen.getByRole('dialog', { name: 'Outer' })).toBeInTheDocument();
  });

  it('closes descendants when the outer closes first and restores the original trigger', async () => {
    const innerChange = vi.fn();
    function Example() {
      const [open, setOpen] = useState(false);
      const [innerOpen, setInnerOpen] = useState(false);
      return (
        <Dialog
          open={open}
          onOpenChange={setOpen}
          title="Outer"
          trigger="Open outer"
        >
          <Dialog
            title="Inner"
            trigger="Open inner"
            open={innerOpen}
            onOpenChange={(nextOpen) => {
              innerChange(nextOpen);
              setInnerOpen(nextOpen);
            }}
          >
            <Button onAction={() => setOpen(false)}>Close outer first</Button>
          </Dialog>
        </Dialog>
      );
    }
    renderBreeze(<Example />);
    const trigger = screen.getByRole('button', { name: 'Open outer' });
    await userEvent.click(trigger);
    await userEvent.click(screen.getByRole('button', { name: 'Open inner' }));
    await userEvent.click(
      screen.getByRole('button', { name: 'Close outer first' }),
    );
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
    await waitFor(() => expect(trigger).toHaveFocus());
    expect(innerChange).toHaveBeenLastCalledWith(false);
    expect(
      document.querySelector('[data-breeze-scrim="true"]'),
    ).not.toBeInTheDocument();
    await userEvent.click(trigger);
    expect(screen.getByRole('dialog', { name: 'Outer' })).toBeInTheDocument();
    expect(
      screen.queryByRole('dialog', { name: 'Inner' }),
    ).not.toBeInTheDocument();
  });

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

  it('transfers the scrim and restores focus through nested dialogs', async () => {
    renderBreeze(
      <Dialog title="Outer" trigger="Open outer">
        <Dialog title="Inner" trigger="Open inner">
          Nested content
        </Dialog>
      </Dialog>,
    );
    const outerTrigger = screen.getByRole('button', { name: 'Open outer' });
    await userEvent.click(outerTrigger);
    const outer = screen.getByRole('dialog', { name: 'Outer' });
    const innerTrigger = within(outer).getByRole('button', {
      name: 'Open inner',
    });
    await userEvent.click(innerTrigger);
    const inner = screen.getByRole('dialog', { name: 'Inner' });
    expect(
      document.querySelectorAll('[data-breeze-scrim="true"]'),
    ).toHaveLength(1);
    expect(inner.closest('[data-breeze-overlay]')).toHaveAttribute(
      'data-breeze-scrim',
      'true',
    );
    expect(outer.closest('[data-breeze-overlay]')).toHaveAttribute(
      'data-breeze-topmost',
      'false',
    );

    await userEvent.click(within(inner).getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(innerTrigger).toHaveFocus());
    expect(outer.closest('[data-breeze-overlay]')).toHaveAttribute(
      'data-breeze-scrim',
      'true',
    );

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(outerTrigger).toHaveFocus());
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
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
