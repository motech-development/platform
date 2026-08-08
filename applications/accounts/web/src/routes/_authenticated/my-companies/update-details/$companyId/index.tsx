import { createFileRoute } from '@tanstack/react-router';
import { useAccountsOwnerId } from '../../../../../auth/owner';
import { primeCompanyDetails } from '../../../../../data/loaders';
import { CompanyDetailsPage } from '../../../../../features/companies/CompanyDetailsPage';
import { AccountsPending } from '../../../../-RouteState';

function CompanyDetailsRoute() {
  const { companyId } = Route.useParams();

  return (
    <CompanyDetailsPage companyId={companyId} owner={useAccountsOwnerId()} />
  );
}

export const Route = createFileRoute(
  '/_authenticated/my-companies/update-details/$companyId/',
)({
  component: CompanyDetailsRoute,
  loader: ({ context, params }) =>
    primeCompanyDetails(context, params.companyId),
  pendingComponent: AccountsPending,
});
