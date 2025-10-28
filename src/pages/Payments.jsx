import React, { useState } from 'react';
import { usePayments } from '../hooks/usePayments';
import { useCustomers } from '../hooks/useCustomers';
import { IndianRupee, Plus, Calendar, User, Receipt } from 'lucide-react';
import Button from '../components/common/Button';
import PaymentForm from '../components/payments/PaymentForm';

const Payments = () => {
    const { payments, loading, error, createPayment } = usePayments();
    const { customers } = useCustomers();
    const [showPaymentForm, setShowPaymentForm] = useState(false);

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

    const handleCreatePayment = async (paymentData) => {
        const userId = localStorage.getItem('userId') || '1';
        const result = await createPayment(paymentData, userId);
        if (result.success) {
            setShowPaymentForm(false);
        } else {
            alert(result.error);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
                    <p className="text-gray-600">Record and track customer payments</p>
                </div>
                <Button onClick={() => setShowPaymentForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Record Payment
                </Button>
            </div>

            {/* Payments List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {payments.map((payment) => (
                            <tr key={payment.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <User className="h-4 w-4 text-gray-400 mr-2" />
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {payment.customer?.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {payment.customer?.phone}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {payment.sale?.invoiceNumber || 'General Payment'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(payment.paymentDate)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    <div className="flex items-center">
                                        <IndianRupee className="h-3 w-3 mr-1" />
                                        {formatCurrency(payment.amount)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                                    {payment.paymentMethod}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {payment.notes || '-'}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Payment Form Modal */}
            <PaymentForm
                isOpen={showPaymentForm}
                onClose={() => setShowPaymentForm(false)}
                onSubmit={handleCreatePayment}
                customers={customers}
            />
        </div>
    );
};

export default Payments;