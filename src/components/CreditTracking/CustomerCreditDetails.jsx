import React, { useState, useEffect } from 'react';
import { usePaymentReminders } from '../../hooks/usePaymentReminders';
import { IndianRupee, Calendar, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import Modal from '../common/Modal';

const CustomerCreditDetails = ({ customer, isOpen, onClose }) => {
    const { creditSummary, loading, getCustomerCreditSummary } = usePaymentReminders();
    const [activeTab, setActiveTab] = useState('summary');

    useEffect(() => {
        if (isOpen && customer) {
            getCustomerCreditSummary(customer.id);
        }
    }, [isOpen, customer]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
        }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    if (!customer) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Credit Details - ${customer.name}`}
            size="xl"
        >
            <div className="space-y-6">
                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('summary')}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'summary'
                                    ? 'border-primary-500 text-primary-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Credit Summary
                        </button>
                        <button
                            onClick={() => setActiveTab('invoices')}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'invoices'
                                    ? 'border-primary-500 text-primary-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Credit Invoices
                        </button>
                    </nav>
                </div>

                {loading ? (
                    <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                ) : activeTab === 'summary' ? (
                    <CreditSummaryTab creditSummary={creditSummary} formatCurrency={formatCurrency} />
                ) : (
                    <CreditInvoicesTab creditSummary={creditSummary} formatCurrency={formatCurrency} formatDate={formatDate} />
                )}

                <div className="flex justify-end pt-6 border-t border-gray-200">
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

const CreditSummaryTab = ({ creditSummary, formatCurrency }) => {
    if (!creditSummary) {
        return <div className="text-center text-gray-500 py-8">No credit data available</div>;
    }

    const creditUtilization = creditSummary.creditLimit > 0
        ? (creditSummary.currentBalance / creditSummary.creditLimit) * 100
        : 0;

    return (
        <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-900">
                        {formatCurrency(creditSummary.totalCredit)}
                    </div>
                    <div className="text-sm text-blue-700">Total Credit</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-900">
                        {formatCurrency(creditSummary.totalPaid)}
                    </div>
                    <div className="text-sm text-green-700">Total Paid</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-orange-900">
                        {formatCurrency(creditSummary.outstandingBalance)}
                    </div>
                    <div className="text-sm text-orange-700">Outstanding</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-900">
                        {creditSummary.overdueInvoices}
                    </div>
                    <div className="text-sm text-purple-700">Overdue Invoices</div>
                </div>
            </div>

            {/* Credit Utilization */}
            <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Credit Utilization</h4>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Utilization</span>
                        <span>{creditUtilization.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                            className={`h-3 rounded-full ${
                                creditUtilization > 90
                                    ? 'bg-red-500'
                                    : creditUtilization > 70
                                        ? 'bg-yellow-500'
                                        : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(creditUtilization, 100)}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>Used: {formatCurrency(creditSummary.currentBalance)}</span>
                        <span>Limit: {formatCurrency(creditSummary.creditLimit)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CreditInvoicesTab = ({ creditSummary, formatCurrency, formatDate }) => {
    if (!creditSummary || !creditSummary.creditSales || creditSummary.creditSales.length === 0) {
        return <div className="text-center text-gray-500 py-8">No credit invoices found</div>;
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paid</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Outstanding</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                {creditSummary.creditSales.map((sale) => (
                    <tr key={sale.saleId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {sale.invoiceNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(sale.invoiceDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(sale.dueDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(sale.invoiceAmount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(sale.paidAmount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formatCurrency(sale.outstandingAmount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <InvoiceStatusBadge sale={sale} />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

const InvoiceStatusBadge = ({ sale }) => {
    const getStatusInfo = (sale) => {
        if (sale.paymentStatus === 'paid') {
            return { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Paid' };
        } else if (sale.daysOverdue > 0) {
            return { color: 'bg-red-100 text-red-800', icon: AlertTriangle, text: `Overdue (${sale.daysOverdue}d)` };
        } else if (sale.paymentStatus === 'partial') {
            return { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Partial' };
        } else {
            return { color: 'bg-blue-100 text-blue-800', icon: Clock, text: 'Pending' };
        }
    };

    const statusInfo = getStatusInfo(sale);
    const IconComponent = statusInfo.icon;

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
            <IconComponent className="h-3 w-3 mr-1" />
            {statusInfo.text}
        </span>
    );
};

export default CustomerCreditDetails;