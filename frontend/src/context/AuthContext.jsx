import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('hb_access_token');
        const savedUser = localStorage.getItem('hb_user');

        if (token && savedUser) {
            try {
                const decoded = jwtDecode(token);
                // Check if token is expired
                if (decoded.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    setUser(JSON.parse(savedUser));
                }
            } catch (error) {
                logout();
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password, role) => {
        try {
            const response = await api.post('/auth/login', { email, passwordHash: password, role }); // Backend expects passwordHash and role
            const { accessToken, refreshToken, user } = response.data;

            localStorage.setItem('hb_access_token', accessToken);
            localStorage.setItem('hb_refresh_token', refreshToken);
            localStorage.setItem('hb_user', JSON.stringify(user));

            setUser(user);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const register = async (userData, role) => {
        try {
            // Ensure password is sent as passwordHash to match backend expectation
            const payload = { ...userData, passwordHash: userData.password, role };
            delete payload.password;

            const response = await api.post('/auth/register', payload);
            const { accessToken, refreshToken, user } = response.data;

            localStorage.setItem('hb_access_token', accessToken);
            localStorage.setItem('hb_refresh_token', refreshToken);
            localStorage.setItem('hb_user', JSON.stringify(user));

            setUser(user);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('hb_access_token');
        localStorage.removeItem('hb_refresh_token');
        localStorage.removeItem('hb_user');
        setUser(null);
        window.location.href = '/auth';
    };

    const value = {
        user,
        login,
        register,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
