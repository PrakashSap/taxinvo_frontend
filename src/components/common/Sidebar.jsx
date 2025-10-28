// components/common/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Truck,
    CreditCard,
    IndianRupee,
    X
} from 'lucide-react';

const SideBar = ({ currentPath, onClose }) => {
    const navigation = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard, exact: true },
        { name: 'Products', href: '/products', icon: Package },
        { name: 'Sales', href: '/sales', icon: ShoppingCart },
        { name: 'Customers', href: '/customers', icon: Users },
        { name: 'Purchases', href: '/purchases', icon: Truck },
        { name: 'Credit Tracking', href: '/credit-tracking', icon: CreditCard },
        { name: 'Payments', href: '/payments', icon: IndianRupee },
    ];

    return (
        <div className="flex flex-col w-64 bg-white border-r border-gray-200 h-full">
            {/* Close button for mobile */}
            {onClose && (
                <div className="flex items-center justify-between p-4 border-b border-gray-200 md:hidden">
                    <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 px-4 py-4 space-y-1">
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
                                `group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                                    (item.exact ? currentPath === item.href : navIsActive)
                                        ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-700'
                                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                }`
                            }
                            onClick={onClose} // Close sidebar on mobile when item is clicked
                        >
                            <Icon
                                className={`mr-3 h-5 w-5 ${
                                    (item.exact ? currentPath === item.href : currentPath.startsWith(item.href))
                                        ? 'text-primary-700'
                                        : 'text-gray-400 group-hover:text-gray-500'
                                }`}
                            />
                            {item.name}
                        </NavLink>
                    );
                })}
            </nav>
        </div>
    );
};

export default SideBar;