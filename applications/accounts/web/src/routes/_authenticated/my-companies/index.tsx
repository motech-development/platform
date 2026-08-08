import { createFileRoute } from '@tanstack/react-router';
import { primeCompanies } from '../../../data/loaders';
import { CompaniesPageContent } from '../../../features/companies/CompaniesPageContent';
import { AccountsPending } from '../../-RouteState';

export const Route = createFileRoute('/_authenticated/my-companies/')({
  component: CompaniesPageContent,
  loader: ({ context }) => primeCompanies(context),
  pendingComponent: AccountsPending,
});
