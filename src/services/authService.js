// services/authService.js
import api from '../utils/api';

export const authService = {
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },
    verifyToken: async () => {
        const response = await api.get('/auth/verify');
        return response.data;
    },
};