import { render, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { BreezeProvider } from '../../provider/BreezeProvider';
import { Dialog } from '../Dialog/Dialog';
import { Drawer } from '../Drawer/Drawer';
import { useToast } from './Toast';
import '../../styles/styles.css';

function SaveAction() {
  const enqueue = useToast();

  return (
    <button type="button" onClick={() => enqueue('Changes saved')}>
      Save changes
    </button>
  );
}

function ToastExample() {
  return (
    <BreezeProvider locale="en-GB">
      <SaveAction />
    </BreezeProvider>
  );
}

function ModalToastExample({ kind }: Readonly<{ kind: 'dialog' | 'drawer' }>) {
  const content = <SaveAction />;

  return (
    <BreezeProvider locale="en-GB">
      {kind === 'dialog' ? (
        <Dialog defaultOpen title="Confirm change" trigger="Open dialog">
          {content}
        </Dialog>
      ) : (
        <Drawer defaultOpen title="Confirm change" trigger="Open drawer">
          {content}
        </Drawer>
      )}
    </BreezeProvider>
  );
}

async function assertToastGeometry(
  width: number,
  height: number,
  expectedEnd: number,
  screenshotPath: string,
) {
  await page.viewport(width, height);
  expect(window.innerWidth).toBe(width);

  render(<ToastExample />);
  const trigger = screen.getByRole('button', { name: 'Save changes' });
  trigger.focus();
  await userEvent.click(trigger);

  const toast = await screen.findByRole('status', { name: 'Changes saved' });
  await waitFor(() => {
    const bounds = toast.getBoundingClientRect();
    expect(bounds.width).toBe(288);
    expect(Math.round(bounds.top)).toBe(76);
    expect(Math.round(width - bounds.right)).toBe(expectedEnd);
  });

  expect(document.activeElement).toBe(trigger);
  expect(toast).not.toHaveAttribute('tabindex');
  await page.screenshot({
    element: document.documentElement,
    path: screenshotPath,
  });
}

describe('Toast browser geometry', () => {
  it('keeps the 288px confirmation on the desktop content gutter', async () => {
    await assertToastGeometry(1280, 720, 28, '/tmp/breeze-toast-desktop.png');
    expect(window.innerWidth).toBe(1280);
  });

  it('uses the mobile content gutter at a real 375px viewport', async () => {
    await assertToastGeometry(375, 812, 16, '/tmp/breeze-toast-mobile.png');
    expect(window.innerWidth).toBe(375);
  });
});

describe.each(['dialog', 'drawer'] as const)('%s with Toast', (kind) => {
  it('keeps the status region live and above the modal without taking focus', async () => {
    render(<ModalToastExample kind={kind} />);

    const modal = await screen.findByRole('dialog', {
      name: 'Confirm change',
    });
    const action = within(modal).getByRole('button', {
      name: 'Save changes',
    });
    await userEvent.click(action);

    const toast = await screen.findByRole('status', { name: 'Changes saved' });
    const region = toast.closest('[data-breeze-toast-region]');
    const modalLayer = modal.closest('[data-breeze-overlay]');

    expect(region).toBeInTheDocument();
    expect(region).toHaveAttribute('aria-live', 'polite');
    expect(region).toHaveAttribute('data-live-announcer');
    expect(region).toHaveAttribute('data-react-aria-top-layer');
    expect(region).not.toHaveAttribute('aria-hidden', 'true');
    expect(region?.closest('[aria-hidden="true"]')).toBeNull();
    expect(region?.closest('[inert]')).toBeNull();
    expect(modalLayer).toBeInTheDocument();
    expect(Number(getComputedStyle(region!).zIndex)).toBeGreaterThan(
      Number(getComputedStyle(modalLayer!).zIndex),
    );
    expect(document.activeElement).toBe(action);
    expect(document.activeElement).not.toBe(toast);
  });
});
