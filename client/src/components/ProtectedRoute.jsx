// ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredAuth }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || (requiredAuth === 'worldID' && !user.worldIDVerified) || (requiredAuth === 'swap' && !user.hasSwapped)) {
    return <Navigate to="/campaigns" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;