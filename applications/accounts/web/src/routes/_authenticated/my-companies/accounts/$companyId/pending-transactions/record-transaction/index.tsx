import { createFileRoute } from '@tanstack/react-router';
import { verifyRecordTransactionRoute } from '../../../../../../../data/loaders';
import { RecordTransactionPage } from '../../../../../../../features/transactions/RecordTransactionPage';
import { AccountsPending } from '../../../../../../-RouteState';

function PendingRecordTransactionPage() {
  const { companyId } = Route.useParams();

  return <RecordTransactionPage companyId={companyId} origin="pending" />;
}

export const Route = createFileRoute(
  '/_authenticated/my-companies/accounts/$companyId/pending-transactions/record-transaction/',
)({
  component: PendingRecordTransactionPage,
  loader: ({ context, params }) =>
    verifyRecordTransactionRoute(context, params.companyId),
  pendingComponent: AccountsPending,
});
