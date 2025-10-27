import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Printer } from 'lucide-react';
import Button from './Button';

const PrintInvoice = ({
                          invoiceData,
                          type = 'sale',
                          buttonText = 'Print Invoice',
                          className = '',
                          variant = 'outline'
                      }) => {
    const componentRef = useRef();

    // Invoice content component
    const InvoiceContent = () => {
        const formatDate = (dateString) => {
            return new Date(dateString).toLocaleDateString('en-IN');
        };

        const formatCurrency = (amount) => {
            return new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                minimumFractionDigits: 2,
            }).format(amount || 0);
        };

        return (
            <div className="p-6 bg-white">
                {/* Sale Invoice Template */}
                {type === 'sale' && (
                    <div className="max-w-4xl mx-auto font-inter text-sm">
                        {/* Header */}
                        <div className="border-b-2 border-gray-800 pb-4 mb-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">TAX INVOICE</h1>
                                    <p className="text-gray-600 font-semibold">Sri Dhanalakshmi Trader</p>
                                    <p className="text-gray-600">#216, Opp: KEB, Triveninagar</p>
                                    <p className="text-gray-600">Mysore-T.Narasipura Main Road, T.Narasipura - 571124</p>
                                    <p className="text-gray-600">GSTIN: 29AAJFD2218GIZK</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-semibold">Invoice: {invoiceData.invoiceNumber}</p>
                                    <p className="text-sm">Date: {formatDate(invoiceData.invoiceDate)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Customer Details */}
                        <div className="grid grid-cols-2 gap-8 mb-6">
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Bill To:</h3>
                                <p className="text-sm">{invoiceData.customer?.name || invoiceData.customerName || 'Retail Customer'}</p>
                                {invoiceData.customer?.address && (
                                    <p className="text-sm">{invoiceData.customer.address}</p>
                                )}
                                {invoiceData.customer?.gstin && (
                                    <p className="text-sm">GSTIN: {invoiceData.customer.gstin}</p>
                                )}
                                {invoiceData.customerPhone && (
                                    <p className="text-sm">Phone: {invoiceData.customerPhone}</p>
                                )}
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Payment Details:</h3>
                                <p className="text-sm">Method: {invoiceData.paymentMethod?.toUpperCase()}</p>
                                <p className="text-sm">Status: {invoiceData.paymentStatus?.toUpperCase()}</p>
                            </div>
                        </div>

                        {/* Items Table */}
                        <table className="w-full border-collapse border border-gray-300 mb-6">
                            <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Product</th>
                                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">HSN</th>
                                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Qty</th>
                                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Rate</th>
                                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">GST %</th>
                                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Amount</th>
                            </tr>
                            </thead>
                            <tbody>
                            {invoiceData.items?.map((item, index) => (
                                <tr key={index}>
                                    <td className="border border-gray-300 px-3 py-2 text-sm">{item.product?.name}</td>
                                    <td className="border border-gray-300 px-3 py-2 text-sm">{item.product?.hsnCode || '-'}</td>
                                    <td className="border border-gray-300 px-3 py-2 text-sm">{item.quantity}</td>
                                    <td className="border border-gray-300 px-3 py-2 text-sm">{formatCurrency(item.rate)}</td>
                                    <td className="border border-gray-300 px-3 py-2 text-sm">{item.cgstRate}%</td>
                                    <td className="border border-gray-300 px-3 py-2 text-sm">{formatCurrency(item.totalAmount)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        {/* Totals */}
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <p className="text-sm italic">Above said items are only for agricultural purpose</p>
                                <p className="text-sm italic mt-2">Goods once sold cannot be taken back or exchanged</p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="font-semibold">Subtotal:</span>
                                    <span>{formatCurrency(invoiceData.totalAmount)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>CGST:</span>
                                    <span>{formatCurrency(invoiceData.totalCgst)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>SGST:</span>
                                    <span>{formatCurrency(invoiceData.totalSgst)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Round Off:</span>
                                    <span>{formatCurrency(invoiceData.roundOff)}</span>
                                </div>
                                <div className="flex justify-between border-t border-gray-300 pt-2 font-semibold">
                                    <span>Grand Total:</span>
                                    <span>{formatCurrency(invoiceData.grandTotal)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-8 pt-4 border-t border-gray-300">
                            <div className="flex justify-between">
                                <div className="text-center">
                                    <p className="text-sm font-semibold mb-12">Customer Signature</p>
                                    <p className="text-xs text-gray-600">Date: ________________</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-semibold mb-12">Authorized Signature</p>
                                    <p className="text-xs text-gray-600">For Sri Dhanalakshmi Trader</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `${type === 'sale' ? 'Tax' : 'Purchase'} Invoice - ${invoiceData.invoiceNumber}`,
    });

    // Don't render if no invoice data
    if (!invoiceData) {
        return null;
    }

    return (
        <>
            <Button
                variant={variant}
                onClick={handlePrint}
                className={`flex items-center gap-2 ${className}`}
            >
                <Printer className="h-4 w-4" />
                {buttonText}
            </Button>

            {/* Hidden content for printing */}
            <div style={{ display: 'none' }}>
                <div ref={componentRef}>
                    <InvoiceContent />
                </div>
            </div>
        </>
    );
};

export default PrintInvoice;