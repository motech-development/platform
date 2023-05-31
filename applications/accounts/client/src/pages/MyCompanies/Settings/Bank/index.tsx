import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const Callback = lazy(() => import('./Callback'));
const Bank = lazy(() => import('./Bank'));
const SelectAccount = lazy(() => import('./SelectAccount'));

function BankRoutes() {
  return (
    <Routes>
      <Route element={<Callback />} path="callback" />
      <Route element={<SelectAccount />} path="select-account" />
      <Route index element={<Bank />} />
    </Routes>
  );
}

export default BankRoutes;
