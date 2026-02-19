import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const DashboardRedirect = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'ORGANIZER') {
    return <Navigate to="/dashboard/organizer" replace />;
  }

  return <Navigate to="/dashboard/buyer" replace />;
};

export default DashboardRedirect;
