// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, isAdmin, isBlogWriter } from '../auth';

const ProtectedRoute = ({ element: Component, adminOnly, blogWriterOnly, ...rest }) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  if (adminOnly && !isAdmin()) {
    return <Navigate to="/" />;
  }
  if (blogWriterOnly && !isBlogWriter()) {
    return <Navigate to="/" />;
  }
  
  return <Component {...rest} />;
};

export default ProtectedRoute;
