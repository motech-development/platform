import { createFileRoute } from '@tanstack/react-router';
import { verifyRecordTransactionRoute } from '../../../../../../data/loaders';
import { RecordTransactionPage } from '../../../../../../features/transactions/RecordTransactionPage';
import { AccountsPending } from '../../../../../-RouteState';

function AccountsRecordTransactionPage() {
  const { companyId } = Route.useParams();

  return <RecordTransactionPage companyId={companyId} origin="transactions" />;
}

export const Route = createFileRoute(
  '/_authenticated/my-companies/accounts/$companyId/record-transaction/',
)({
  component: AccountsRecordTransactionPage,
  loader: ({ context, params }) =>
    verifyRecordTransactionRoute(context, params.companyId),
  pendingComponent: AccountsPending,
});
