import { useState, useEffect } from 'react';
import { purchaseService } from '../services/purchaseService';

export const usePurchases = () => {
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPurchases = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await purchaseService.getAllPurchases();
            if (response.success) {
                setPurchases(response.data);
            } else {
                setError(response.message || 'Failed to fetch purchases');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch purchases');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPurchases();
    }, []);

    const createPurchase = async (purchaseData, userId) => {
        try {
            const response = await purchaseService.createPurchase(purchaseData, userId);
            if (response.success) {
                await fetchPurchases(); // Refresh the list
                return { success: true, data: response.data };
            }
            return { success: false, error: response.message };
        } catch (err) {
            return { success: false, error: err.response?.data?.message || 'Failed to create purchase' };
        }
    };

    const getPurchaseById = async (id) => {
        try {
            const response = await purchaseService.getPurchaseById(id);
            if (response.success) {
                return { success: true, data: response.data };
            }
            return { success: false, error: response.message };
        } catch (err) {
            return { success: false, error: err.response?.data?.message || 'Failed to fetch purchase' };
        }
    };

    return {
        purchases,
        loading,
        error,
        createPurchase,
        getPurchaseById,
        refetch: fetchPurchases,
    };
};