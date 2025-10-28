import { useState, useEffect } from 'react';
import { paymentReminderService } from '../services/paymentReminderService';

export const usePaymentReminders = () => {
    const [reminders, setReminders] = useState([]);
    const [creditSummary, setCreditSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchOverdueReminders = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Fetching overdue reminders...');
            const response = await paymentReminderService.getOverdueReminders();
            console.log('Overdue reminders response:', response);

            if (response.success) {
                setReminders(response.data);
            } else {
                const errorMsg = response.message || 'Failed to fetch reminders';
                setError(errorMsg);
                console.error('Error fetching reminders:', errorMsg);
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch reminders';
            setError(errorMsg);
            console.error('Exception fetching reminders:', err);
        } finally {
            setLoading(false);
        }
    };

    // Add this useEffect to automatically fetch data when the hook is used
    useEffect(() => {
        fetchOverdueReminders();
    }, []);

    const getCustomerCreditSummary = async (customerId) => {
        try {
            setLoading(true);
            const response = await paymentReminderService.getCustomerCreditSummary(customerId);
            if (response.success) {
                setCreditSummary(response.data);
                return { success: true, data: response.data };
            }
            return { success: false, error: response.message };
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to fetch credit summary';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setLoading(false);
        }
    };

    const createPaymentReminder = async (reminderData) => {
        try {
            const response = await paymentReminderService.createPaymentReminder(reminderData);
            if (response.success) {
                await fetchOverdueReminders();
                return { success: true, data: response.data };
            }
            return { success: false, error: response.message };
        } catch (err) {
            return { success: false, error: err.response?.data?.message || 'Failed to create reminder' };
        }
    };

    const getCustomerReminders = async (customerId) => {
        try {
            const response = await paymentReminderService.getCustomerReminders(customerId);
            if (response.success) {
                return { success: true, data: response.data };
            }
            return { success: false, error: response.message };
        } catch (err) {
            return { success: false, error: err.response?.data?.message || 'Failed to fetch customer reminders' };
        }
    };

    const markReminderAsSent = async (reminderId) => {
        try {
            const response = await paymentReminderService.markReminderAsSent(reminderId);
            if (response.success) {
                await fetchOverdueReminders();
                return { success: true };
            }
            return { success: false, error: response.message };
        } catch (err) {
            return { success: false, error: err.response?.data?.message || 'Failed to mark reminder as sent' };
        }
    };

    return {
        reminders,
        creditSummary,
        loading,
        error,
        createPaymentReminder,
        getCustomerCreditSummary,
        getCustomerReminders,
        markReminderAsSent,
        refetch: fetchOverdueReminders,
    };
};