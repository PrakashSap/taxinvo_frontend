import React from 'react';
import { AlertTriangle, Package } from 'lucide-react';

const LowStockAlerts = ({ products }) => {
    const lowStockProducts = products?.filter(product =>
        product.currentStock <= product.minStock
    ) || [];

    const getSeverityColor = (product) => {
        if (product.currentStock === 0) return 'text-red-600 bg-red-50';
        if (product.currentStock <= product.minStock / 2) return 'text-orange-600 bg-orange-50';
        return 'text-yellow-600 bg-yellow-50';
    };

    const getSeverityText = (product) => {
        if (product.currentStock === 0) return 'Out of Stock';
        if (product.currentStock <= product.minStock / 2) return 'Critical';
        return 'Low';
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                    Low Stock Alerts
                </h3>
            </div>
            <div className="p-6">
                <div className="space-y-3">
                    {lowStockProducts.slice(0, 5).map((product) => (
                        <div key={product.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                            <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                    <Package className="h-4 w-4 text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                                    <p className="text-xs text-gray-500">Min: {product.minStock}</p>
                                </div>
                            </div>
                            <div className="text-right">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(product)}`}>
                  {getSeverityText(product)}
                </span>
                                <p className="text-sm font-semibold text-gray-900 mt-1">
                                    {product.currentStock} left
                                </p>
                            </div>
                        </div>
                    ))}
                    {lowStockProducts.length === 0 && (
                        <p className="text-center text-gray-500 py-4">All products are well stocked</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LowStockAlerts;