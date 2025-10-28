import React, { useState, useEffect } from 'react';
import { usePaymentReminders } from '../hooks/usePaymentReminders';
import { useCustomers } from '../hooks/useCustomers';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { CreditCard, AlertTriangle, Calendar, IndianRupee, Mail, Phone } from 'lucide-react';

const CreditTracking = () => {
    const { reminders, loading, error, markReminderAsSent, refetch } = usePaymentReminders();
    const { customers } = useCustomers();
    const [selectedReminder, setSelectedReminder] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    // Add debug logging
    useEffect(() => {
        console.log('CreditTracking - reminders:', reminders);
        console.log('CreditTracking - loading:', loading);
        console.log('CreditTracking - error:', error);
    }, [reminders, loading, error]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
        }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const getDaysOverdue = (dueDate) => {
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = today - due;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    const handleMarkAsSent = async (reminderId) => {
        const result = await markReminderAsSent(reminderId);
        if (result.success) {
            alert('Reminder marked as sent!');
        } else {
            alert('Failed to mark reminder as sent: ' + result.error);
        }
    };

    const handleViewDetails = (reminder) => {
        setSelectedReminder(reminder);
        setShowDetails(true);
    };

    // Improved loading state
    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading credit tracking data...</p>
                </div>
            </div>
        );
    }

    // Improved error state with retry button
    if (error) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-center text-red-600">
                    <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Failed to load credit tracking</h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <Button onClick={refetch}>
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Credit Tracking</h1>
                        <p className="text-gray-600">Manage payment reminders and track overdue invoices</p>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                        <span>{reminders.length} overdue reminders</span>
                    </div>
                </div>
            </div>

            {/* Overdue Reminders */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                        <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                        Overdue Payment Reminders
                    </h2>
                </div>

                {reminders.length === 0 ? (
                    <div className="p-8 text-center">
                        <CreditCard className="h-12 w-12 text-green-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No overdue payments</h3>
                        <p className="text-gray-500">All payments are up to date!</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Overdue Days</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reminder Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {reminders.map((reminder) => (
                                <tr key={reminder.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {reminder.customerName}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {reminder.customerPhone || 'No phone'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {reminder.invoiceNumber}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(reminder.dueDate)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                {getDaysOverdue(reminder.dueDate)} days
                                            </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        <div className="flex items-center">
                                            <IndianRupee className="h-3 w-3 mr-1" />
                                            {formatCurrency(reminder.outstandingAmount)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex items-center space-x-1">
                                            {reminder.reminderType && reminder.reminderType.includes('email') && <Mail className="h-4 w-4" />}
                                            {reminder.reminderType && reminder.reminderType.includes('sms') && <Phone className="h-4 w-4" />}
                                            <span className="capitalize">{reminder.reminderType || 'email'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleViewDetails(reminder)}
                                            >
                                                View
                                            </Button>
                                            {!reminder.reminderSent && (
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleMarkAsSent(reminder.id)}
                                                >
                                                    Mark Sent
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Reminder Details Modal */}
            <Modal
                isOpen={showDetails}
                onClose={() => setShowDetails(false)}
                title="Reminder Details"
                size="md"
            >
                {selectedReminder && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Customer</label>
                                <p className="text-sm text-gray-900">{selectedReminder.customerName}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Invoice</label>
                                <p className="text-sm text-gray-900">{selectedReminder.invoiceNumber}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Due Date</label>
                                <p className="text-sm text-gray-900">{formatDate(selectedReminder.dueDate)}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Amount</label>
                                <p className="text-sm text-gray-900 font-medium">
                                    {formatCurrency(selectedReminder.outstandingAmount)}
                                </p>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Notes</label>
                            <p className="text-sm text-gray-900">{selectedReminder.notes || 'No notes'}</p>
                        </div>
                        <div className="flex justify-end space-x-3 pt-4">
                            <Button
                                variant="outline"
                                onClick={() => setShowDetails(false)}
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default CreditTracking;