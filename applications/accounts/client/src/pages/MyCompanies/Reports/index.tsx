import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const CreateReport = lazy(() => import('./CreateReport'));
const Reports = lazy(() => import('./Reports'));

function ReportsRoutes() {
  return (
    <Routes>
      <Route index element={<Reports />} />
      <Route element={<CreateReport />} path="create-report" />
    </Routes>
  );
}

export default ReportsRoutes;
