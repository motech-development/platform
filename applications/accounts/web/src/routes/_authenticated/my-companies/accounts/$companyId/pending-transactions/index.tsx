import { createFileRoute } from '@tanstack/react-router';
import { primePendingTransactions } from '../../../../../../data/loaders';
import { PendingTransactionsPageContent } from '../../../../../../features/transactions/PendingTransactionsPageContent';
import { AccountsPending } from '../../../../../-RouteState';

function PendingTransactionsPage() {
  const { companyId } = Route.useParams();

  return <PendingTransactionsPageContent companyId={companyId} />;
}

export const Route = createFileRoute(
  '/_authenticated/my-companies/accounts/$companyId/pending-transactions/',
)({
  component: PendingTransactionsPage,
  loader: ({ context, params }) =>
    primePendingTransactions(context, params.companyId),
  pendingComponent: AccountsPending,
});
