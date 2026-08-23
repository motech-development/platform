import { createFileRoute } from '@tanstack/react-router';
import { primeTransaction } from '../../../../../../../data/loaders';
import { TransactionEditPage } from '../../../../../../../features/transactions/TransactionEditPage';
import { AccountsPending } from '../../../../../../-RouteState';

function DashboardTransactionPage() {
  const { companyId, transactionId } = Route.useParams();

  return (
    <TransactionEditPage
      companyId={companyId}
      origin="dashboard"
      transactionId={transactionId}
    />
  );
}

export const Route = createFileRoute(
  '/_authenticated/my-companies/dashboard/$companyId/view-transaction/$transactionId/',
)({
  component: DashboardTransactionPage,
  loader: ({ context, params }) =>
    primeTransaction(context, params.companyId, params.transactionId),
  pendingComponent: AccountsPending,
});
