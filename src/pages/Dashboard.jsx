import React from 'react';
import {
    IndianRupee,
    TrendingUp,
    AlertTriangle,
    CreditCard,
    RefreshCw
} from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';
import { useProducts } from '../hooks/useProducts';
import StatCard from '../components/dashboard/StatCard';
import RecentSales from '../components/dashboard/RecentSales';
import LowStockAlerts from '../components/dashboard/LowStockAlerts';
import Button from '../components/common/Button';

const Dashboard = () => {
        const { dashboardData, loading, error, refetch } = useDashboard();
    const { products } = useProducts();

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
        }).format(amount || 0);
    };

    return (
        <div className="space-y-4 sm:space-y-6 main-content">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Dashboard</h1>
                    <p className="text-gray-600 mt-1 text-sm sm:text-base">Overview of your fertilizer store</p>
                </div>
                <Button
                    variant="outline"
                    onClick={refetch}
                    className="sm:self-start"
                    disabled={loading}
                    size="sm"
                >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Today's Sales"
                    value={formatCurrency(dashboardData?.dailySales?.totalSalesAmount)}
                    subtitle={`${dashboardData?.dailySales?.totalInvoices || 0} invoices`}
                    icon={<IndianRupee className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />}
                    className="col-span-1"
                />

                <StatCard
                    title="Monthly Revenue"
                    value={formatCurrency(dashboardData?.monthlyRevenue?.totalRevenue)}
                    subtitle={`${dashboardData?.monthlyRevenue?.totalTransactions || 0} transactions`}
                    icon={<TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />}
                    trend={dashboardData?.monthlyRevenue?.growthPercentage}
                    className="col-span-1"
                />

                <StatCard
                    title="Low Stock"
                    value={dashboardData?.lowStockAlerts?.length || 0}
                    subtitle="items need attention"
                    icon={<AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />}
                    className="col-span-1"
                />

                <StatCard
                    title="Pending Payments"
                    value={formatCurrency(dashboardData?.dailySales?.creditSales)}
                    subtitle="from credit customers"
                    icon={<CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />}
                    className="col-span-1"
                />
            </div>

            {loading && (
                <div className="flex items-center justify-center min-h-48 sm:min-h-64">
                    <div className="text-center">
                        <RefreshCw className="h-8 w-8 text-primary-500 animate-spin mx-auto mb-4" />
                        <p className="text-gray-500 text-sm sm:text-base">Loading dashboard data...</p>
                    </div>
                </div>
            )}

            {error && !loading && (
                <div className="text-center py-8 sm:py-12">
                    <div className="text-red-500 mb-4">
                        <AlertTriangle className="h-12 w-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load dashboard</h3>
                    <p className="text-gray-500 mb-4 text-sm sm:text-base">{error}</p>
                    <Button onClick={refetch} size="sm">Try Again</Button>
                </div>
            )}

            {dashboardData && !loading && (
                <>
                    {/* Charts and Additional Stats */}
                    <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
                        {/* Sales Trend Chart */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Trend (Last 7 Days)</h3>
                            <div className="space-y-2 sm:space-y-3">
                                {dashboardData.salesTrends?.slice(0, 7).map((trend, index) => (
                                    <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 capitalize truncate flex-1 mr-4">
                      {trend.period}
                    </span>
                                        <div className="flex items-center space-x-2 sm:space-x-4 flex-1 max-w-48">
                                            <div className="w-full bg-gray-200 rounded-full h-2 flex-1">
                                                <div
                                                    className="bg-primary-500 h-2 rounded-full"
                                                    style={{
                                                        width: `${Math.min((trend.salesAmount / (dashboardData.monthlyRevenue?.totalRevenue / 30)) * 100, 100)}%`
                                                    }}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-medium text-gray-900 w-16 sm:w-20 text-right text-xs sm:text-sm">
                        {formatCurrency(trend.salesAmount)}
                      </span>
                                        </div>
                                    </div>
                                ))}
                                {(!dashboardData.salesTrends || dashboardData.salesTrends.length === 0) && (
                                    <p className="text-center text-gray-500 py-4 text-sm">No sales data available</p>
                                )}
                            </div>
                        </div>

                        {/* Payment Breakdown */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Payment Breakdown</h3>
                            <div className="space-y-3 sm:space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Cash Sales</span>
                                    <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(dashboardData.dailySales?.cashSales)}
                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Credit Sales</span>
                                    <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(dashboardData.dailySales?.creditSales)}
                  </span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                                    <span className="text-sm font-semibold text-gray-900">Total Tax</span>
                                    <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(dashboardData.dailySales?.totalTaxAmount)}
                  </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Sales and Low Stock Alerts */}
                    <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
                        <RecentSales sales={dashboardData.recentSales || []} />
                        <LowStockAlerts products={products} />
                    </div>

                    {/* Current Month Purchases */}
                    {dashboardData?.currentMonthPurchases && dashboardData.currentMonthPurchases.length > 0 && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">Current Month Purchases</h3>
                            </div>
                            <div className="p-4 sm:p-6">
                                <div className="space-y-3">
                                    {dashboardData.currentMonthPurchases.slice(0, 5).map((purchase, index) => (
                                        <div key={index} className="flex items-center justify-between py-2">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">{purchase.supplierName}</p>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(purchase.purchaseDate).toLocaleDateString('en-IN')} • {purchase.itemCount} items
                                                </p>
                                            </div>
                                            <span className="text-sm font-semibold text-gray-900 ml-4 whitespace-nowrap">
                        {formatCurrency(purchase.totalAmount)}
                      </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Dashboard;