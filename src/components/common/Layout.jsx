// components/common/Layout.jsx
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useLocation } from 'react-router-dom';
import MobileNav from './MobileNav';
import Header from './Header';
import SideBar from "./Sidebar";

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleMenuToggle = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleBack = () => {
        // You can implement back navigation logic here if needed
        window.history.back();
    };

    // Determine if we should show back button (not on root pages)
    const shouldShowBack = !['/', '/products', '/sales', '/customers', '/purchases'].includes(location.pathname);

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Header - For both mobile and desktop */}
            <Header
                onMenuToggle={handleMenuToggle}
                onBack={shouldShowBack ? handleBack : null}
                isMobile={true}
                currentPath={location.pathname}
            />

            {/* Main content area */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar - Desktop only */}
                <div className="hidden md:flex md:flex-shrink-0">
                    <SideBar />
                </div>

                {/* Mobile Sidebar - Conditionally rendered */}
                {sidebarOpen && (
                    <div className="md:hidden fixed inset-0 z-50">
                        <div
                            className="fixed inset-0 bg-gray-600 bg-opacity-75"
                            onClick={() => setSidebarOpen(false)}
                        />
                        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
                            <SideBar />
                        </div>
                    </div>
                )}

                {/* Page content */}
                <main className="flex-1 overflow-auto pb-16 md:pb-0 pt-16 md:pt-0">
                    <div className="p-4 sm:p-6 lg:p-8">
                        {children}
                    </div>
                </main>
            </div>

            {/* Mobile Navigation - Fixed at bottom */}
            <MobileNav />
        </div>
    );
};

export default Layout;