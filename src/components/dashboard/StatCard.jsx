import React from 'react';

const StatCard = ({ title, value, subtitle, icon, trend, className = '' }) => {
    const getTrendColor = (trend) => {
        if (trend > 0) return 'text-green-600';
        if (trend < 0) return 'text-red-600';
        return 'text-gray-600';
    };

    const getTrendIcon = (trend) => {
        if (trend > 0) return '↗';
        if (trend < 0) return '↘';
        return '→';
    };

    return (
        <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                        {icon}
                    </div>
                </div>
                <div className="ml-4 flex-1">
                    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
                    <div className="flex items-baseline">
                        <p className="text-2xl font-semibold text-gray-900">{value}</p>
                        {trend !== undefined && (
                            <span className={`ml-2 text-sm ${getTrendColor(trend)}`}>
                {getTrendIcon(trend)} {Math.abs(trend)}%
              </span>
                        )}
                    </div>
                    {subtitle && (
                        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StatCard;