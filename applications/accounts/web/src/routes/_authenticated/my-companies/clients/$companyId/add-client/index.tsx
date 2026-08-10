import { createFileRoute } from '@tanstack/react-router';
import { primeClients } from '../../../../../../data/loaders';
import { ClientCreatePage } from '../../../../../../features/clients/ClientCreatePage';
import { AccountsPending } from '../../../../../-RouteState';

function AddClientPage() {
  const { companyId } = Route.useParams();

  return <ClientCreatePage companyId={companyId} />;
}

export const Route = createFileRoute(
  '/_authenticated/my-companies/clients/$companyId/add-client/',
)({
  component: AddClientPage,
  loader: ({ context, params }) => primeClients(context, params.companyId),
  pendingComponent: AccountsPending,
});
