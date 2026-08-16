import { BreezeProvider } from '@motech-development/breeze-ui';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TransactionAttachment } from './TransactionAttachment';

const mocks = vi.hoisted(() => ({
  capture: vi.fn(),
  query: vi.fn(),
  toast: { show: vi.fn() },
}));

vi.mock('@apollo/client/react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@apollo/client/react')>()),
  useApolloClient: () => ({ query: mocks.query }),
}));

vi.mock('@motech-development/breeze-ui', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@motech-development/breeze-ui')>()),
  useToast: () => mocks.toast,
}));

vi.mock('../../observability', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../observability')>()),
  capturePresignedTransferFailure: mocks.capture,
}));

vi.mock('../../pwa/connectivity', () => ({ useOnlineStatus: () => true }));

describe('TransactionAttachment', () => {
  beforeEach(() => vi.clearAllMocks());

  it('reports a missing presigned download without losing the attachment', async () => {
    mocks.query.mockResolvedValue({ data: { requestDownload: { url: null } } });

    render(
      <BreezeProvider locale="en-GB">
        <TransactionAttachment
          companyId="company-id"
          onDeleted={() => true}
          path="company-id/invoice.pdf"
        />
      </BreezeProvider>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'View file' }));

    await waitFor(() =>
      expect(mocks.capture).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'No download destination was returned',
        }),
        'Download',
      ),
    );
    expect(screen.getByText('invoice.pdf')).toBeVisible();
    expect(mocks.toast.show).toHaveBeenCalledWith(
      expect.objectContaining({ variant: 'danger' }),
    );
  });

  it('marks a persisted attachment for deletion without deleting it immediately', async () => {
    const onDeleted = vi.fn(() => true);

    render(
      <BreezeProvider locale="en-GB">
        <TransactionAttachment
          companyId="company-id"
          onDeleted={onDeleted}
          path="company-id/receipt.png"
        />
      </BreezeProvider>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Delete file' }));

    expect(onDeleted).toHaveBeenCalledOnce();
  });
});
