import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const USER_KEY = 'umca_auth_user';
const TOKEN_KEY = 'umca_auth_token';

const readSavedUser = () => {
    try {
        const saved = localStorage.getItem(USER_KEY);
        const token = localStorage.getItem(TOKEN_KEY);
        if (!saved || !token) return null;
        // Drop sessions that have already expired
        const payload = JSON.parse(atob(token.split('.')[0].replace(/-/g, '+').replace(/_/g, '/')));
        if (!payload.exp || payload.exp < Date.now()) {
            localStorage.removeItem(USER_KEY);
            localStorage.removeItem(TOKEN_KEY);
            return null;
        }
        return JSON.parse(saved);
    } catch (e) {
        console.error("Failed to load saved session", e);
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(readSavedUser);

    // Credentials are checked on the server; passwords never ship to the browser.
    const login = async (usernameOrEmail, password) => {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: usernameOrEmail.trim(), password })
            });
            const isJson = (response.headers.get('content-type') || '').includes('application/json');
            const data = isJson ? await response.json() : null;

            if (response.ok && data && data.token && data.user) {
                localStorage.setItem(TOKEN_KEY, data.token);
                localStorage.setItem(USER_KEY, JSON.stringify(data.user));
                setUser(data.user);
                return { success: true, user: data.user };
            }
            if (!isJson) {
                return { success: false, error: 'The login service is not available right now. Please try again later.' };
            }
            return { success: false, error: (data && data.error) || 'Invalid credentials. Please check your username and password.' };
        } catch (e) {
            return { success: false, error: 'Could not reach the server. Check your internet connection and try again.' };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_KEY);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
