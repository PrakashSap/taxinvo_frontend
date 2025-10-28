import React, { useState } from 'react';
import { MoreVertical, Edit, Trash2, User, CreditCard, Phone, MapPin } from 'lucide-react';
import Button from '../common/Button';

const CustomersTable = ({ customers, onEdit, onDelete, onCreditDetails, loading }) => {
    const [actionMenu, setActionMenu] = useState(null);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
        }).format(amount || 0);
    };

    const getCustomerTypeBadge = (type) => {
        const styles = {
            retail: 'bg-gray-100 text-gray-800',
            sub_dealer: 'bg-blue-100 text-blue-800',
        };

        const labels = {
            retail: 'Retail',
            sub_dealer: 'Sub-dealer',
        };

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[type]}`}>
                {labels[type]}
            </span>
        );
    };

    const getCreditStatus = (customer) => {
        if (customer.type !== 'sub_dealer') return null;

        const availableCredit = customer.creditLimit - customer.currentBalance;

        if (customer.currentBalance === 0) {
            return { status: 'No Balance', color: 'text-green-600 bg-green-50' };
        } else if (availableCredit > 0) {
            return { status: 'Credit Available', color: 'text-blue-600 bg-blue-50' };
        } else {
            return { status: 'Limit Exceeded', color: 'text-red-600 bg-red-50' };
        }
    };

    const handleActionClick = (customerId, event) => {
        event.stopPropagation();
        setActionMenu(actionMenu === customerId ? null : customerId);
    };

    const handleEdit = (customer, event) => {
        event.stopPropagation();
        setActionMenu(null);
        onEdit(customer);
    };

    const handleDelete = (customer, event) => {
        event.stopPropagation();
        setActionMenu(null);
        onDelete(customer);
    };

    const handleCreditDetails = (customer, event) => {
        event.stopPropagation();
        setActionMenu(null);
        if (onCreditDetails) {
            onCreditDetails(customer);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="animate-pulse">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="p-4 border-b border-gray-200">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (customers.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 text-center py-12">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
                <p className="text-gray-500">Get started by creating your first customer.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Credit Info
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {customers.map((customer) => {
                        const creditStatus = getCreditStatus(customer);

                        return (
                            <tr key={customer.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                                            <User className="h-5 w-5 text-primary-600" />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                                            {customer.gstin && (
                                                <div className="text-sm text-gray-500">GSTIN: {customer.gstin}</div>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-900">
                                        {customer.phone && (
                                            <div className="flex items-center">
                                                <Phone className="h-3 w-3 mr-1 text-gray-400" />
                                                {customer.phone}
                                            </div>
                                        )}
                                    </div>
                                    {customer.address && (
                                        <div className="text-sm text-gray-500 mt-1 flex items-start">
                                            <MapPin className="h-3 w-3 mr-1 text-gray-400 mt-0.5 flex-shrink-0" />
                                            <span className="truncate max-w-xs">{customer.address}</span>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {getCustomerTypeBadge(customer.type)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {customer.type === 'sub_dealer' ? (
                                        <div>
                                            <div className="text-sm text-gray-900">
                                                <CreditCard className="h-3 w-3 inline mr-1" />
                                                Limit: {formatCurrency(customer.creditLimit)}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Balance: {formatCurrency(customer.currentBalance)}
                                            </div>
                                            {creditStatus && (
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1 ${creditStatus.color}`}>
                                                    {creditStatus.status}
                                                </span>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-sm text-gray-500">-</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        customer.isActive
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {customer.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                                    <div className="flex justify-end">
                                        <button
                                            onClick={(e) => handleActionClick(customer.id, e)}
                                            className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full p-1"
                                        >
                                            <MoreVertical className="h-5 w-5" />
                                        </button>

                                        {actionMenu === customer.id && (
                                            <div className="absolute right-0 top-12 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                                <div className="py-1">
                                                    <button
                                                        onClick={(e) => handleEdit(customer, e)}
                                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                                    >
                                                        <Edit className="h-4 w-4 mr-2" />
                                                        Edit Customer
                                                    </button>
                                                    <button
                                                        onClick={(e) => handleCreditDetails(customer, e)}
                                                        className="flex items-center px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 w-full text-left"
                                                    >
                                                        <CreditCard className="h-4 w-4 mr-2" />
                                                        Credit Details
                                                    </button>
                                                    <button
                                                        onClick={(e) => handleDelete(customer, e)}
                                                        className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        Delete Customer
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CustomersTable;