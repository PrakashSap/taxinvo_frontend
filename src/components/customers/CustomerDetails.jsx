import React from 'react';
import { User, Phone, MapPin, CreditCard, Calendar, IndianRupee } from 'lucide-react';
import Modal from '../common/Modal';

const CustomerDetails = ({ customer, isOpen, onClose }) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
        }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const getCreditUtilization = (customer) => {
        if (customer.type !== 'sub_dealer' || customer.creditLimit === 0) return 0;
        return (customer.currentBalance / customer.creditLimit) * 100;
    };

    if (!customer) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Customer Details"
            size="lg"
        >
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="h-8 w-8 text-primary-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{customer.name}</h2>
                        <div className="flex items-center space-x-4 mt-1">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  customer.type === 'sub_dealer'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
              }`}>
                {customer.type === 'sub_dealer' ? 'Sub-dealer' : 'Retail Customer'}
              </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                customer.isActive
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                            }`}>
                {customer.isActive ? 'Active' : 'Inactive'}
              </span>
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {customer.phone && (
                            <div className="flex items-center space-x-3">
                                <Phone className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Phone</p>
                                    <p className="text-sm text-gray-900">{customer.phone}</p>
                                </div>
                            </div>
                        )}
                        {customer.gstin && (
                            <div>
                                <p className="text-sm font-medium text-gray-500">GSTIN</p>
                                <p className="text-sm text-gray-900">{customer.gstin}</p>
                            </div>
                        )}
                        {customer.address && (
                            <div className="sm:col-span-2 flex items-start space-x-3">
                                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Address</p>
                                    <p className="text-sm text-gray-900">{customer.address}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Credit Information for Sub-dealers */}
                {customer.type === 'sub_dealer' && (
                    <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center space-x-3 mb-4">
                            <CreditCard className="h-5 w-5 text-blue-600" />
                            <h3 className="text-lg font-medium text-blue-900">Credit Information</h3>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-4">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-blue-900">
                                    {formatCurrency(customer.creditLimit)}
                                </p>
                                <p className="text-sm text-blue-700">Credit Limit</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-blue-900">
                                    {formatCurrency(customer.currentBalance)}
                                </p>
                                <p className="text-sm text-blue-700">Current Balance</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-blue-900">
                                    {formatCurrency(customer.creditLimit - customer.currentBalance)}
                                </p>
                                <p className="text-sm text-blue-700">Available Credit</p>
                            </div>
                        </div>

                        {/* Credit Utilization Bar */}
                        <div className="mt-4">
                            <div className="flex justify-between text-sm text-blue-700 mb-1">
                                <span>Credit Utilization</span>
                                <span>{getCreditUtilization(customer).toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-blue-200 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full ${
                                        getCreditUtilization(customer) > 90
                                            ? 'bg-red-500'
                                            : getCreditUtilization(customer) > 70
                                                ? 'bg-yellow-500'
                                                : 'bg-green-500'
                                    }`}
                                    style={{ width: `${Math.min(getCreditUtilization(customer), 100)}%` }}
                                ></div>
                            </div>
                            {customer.currentBalance > customer.creditLimit && (
                                <p className="text-sm text-red-600 mt-2 flex items-center">
                                    ⚠️ Credit limit exceeded by {formatCurrency(customer.currentBalance - customer.creditLimit)}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Customer Statistics */}
                <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Statistics</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-gray-900">
                                {formatDate(customer.createdAt)}
                            </p>
                            <p className="text-sm text-gray-500">Member Since</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-gray-900">
                                {formatDate(customer.updatedAt)}
                            </p>
                            <p className="text-sm text-gray-500">Last Updated</p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default CustomerDetails;