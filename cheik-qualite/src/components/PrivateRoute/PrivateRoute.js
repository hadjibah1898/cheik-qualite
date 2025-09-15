import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.js';

const PrivateRoute = () => {
    const { user, permissions, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        // While the context is loading user and permissions, show a loading indicator
        // or a blank screen to prevent redirects before the state is known.
        return <div>Chargement...</div>; // Or a spinner component
    }

    if (!user) {
        // User is not logged in, redirect to login page
        // Pass the current location so we can redirect back after login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Admins have access to all routes
    if (user.role === 'admin') {
        return <Outlet />;
    }

    // For other roles, check if the current path is in their list of allowed routes
    if (permissions.includes(location.pathname)) {
        return <Outlet />;
    }

    // If the user is logged in but doesn't have permission for the route
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
};

export default PrivateRoute;