import React, { useState, useMemo } from 'react';
import { Users, Plus, Filter, RefreshCw, AlertTriangle, CreditCard } from 'lucide-react';
import { useCustomers } from '../hooks/useCustomers';
import Button from '../components/common/Button';
import SearchBar from '../components/common/SearchBar';
import FilterSelect from '../components/common/FilterSelect';
import CustomersTable from '../components/customers/CustomersTable';
import CustomerForm from '../components/customers/CustomerForm';
import CustomerDetails from '../components/customers/CustomerDetails';

const Customers = () => {
    const {
        customers,
        loading,
        error,
        createCustomer,
        updateCustomer,
        deleteCustomer,
        refetch
    } = useCustomers();

    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showCustomerForm, setShowCustomerForm] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    // Filter customers based on search and filters
    const filteredCustomers = useMemo(() => {
        return customers.filter(customer => {
            const matchesSearch =
                customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.gstin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.address?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesType = !typeFilter || customer.type === typeFilter;

            const matchesStatus = !statusFilter ||
                (statusFilter === 'active' && customer.isActive) ||
                (statusFilter === 'inactive' && !customer.isActive);

            return matchesSearch && matchesType && matchesStatus;
        });
    }, [customers, searchTerm, typeFilter, statusFilter]);

    const handleCreateCustomer = async (customerData) => {
        setFormLoading(true);
        const result = await createCustomer(customerData);
        setFormLoading(false);

        if (result.success) {
            setShowCustomerForm(false);
        } else {
            alert(result.error);
        }
    };

    const handleUpdateCustomer = async (customerData) => {
        setFormLoading(true);
        const result = await updateCustomer(editingCustomer.id, customerData);
        setFormLoading(false);

        if (result.success) {
            setShowCustomerForm(false);
            setEditingCustomer(null);
        } else {
            alert(result.error);
        }
    };

    const handleEditCustomer = (customer) => {
        setEditingCustomer(customer);
        setShowCustomerForm(true);
    };

    const handleDeleteCustomer = async (customer) => {
        if (window.confirm(`Are you sure you want to delete "${customer.name}"? This action cannot be undone.`)) {
            const result = await deleteCustomer(customer.id);
            if (!result.success) {
                alert(result.error);
            }
        }
    };

    const handleViewCustomer = (customer) => {
        setSelectedCustomer(customer);
    };

    const handleCloseDetails = () => {
        setSelectedCustomer(null);
    };

    const handleFormSubmit = (customerData) => {
        if (editingCustomer) {
            handleUpdateCustomer(customerData);
        } else {
            handleCreateCustomer(customerData);
        }
    };

    const handleCloseForm = () => {
        setShowCustomerForm(false);
        setEditingCustomer(null);
    };

    const typeOptions = [
        { value: '', label: 'All Types' },
        { value: 'retail', label: 'Retail Customers' },
        { value: 'sub_dealer', label: 'Sub-dealers' },
    ];

    const statusOptions = [
        { value: '', label: 'All Status' },
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
    ];

    // Calculate summary statistics
    const summaryStats = useMemo(() => {
        const totalCustomers = filteredCustomers.length;
        const retailCustomers = filteredCustomers.filter(c => c.type === 'retail').length;
        const subDealers = filteredCustomers.filter(c => c.type === 'sub_dealer').length;
        const activeCustomers = filteredCustomers.filter(c => c.isActive).length;

        const totalCreditLimit = filteredCustomers
            .filter(c => c.type === 'sub_dealer')
            .reduce((sum, customer) => sum + (customer.creditLimit || 0), 0);

        const totalOutstanding = filteredCustomers
            .filter(c => c.type === 'sub_dealer')
            .reduce((sum, customer) => sum + (customer.currentBalance || 0), 0);

        return {
            totalCustomers,
            retailCustomers,
            subDealers,
            activeCustomers,
            totalCreditLimit,
            totalOutstanding,
        };
    }, [filteredCustomers]);

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="text-red-500 mb-4">
                    <AlertTriangle className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load customers</h3>
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
                    <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
                    <p className="text-gray-600 mt-1">Manage your retail customers and sub-dealers</p>
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
                        onClick={() => setShowCustomerForm(true)}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Customer
                    </Button>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">{summaryStats.totalCustomers}</div>
                    <div className="text-sm text-gray-500">Total Customers</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">{summaryStats.retailCustomers}</div>
                    <div className="text-sm text-gray-500">Retail Customers</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">{summaryStats.subDealers}</div>
                    <div className="text-sm text-gray-500">Sub-dealers</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">{summaryStats.activeCustomers}</div>
                    <div className="text-sm text-gray-500">Active</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">
                        ₹{(summaryStats.totalOutstanding).toLocaleString('en-IN')}
                    </div>
                    <div className="text-sm text-gray-500">Outstanding</div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                    <div className="sm:col-span-2">
                        <SearchBar
                            value={searchTerm}
                            onChange={setSearchTerm}
                            placeholder="Search customers by name, phone, GSTIN, or address..."
                        />
                    </div>
                    <div>
                        <FilterSelect
                            value={typeFilter}
                            onChange={setTypeFilter}
                            options={typeOptions}
                            placeholder="Customer Type"
                        />
                    </div>
                    <div>
                        <FilterSelect
                            value={statusFilter}
                            onChange={setStatusFilter}
                            options={statusOptions}
                            placeholder="Status"
                        />
                    </div>
                </div>
            </div>

            {/* Credit Summary for Sub-dealers */}
            {summaryStats.subDealers > 0 && (
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center space-x-3 mb-3">
                        <CreditCard className="h-5 w-5 text-blue-600" />
                        <h3 className="text-lg font-medium text-blue-900">Sub-dealer Credit Summary</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-blue-900">
                                ₹{summaryStats.totalCreditLimit.toLocaleString('en-IN')}
                            </p>
                            <p className="text-sm text-blue-700">Total Credit Limit</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-blue-900">
                                ₹{summaryStats.totalOutstanding.toLocaleString('en-IN')}
                            </p>
                            <p className="text-sm text-blue-700">Total Outstanding</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-blue-900">
                                ₹{(summaryStats.totalCreditLimit - summaryStats.totalOutstanding).toLocaleString('en-IN')}
                            </p>
                            <p className="text-sm text-blue-700">Available Credit</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Customers Table */}
            <CustomersTable
                customers={filteredCustomers}
                onEdit={handleEditCustomer}
                onDelete={handleDeleteCustomer}
                loading={loading}
            />

            {/* Customer Form Modal */}
            <CustomerForm
                isOpen={showCustomerForm}
                onClose={handleCloseForm}
                customer={editingCustomer}
                onSubmit={handleFormSubmit}
                loading={formLoading}
            />

            {/* Customer Details Modal */}
            {selectedCustomer && (
                <CustomerDetails
                    customer={selectedCustomer}
                    isOpen={!!selectedCustomer}
                    onClose={handleCloseDetails}
                />
            )}
        </div>
    );
};

export default Customers;