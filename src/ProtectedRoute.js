import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, isLoggedIn, ...rest }) => {
  return isLoggedIn ? (
    <Route {...rest} element={element} />
  ) : (
    <Navigate to="/connexion" replace /> // Assurez-vous que le chemin est correct
  );
};

export default ProtectedRoute;
