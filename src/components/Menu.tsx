import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../store';
import { RoutesEnum } from '../router';

const roleRoutes = {
  admin: [RoutesEnum.DOCS, RoutesEnum.ADMIN_DASHBOARD],
  user: [RoutesEnum.DOCS],
};

const Menu: React.FC = () => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  if (!isAuthenticated || !user) {
    return null;
  }

  const allowedRoutes = roleRoutes[user.role as keyof typeof roleRoutes] || [];

  return (
    <nav>
      {allowedRoutes.map((route) => (
        <Link key={route} to={route} style={{ marginRight: '10px' }}>
          {route.slice(1)}
        </Link>
      ))}
    </nav>
  );
};

export default Menu;
