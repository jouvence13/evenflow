import React, { createContext, useState, useContext } from 'react';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [loading] = useState(false);
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

    const login = (email, password) => {
        const mockUser = {
            id: 'user-001',
            email,
            name: 'John Doe',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
            role: 'admin', // Par défaut pour démo
            tickets: 3,
            favorites: ['event-001']
        };

        setUser(mockUser);
        localStorage.setItem('evenflow_user', JSON.stringify(mockUser));
        return Promise.resolve(mockUser);
    };

    const register = (userData) => {
        const newUser = {
            id: `user-${Date.now()}`,
            ...userData,
            role: 'user',
            tickets: 0,
            favorites: []
        };

        setUser(newUser);
        localStorage.setItem('evenflow_user', JSON.stringify(newUser));
        return Promise.resolve(newUser);
    };

    const logout = () => {
        setUser(null);
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
