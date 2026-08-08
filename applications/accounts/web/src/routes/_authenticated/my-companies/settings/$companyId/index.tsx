import { createFileRoute } from '@tanstack/react-router';
import { primeCompanySettings } from '../../../../../data/loaders';
import { SettingsPage } from '../../../../../features/companies/SettingsPage';
import { AccountsPending } from '../../../../-RouteState';

function SettingsRoute() {
  const { companyId } = Route.useParams();

  return <SettingsPage companyId={companyId} />;
}

export const Route = createFileRoute(
  '/_authenticated/my-companies/settings/$companyId/',
)({
  component: SettingsRoute,
  loader: ({ context, params }) =>
    primeCompanySettings(context, params.companyId),
  pendingComponent: AccountsPending,
});
