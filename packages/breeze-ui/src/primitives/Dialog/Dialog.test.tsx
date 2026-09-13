import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, expectTypeOf, it } from 'vitest';
import renderBreeze from '../../../test/render';
import { BreezeProvider } from '../../provider/BreezeProvider';
import { Skeleton } from '../Skeleton/Skeleton';
import { Dialog, type DialogProps } from './Dialog';

expectTypeOf<DialogProps>().not.toHaveProperty('loading');

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

  it('renders loading content supplied by the caller', () => {
    renderBreeze(
      <Dialog defaultOpen title="Confirm change" trigger="Open dialog">
        <Skeleton blockSize="6rem" label="Loading details" shape="rectangle" />
      </Dialog>,
    );

    expect(
      screen.getByRole('progressbar', { name: 'Loading details' }),
    ).toBeInTheDocument();
  });
});
