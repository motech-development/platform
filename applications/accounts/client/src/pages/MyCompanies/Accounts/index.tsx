import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const Accounts = lazy(() => import('./Accounts'));
const PendingTransactions = lazy(() => import('./PendingTransactions'));
const RecordTransaction = lazy(() => import('./RecordTransaction'));
const ViewTransaction = lazy(() => import('./ViewTransaction'));

function AccountsRoutes() {
  return (
    <Routes>
      <Route element={<Accounts />} path="/" />
      <Route element={<PendingTransactions />} path="pending-transactions" />
      <Route element={<RecordTransaction />} path="record-transaction" />
      <Route
        element={<ViewTransaction />}
        path="view-transaction/:transactionId"
      />
    </Routes>
  );
}

export default AccountsRoutes;
