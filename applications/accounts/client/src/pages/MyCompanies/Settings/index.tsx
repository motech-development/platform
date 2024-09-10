import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const Settings = lazy(() => import('./Settings'));

function SettingsRoutes() {
  return (
    <Routes>
      <Route index element={<Settings />} />
    </Routes>
  );
}

export default SettingsRoutes;
