import React from 'react';
import { IndianRupee, Calendar, Truck, Package } from 'lucide-react';
import Modal from '../common/Modal';
import SimplePrintInvoice from '../common/SimplePrintInvoice';

const PurchaseDetails = ({ purchase, isOpen, onClose }) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2,
        }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    // Calculate GST breakdown for display
    const calculateGstPercentage = () => {
        if (!purchase.totalAmount || purchase.totalAmount === 0) return { cgst: 0, sgst: 0 };

        const totalGst = (purchase.totalCgst || 0) + (purchase.totalSgst || 0);
        const gstRate = (totalGst / purchase.totalAmount) * 100;

        return {
            cgst: (gstRate / 2).toFixed(1),
            sgst: (gstRate / 2).toFixed(1)
        };
    };

    const gstPercentages = calculateGstPercentage();

    if (!purchase) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Purchase Order Details"
            size="lg"
        >
            <div className="space-y-6">
                {/* Header Info */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <div>
                            <p className="text-sm font-medium text-gray-500">Invoice Date</p>
                            <p className="text-sm text-gray-900">{formatDate(purchase.invoiceDate)}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Truck className="h-5 w-5 text-gray-400" />
                        <div>
                            <p className="text-sm font-medium text-gray-500">Supplier</p>
                            <p className="text-sm text-gray-900">{purchase.supplierName}</p>
                        </div>
                    </div>
                </div>

                {/* Supplier Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                        <Truck className="h-5 w-5 text-gray-400" />
                        <h3 className="text-lg font-medium text-gray-900">Supplier Information</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Name</p>
                            <p className="text-sm text-gray-900">{purchase.supplierName}</p>
                        </div>
                        {purchase.supplierGstin && (
                            <div>
                                <p className="text-sm font-medium text-gray-500">GSTIN</p>
                                <p className="text-sm text-gray-900">{purchase.supplierGstin}</p>
                            </div>
                        )}
                        <div className="sm:col-span-2">
                            <p className="text-sm font-medium text-gray-500">Invoice Number</p>
                            <p className="text-sm text-gray-900">{purchase.invoiceNumber}</p>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Purchase Items</h3>
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Batch No</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate (incl. GST)</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount (incl. GST)</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            {purchase.items?.map((item, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-3">
                                        <div>
                                            <p className="font-medium text-gray-900">{item.product?.name}</p>
                                            <p className="text-sm text-gray-500">
                                                {item.product?.hsnCode} • GST: {item.product?.gstRate}%
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-900">
                                        {item.batchNumber || '-'}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-900">
                                        {formatDate(item.expiryDate)}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-900">{item.quantity}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(item.rate)}</td>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                        {formatCurrency(item.rate * item.quantity)}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Totals */}
                <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Purchase Summary</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal (excl. GST):</span>
                            <span className="font-medium">{formatCurrency(purchase.totalAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">CGST ({gstPercentages.cgst}%):</span>
                            <span className="font-medium">{formatCurrency(purchase.totalCgst)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">SGST ({gstPercentages.sgst}%):</span>
                            <span className="font-medium">{formatCurrency(purchase.totalSgst)}</span>
                        </div>
                        <div className="flex justify-between border-t border-gray-300 pt-2">
                            <span className="text-lg font-semibold">Grand Total (incl. GST):</span>
                            <span className="text-lg font-semibold flex items-center">
                                <IndianRupee className="h-4 w-4 mr-1" />
                                {formatCurrency(purchase.grandTotal)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Stock Impact */}
                <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                        <Package className="h-5 w-5 text-blue-600" />
                        <h3 className="text-lg font-medium text-blue-900">Stock Impact</h3>
                    </div>
                    <div className="text-sm text-blue-700">
                        <p>This purchase has increased your inventory stock levels.</p>
                        <p className="mt-1">
                            Total items received: <strong>{purchase.items?.length || 0}</strong> products •
                            Total quantity: <strong>{purchase.items?.reduce((sum, item) => sum + item.quantity, 0) || 0}</strong> units
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <SimplePrintInvoice
                        invoiceData={purchase}
                        type="purchase"
                        buttonText="Print Invoice"
                    />
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

export default PurchaseDetails;