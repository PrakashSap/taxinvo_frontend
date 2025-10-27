import api from '../utils/api';

export const saleService = {
    getAllSales: async () => {
        const response = await api.get('/sales');
        return response.data;
    },

    getSaleById: async (id) => {
        const response = await api.get(`/sales/${id}`);
        return response.data;
    },

    createSale: async (saleData, userId) => {
        const response = await api.post('/sales', saleData, {
            headers: { 'X-User-Id': userId }
        });
        return response.data;
    },

    getSalesByDateRange: async (startDate, endDate) => {
        const response = await api.get('/sales/date-range', {
            params: { startDate, endDate }
        });
        return response.data;
    },

    getSalesByCustomer: async (customerId) => {
        const response = await api.get(`/sales/customer/${customerId}`);
        return response.data;
    },
};