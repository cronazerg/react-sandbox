import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DocumentList from './pages/DocumentList';
import AdminDashboard from './pages/AdminDashboard';
import UnauthorizedPage from './pages/UnauthorizedPage';
import PrivateRoute from './components/PrivateRoute';

export enum RoutesEnum {
  LOGIN = '/login',
  DOCS = '/docs',
  ADMIN_DASHBOARD = '/admin',
}

export const router = createBrowserRouter([
  {
    path: RoutesEnum.LOGIN,
    element: <LoginPage />,
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        path: RoutesEnum.DOCS,
        element: <DocumentList />,
      },
      {
        path: RoutesEnum.ADMIN_DASHBOARD,
        element: (
          <PrivateRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: '/unauthorized',
    element: <UnauthorizedPage />,
  },
  {
    path: '/',
    element: <Navigate to={RoutesEnum.LOGIN} replace />,
  },
]);
