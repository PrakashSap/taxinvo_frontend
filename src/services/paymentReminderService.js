import api from '../utils/api';

export const paymentReminderService = {
    createPaymentReminder: async (reminderData) => {
        const response = await api.post('/payment-reminders', reminderData);
        return response.data;
    },

    getCustomerCreditSummary: async (customerId) => {
        const response = await api.get(`/payment-reminders/customer/${customerId}/summary`);
        return response.data;
    },

    getCustomerReminders: async (customerId) => {
        const response = await api.get(`/payment-reminders/customer/${customerId}`);
        return response.data;
    },

    getOverdueReminders: async () => {
        const response = await api.get('/payment-reminders/overdue');
        return response.data;
    },

    markReminderAsSent: async (reminderId) => {
        const response = await api.put(`/payment-reminders/${reminderId}/mark-sent`);
        return response.data;
    },
};  