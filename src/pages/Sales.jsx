import React, { useState, useMemo } from 'react';
import { Receipt, Plus, Filter, RefreshCw, AlertTriangle, Calendar } from 'lucide-react';
import { useSales } from '../hooks/useSales';
import Button from '../components/common/Button';
import SearchBar from '../components/common/SearchBar';
import FilterSelect from '../components/common/FilterSelect';
import SalesTable from '../components/sales/SalesTable';
import SaleForm from '../components/sales/SaleForm';
import SaleDetails from '../components/sales/SaleDetails';

const Sales = () => {
    const {
        sales,
        loading,
        error,
        createSale,
        refetch
    } = useSales();

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [paymentFilter, setPaymentFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [showSaleForm, setShowSaleForm] = useState(false);
    const [selectedSale, setSelectedSale] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    // Filter sales based on search and filters
    const filteredSales = useMemo(() => {
        return sales.filter(sale => {
            const matchesSearch =
                sale.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (sale.customer?.name || sale.customerName || '').toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = !statusFilter || sale.paymentStatus === statusFilter;

            const matchesPayment = !paymentFilter || sale.paymentMethod === paymentFilter;

            const matchesDate = !dateFilter || (
                dateFilter === 'today' && new Date(sale.invoiceDate).toDateString() === new Date().toDateString()
            ) || (
                dateFilter === 'week' && (
                    new Date(sale.invoiceDate) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                )
            ) || (
                dateFilter === 'month' && (
                    new Date(sale.invoiceDate).getMonth() === new Date().getMonth() &&
                    new Date(sale.invoiceDate).getFullYear() === new Date().getFullYear()
                )
            );

            return matchesSearch && matchesStatus && matchesPayment && matchesDate;
        });
    }, [sales, searchTerm, statusFilter, paymentFilter, dateFilter]);

    const handleCreateSale = async (saleData) => {
        setFormLoading(true);
        const userId = localStorage.getItem('userId') || '1';
        const result = await createSale(saleData, userId);
        setFormLoading(false);

        if (result.success) {
            setShowSaleForm(false);
            // You might want to show a success message here
        } else {
            alert(result.error); // In real app, use toast notification
        }
    };

    const handleViewSale = (sale) => {
        setSelectedSale(sale);
    };

    const handleCloseDetails = () => {
        setSelectedSale(null);
    };

    const statusOptions = [
        { value: '', label: 'All Status' },
        { value: 'paid', label: 'Paid' },
        { value: 'credit', label: 'Credit' },
    ];

    const paymentOptions = [
        { value: '', label: 'All Methods' },
        { value: 'cash', label: 'Cash' },
        { value: 'upi', label: 'UPI' },
        { value: 'card', label: 'Card' },
        { value: 'credit', label: 'Credit' },
    ];

    const dateOptions = [
        { value: '', label: 'All Time' },
        { value: 'today', label: 'Today' },
        { value: 'week', label: 'This Week' },
        { value: 'month', label: 'This Month' },
    ];

    // Calculate summary statistics
    const summaryStats = useMemo(() => {
        const totalSales = filteredSales.length;
        const totalAmount = filteredSales.reduce((sum, sale) => sum + (sale.grandTotal || 0), 0);
        const paidSales = filteredSales.filter(sale => sale.paymentStatus === 'paid').length;
        const creditSales = filteredSales.filter(sale => sale.paymentStatus === 'credit').length;

        return {
            totalSales,
            totalAmount,
            paidSales,
            creditSales,
        };
    }, [filteredSales]);

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="text-red-500 mb-4">
                    <AlertTriangle className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load sales</h3>
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
                    <h1 className="text-2xl font-bold text-gray-900">Sales</h1>
                    <p className="text-gray-600 mt-1">Manage your sales invoices and customer billing</p>
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
                        onClick={() => setShowSaleForm(true)}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        New Sale
                    </Button>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">{summaryStats.totalSales}</div>
                    <div className="text-sm text-gray-500">Total Invoices</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">
                        ₹{summaryStats.totalAmount.toLocaleString('en-IN')}
                    </div>
                    <div className="text-sm text-gray-500">Total Amount</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">{summaryStats.paidSales}</div>
                    <div className="text-sm text-gray-500">Paid Invoices</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">{summaryStats.creditSales}</div>
                    <div className="text-sm text-gray-500">Credit Sales</div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
                    <div className="sm:col-span-2">
                        <SearchBar
                            value={searchTerm}
                            onChange={setSearchTerm}
                            placeholder="Search by invoice number or customer name..."
                        />
                    </div>
                    <div>
                        <FilterSelect
                            value={statusFilter}
                            onChange={setStatusFilter}
                            options={statusOptions}
                            placeholder="Payment Status"
                        />
                    </div>
                    <div>
                        <FilterSelect
                            value={paymentFilter}
                            onChange={setPaymentFilter}
                            options={paymentOptions}
                            placeholder="Payment Method"
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

            {/* Sales Table */}
            <SalesTable
                sales={filteredSales}
                loading={loading}
                onView={handleViewSale}
            />

            {/* Sale Form Modal */}
            <SaleForm
                isOpen={showSaleForm}
                onClose={() => setShowSaleForm(false)}
                onSubmit={handleCreateSale}
                loading={formLoading}
            />

            {/* Sale Details Modal */}
            {selectedSale && (
                <SaleDetails
                    sale={selectedSale}
                    isOpen={!!selectedSale}
                    onClose={handleCloseDetails}
                />
            )}
        </div>
    );
};

export default Sales;