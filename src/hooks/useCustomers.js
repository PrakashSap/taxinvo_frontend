import { useState, useEffect } from 'react';
import { customerService } from '../services/customerService';

export const useCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await customerService.getAllCustomers();
            if (response.success) {
                setCustomers(response.data);
            } else {
                setError(response.message || 'Failed to fetch customers');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch customers');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const createCustomer = async (customerData) => {
        try {
            const response = await customerService.createCustomer(customerData);
            if (response.success) {
                await fetchCustomers(); // Refresh the list
                return { success: true, data: response.data };
            }
            return { success: false, error: response.message };
        } catch (err) {
            return { success: false, error: err.response?.data?.message || 'Failed to create customer' };
        }
    };

    const updateCustomer = async (id, customerData) => {
        try {
            const response = await customerService.updateCustomer(id, customerData);
            if (response.success) {
                await fetchCustomers(); // Refresh the list
                return { success: true, data: response.data };
            }
            return { success: false, error: response.message };
        } catch (err) {
            return { success: false, error: err.response?.data?.message || 'Failed to update customer' };
        }
    };

    const deleteCustomer = async (id) => {
        try {
            const response = await customerService.deleteCustomer(id);
            if (response.success) {
                await fetchCustomers(); // Refresh the list
                return { success: true };
            }
            return { success: false, error: response.message };
        } catch (err) {
            return { success: false, error: err.response?.data?.message || 'Failed to delete customer' };
        }
    };

    const getActiveCustomers = async () => {
        try {
            const response = await customerService.getActiveCustomers();
            if (response.success) {
                return { success: true, data: response.data };
            }
            return { success: false, error: response.message };
        } catch (err) {
            return { success: false, error: err.response?.data?.message || 'Failed to fetch active customers' };
        }
    };

    return {
        customers,
        loading,
        error,
        createCustomer,
        updateCustomer,
        deleteCustomer,
        getActiveCustomers,
        refetch: fetchCustomers,
    };
};