import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import Modal from '../common/Modal';

const CustomerForm = ({ isOpen, onClose, customer, onSubmit, loading }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        gstin: '',
        type: 'retail',
        creditLimit: 0,
        currentBalance: 0,
        isActive: true,
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (customer) {
            setFormData({
                name: customer.name || '',
                phone: customer.phone || '',
                address: customer.address || '',
                gstin: customer.gstin || '',
                type: customer.type || 'retail',
                creditLimit: customer.creditLimit || 0,
                currentBalance: customer.currentBalance || 0,
                isActive: customer.isActive !== undefined ? customer.isActive : true,
            });
        } else {
            setFormData({
                name: '',
                phone: '',
                address: '',
                gstin: '',
                type: 'retail',
                creditLimit: 0,
                currentBalance: 0,
                isActive: true,
            });
        }
        setErrors({});
    }, [customer, isOpen]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Customer name is required';
        }

        if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
            newErrors.phone = 'Phone number must be 10 digits';
        }

        if (formData.gstin && !/^[0-9A-Z]{15}$/.test(formData.gstin)) {
            newErrors.gstin = 'GSTIN must be 15 characters';
        }

        if (formData.creditLimit < 0) {
            newErrors.creditLimit = 'Credit limit cannot be negative';
        }

        if (formData.currentBalance < 0) {
            newErrors.currentBalance = 'Current balance cannot be negative';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const submitData = {
                ...formData,
                creditLimit: parseFloat(formData.creditLimit) || 0,
                currentBalance: parseFloat(formData.currentBalance) || 0,
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

    const customerTypes = [
        { value: 'retail', label: 'Retail Customer' },
        { value: 'sub_dealer', label: 'Sub-dealer' },
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={customer ? 'Edit Customer' : 'Add New Customer'}
            size="md"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                    {/* Customer Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Customer Name *
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
                            placeholder="Enter customer name"
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                errors.phone ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="Enter 10-digit phone number"
                        />
                        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                    </div>

                    {/* Address */}
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                            Address
                        </label>
                        <textarea
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            rows={3}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Enter customer address"
                        />
                    </div>

                    {/* GSTIN */}
                    <div>
                        <label htmlFor="gstin" className="block text-sm font-medium text-gray-700">
                            GSTIN
                        </label>
                        <input
                            type="text"
                            id="gstin"
                            name="gstin"
                            value={formData.gstin}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                errors.gstin ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="Enter 15-character GSTIN"
                        />
                        {errors.gstin && <p className="mt-1 text-sm text-red-600">{errors.gstin}</p>}
                    </div>

                    {/* Customer Type */}
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                            Customer Type
                        </label>
                        <select
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            {customerTypes.map(type => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Credit Information - Only for Sub-dealers */}
                    {formData.type === 'sub_dealer' && (
                        <>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="creditLimit" className="block text-sm font-medium text-gray-700">
                                        Credit Limit (₹)
                                    </label>
                                    <input
                                        type="number"
                                        id="creditLimit"
                                        name="creditLimit"
                                        value={formData.creditLimit}
                                        onChange={handleChange}
                                        min="0"
                                        step="0.01"
                                        className={`mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                            errors.creditLimit ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.creditLimit && <p className="mt-1 text-sm text-red-600">{errors.creditLimit}</p>}
                                </div>

                                <div>
                                    <label htmlFor="currentBalance" className="block text-sm font-medium text-gray-700">
                                        Current Balance (₹)
                                    </label>
                                    <input
                                        type="number"
                                        id="currentBalance"
                                        name="currentBalance"
                                        value={formData.currentBalance}
                                        onChange={handleChange}
                                        min="0"
                                        step="0.01"
                                        className={`mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                            errors.currentBalance ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.currentBalance && <p className="mt-1 text-sm text-red-600">{errors.currentBalance}</p>}
                                </div>
                            </div>

                            {/* Available Credit Display */}
                            <div className="bg-blue-50 rounded-lg p-3">
                                <p className="text-sm font-medium text-blue-800">
                                    Available Credit: ₹{(formData.creditLimit - formData.currentBalance).toLocaleString('en-IN')}
                                </p>
                                {formData.currentBalance > formData.creditLimit && (
                                    <p className="text-sm text-red-600 mt-1">
                                        ⚠️ Credit limit exceeded by ₹{(formData.currentBalance - formData.creditLimit).toLocaleString('en-IN')}
                                    </p>
                                )}
                            </div>
                        </>
                    )}

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
                            Active Customer
                        </label>
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
                    >
                        {customer ? 'Update Customer' : 'Create Customer'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default CustomerForm;