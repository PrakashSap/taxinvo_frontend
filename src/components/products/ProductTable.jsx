import React, { useState } from 'react';
import { MoreVertical, Edit, Trash2, Package, AlertTriangle } from 'lucide-react';
import Button from '../common/Button';

const ProductTable = ({ products, onEdit, onDelete, loading }) => {
    const [actionMenu, setActionMenu] = useState(null);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
        }).format(amount || 0);
    };

    const getStockStatus = (product) => {
        if (product.currentStock === 0) {
            return { status: 'Out of Stock', color: 'text-red-600 bg-red-50', icon: AlertTriangle };
        }
        if (product.currentStock <= product.minStock) {
            return { status: 'Low Stock', color: 'text-orange-600 bg-orange-50', icon: AlertTriangle };
        }
        return { status: 'In Stock', color: 'text-green-600 bg-green-50', icon: Package };
    };

    const handleActionClick = (productId, event) => {
        event.stopPropagation();
        setActionMenu(actionMenu === productId ? null : productId);
    };

    const handleEdit = (product, event) => {
        event.stopPropagation();
        setActionMenu(null);
        onEdit(product);
    };

    const handleDelete = (product, event) => {
        event.stopPropagation();
        setActionMenu(null);
        onDelete(product);
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

    if (products.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500">Get started by creating your first product.</p>
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
                            Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            HSN Code
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-xs font-medium text-gray-500 uppercase tracking-wider">
                            Stock
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => {
                        const stockStatus = getStockStatus(product);
                        const StatusIcon = stockStatus.icon;

                        return (
                            <tr
                                key={product.id}
                                className="hover:bg-gray-50 cursor-pointer transition-colors"
                                onClick={() => onEdit(product)}
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                        {product.batchNumber && (
                                            <div className="text-sm text-gray-500">Batch: {product.batchNumber}</div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                      {product.category}
                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {product.hsnCode || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{product.currentStock} {product.unit}</div>
                                    <div className="text-xs text-gray-500">Min: {product.minStock}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {formatCurrency(product.sellingRate)}
                                    </div>
                                    {product.purchaseRate && (
                                        <div className="text-xs text-gray-500">
                                            Cost: {formatCurrency(product.purchaseRate)}
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockStatus.color}`}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                        {stockStatus.status}
                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                                    <div className="flex justify-end">
                                        <button
                                            onClick={(e) => handleActionClick(product.id, e)}
                                            className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full p-1"
                                        >
                                            <MoreVertical className="h-5 w-5" />
                                        </button>

                                        {actionMenu === product.id && (
                                            <div className="absolute right-0 top-12 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                                <div className="py-1">
                                                    <button
                                                        onClick={(e) => handleEdit(product, e)}
                                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                                    >
                                                        <Edit className="h-4 w-4 mr-2" />
                                                        Edit Product
                                                    </button>
                                                    <button
                                                        onClick={(e) => handleDelete(product, e)}
                                                        className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        Delete Product
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductTable;