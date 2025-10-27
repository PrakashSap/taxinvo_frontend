import { useState, useEffect } from 'react';
import { productService } from '../services/productService';

export const useProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await productService.getAllProducts();
            if (response.success) {
                setProducts(response.data);
            } else {
                setError(response.message || 'Failed to fetch products');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const createProduct = async (productData) => {
        try {
            const response = await productService.createProduct(productData);
            if (response.success) {
                await fetchProducts(); // Refresh the list
                return { success: true, data: response.data };
            }
            return { success: false, error: response.message };
        } catch (err) {
            return { success: false, error: err.response?.data?.message || 'Failed to create product' };
        }
    };

    const updateProduct = async (id, productData) => {
        try {
            const response = await productService.updateProduct(id, productData);
            if (response.success) {
                await fetchProducts(); // Refresh the list
                return { success: true, data: response.data };
            }
            return { success: false, error: response.message };
        } catch (err) {
            return { success: false, error: err.response?.data?.message || 'Failed to update product' };
        }
    };

    const deleteProduct = async (id) => {
        try {
            const response = await productService.deleteProduct(id);
            if (response.success) {
                await fetchProducts(); // Refresh the list
                return { success: true };
            }
            return { success: false, error: response.message };
        } catch (err) {
            return { success: false, error: err.response?.data?.message || 'Failed to delete product' };
        }
    };

    const getLowStockProducts = async () => {
        try {
            const response = await productService.getLowStockProducts();
            if (response.success) {
                return { success: true, data: response.data };
            }
            return { success: false, error: response.message };
        } catch (err) {
            return { success: false, error: err.response?.data?.message || 'Failed to fetch low stock products' };
        }
    };

    return {
        products,
        loading,
        error,
        createProduct,
        updateProduct,
        deleteProduct,
        getLowStockProducts,
        refetch: fetchProducts,
    };
};