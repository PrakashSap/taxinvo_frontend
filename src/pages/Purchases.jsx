import React, { useState, useMemo } from 'react';
import { Truck, Plus, Filter, RefreshCw, AlertTriangle, Calendar } from 'lucide-react';
import { usePurchases } from '../hooks/usePurchases';
import Button from '../components/common/Button';
import SearchBar from '../components/common/SearchBar';
import FilterSelect from '../components/common/FilterSelect';
import PurchasesTable from '../components/purchases/PurchasesTable';
import PurchaseForm from '../components/purchases/PurchaseForm';
import PurchaseDetails from '../components/purchases/PurchaseDetails';

const Purchases = () => {
    const {
        purchases,
        loading,
        error,
        createPurchase,
        refetch
    } = usePurchases();

    const [searchTerm, setSearchTerm] = useState('');
    const [supplierFilter, setSupplierFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [showPurchaseForm, setShowPurchaseForm] = useState(false);
    const [selectedPurchase, setSelectedPurchase] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    // Filter purchases based on search and filters
    const filteredPurchases = useMemo(() => {
        return purchases.filter(purchase => {
            const matchesSearch =
                purchase.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                purchase.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (purchase.supplierGstin && purchase.supplierGstin.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesSupplier = !supplierFilter || purchase.supplierName === supplierFilter;

            const matchesDate = !dateFilter || (
                dateFilter === 'today' && new Date(purchase.invoiceDate).toDateString() === new Date().toDateString()
            ) || (
                dateFilter === 'week' && (
                    new Date(purchase.invoiceDate) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                )
            ) || (
                dateFilter === 'month' && (
                    new Date(purchase.invoiceDate).getMonth() === new Date().getMonth() &&
                    new Date(purchase.invoiceDate).getFullYear() === new Date().getFullYear()
                )
            );

            return matchesSearch && matchesSupplier && matchesDate;
        });
    }, [purchases, searchTerm, supplierFilter, dateFilter]);

    const handleCreatePurchase = async (purchaseData) => {
        setFormLoading(true);
        const userId = localStorage.getItem('userId') || '1';
        const result = await createPurchase(purchaseData, userId);
        setFormLoading(false);

        if (result.success) {
            setShowPurchaseForm(false);
            // You might want to show a success message here
        } else {
            alert(result.error); // In real app, use toast notification
        }
    };

    const handleViewPurchase = (purchase) => {
        setSelectedPurchase(purchase);
    };

    const handleCloseDetails = () => {
        setSelectedPurchase(null);
    };

    // Get unique suppliers for filter
    const supplierOptions = useMemo(() => {
        const suppliers = [...new Set(purchases.map(p => p.supplierName))];
        return [
            { value: '', label: 'All Suppliers' },
            ...suppliers.map(supplier => ({
                value: supplier,
                label: supplier,
            })),
        ];
    }, [purchases]);

    const dateOptions = [
        { value: '', label: 'All Time' },
        { value: 'today', label: 'Today' },
        { value: 'week', label: 'This Week' },
        { value: 'month', label: 'This Month' },
    ];

    // Calculate summary statistics
    const summaryStats = useMemo(() => {
        const totalPurchases = filteredPurchases.length;
        const totalAmount = filteredPurchases.reduce((sum, purchase) => sum + (purchase.grandTotal || 0), 0);
        const totalItems = filteredPurchases.reduce((sum, purchase) =>
            sum + (purchase.items?.reduce((itemSum, item) => itemSum + item.quantity, 0) || 0), 0
        );
        const uniqueSuppliers = new Set(filteredPurchases.map(p => p.supplierName)).size;

        return {
            totalPurchases,
            totalAmount,
            totalItems,
            uniqueSuppliers,
        };
    }, [filteredPurchases]);

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="text-red-500 mb-4">
                    <AlertTriangle className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load purchases</h3>
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
                    <h1 className="text-2xl font-bold text-gray-900">Purchases</h1>
                    <p className="text-gray-600 mt-1">Manage your purchase orders and inventory intake</p>
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
                        onClick={() => setShowPurchaseForm(true)}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        New Purchase
                    </Button>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">{summaryStats.totalPurchases}</div>
                    <div className="text-sm text-gray-500">Total Purchases</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">
                        ₹{summaryStats.totalAmount.toLocaleString('en-IN')}
                    </div>
                    <div className="text-sm text-gray-500">Total Amount</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">{summaryStats.totalItems}</div>
                    <div className="text-sm text-gray-500">Items Received</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">{summaryStats.uniqueSuppliers}</div>
                    <div className="text-sm text-gray-500">Suppliers</div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                    <div className="sm:col-span-2">
                        <SearchBar
                            value={searchTerm}
                            onChange={setSearchTerm}
                            placeholder="Search by invoice number, supplier name, or GSTIN..."
                        />
                    </div>
                    <div>
                        <FilterSelect
                            value={supplierFilter}
                            onChange={setSupplierFilter}
                            options={supplierOptions}
                            placeholder="Select Supplier"
                        />
                    </div>
                    <div>
                        <FilterSelect
                            value={dateFilter}
                            onChange={setDateFilter}
                            options={dateOptions}
                            placeholder="Date Range"
                        />
                    </div>
                </div>
            </div>

            {/* Purchases Table */}
            <PurchasesTable
                purchases={filteredPurchases}
                loading={loading}
                onView={handleViewPurchase}
            />

            {/* Purchase Form Modal */}
            <PurchaseForm
                isOpen={showPurchaseForm}
                onClose={() => setShowPurchaseForm(false)}
                onSubmit={handleCreatePurchase}
                loading={formLoading}
            />

            {/* Purchase Details Modal */}
            {selectedPurchase && (
                <PurchaseDetails
                    purchase={selectedPurchase}
                    isOpen={!!selectedPurchase}
                    onClose={handleCloseDetails}
                />
            )}
        </div>
    );
};

export default Purchases;