import React, { createContext, useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import { getToken, removeToken, setToken } from '../utils/auth';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem('evenflow_user');
            return savedUser ? JSON.parse(savedUser) : null;
        } catch (error) {
            console.error('Error parsing saved user:', error);
            localStorage.removeItem('evenflow_user');
            return null;
        }
    });

    useEffect(() => {
        const hydrateUser = async () => {
            const token = getToken();

            if (!token) {
                setUser(null);
                localStorage.removeItem('evenflow_user');
                setLoading(false);
                return;
            }

            try {
                const { data } = await api.get('/auth/me');
                setUser(data.user);
                localStorage.setItem('evenflow_user', JSON.stringify(data.user));
            } catch (error) {
                removeToken();
                localStorage.removeItem('evenflow_user');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        hydrateUser();
    }, []);

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', {
            email,
            password
        });

        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('evenflow_user', JSON.stringify(data.user));

        return data.user;
    };

    const register = async (userData) => {
        const { data } = await api.post('/auth/register', userData);

        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('evenflow_user', JSON.stringify(data.user));

        return data.user;
    };

    const logout = () => {
        setUser(null);
        removeToken();
        localStorage.removeItem('evenflow_user');
    };

    const value = {
        user,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!user
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
