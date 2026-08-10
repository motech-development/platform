import { createFileRoute } from '@tanstack/react-router';
import { primeClient } from '../../../../../../../data/loaders';
import { ClientEditPage } from '../../../../../../../features/clients/ClientEditPage';
import { AccountsPending } from '../../../../../../-RouteState';

function EditClientPage() {
  const { clientId, companyId } = Route.useParams();

  return <ClientEditPage clientId={clientId} companyId={companyId} />;
}

export const Route = createFileRoute(
  '/_authenticated/my-companies/clients/$companyId/update-details/$clientId/',
)({
  component: EditClientPage,
  loader: ({ context, params }) =>
    primeClient(context, params.companyId, params.clientId),
  pendingComponent: AccountsPending,
});
