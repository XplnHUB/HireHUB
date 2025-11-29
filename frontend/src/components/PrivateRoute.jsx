import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    // If roles are specified, check if user has required role
    // Note: Backend uses 'student' and 'recruiter' roles
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to appropriate dashboard based on role
        if (user.role === 'recruiter') return <Navigate to="/recruiter" replace />;
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default PrivateRoute;
