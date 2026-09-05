import { useAuth0 } from '@auth0/auth0-react';
import { lazy } from 'react';
import { Route, Routes, useParams } from 'react-router-dom';
import TransactionUpdates from '../../../components/TransactionUpdates';
import invariant from '../../../utils/invariant';

const Accounts = lazy(() => import('./Accounts'));
const PendingTransactions = lazy(() => import('./PendingTransactions'));
const RecordTransaction = lazy(() => import('./RecordTransaction'));
const ViewTransaction = lazy(() => import('./ViewTransaction'));

function AccountsRoutes() {
  const { companyId } = useParams();
  const { user } = useAuth0();
  const owner = user?.sub;
  invariant(companyId);
  invariant(owner);

  return (
    <TransactionUpdates
      key={`${owner}:${companyId}`}
      companyId={companyId}
      owner={owner}
    >
      <Routes>
        <Route index element={<Accounts />} />
        <Route element={<PendingTransactions />} path="pending-transactions" />
        <Route element={<RecordTransaction />} path="record-transaction" />
        <Route
          element={<ViewTransaction />}
          path="view-transaction/:transactionId"
        />
      </Routes>
    </TransactionUpdates>
  );
}

export default AccountsRoutes;
