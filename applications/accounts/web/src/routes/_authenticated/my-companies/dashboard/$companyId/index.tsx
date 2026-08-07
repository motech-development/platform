import { createFileRoute } from '@tanstack/react-router';
import { primeDashboard } from '../../../../../data/loaders';
import { DashboardPageContent } from '../../../../../features/transactions/DashboardPageContent';
import { AccountsPending } from '../../../../-RouteState';

function DashboardPage() {
  const { companyId } = Route.useParams();

  return <DashboardPageContent companyId={companyId} />;
}

export const Route = createFileRoute(
  '/_authenticated/my-companies/dashboard/$companyId/',
)({
  component: DashboardPage,
  loader: ({ context, params }) => primeDashboard(context, params.companyId),
  pendingComponent: AccountsPending,
});
