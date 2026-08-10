import { createFileRoute } from '@tanstack/react-router';
import { primeClients } from '../../../../../data/loaders';
import { ClientsPageContent } from '../../../../../features/clients/ClientsPageContent';
import { AccountsPending } from '../../../../-RouteState';

function ClientsPage() {
  const { companyId } = Route.useParams();

  return <ClientsPageContent companyId={companyId} />;
}

export const Route = createFileRoute(
  '/_authenticated/my-companies/clients/$companyId/',
)({
  component: ClientsPage,
  loader: ({ context, params }) => primeClients(context, params.companyId),
  pendingComponent: AccountsPending,
});
