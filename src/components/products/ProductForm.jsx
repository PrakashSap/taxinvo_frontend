import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from '../common/Button';
import Modal from '../common/Modal';

const ProductForm = ({ isOpen, onClose, product, onSubmit, loading }) => {
    const [formData, setFormData] = useState({
        name: '',
        category: 'fertilizer',
        hsnCode: '',
        unit: 'NOS',
        gstRate: '',
        purchaseRate: '',
        sellingRate: '',
        currentStock: 0,
        minStock: 10,
        batchNumber: '',
        expiryDate: '',
        isActive: true,
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                category: product.category || 'fertilizer',
                hsnCode: product.hsnCode || '',
                unit: product.unit || 'NOS',
                gstRate: product.gstRate?.toString() || '',
                purchaseRate: product.purchaseRate?.toString() || '',
                sellingRate: product.sellingRate?.toString() || '',
                currentStock: product.currentStock || 0,
                minStock: product.minStock || 10,
                batchNumber: product.batchNumber || '',
                expiryDate: product.expiryDate || '',
                isActive: product.isActive !== undefined ? product.isActive : true,
            });
        } else {
            setFormData({
                name: '',
                category: 'fertilizer',
                hsnCode: '',
                unit: 'NOS',
                gstRate: '',
                purchaseRate: '',
                sellingRate: '',
                currentStock: 0,
                minStock: 10,
                batchNumber: '',
                expiryDate: '',
                isActive: true,
            });
        }
        setErrors({});
    }, [product, isOpen]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Product name is required';
        }

        if (!formData.category) {
            newErrors.category = 'Category is required';
        }

        if (!formData.gstRate || isNaN(formData.gstRate) || parseFloat(formData.gstRate) < 0) {
            newErrors.gstRate = 'Valid GST rate is required';
        }

        if (!formData.sellingRate || isNaN(formData.sellingRate) || parseFloat(formData.sellingRate) <= 0) {
            newErrors.sellingRate = 'Valid selling rate is required';
        }

        if (formData.purchaseRate && (isNaN(formData.purchaseRate) || parseFloat(formData.purchaseRate) < 0)) {
            newErrors.purchaseRate = 'Valid purchase rate is required';
        }

        if (formData.sellingRate && formData.purchaseRate && parseFloat(formData.sellingRate) < parseFloat(formData.purchaseRate)) {
            newErrors.sellingRate = 'Selling rate cannot be less than purchase rate';
        }

        if (formData.expiryDate && new Date(formData.expiryDate) < new Date()) {
            newErrors.expiryDate = 'Expiry date cannot be in the past';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const submitData = {
                ...formData,
                gstRate: parseFloat(formData.gstRate),
                purchaseRate: formData.purchaseRate ? parseFloat(formData.purchaseRate) : null,
                sellingRate: parseFloat(formData.sellingRate),
                currentStock: parseInt(formData.currentStock),
                minStock: parseInt(formData.minStock),
            };
            onSubmit(submitData);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const categories = [
        { value: 'fertilizer', label: 'Fertilizer' },
        { value: 'pesticide', label: 'Pesticide' },
        { value: 'seed', label: 'Seed' },
    ];

    const units = [
        { value: 'NOS', label: 'NOS' },
        { value: 'BAG', label: 'BAG' },
        { value: 'PKT', label: 'PKT' },
        { value: 'KG', label: 'KG' },
        { value: 'LTR', label: 'LTR' },
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={product ? 'Edit Product' : 'Add New Product'}
            size="lg"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Product Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Product Name *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                errors.name ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="Enter product name"
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                    </div>

                    {/* Category */}
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                            Category *
                        </label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                errors.category ? 'border-red-300' : 'border-gray-300'
                            }`}
                        >
                            {categories.map(cat => (
                                <option key={cat.value} value={cat.value}>
                                    {cat.label}
                                </option>
                            ))}
                        </select>
                        {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                    </div>

                    {/* HSN Code */}
                    <div>
                        <label htmlFor="hsnCode" className="block text-sm font-medium text-gray-700">
                            HSN Code
                        </label>
                        <input
                            type="text"
                            id="hsnCode"
                            name="hsnCode"
                            value={formData.hsnCode}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Enter HSN code"
                        />
                    </div>

                    {/* Unit */}
                    <div>
                        <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
                            Unit *
                        </label>
                        <select
                            id="unit"
                            name="unit"
                            value={formData.unit}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            {units.map(unit => (
                                <option key={unit.value} value={unit.value}>
                                    {unit.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* GST Rate */}
                    <div>
                        <label htmlFor="gstRate" className="block text-sm font-medium text-gray-700">
                            GST Rate (%) *
                        </label>
                        <input
                            type="number"
                            id="gstRate"
                            name="gstRate"
                            value={formData.gstRate}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            max="28"
                            className={`mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                errors.gstRate ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="0.00"
                        />
                        {errors.gstRate && <p className="mt-1 text-sm text-red-600">{errors.gstRate}</p>}
                    </div>

                    {/* Purchase Rate */}
                    <div>
                        <label htmlFor="purchaseRate" className="block text-sm font-medium text-gray-700">
                            Purchase Rate (₹)- Including GST
                        </label>
                        <input
                            type="number"
                            id="purchaseRate"
                            name="purchaseRate"
                            value={formData.purchaseRate}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            className={`mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                errors.purchaseRate ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="0.00"
                        />
                        {errors.purchaseRate && <p className="mt-1 text-sm text-red-600">{errors.purchaseRate}</p>}
                    </div>

                    {/* Selling Rate */}
                    <div>
                        <label htmlFor="sellingRate" className="block text-sm font-medium text-gray-700">
                            Selling Rate (₹) * - Including GST
                        </label>
                        <input
                            type="number"
                            id="sellingRate"
                            name="sellingRate"
                            value={formData.sellingRate}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            className={`mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                errors.sellingRate ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="0.00"
                        />
                        {errors.sellingRate && <p className="mt-1 text-sm text-red-600">{errors.sellingRate}</p>}
                    </div>

                    {/* Current Stock */}
                    <div>
                        <label htmlFor="currentStock" className="block text-sm font-medium text-gray-700">
                            Current Stock
                        </label>
                        <input
                            type="number"
                            id="currentStock"
                            name="currentStock"
                            value={formData.currentStock}
                            onChange={handleChange}
                            min="0"
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>

                    {/* Minimum Stock */}
                    <div>
                        <label htmlFor="minStock" className="block text-sm font-medium text-gray-700">
                            Minimum Stock Level
                        </label>
                        <input
                            type="number"
                            id="minStock"
                            name="minStock"
                            value={formData.minStock}
                            onChange={handleChange}
                            min="0"
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>

                    {/* Batch Number */}
                    <div>
                        <label htmlFor="batchNumber" className="block text-sm font-medium text-gray-700">
                            Batch Number
                        </label>
                        <input
                            type="text"
                            id="batchNumber"
                            name="batchNumber"
                            value={formData.batchNumber}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Enter batch number"
                        />
                    </div>

                    {/* Expiry Date */}
                    <div>
                        <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                            Expiry Date
                        </label>
                        <input
                            type="date"
                            id="expiryDate"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                errors.expiryDate ? 'border-red-300' : 'border-gray-300'
                            }`}
                        />
                        {errors.expiryDate && <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>}
                    </div>
                </div>

                {/* Active Status */}
                <div className="flex items-center">
                    <input
                        id="isActive"
                        name="isActive"
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={handleChange}
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                        Active Product
                    </label>
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
                    >
                        {product ? 'Update Product' : 'Create Product'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default ProductForm;