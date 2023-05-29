import { ProtectedRoute } from '@motech-development/auth';
import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const MyCompanies = lazy(() => import('./MyCompanies'));
const LogIn = lazy(() => import('./LogIn'));
const NotFound = lazy(() => import('./NotFound'));

function Pages() {
  return (
    <Routes>
      <Route index element={<LogIn />} />
      <Route
        element={<ProtectedRoute element={<MyCompanies />} />}
        path="/my-companies/*"
      />
      <Route element={<NotFound />} path="*" />
    </Routes>
  );
}

export default Pages;
