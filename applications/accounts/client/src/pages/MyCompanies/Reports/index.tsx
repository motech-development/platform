import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const CreateReport = lazy(() => import('./CreateReport'));
const Reports = lazy(() => import('./Reports'));

function ReportsRoutes() {
  return (
    <Routes>
      <Route element={<Reports />} path="/" />
      <Route element={<CreateReport />} path="create-report" />
    </Routes>
  );
}

export default ReportsRoutes;
