import React from 'react';
import { IndianRupee, Calendar, User, CreditCard } from 'lucide-react';
import Modal from '../common/Modal';
import PrintInvoice from '../common/PrintInvoice';

const SaleDetails = ({ sale, isOpen, onClose }) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2,
        }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    if (!sale) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Sale Invoice Details"
            size="lg"
        >
            <div className="space-y-6">
                {/* Header Info */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <div>
                            <p className="text-sm font-medium text-gray-500">Invoice Date</p>
                            <p className="text-sm text-gray-900">{formatDate(sale.invoiceDate)}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <CreditCard className="h-5 w-5 text-gray-400" />
                        <div>
                            <p className="text-sm font-medium text-gray-500">Payment</p>
                            <p className="text-sm text-gray-900 capitalize">
                                {sale.paymentMethod} • {sale.paymentStatus}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Customer Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                        <User className="h-5 w-5 text-gray-400" />
                        <h3 className="text-lg font-medium text-gray-900">Customer Information</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Name</p>
                            <p className="text-sm text-gray-900">
                                {sale.customer?.name || sale.customerName || 'Retail Customer'}
                            </p>
                        </div>
                        {sale.customer?.phone && (
                            <div>
                                <p className="text-sm font-medium text-gray-500">Phone</p>
                                <p className="text-sm text-gray-900">{sale.customer.phone}</p>
                            </div>
                        )}
                        {sale.customer?.gstin && (
                            <div className="sm:col-span-2">
                                <p className="text-sm font-medium text-gray-500">GSTIN</p>
                                <p className="text-sm text-gray-900">{sale.customer.gstin}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Items Table */}
                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Items</h3>
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">GST</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            {sale.items?.map((item, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-3">
                                        <div>
                                            <p className="font-medium text-gray-900">{item.product?.name}</p>
                                            <p className="text-sm text-gray-500">{item.product?.hsnCode}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-900">{item.quantity}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(item.rate)}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500">{item.cgstRate}%</td>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                        {formatCurrency(item.totalAmount)}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Totals */}
                <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Invoice Summary</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal:</span>
                            <span className="font-medium">{formatCurrency(sale.totalAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">CGST:</span>
                            <span className="font-medium">{formatCurrency(sale.totalCgst)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">SGST:</span>
                            <span className="font-medium">{formatCurrency(sale.totalSgst)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Round Off:</span>
                            <span className="font-medium">{formatCurrency(sale.roundOff)}</span>
                        </div>
                        <div className="flex justify-between border-t border-gray-300 pt-2">
                            <span className="text-lg font-semibold">Grand Total:</span>
                            <span className="text-lg font-semibold flex items-center">
                <IndianRupee className="h-4 w-4 mr-1" />
                                {formatCurrency(sale.grandTotal)}
              </span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <PrintInvoice
                        invoiceData={sale}
                        type="sale"
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

export default SaleDetails;