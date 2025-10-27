// hooks/useAuth.js
import { useState, useContext, createContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check for existing token and user data on app start
    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (token && savedUser) {
            try {
                const userData = JSON.parse(savedUser);
                setUser(userData);
                // Skip verification for now to simplify
                setLoading(false);
            } catch (e) {
                console.error('Failed to parse saved user:', e);
                clearAuthData();
            }
        } else {
            setLoading(false);
        }
    }, []);

    const clearAuthData = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const login = async (username, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authService.login({ username, password });
            console.log('Login response:', response); // Debug log

            if (response.success && response.token) {
                // Store token and user data in localStorage
                localStorage.setItem('token', response.token);

                const userData = {
                    username: response.username,
                    name: response.name,
                    role: response.role
                };

                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);

                console.log('Login successful, user state updated'); // Debug log
                return { success: true };
            } else {
                const errorMsg = response.message || 'Login failed';
                setError(errorMsg);
                return { success: false, error: errorMsg };
            }
        } catch (err) {
            console.error('Login error:', err); // Debug log
            const errorMsg = err.response?.data?.message || err.message || 'Login failed';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        clearAuthData();
        // Optional: Call logout API endpoint if you have one
        // authService.logout();
    };

    const value = {
        user,
        login,
        logout,
        loading,
        error
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};