import React from 'react';
import { CheckCircle, Clock, IndianRupee } from 'lucide-react';

const RecentSales = ({  sales }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const getStatusIcon = (status) => {
        if (status === 'paid') {
            return <CheckCircle className="h-4 w-4 text-green-500" />;
        }
        return <Clock className="h-4 w-4 text-yellow-500" />;
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Sales</h3>
            </div>
            <div className="p-6">
                <div className="space-y-4">
                    {sales?.slice(0, 5).map((sale) => (
                        <div key={sale.id} className="flex items-center justify-between py-2">
                            <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                    {getStatusIcon(sale.paymentStatus)}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {sale.invoiceNumber}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {sale.customer?.name || sale.customerName || 'Retail Customer'}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-semibold text-gray-900 flex items-center">
                                    <IndianRupee className="h-3 w-3 mr-1" />
                                    {formatCurrency(sale.grandTotal)}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {formatDate(sale.invoiceDate)}
                                </p>
                            </div>
                        </div>
                    ))}
                    {(!sales || sales.length === 0) && (
                        <p className="text-center text-gray-500 py-4">No recent sales</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecentSales;