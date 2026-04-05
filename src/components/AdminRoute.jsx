import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const { isLoggedIn, user } = useAuth();

  if (isLoggedIn && user?.role === 'admin') {
    return <Outlet />; 
  }
  if (isLoggedIn && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return <Navigate to="/login" replace />;
};

export default AdminRoute;