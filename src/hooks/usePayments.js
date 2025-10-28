import { useState, useEffect } from 'react';
import { paymentService } from '../services/paymentService';

export const usePayments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPayments = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await paymentService.getAllPayments();
            if (response.success) {
                setPayments(response.data);
            } else {
                setError(response.message || 'Failed to fetch payments');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch payments');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    const createPayment = async (paymentData, userId) => {
        try {
            const response = await paymentService.createPayment(paymentData, userId);
            if (response.success) {
                await fetchPayments();
                return { success: true, data: response.data };
            }
            return { success: false, error: response.message };
        } catch (err) {
            return { success: false, error: err.response?.data?.message || 'Failed to create payment' };
        }
    };

    const getPaymentsByCustomer = async (customerId) => {
        try {
            const response = await paymentService.getPaymentsByCustomer(customerId);
            if (response.success) {
                return { success: true, data: response.data };
            }
            return { success: false, error: response.message };
        } catch (err) {
            return { success: false, error: err.response?.data?.message || 'Failed to fetch customer payments' };
        }
    };

    return {
        payments,
        loading,
        error,
        createPayment,
        getPaymentsByCustomer,
        refetch: fetchPayments,
    };
};