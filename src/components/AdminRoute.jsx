import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <div className="container">Checking access…</div>;

  if (isAuthenticated && user?.role === 'admin') {
    return <Outlet />; 
  }
  if (isAuthenticated && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return <Navigate to="/login" replace />;
};

export default AdminRoute;
