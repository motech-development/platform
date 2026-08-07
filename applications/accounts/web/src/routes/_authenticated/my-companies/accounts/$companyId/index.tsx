import { createFileRoute } from '@tanstack/react-router';
import { TransactionsPageContent } from '../../../../../features/transactions/TransactionsPageContent';

function TransactionsPage() {
  const { companyId } = Route.useParams();

  return <TransactionsPageContent companyId={companyId} />;
}

export const Route = createFileRoute(
  '/_authenticated/my-companies/accounts/$companyId/',
)({
  component: TransactionsPage,
});
