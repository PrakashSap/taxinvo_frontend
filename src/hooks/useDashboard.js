import { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';

export const useDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await dashboardService.getDashboardData();
            if (response.success) {
                setDashboardData(response.data);
            } else {
                setError(response.message || 'Failed to fetch dashboard data');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch dashboard data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const refetch = () => {
        fetchDashboardData();
    };

    return {
        dashboardData,
        loading,
        error,
        refetch,
    };
};