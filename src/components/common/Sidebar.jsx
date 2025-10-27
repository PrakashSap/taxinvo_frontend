// components/common/SideBar.jsx
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Truck
} from 'lucide-react';

const SideBar = () => {
    const location = useLocation();

    const navigation = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'Products', href: '/products', icon: Package },
        { name: 'Sales', href: '/sales', icon: ShoppingCart },
        { name: 'Customers', href: '/customers', icon: Users },
        { name: 'Purchases', href: '/purchases', icon: Truck },
    ];

    const isActive = (href) => {
        if (href === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(href);
    };

    return (
        <div className="w-64 bg-white shadow-lg h-full flex flex-col">
            {/* Logo */}
            <div className="flex items-center p-4 border-b border-gray-200">
                {/*<div className="bg-primary-600 p-2 rounded-lg">*/}
                {/*    /!*<LayoutDashboard className="h-6 w-6 text-white" />*!/*/}
                {/*</div>*/}
                <div className="ml-3">
                    <h1 className="text-lg font-semibold text-gray-900">
                        Sri DhanaLakshmi Trader
                    </h1>
                    <p className="text-xs text-gray-500">Fertilizer Store</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
                {navigation.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                        <NavLink
                            key={item.name}
                            to={item.href}
                            className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                active
                                    ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        >
                            <Icon className={`h-5 w-5 mr-3 ${
                                active ? 'text-primary-600' : 'text-gray-400'
                            }`} />
                            {item.name}
                        </NavLink>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
                <div className="text-xs text-gray-500 text-center">
                    © 2025 Taxinvo. All rights reserved.
                </div>
            </div>
        </div>
    );
};

export default SideBar;