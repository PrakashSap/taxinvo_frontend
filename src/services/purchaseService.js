import api from '../utils/api';

export const purchaseService = {
    getAllPurchases: async () => {
        const response = await api.get('/purchases');
        return response.data;
    },

    getPurchaseById: async (id) => {
        const response = await api.get(`/purchases/${id}`);
        return response.data;
    },

    createPurchase: async (purchaseData, userId) => {
        const response = await api.post('/purchases', purchaseData, {
            headers: { 'X-User-Id': userId }
        });
        return response.data;
    },
};