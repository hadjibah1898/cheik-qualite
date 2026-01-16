import React, { createContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext(null);

const API_URL = 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUserProfile = useCallback(async (token) => {
        try {
            // backend exposes profile at GET /api/user
            const response = await fetch(`${API_URL}/user`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const userData = await response.json();
                setUser(userData); // Set full user profile
            } else {
                console.error("Failed to fetch user profile", response.status, response.statusText);
                setUser(null);
                localStorage.removeItem('token');
            }
        } catch (error) {
            console.error("Error fetching user profile", error);
            setUser(null);
            localStorage.removeItem('token');
        }
    }, []);

    const fetchPermissions = useCallback(async (token) => {
        try {
            const response = await fetch(`${API_URL}/auth/me/permissions`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setPermissions(data.allowedRoutes || []);
            } else {
                setPermissions([]);
            }
        } catch (error) {
            console.error("Could not fetch permissions", error);
            setPermissions([]); // Default to no permissions on error
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 > Date.now()) {
                    // Fetch full user profile and permissions
                    fetchUserProfile(token);
                    fetchPermissions(token);
                } else {
                    localStorage.removeItem('token');
                    setLoading(false);
                }
            } catch (e) {
                console.error("Invalid token on initial load");
                localStorage.removeItem('token');
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, [fetchUserProfile, fetchPermissions]);

    const login = (token) => {
        setLoading(true);
        localStorage.setItem('token', token);
        // Fetch full user profile and permissions after login
        fetchUserProfile(token);
        fetchPermissions(token);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setPermissions([]);
    };

    const authContextValue = {
        user,
        permissions,
        loading,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
