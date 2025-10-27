import React, { useState, useEffect } from 'react';
import { Search, Plus, Minus, Trash2, IndianRupee } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import Button from '../common/Button';
import Modal from '../common/Modal';
import SearchBar from '../common/SearchBar';

const PurchaseForm = ({ isOpen, onClose, onSubmit, loading }) => {
    const { products } = useProducts();
    const [formData, setFormData] = useState({
        invoiceNumber: '',
        invoiceDate: new Date().toISOString().split('T')[0],
        supplierName: '',
        supplierGstin: '',
        items: [],
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [calculations, setCalculations] = useState({
        subtotal: 0,
        totalCgst: 0,
        totalSgst: 0,
        grandTotal: 0,
    });

    useEffect(() => {
        if (!isOpen) {
            // Reset form when modal closes
            setFormData({
                invoiceNumber: '',
                invoiceDate: new Date().toISOString().split('T')[0],
                supplierName: '',
                supplierGstin: '',
                items: [],
            });
            setSearchTerm('');
        }
    }, [isOpen]);

    // Calculate totals whenever items change
    useEffect(() => {
        calculateTotals();
    }, [formData.items]);

    const calculateTotals = () => {
        let subtotal = 0;
        let totalCgst = 0;
        let totalSgst = 0;

        formData.items.forEach(item => {
            const itemTotal = item.rate * item.quantity;
            const cgstAmount = itemTotal * (item.gstRate / 100);
            const sgstAmount = itemTotal * (item.gstRate / 100);

            subtotal += itemTotal;
            totalCgst += cgstAmount;
            totalSgst += sgstAmount;
        });

        const grandTotal = subtotal + totalCgst + totalSgst;

        setCalculations({
            subtotal,
            totalCgst,
            totalSgst,
            grandTotal,
        });
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        product.isActive
    );

    const handleAddProduct = (product) => {
        const existingItem = formData.items.find(item => item.productId === product.id);

        if (existingItem) {
            // Update quantity if product already exists
            const updatedItems = formData.items.map(item =>
                item.productId === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
            setFormData(prev => ({ ...prev, items: updatedItems }));
        } else {
            // Add new product
            const newItem = {
                productId: product.id,
                product: product,
                quantity: 1,
                rate: product.purchaseRate || 0,
                gstRate: product.gstRate,
                batchNumber: '',
                expiryDate: '',
            };
            setFormData(prev => ({ ...prev, items: [...prev.items, newItem] }));
        }
        setSearchTerm('');
    };

    const handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity < 1) return;

        const updatedItems = formData.items.map(item =>
            item.productId === productId
                ? { ...item, quantity: newQuantity }
                : item
        );
        setFormData(prev => ({ ...prev, items: updatedItems }));
    };

    const handleRemoveItem = (productId) => {
        const updatedItems = formData.items.filter(item => item.productId !== productId);
        setFormData(prev => ({ ...prev, items: updatedItems }));
    };

    const handleRateChange = (productId, newRate) => {
        const updatedItems = formData.items.map(item =>
            item.productId === productId
                ? { ...item, rate: parseFloat(newRate) || 0 }
                : item
        );
        setFormData(prev => ({ ...prev, items: updatedItems }));
    };

    const handleBatchNumberChange = (productId, batchNumber) => {
        const updatedItems = formData.items.map(item =>
            item.productId === productId
                ? { ...item, batchNumber }
                : item
        );
        setFormData(prev => ({ ...prev, items: updatedItems }));
    };

    const handleExpiryDateChange = (productId, expiryDate) => {
        const updatedItems = formData.items.map(item =>
            item.productId === productId
                ? { ...item, expiryDate }
                : item
        );
        setFormData(prev => ({ ...prev, items: updatedItems }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.items.length === 0) {
            alert('Please add at least one product to the purchase');
            return;
        }

        if (!formData.invoiceNumber.trim()) {
            alert('Please enter an invoice number');
            return;
        }

        if (!formData.supplierName.trim()) {
            alert('Please enter supplier name');
            return;
        }

        // Prepare items for submission
        const itemsForSubmission = formData.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            rate: item.rate,
            batchNumber: item.batchNumber,
            expiryDate: item.expiryDate,
        }));

        const submissionData = {
            ...formData,
            items: itemsForSubmission,
            totalAmount: calculations.subtotal,
            totalCgst: calculations.totalCgst,
            totalSgst: calculations.totalSgst,
            grandTotal: calculations.grandTotal,
        };

        onSubmit(submissionData);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Create Purchase Order"
            size="xl"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Supplier Details Section */}
                <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Supplier Details</h3>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Invoice Number *
                            </label>
                            <input
                                type="text"
                                value={formData.invoiceNumber}
                                onChange={(e) => setFormData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                                className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                placeholder="Enter invoice number"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Invoice Date *
                            </label>
                            <input
                                type="date"
                                value={formData.invoiceDate}
                                onChange={(e) => setFormData(prev => ({ ...prev, invoiceDate: e.target.value }))}
                                className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Supplier Name *
                            </label>
                            <input
                                type="text"
                                value={formData.supplierName}
                                onChange={(e) => setFormData(prev => ({ ...prev, supplierName: e.target.value }))}
                                className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                placeholder="Enter supplier name"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Supplier GSTIN (Optional)
                            </label>
                            <input
                                type="text"
                                value={formData.supplierGstin}
                                onChange={(e) => setFormData(prev => ({ ...prev, supplierGstin: e.target.value }))}
                                className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                placeholder="Enter supplier GSTIN"
                            />
                        </div>
                    </div>
                </div>

                {/* Add Products Section */}
                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Add Products</h3>

                    <div className="mb-4">
                        <SearchBar
                            value={searchTerm}
                            onChange={setSearchTerm}
                            placeholder="Search products by name..."
                        />
                    </div>

                    {searchTerm && (
                        <div className="bg-white border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
                            {filteredProducts.map(product => (
                                <div
                                    key={product.id}
                                    className="flex items-center justify-between p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                                    onClick={() => handleAddProduct(product)}
                                >
                                    <div>
                                        <p className="font-medium text-gray-900">{product.name}</p>
                                        <p className="text-sm text-gray-500">
                                            Stock: {product.currentStock} {product.unit} •
                                            Current Rate: {formatCurrency(product.purchaseRate || 0)} •
                                            GST: {product.gstRate}%
                                        </p>
                                    </div>
                                    <Plus className="h-5 w-5 text-primary-600" />
                                </div>
                            ))}
                            {filteredProducts.length === 0 && (
                                <p className="p-4 text-center text-gray-500">No products found</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Items Table */}
                {formData.items.length > 0 && (
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
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                {formData.items.map((item) => (
                                    <tr key={item.productId}>
                                        <td className="px-4 py-3">
                                            <div>
                                                <p className="font-medium text-gray-900">{item.product.name}</p>
                                                <p className="text-sm text-gray-500">{item.product.hsnCode}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <input
                                                type="text"
                                                value={item.batchNumber}
                                                onChange={(e) => handleBatchNumberChange(item.productId, e.target.value)}
                                                className="w-24 border border-gray-300 rounded px-2 py-1 text-sm"
                                                placeholder="Batch No"
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <input
                                                type="date"
                                                value={item.expiryDate}
                                                onChange={(e) => handleExpiryDateChange(item.productId, e.target.value)}
                                                className="w-32 border border-gray-300 rounded px-2 py-1 text-sm"
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                                                    className="p-1 rounded border border-gray-300 hover:bg-gray-100"
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </button>
                                                <span className="w-12 text-center">{item.quantity}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                                                    className="p-1 rounded border border-gray-300 hover:bg-gray-100"
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <input
                                                type="number"
                                                value={item.rate}
                                                onChange={(e) => handleRateChange(item.productId, e.target.value)}
                                                className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
                                                min="0"
                                                step="0.01"
                                            />
                                        </td>
                                        <td className="px-4 py-3 font-medium">
                                            {formatCurrency(item.rate * item.quantity)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveItem(item.productId)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Order Summary */}
                {formData.items.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Purchase Summary</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal:</span>
                                <span className="font-medium">{formatCurrency(calculations.subtotal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">CGST:</span>
                                <span className="font-medium">{formatCurrency(calculations.totalCgst)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">SGST:</span>
                                <span className="font-medium">{formatCurrency(calculations.totalSgst)}</span>
                            </div>
                            <div className="flex justify-between border-t border-gray-300 pt-2">
                                <span className="text-lg font-semibold">Grand Total:</span>
                                <span className="text-lg font-semibold flex items-center">
                  <IndianRupee className="h-4 w-4 mr-1" />
                                    {formatCurrency(calculations.grandTotal)}
                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        loading={loading}
                        disabled={formData.items.length === 0}
                    >
                        Create Purchase
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default PurchaseForm;