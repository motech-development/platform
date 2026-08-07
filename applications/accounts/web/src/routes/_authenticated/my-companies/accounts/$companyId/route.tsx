import { createFileRoute, Outlet } from '@tanstack/react-router';
import { useAccountsOwnerId } from '../../../../../auth/owner';
import { primeTransactions } from '../../../../../data/loaders';
import { CompanyTransactionSubscription } from '../../../../../features/transactions/CompanyTransactionSubscription';
import { AccountsPending } from '../../../../-RouteState';

function AccountsCompanyLayout() {
  const { companyId } = Route.useParams();
  const ownerId = useAccountsOwnerId();

  return (
    <CompanyTransactionSubscription companyId={companyId} owner={ownerId}>
      <Outlet />
    </CompanyTransactionSubscription>
  );
}

export const Route = createFileRoute(
  '/_authenticated/my-companies/accounts/$companyId',
)({
  component: AccountsCompanyLayout,
  loader: ({ context, params }) => primeTransactions(context, params.companyId),
  pendingComponent: AccountsPending,
});
