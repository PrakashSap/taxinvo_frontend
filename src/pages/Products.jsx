import React, { useState, useMemo } from 'react';
import { Package, Plus, Filter, RefreshCw, AlertTriangle } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import Button from '../components/common/Button';
import SearchBar from '../components/common/SearchBar';
import FilterSelect from '../components/common/FilterSelect';
import ProductTable from '../components/products/ProductTable';
import ProductForm from '../components/products/ProductForm';

const Products = () => {
    const {
        products,
        loading,
        error,
        createProduct,
        updateProduct,
        deleteProduct,
        refetch
    } = useProducts();

    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [stockFilter, setStockFilter] = useState('');
    const [showProductForm, setShowProductForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    // Filter products based on search and filters
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.hsnCode?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCategory = !categoryFilter || product.category === categoryFilter;

            const matchesStock = !stockFilter ||
                (stockFilter === 'low' && product.currentStock <= product.minStock) ||
                (stockFilter === 'out' && product.currentStock === 0) ||
                (stockFilter === 'normal' && product.currentStock > product.minStock);

            return matchesSearch && matchesCategory && matchesStock;
        });
    }, [products, searchTerm, categoryFilter, stockFilter]);

    const handleCreateProduct = async (productData) => {
        setFormLoading(true);
        const result = await createProduct(productData);
        setFormLoading(false);

        if (result.success) {
            setShowProductForm(false);
        } else {
            alert(result.error); // In real app, use toast notification
        }
    };

    const handleUpdateProduct = async (productData) => {
        setFormLoading(true);
        const result = await updateProduct(editingProduct.id, productData);
        setFormLoading(false);

        if (result.success) {
            setShowProductForm(false);
            setEditingProduct(null);
        } else {
            alert(result.error);
        }
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setShowProductForm(true);
    };

    const handleDeleteProduct = async (product) => {
        if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
            const result = await deleteProduct(product.id);
            if (!result.success) {
                alert(result.error);
            }
        }
    };

    const handleFormSubmit = (productData) => {
        if (editingProduct) {
            handleUpdateProduct(productData);
        } else {
            handleCreateProduct(productData);
        }
    };

    const handleCloseForm = () => {
        setShowProductForm(false);
        setEditingProduct(null);
    };

    const categoryOptions = [
        { value: '', label: 'All Categories' },
        { value: 'fertilizer', label: 'Fertilizer' },
        { value: 'pesticide', label: 'Pesticide' },
        { value: 'seed', label: 'Seed' },
    ];

    const stockOptions = [
        { value: '', label: 'All Stock' },
        { value: 'low', label: 'Low Stock' },
        { value: 'out', label: 'Out of Stock' },
        { value: 'normal', label: 'Normal Stock' },
    ];

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="text-red-500 mb-4">
                    <AlertTriangle className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load products</h3>
                <p className="text-gray-500 mb-4">{error}</p>
                <Button onClick={refetch}>Try Again</Button>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6 main-content">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                    <p className="text-gray-600 mt-1">Manage your fertilizer, pesticide, and seed products</p>
                </div>
                <div className="flex space-x-3 mt-4 sm:mt-0">
                    <Button
                        variant="outline"
                        onClick={refetch}
                        disabled={loading}
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>
                    <Button
                        onClick={() => setShowProductForm(true)}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                    <div className="sm:col-span-2">
                        <SearchBar
                            value={searchTerm}
                            onChange={setSearchTerm}
                            placeholder="Search products by name or HSN code..."
                        />
                    </div>
                    <div>
                        <FilterSelect
                            value={categoryFilter}
                            onChange={setCategoryFilter}
                            options={categoryOptions}
                            placeholder="All Categories"
                        />
                    </div>
                    <div>
                        <FilterSelect
                            value={stockFilter}
                            onChange={setStockFilter}
                            options={stockOptions}
                            placeholder="All Stock"
                        />
                    </div>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">{products.length}</div>
                    <div className="text-sm text-gray-500">Total Products</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">
                        {products.filter(p => p.category === 'fertilizer').length}
                    </div>
                    <div className="text-sm text-gray-500">Fertilizers</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">
                        {products.filter(p => p.category === 'pesticide').length}
                    </div>
                    <div className="text-sm text-gray-500">Pesticides</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">
                        {products.filter(p => p.currentStock <= p.minStock).length}
                    </div>
                    <div className="text-sm text-gray-500">Low Stock</div>
                </div>
            </div>

            {/* Products Table */}
            <ProductTable
                products={filteredProducts}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                loading={loading}
            />

            {/* Product Form Modal */}
            <ProductForm
                isOpen={showProductForm}
                onClose={handleCloseForm}
                product={editingProduct}
                onSubmit={handleFormSubmit}
                loading={formLoading}
            />
        </div>
    );
};

export default Products;