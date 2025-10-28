import api from '../utils/api';

export const paymentService = {
    getAllPayments: async () => {
        const response = await api.get('/payments');
        return response.data;
    },

    createPayment: async (paymentData, userId) => {
        const response = await api.post('/payments', paymentData, {
            headers: { 'X-User-Id': userId }
        });
        return response.data;
    },

    getPaymentsByCustomer: async (customerId) => {
        const response = await api.get(`/payments/customer/${customerId}`);
        return response.data;
    },
};