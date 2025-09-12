import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Correct import for jwt-decode

const PrivateRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');
  let isAuthenticated = false;
  let userRole = null;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
      } else {
        isAuthenticated = true;
        userRole = decodedToken.role; // Assuming the role is stored in the token payload
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      // Token is invalid, treat as unauthenticated
      localStorage.removeItem('token');
    }
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // User is authenticated but does not have the required role
    return <Navigate to="/unauthorized" />; // Redirect to an unauthorized page
  }

  return <Outlet />;
};

export default PrivateRoute;
