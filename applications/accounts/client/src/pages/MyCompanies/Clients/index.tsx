import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const AddClient = lazy(() => import('./AddClient'));
const Clients = lazy(() => import('./Clients'));
const UpdateDetails = lazy(() => import('./UpdateDetails'));

function ClientsRoutes() {
  return (
    <Routes>
      <Route element={<Clients />} path="/" />
      <Route element={<AddClient />} path="add-client" />
      <Route element={<UpdateDetails />} path="update-details/:clientId" />
    </Routes>
  );
}

export default ClientsRoutes;
