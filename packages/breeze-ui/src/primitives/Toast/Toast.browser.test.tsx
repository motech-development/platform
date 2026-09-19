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

const wrappedMessages = [
  'Changes saved successfully and your updates are ready to review.',
  'Your profile details were updated successfully and are now visible across your account.',
  'The invitation was sent successfully to the selected recipient and will expire soon.',
];

const waitForTime = (milliseconds: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, milliseconds);
  });

function WrappedToastContent() {
  const enqueue = useToast();

  return wrappedMessages.map((message) => (
    <button key={message} type="button" onClick={() => enqueue(message)}>
      {message}
    </button>
  ));
}

function WrappedToastExample({ limit = 3 }: Readonly<{ limit?: number }> = {}) {
  return (
    <BreezeProvider locale="en-GB" toastLimit={limit}>
      <WrappedToastContent />
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

function NestedProviderToastExample() {
  return (
    <BreezeProvider locale="en-GB">
      <Dialog defaultOpen title="Confirm change" trigger="Open dialog">
        <BreezeProvider locale="en-GB">
          <SaveAction />
        </BreezeProvider>
      </Dialog>
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

  it('keeps an offscreen card queued until it becomes fully visible', async () => {
    await page.viewport(375, 240);
    expect(window.innerWidth).toBe(375);

    render(<WrappedToastExample />);
    await wrappedMessages.reduce(
      (previous, message) =>
        previous.then(() =>
          userEvent.click(page.getByRole('button', { name: message })),
        ),
      Promise.resolve(),
    );

    const toasts = await screen.findAllByRole('status');
    expect(toasts).toHaveLength(3);
    const lastToast = toasts.at(-1);
    expect(lastToast).toBeDefined();
    expect(lastToast!.getBoundingClientRect().bottom).toBeGreaterThan(
      window.innerHeight,
    );

    await waitForTime(2700);

    const promotedToast = await screen.findByRole('status', {
      name: wrappedMessages[2],
    });
    expect(screen.getAllByRole('status')).toHaveLength(1);
    expect(promotedToast.getBoundingClientRect().bottom).toBeLessThan(
      window.innerHeight,
    );

    await waitForTime(2000);
    expect(promotedToast).toBeInTheDocument();

    await waitForTime(700);
    expect(
      screen.queryByRole('status', { name: wrappedMessages[2] }),
    ).not.toBeInTheDocument();
  }, 10000);

  it('waits for a clipped card to become fully visible before expiring', async () => {
    await page.viewport(375, 120);
    expect(window.innerWidth).toBe(375);

    render(<WrappedToastExample limit={1} />);
    await userEvent.click(
      page.getByRole('button', { name: wrappedMessages[0] }),
    );

    const firstToast = await screen.findByRole('status', {
      name: wrappedMessages[0],
    });
    await userEvent.click(
      page.getByRole('button', { name: wrappedMessages[1] }),
    );
    expect(
      screen.queryByRole('status', { name: wrappedMessages[1] }),
    ).not.toBeInTheDocument();
    expect(firstToast.getBoundingClientRect().bottom).toBeGreaterThan(
      window.innerHeight,
    );

    await waitForTime(2700);
    expect(firstToast).toBeInTheDocument();

    await page.viewport(375, 240);
    expect(window.innerHeight).toBe(240);
    await waitFor(() => {
      expect(firstToast.getBoundingClientRect().bottom).toBeLessThanOrEqual(
        window.innerHeight,
      );
    });

    await waitForTime(2700);
    expect(firstToast).not.toBeInTheDocument();
    expect(
      await screen.findByRole('status', { name: wrappedMessages[1] }),
    ).toBeInTheDocument();
  }, 10000);
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
    expect(region).not.toHaveAttribute('aria-live');
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

describe('nested BreezeProvider with Toast', () => {
  it('keeps a nested provider above its ancestor overlay', async () => {
    render(<NestedProviderToastExample />);

    const modal = await screen.findByRole('dialog', {
      name: 'Confirm change',
    });
    await userEvent.click(
      within(modal).getByRole('button', { name: 'Save changes' }),
    );

    const toast = await screen.findByRole('status', { name: 'Changes saved' });
    const region = toast.closest('[data-breeze-toast-region]');
    const modalLayer = modal.closest('[data-breeze-overlay]');

    expect(region).toBeInTheDocument();
    expect(modalLayer).toBeInTheDocument();
    expect(Number(getComputedStyle(region!).zIndex)).toBeGreaterThanOrEqual(
      Number(getComputedStyle(modalLayer!).zIndex),
    );
  });
});
