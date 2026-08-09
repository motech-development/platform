import { BreezeProvider } from '@motech-development/breeze-ui';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TransactionPageHeaderAction } from './TransactionPagePresentation';

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

describe('TransactionPageHeaderAction', () => {
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
});
