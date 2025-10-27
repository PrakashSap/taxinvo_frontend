import React, { useState } from 'react';
import { MoreVertical, Eye, IndianRupee, CheckCircle, Clock } from 'lucide-react';
import SimplePrintInvoice from '../common/SimplePrintInvoice';

const SalesTable = ({ sales, loading, onView }) => {
    const [actionMenu, setActionMenu] = useState(null);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
        }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN');
    };

    const getStatusIcon = (status) => {
        if (status === 'paid') {
            return <CheckCircle className="h-4 w-4 text-green-500" />;
        }
        return <Clock className="h-4 w-4 text-yellow-500" />;
    };

    const getStatusText = (status) => {
        return status === 'paid' ? 'Paid' : 'Credit';
    };

    const handleActionClick = (saleId, event) => {
        event.stopPropagation();
        setActionMenu(actionMenu === saleId ? null : saleId);
    };

    const handleView = (sale, event) => {
        event.stopPropagation();
        setActionMenu(null);
        onView(sale);
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

    if (sales.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 text-center py-12">
                <IndianRupee className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No sales found</h3>
                <p className="text-gray-500">Create your first sale invoice to get started.</p>
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
                            Invoice
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Payment
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {sales.map((sale) => (
                        <tr key={sale.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{sale.invoiceNumber}</div>
                                <div className="text-sm text-gray-500">{sale.items?.length || 0} items</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                    {sale.customer?.name || sale.customerName || 'Retail Customer'}
                                </div>
                                {sale.customer?.phone && (
                                    <div className="text-sm text-gray-500">{sale.customer.phone}</div>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(sale.invoiceDate)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-semibold text-gray-900 flex items-center">
                                    <IndianRupee className="h-3 w-3 mr-1" />
                                    {formatCurrency(sale.grandTotal)}
                                </div>
                                <div className="text-xs text-gray-500">
                                    Tax: {formatCurrency((sale.totalCgst || 0) + (sale.totalSgst || 0))}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    {getStatusIcon(sale.paymentStatus)}
                                    <span className="ml-2 text-sm text-gray-900">
                      {getStatusText(sale.paymentStatus)}
                    </span>
                                    <span className="ml-2 text-xs text-gray-500 capitalize">
                      ({sale.paymentMethod})
                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex justify-end space-x-2">
                                    <SimplePrintInvoice
                                        invoiceData={sale}
                                        type="sale"
                                        buttonText="Print"
                                        className="text-xs"
                                    />
                                    <button
                                        onClick={(e) => handleActionClick(sale.id, e)}
                                        className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full p-1"
                                    >
                                        <MoreVertical className="h-5 w-5" />
                                    </button>

                                    {actionMenu === sale.id && (
                                        <div className="absolute right-0 top-12 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                            <div className="py-1">
                                                <button
                                                    onClick={(e) => handleView(sale, e)}
                                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                                >
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    View Details
                                                </button>
                                                <div className="px-4 py-2">
                                                    <SimplePrintInvoice
                                                        invoiceData={sale}
                                                        type="sale"
                                                        buttonText="Print Invoice"
                                                        variant="outline"
                                                        className="w-full justify-start text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SalesTable;