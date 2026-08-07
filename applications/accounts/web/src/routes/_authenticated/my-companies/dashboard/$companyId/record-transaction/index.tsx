import { createFileRoute } from '@tanstack/react-router';
import { verifyRecordTransactionRoute } from '../../../../../../data/loaders';
import { RecordTransactionPage } from '../../../../../../features/transactions/RecordTransactionPage';
import { AccountsPending } from '../../../../../-RouteState';

function DashboardRecordTransactionPage() {
  const { companyId } = Route.useParams();

  return <RecordTransactionPage companyId={companyId} origin="dashboard" />;
}

export const Route = createFileRoute(
  '/_authenticated/my-companies/dashboard/$companyId/record-transaction/',
)({
  component: DashboardRecordTransactionPage,
  loader: ({ context, params }) =>
    verifyRecordTransactionRoute(context, params.companyId),
  pendingComponent: AccountsPending,
});
