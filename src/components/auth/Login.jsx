// components/auth/Login.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, Store } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { user, login, loading, error } = useAuth();
    const navigate = useNavigate();
    const [showWakeupOverlay, setShowWakeupOverlay] = useState(false);

    // Redirect if user is already logged in
    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Login form submitted'); // Debug log
        // Start a fallback timer — if backend doesn’t respond in 5s, show wake-up overlay
        const wakeupTimer = setTimeout(() => {
            if (loading) setShowWakeupOverlay(true);
        }, 5000);
        const result = await login(username, password);
        console.log('Login result:', result); // Debug log
        clearTimeout(wakeupTimer);
        setShowWakeupOverlay(false);
        if (result.success) {
            console.log('Login successful, should redirect...'); // Debug log
            // The useEffect above will handle the redirect when user state updates
        } else if (result.error?.includes('waking up')) {
            // Show overlay immediately if detected from backend
            setShowWakeupOverlay(true);
            setTimeout(() => setShowWakeupOverlay(false), 15000); // Hide after 15s
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <div className="bg-primary-600 p-3 rounded-lg">
                            <Store className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Taxinvo
                    </h1>
                    <p className="text-gray-600">Fertilizer Store Management</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
                        Sign In to Your Account
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Username Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Username
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                                    placeholder="Enter your username"
                                    required
                                    autoComplete="username"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                                    placeholder="Enter your password"
                                    required
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || showWakeupOverlay}
                            className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Signing In...
                                </div>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Demo Credentials: admin / admin123
                        </p>
                    </div>
                </div>
            </div>
            {/* 💤 Server Wake-Up Overlay */}
            {showWakeupOverlay && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 shadow-xl flex flex-col items-center max-w-sm mx-auto">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mb-4"></div>
                        <p className="text-gray-800 font-medium text-center mb-2">
                            Server is waking up...
                        </p>
                        <p className="text-gray-500 text-sm text-center">
                            This may take 20–40 seconds on first use.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;