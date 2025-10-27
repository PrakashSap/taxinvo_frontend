import React from 'react';
import { Menu, Bell, User, Home, ArrowLeft, LogOut, ReceiptIndianRupee } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Header = ({ onMenuToggle, onBack, isMobile, currentPath }) => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    // Get page title based on current path
    const getPageTitle = () => {
        const titles = {
            '/': 'Dashboard',
            '/products': 'Products',
            '/sales': 'Sales',
            '/customers': 'Customers',
            '/purchases': 'Purchases',
        };

        // Handle nested routes
        if (currentPath.startsWith('/sales/')) return 'Sale Details';
        if (currentPath.startsWith('/products/')) return 'Product Details';
        if (currentPath.startsWith('/customers/')) return 'Customer Details';
        if (currentPath.startsWith('/purchases/')) return 'Purchase Details';

        return titles[currentPath] || 'TaxInvo';
    };

    const handleHomeClick = () => {
        navigate('/');
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40 safe-top">
            <div className="container-responsive">
                <div className="flex justify-between items-center h-16">
                    {/* Left Section - Logo, Back Button & Menu */}
                    <div className="flex items-center flex-1">
                        {onBack && (
                            <button
                                onClick={onBack}
                                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 touch-target mr-2"
                                aria-label="Go back"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </button>
                        )}

                        <button
                            onClick={onMenuToggle}
                            className="p-2 rounded-md text-gray-400 lg:hidden hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 touch-target"
                            aria-label="Toggle menu"
                        >
                            <Menu className="h-6 w-6" />
                        </button>

                        {/* Logo and App Name - Show on mobile when not on back button */}
                        {isMobile && (!onBack || currentPath === '/') && (
                            <div className="flex items-center ml-2">
                                <ReceiptIndianRupee
                                    className="text-primary-600"
                                    size={24}
                                />
                                <div className="ml-2">
                                    <h1 className="text-sm font-semibold text-gray-900 leading-none">
                                        Taxinvo
                                    </h1>
                                    <p className="text-xs text-gray-500 leading-none">
                                        {user?.storeName || 'Sri DhanaLakshmi Trader'}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Home button for desktop */}
                        {!isMobile && currentPath !== '/' && (
                            <button
                                onClick={handleHomeClick}
                                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 touch-target ml-2"
                                aria-label="Go to dashboard"
                            >
                                <Home className="h-5 w-5" />
                            </button>
                        )}

                        {/* Logo and App Name - Desktop (when no back button) */}
                        {!isMobile && !onBack && (
                            <div className="flex items-center ml-2">
                                <ReceiptIndianRupee
                                    className="text-primary-600"
                                    size={26}
                                />
                                <div className="ml-3">
                                    <h1 className="text-lg font-semibold text-gray-900">
                                        Taxinvo
                                    </h1>
                                    <p className="text-sm text-gray-500">
                                        {user?.storeName || 'Sri DhanaLakshmi Trader'}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Center Section - Page Title (only show when we have back button or on specific pages) */}
                    {(onBack || (isMobile && currentPath !== '/')) && (
                        <div className="flex-1 flex justify-center">
                            <div className="text-center min-w-0">
                                <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate px-2">
                                    {getPageTitle()}
                                </h1>
                                {currentPath === '/' && !isMobile && (
                                    <p className="text-sm text-gray-500 hidden sm:block">
                                        Tax Invoice Management
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Right Section - Notifications & User */}
                    <div className="flex items-center justify-end flex-1">
                        <button
                            className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 touch-target"
                            aria-label="Notifications"
                        >
                            <Bell className="h-5 w-5" />
                        </button>

                        {/* User info for mobile */}
                        {isMobile && user && (
                            <div className="flex items-center space-x-2 ml-2">
                                <div className="flex items-center space-x-1">
                                    <div className="flex items-center justify-center h-8 w-8 bg-primary-100 rounded-full">
                                        <User className="h-4 w-4 text-primary-600" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 hidden xs:block">
                                        {user.name?.split(' ')[0] || 'Admin'}
                                    </span>
                                </div>

                                {/* Logout button for mobile */}
                                <button
                                    onClick={handleLogout}
                                    className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 touch-target"
                                    aria-label="Logout"
                                >
                                    <LogOut className="h-4 w-4" />
                                </button>
                            </div>
                        )}

                        {/* User info for desktop */}
                        {!isMobile && user && (
                            <div className="flex items-center space-x-2 sm:space-x-3 ml-2">
                                <div className="flex items-center justify-center h-8 w-8 bg-primary-100 rounded-full">
                                    <User className="h-5 w-5 text-primary-600" />
                                </div>
                                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                                    {user.name}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 touch-target ml-2"
                                    aria-label="Logout"
                                >
                                    <LogOut className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;