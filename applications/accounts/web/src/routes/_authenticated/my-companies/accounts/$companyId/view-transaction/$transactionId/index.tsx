import { createFileRoute } from '@tanstack/react-router';
import { primeTransaction } from '../../../../../../../data/loaders';
import { TransactionEditPage } from '../../../../../../../features/transactions/TransactionEditPage';
import { AccountsPending } from '../../../../../../-RouteState';

function TransactionPage() {
  const { companyId, transactionId } = Route.useParams();

  return (
    <TransactionEditPage
      companyId={companyId}
      origin="transactions"
      transactionId={transactionId}
    />
  );
}

export const Route = createFileRoute(
  '/_authenticated/my-companies/accounts/$companyId/view-transaction/$transactionId/',
)({
  component: TransactionPage,
  loader: ({ context, params }) =>
    primeTransaction(context, params.companyId, params.transactionId),
  pendingComponent: AccountsPending,
});
