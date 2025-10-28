// components/common/MobileNav.jsx
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Truck,
    CreditCard,
    IndianRupee
} from 'lucide-react';

const MobileNav = () => {
    const location = useLocation();

    const navigation = [
        { name: 'Home', href: '/', icon: LayoutDashboard },
        { name: 'Products', href: '/products', icon: Package },
        { name: 'Sales', href: '/sales', icon: ShoppingCart },
        { name: 'Customers', href: '/customers', icon: Users },
        { name: 'Purchases', href: '/purchases', icon: Truck },
        { name: 'Credit', href: '/credit-tracking', icon: CreditCard },
        { name: 'Payments', href: '/payments', icon: IndianRupee },
    ];

    const isActive = (href) => {
        if (href === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(href);
    };

    return (
        <div className="mobile-nav md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
            <nav className="flex justify-around items-center py-2">
                {navigation.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                        <NavLink
                            key={item.name}
                            to={item.href}
                            className={`flex flex-col items-center py-1 px-2 flex-1 min-w-0 ${
                                active ? 'text-primary-600' : 'text-gray-500'
                            }`}
                        >
                            <div className={`p-2 rounded-lg ${
                                active ? 'bg-primary-50' : ''
                            }`}>
                                <Icon className={`h-5 w-5 ${active ? 'text-primary-600' : 'text-gray-400'}`} />
                            </div>
                            <span className="text-xs mt-1 truncate">
                                {item.name}
                            </span>
                        </NavLink>
                    );
                })}
            </nav>

            {/* Safe area for iOS */}
            <div className="h-safe-area-bottom bg-white"></div>
        </div>
    );
};

export default MobileNav;