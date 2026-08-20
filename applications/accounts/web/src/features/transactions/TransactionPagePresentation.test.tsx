import { BreezeProvider } from '@motech-development/breeze-ui';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TransactionPageHeaderAction } from './TransactionPagePresentation';

let wideActionLayout = false;
const actionLayoutListeners = new Set<() => void>();

vi.mock('@motech-development/breeze-ui/icons', async (importOriginal) => ({
  ...(await importOriginal<
    typeof import('@motech-development/breeze-ui/icons')
  >()),
  AddIcon: () => <span aria-hidden="true">+</span>,
  WarningIcon: () => <span aria-hidden="true">!</span>,
}));

function renderAction({
  hasTransactions,
  initiallyLoading,
}: Readonly<{ hasTransactions: boolean; initiallyLoading: boolean }>) {
  return render(
    <BreezeProvider locale="en-GB">
      <TransactionPageHeaderAction
        hasTransactions={hasTransactions}
        initiallyLoading={initiallyLoading}
        recordTransactionHref="/record-transaction"
      />
    </BreezeProvider>,
  );
}

function setWideActionLayout(wide: boolean) {
  wideActionLayout = wide;
  act(() => {
    actionLayoutListeners.forEach((listener) => listener());
  });
}

describe('TransactionPageHeaderAction', () => {
  beforeEach(() => {
    wideActionLayout = false;
    actionLayoutListeners.clear();
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockImplementation(() => ({
        addEventListener: (_event: string, listener: () => void) => {
          actionLayoutListeners.add(listener);
        },
        matches: wideActionLayout,
        removeEventListener: (_event: string, listener: () => void) => {
          actionLayoutListeners.delete(listener);
        },
      })),
    );
  });

  it('omits the action while the initial query loads', () => {
    renderAction({
      hasTransactions: false,
      initiallyLoading: true,
    });

    expect(
      screen.queryByRole('link', { name: 'Record transaction' }),
    ).not.toBeInTheDocument();
  });

  it('shows the action after transactions load', () => {
    renderAction({ hasTransactions: true, initiallyLoading: false });

    expect(
      screen.getByRole('link', { name: 'Record transaction' }),
    ).toHaveAttribute('href', '/record-transaction');
  });

  it('uses compact action order when media queries are unavailable', () => {
    vi.stubGlobal('matchMedia', undefined);

    render(
      <BreezeProvider locale="en-GB">
        <TransactionPageHeaderAction
          hasTransactions
          initiallyLoading={false}
          pendingTransactionsHref="/pending-transactions"
          recordTransactionHref="/record-transaction"
        />
      </BreezeProvider>,
    );

    const links = screen.getAllByRole('link');

    expect(links[0]).toHaveAccessibleName('Record transaction');
    expect(links[1]).toHaveAccessibleName('View pending');
  });

  it('keeps keyboard order aligned with each prototype layout', async () => {
    const user = userEvent.setup();

    render(
      <BreezeProvider locale="en-GB">
        <TransactionPageHeaderAction
          hasTransactions
          initiallyLoading={false}
          pendingTransactionsHref="/pending-transactions"
          recordTransactionHref="/record-transaction"
        />
      </BreezeProvider>,
    );

    const links = screen.getAllByRole('link');

    expect(links[0]).toHaveAccessibleName('Record transaction');
    expect(links[1]).toHaveAccessibleName('View pending');
    await user.tab();
    expect(links[0]).toHaveFocus();
    await user.tab();
    expect(links[1]).toHaveFocus();

    setWideActionLayout(true);

    const wideLinks = screen.getAllByRole('link');

    expect(wideLinks[0]).toHaveAccessibleName('View pending');
    expect(wideLinks[1]).toHaveAccessibleName('Record transaction');
    expect(window.matchMedia).toHaveBeenCalledWith('(min-width: 73.8125rem)');
  });
});
