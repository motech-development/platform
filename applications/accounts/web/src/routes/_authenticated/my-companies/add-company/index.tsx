import { createFileRoute } from '@tanstack/react-router';
import { useAccountsOwnerId } from '../../../../auth/owner';
import { primeCompanies } from '../../../../data/loaders';
import { CompanyEnrolmentPage } from '../../../../features/companies/CompanyEnrolmentPage';
import { AccountsPending } from '../../../-RouteState';

function AddCompanyRoute() {
  return <CompanyEnrolmentPage owner={useAccountsOwnerId()} />;
}

export const Route = createFileRoute(
  '/_authenticated/my-companies/add-company/',
)({
  component: AddCompanyRoute,
  loader: ({ context }) => primeCompanies(context),
  pendingComponent: AccountsPending,
});
