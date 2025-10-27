import api from '../utils/api';

export const customerService = {
    getAllCustomers: async () => {
        const response = await api.get('/customers');
        return response.data;
    },

    getCustomerById: async (id) => {
        const response = await api.get(`/customers/${id}`);
        return response.data;
    },

    createCustomer: async (customerData) => {
        const response = await api.post('/customers', customerData);
        return response.data;
    },

    updateCustomer: async (id, customerData) => {
        const response = await api.put(`/customers/${id}`, customerData);
        return response.data;
    },

    deleteCustomer: async (id) => {
        const response = await api.delete(`/customers/${id}`);
        return response.data;
    },

    getActiveCustomers: async () => {
        const response = await api.get('/customers/active');
        return response.data;
    },
};