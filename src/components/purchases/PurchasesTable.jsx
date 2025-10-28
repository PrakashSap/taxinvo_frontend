import React, { useState, useRef } from 'react';
import { MoreVertical, Eye, IndianRupee, Truck } from 'lucide-react';
import SimplePrintInvoice from '../common/SimplePrintInvoice';

const PurchasesTable = ({ purchases, loading, onView }) => {
    const [actionMenu, setActionMenu] = useState(null);
    const actionRefs = useRef({});

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

    const handleActionClick = (purchaseId, event) => {
        event?.stopPropagation();
        setActionMenu(actionMenu === purchaseId ? null : purchaseId);
    };

    const handleView = (purchase, event) => {
        event?.stopPropagation();
        setActionMenu(null);
        onView(purchase);
    };

    const handlePrint = (purchase) => {
        setActionMenu(null);
        // Print functionality is handled by SimplePrintInvoice component
    };

    // Close menu when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (actionMenu && !event.target.closest('.action-menu-container')) {
                setActionMenu(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [actionMenu]);

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

    if (purchases.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 text-center py-12">
                <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No purchases found</h3>
                <p className="text-gray-500">Create your first purchase order to get started.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Invoice
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Supplier
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Items
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {purchases.map((purchase) => (
                        <tr key={purchase.id} className="hover:bg-gray-50 relative">
                            <td className="px-4 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{purchase.invoiceNumber}</div>
                                {purchase.supplierGstin && (
                                    <div className="text-sm text-gray-500">GSTIN: {purchase.supplierGstin}</div>
                                )}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{purchase.supplierName}</div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(purchase.invoiceDate)}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{purchase.items?.length || 0} items</div>
                                <div className="text-xs text-gray-500">
                                    Total Qty: {purchase.items?.reduce((sum, item) => sum + item.quantity, 0) || 0}
                                </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                                <div className="text-sm font-semibold text-gray-900 flex items-center">
                                    <IndianRupee className="h-3 w-3 mr-1" />
                                    {formatCurrency(purchase.grandTotal)}
                                </div>
                                <div className="text-xs text-gray-500">
                                    Tax: {formatCurrency((purchase.totalCgst || 0) + (purchase.totalSgst || 0))}
                                </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex justify-end space-x-2 action-menu-container relative">
                                    <SimplePrintInvoice
                                        invoiceData={purchase}
                                        type="purchase"
                                        buttonText="Print"
                                        className="text-xs"
                                    />
                                    <button
                                        onClick={(e) => handleActionClick(purchase.id, e)}
                                        className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full p-1"
                                    >
                                        <MoreVertical className="h-5 w-5" />
                                    </button>

                                    {actionMenu === purchase.id && (
                                        <div className="absolute right-0 top-full mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                                            <div className="py-1">
                                                <button
                                                    onClick={(e) => handleView(purchase, e)}
                                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                                >
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    View Details
                                                </button>
                                                <div className="border-t border-gray-100">
                                                    <SimplePrintInvoice
                                                        invoiceData={purchase}
                                                        type="purchase"
                                                        buttonText="Print Invoice"
                                                        variant="ghost"
                                                        className="w-full justify-start text-sm hover:bg-gray-100"
                                                        onPrintStart={() => handlePrint(purchase)}
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

export default PurchasesTable;