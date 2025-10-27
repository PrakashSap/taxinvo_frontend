import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    Receipt,
    Users,
    ShoppingCart,
    Home
} from 'lucide-react';

const BottomNav = ({ currentPath }) => {
    const navigation = [
        { name: 'Home', href: '/', icon: Home, exact: true },
        { name: 'Products', href: '/products', icon: Package },
        { name: 'Sales', href: '/sales', icon: Receipt },
        { name: 'Customers', href: '/customers', icon: Users },
        { name: 'Purchases', href: '/purchases', icon: ShoppingCart },
    ];

    return (
        <nav className="mobile-bottom-nav bg-white border-t border-gray-200 shadow-lg">
            <div className="flex justify-around items-center h-16">
                {navigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.exact
                        ? currentPath === item.href
                        : currentPath.startsWith(item.href);

                    return (
                        <NavLink
                            key={item.name}
                            to={item.href}
                            className={({ isActive: navIsActive }) =>
                                `flex flex-col items-center justify-center flex-1 min-w-0 px-2 py-1 touch-target ${
                                    (item.exact ? currentPath === item.href : navIsActive)
                                        ? 'text-primary-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`
                            }
                        >
                            <Icon className="h-6 w-6 mb-1" />
                            <span className="text-xs font-medium truncate max-w-full">
                {item.name}
              </span>
                            {(item.exact ? currentPath === item.href : currentPath.startsWith(item.href)) && (
                                <div className="w-1 h-1 bg-primary-600 rounded-full mt-1"></div>
                            )}
                        </NavLink>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNav;