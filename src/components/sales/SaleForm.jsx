import React, { useState, useEffect } from 'react';
import { Search, Plus, Minus, Trash2, IndianRupee } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { useCustomers } from '../../hooks/useCustomers';
import Button from '../common/Button';
import Modal from '../common/Modal';
import SearchBar from '../common/SearchBar';

const SaleForm = ({ isOpen, onClose, onSubmit, loading }) => {
    const { products } = useProducts();
    const { customers } = useCustomers();
    const [formData, setFormData] = useState({
        invoiceDate: new Date().toISOString().split('T')[0],
        customerId: '',
        customerName: '',
        customerPhone: '',
        customerGstin: '',
        paymentMethod: 'cash',
        items: [],
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [customerType, setCustomerType] = useState('retail');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [calculations, setCalculations] = useState({
        subtotal: 0,
        totalCgst: 0,
        totalSgst: 0,
        roundOff: 0,
        grandTotal: 0,
    });

    useEffect(() => {
        if (!isOpen) {
            // Reset form when modal closes
            setFormData({
                invoiceDate: new Date().toISOString().split('T')[0],
                customerId: '',
                customerName: '',
                customerPhone: '',
                customerGstin: '',
                paymentMethod: 'cash',
                items: [],
            });
            setCustomerType('retail');
            setSelectedCustomer(null);
            setSearchTerm('');
        }
    }, [isOpen]);

    // Calculate totals whenever items change
    useEffect(() => {
        calculateTotals();
    }, [formData.items]);

    const calculateTotals = (items = formData.items) => {
        let subtotal = 0;
        let totalCgst = 0;
        let totalSgst = 0;

        items.forEach(item => {
            // 👉 Set `inclusive = false` to treat rate as exclusive of GST
            const { taxableValue, cgstAmount, sgstAmount } = calculateGstBreakdown(
                item.rate,
                item.gstRate,
                item.quantity,
                false // change to true if your rate includes GST
            );

            subtotal += taxableValue;
            totalCgst += cgstAmount;
            totalSgst += sgstAmount;
        });

        const grandTotal = subtotal + totalCgst + totalSgst;
        const roundOff = Math.round(grandTotal) - grandTotal;

        setCalculations({
            subtotal,
            totalCgst,
            totalSgst,
            roundOff,
            grandTotal: grandTotal + roundOff,
        });
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        product.isActive &&
        product.currentStock > 0
    );

    // GST breakdown (supports both inclusive and exclusive modes)
    const calculateGstBreakdown = (rate, gstRate, quantity, inclusive = true) => {
        let taxableValue, gstAmount, cgstAmount, sgstAmount, totalAmount;

        if (inclusive) {
            // When rate is inclusive of GST
            const gstFactor = 1 + gstRate / 100;
            taxableValue = (rate / gstFactor) * quantity;
            gstAmount = (rate * quantity) - taxableValue;
        } else {
            // When rate is exclusive of GST
            taxableValue = rate * quantity;
            gstAmount = taxableValue * (gstRate / 100);
        }

        cgstAmount = gstAmount / 2;
        sgstAmount = gstAmount / 2;
        totalAmount = taxableValue + gstAmount;

        return {
            taxableValue,
            cgstAmount,
            sgstAmount,
            gstAmount,
            totalAmount
        };
    };

    const handleAddProduct = (product) => {
        const gstRate = product.gstRate || 0;
        const cgstRate = gstRate / 2;
        const sgstRate = gstRate / 2;
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
                rate: product.sellingRate,
                gstRate,
                cgstRate,
                sgstRate,
            };
            setFormData(prev => ({ ...prev, items: [...prev.items, newItem] }));
            calculateTotals([...formData.items, newItem]);
        }
        setSearchTerm('');
    };

    const handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity < 1) return;

        const product = products.find(p => p.id === productId);
        if (product && newQuantity > product.currentStock) {
            alert(`Only ${product.currentStock} units available in stock`);
            return;
        }

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

    const handleCustomerSelect = (customer) => {
        setSelectedCustomer(customer);
        setFormData(prev => ({
            ...prev,
            customerId: customer.id,
            customerName: customer.name,
            customerPhone: customer.phone,
            customerGstin: customer.gstin,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.items.length === 0) {
            alert('Please add at least one product to the invoice');
            return;
        }

        // Prepare items for submission (remove product object, keep only IDs and calculated values)
        const itemsForSubmission = formData.items.map(item => {
            const { taxableValue, cgstAmount, sgstAmount, totalAmount } = calculateGstBreakdown(item.rate, item.cgstRate, item.quantity);

            return {
                productId: item.productId,
                quantity: item.quantity,
                rate: item.rate,
                taxableValue,
                cgstRate: item.cgstRate,
                cgstAmount,
                sgstRate: item.sgstRate,
                sgstAmount,
                totalAmount
            };
        });

        const submissionData = {
            ...formData,
            items: itemsForSubmission,
            totalAmount: calculations.subtotal,
            totalCgst: calculations.totalCgst,
            totalSgst: calculations.totalSgst,
            roundOff: calculations.roundOff,
            grandTotal: calculations.grandTotal,
            paymentStatus: formData.paymentMethod === 'credit' ? 'credit' : 'paid',
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
            title="Create New Sale Invoice"
            size="xl"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Customer Details Section */}
                <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Details</h3>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Customer Type
                            </label>
                            <div className="flex space-x-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        value="retail"
                                        checked={customerType === 'retail'}
                                        onChange={(e) => setCustomerType(e.target.value)}
                                        className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Retail Customer</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        value="sub_dealer"
                                        checked={customerType === 'sub_dealer'}
                                        onChange={(e) => setCustomerType(e.target.value)}
                                        className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Sub-dealer</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Invoice Date
                            </label>
                            <input
                                type="date"
                                value={formData.invoiceDate}
                                onChange={(e) => setFormData(prev => ({ ...prev, invoiceDate: e.target.value }))}
                                className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                required
                            />
                        </div>
                    </div>

                    {customerType === 'sub_dealer' && (
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Sub-dealer
                            </label>
                            <select
                                value={selectedCustomer?.id || ''}
                                onChange={(e) => {
                                    const customer = customers.find(c => c.id === parseInt(e.target.value));
                                    if (customer) handleCustomerSelect(customer);
                                }}
                                className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                            >
                                <option value="">Select a sub-dealer</option>
                                {customers
                                    .filter(c => c.type === 'sub_dealer' && c.isActive)
                                    .map(customer => (
                                        <option key={customer.id} value={customer.id}>
                                            {customer.name} - {customer.phone}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    )}

                    {customerType === 'retail' && (
                        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Customer Name (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={formData.customerName}
                                    onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                                    className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                    placeholder="Enter customer name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone (Optional)
                                </label>
                                <input
                                    type="tel"
                                    value={formData.customerPhone}
                                    onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                                    className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                    placeholder="Enter phone number"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    GSTIN (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={formData.customerGstin}
                                    onChange={(e) => setFormData(prev => ({ ...prev, customerGstin: e.target.value }))}
                                    className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                    placeholder="Enter GSTIN"
                                />
                            </div>
                        </div>
                    )}
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
                                            Rate: {formatCurrency(product.sellingRate)} •
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
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Items in Invoice</h3>
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">GST</th>
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
                                        <td className="px-4 py-3 text-sm text-gray-500">
                                            {(item.cgstRate + item.sgstRate).toFixed(2)}%
                                        </td>
                                        <td className="px-4 py-3 font-medium">
                                            {formatCurrency(item.rate * item.quantity * (1 + (item.cgstRate + item.sgstRate) / 100))}
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

                {/* Payment and Summary Section */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Payment Method */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Details</h3>
                        <div className="space-y-3">
                            {['cash', 'upi', 'card', 'credit'].map(method => (
                                <label key={method} className="flex items-center">
                                    <input
                                        type="radio"
                                        value={method}
                                        checked={formData.paymentMethod === method}
                                        onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                                        className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700 capitalize">
                    {method === 'upi' ? 'UPI' : method}
                  </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
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
                            <div className="flex justify-between">
                                <span className="text-gray-600">Round Off:</span>
                                <span className="font-medium">{formatCurrency(calculations.roundOff)}</span>
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
                </div>

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
                        Generate Invoice
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default SaleForm;