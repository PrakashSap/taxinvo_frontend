import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import Modal from '../common/Modal';

const PaymentForm = ({ isOpen, onClose, onSubmit, customers }) => {
    const [formData, setFormData] = useState({
        customerId: '',
        saleId: '',
        amount: '',
        paymentMethod: 'cash',
        paymentDate: new Date().toISOString().split('T')[0],
        notes: ''
    });

    const [customerCreditSales, setCustomerCreditSales] = useState([]);

    useEffect(() => {
        if (!isOpen) {
            setFormData({
                customerId: '',
                saleId: '',
                amount: '',
                paymentMethod: 'cash',
                paymentDate: new Date().toISOString().split('T')[0],
                notes: ''
            });
            setCustomerCreditSales([]);
        }
    }, [isOpen]);

    const handleCustomerChange = (customerId) => {
        setFormData(prev => ({ ...prev, customerId, saleId: '' }));

        if (customerId) {
            // Find the selected customer
            const selectedCustomer = customers.find(c => c.id === customerId);

            // Extract credit sales from customer data
            // Assuming customer has a 'sales' or 'creditInvoices' property
            const creditSales = selectedCustomer?.sales?.filter(sale =>
                sale.paymentStatus === 'credit' || sale.paymentStatus === 'partial'
            ) || selectedCustomer?.creditInvoices?.filter(invoice =>
                invoice.outstandingAmount > 0
            ) || [];

            setCustomerCreditSales(creditSales);
        } else {
            setCustomerCreditSales([]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.customerId || !formData.amount) {
            alert('Please fill in all required fields');
            return;
        }

        const submissionData = {
            ...formData,
            amount: parseFloat(formData.amount)
        };

        onSubmit(submissionData);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Get customer's outstanding balance for reference
    const selectedCustomer = customers.find(c => c.id === formData.customerId);
    const customerBalance = selectedCustomer?.currentBalance || selectedCustomer?.outstandingBalance || 0;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Record Payment"
            size="md"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Customer *</label>
                    <select
                        name="customerId"
                        value={formData.customerId}
                        onChange={(e) => handleCustomerChange(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                        required
                    >
                        <option value="">Select Customer</option>
                        {customers
                            .filter(customer => customer.isActive)
                            .map(customer => (
                                <option key={customer.id} value={customer.id}>
                                    {customer.name} - {customer.phone}
                                    {customer.currentBalance > 0 && ` (Outstanding: ₹${customer.currentBalance})`}
                                </option>
                            ))}
                    </select>
                    {customerBalance > 0 && (
                        <p className="text-sm text-gray-500 mt-1">
                            Outstanding Balance: ₹{customerBalance}
                        </p>
                    )}
                </div>

                {customerCreditSales.length > 0 && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Apply to Invoice (Optional)</label>
                        <select
                            name="saleId"
                            value={formData.saleId}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                        >
                            <option value="">General Payment</option>
                            {customerCreditSales.map(sale => (
                                <option key={sale.id} value={sale.id}>
                                    {sale.invoiceNumber} - Outstanding: ₹{sale.outstandingAmount || (sale.grandTotal - (sale.paidAmount || 0))}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700">Amount *</label>
                    <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                        placeholder="Enter amount"
                        min="0"
                        step="0.01"
                        max={customerBalance > 0 ? customerBalance : undefined}
                        required
                    />
                    {customerBalance > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                            Maximum: ₹{customerBalance}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                    <select
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    >
                        <option value="cash">Cash</option>
                        <option value="upi">UPI</option>
                        <option value="card">Card</option>
                        <option value="bank_transfer">Bank Transfer</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Payment Date</label>
                    <input
                        type="date"
                        name="paymentDate"
                        value={formData.paymentDate}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Notes</label>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows={3}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                        placeholder="Additional notes about this payment"
                    />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button type="submit">
                        Record Payment
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default PaymentForm;