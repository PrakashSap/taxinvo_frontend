import { useState, useEffect } from 'react';
import { saleService } from '../services/saleService';

export const useSales = () => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSales = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await saleService.getAllSales();
            if (response.success) {
                setSales(response.data);
            } else {
                setError(response.message || 'Failed to fetch sales');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch sales');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSales();
    }, []);

    const createSale = async (saleData, userId) => {
        try {
            const response = await saleService.createSale(saleData, userId);
            if (response.success) {
                await fetchSales(); // Refresh the list
                return { success: true, data: response.data };
            }
            return { success: false, error: response.message };
        } catch (err) {
            return { success: false, error: err.response?.data?.message || 'Failed to create sale' };
        }
    };

    const getSaleById = async (id) => {
        try {
            const response = await saleService.getSaleById(id);
            if (response.success) {
                return { success: true, data: response.data };
            }
            return { success: false, error: response.message };
        } catch (err) {
            return { success: false, error: err.response?.data?.message || 'Failed to fetch sale' };
        }
    };

    const getSalesByDateRange = async (startDate, endDate) => {
        try {
            const response = await saleService.getSalesByDateRange(startDate, endDate);
            if (response.success) {
                return { success: true, data: response.data };
            }
            return { success: false, error: response.message };
        } catch (err) {
            return { success: false, error: err.response?.data?.message || 'Failed to fetch sales by date range' };
        }
    };

    return {
        sales,
        loading,
        error,
        createSale,
        getSaleById,
        getSalesByDateRange,
        refetch: fetchSales,
    };
};