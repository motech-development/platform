import { createFileRoute } from '@tanstack/react-router';
import { primeTransaction } from '../../../../../../../../data/loaders';
import { TransactionEditPage } from '../../../../../../../../features/transactions/TransactionEditPage';
import { AccountsPending } from '../../../../../../../-RouteState';

function PendingTransactionPage() {
  const { companyId, transactionId } = Route.useParams();

  return (
    <TransactionEditPage
      companyId={companyId}
      origin="pending"
      transactionId={transactionId}
    />
  );
}

export const Route = createFileRoute(
  '/_authenticated/my-companies/accounts/$companyId/pending-transactions/view-transaction/$transactionId/',
)({
  component: PendingTransactionPage,
  loader: ({ context, params }) =>
    primeTransaction(context, params.companyId, params.transactionId),
  pendingComponent: AccountsPending,
});
