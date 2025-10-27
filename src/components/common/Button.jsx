import React from 'react';

const Button = ({
                    children,
                    variant = 'primary',
                    size = 'md',
                    disabled = false,
                    loading = false,
                    className = '',
                    ...props
                }) => {
    const baseClasses = 'font-inter font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed touch-target prevent-zoom';

    const variants = {
        primary: 'bg-primary-500 hover:bg-primary-600 text-white focus:ring-primary-500',
        secondary: 'bg-secondary-500 hover:bg-secondary-600 text-white focus:ring-secondary-500',
        outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-primary-500',
        danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500',
    };

    const sizes = {
        sm: 'px-3 py-2 text-sm min-h-[36px]',
        md: 'px-4 py-2.5 text-sm min-h-[44px]',
        lg: 'px-6 py-3 text-base min-h-[48px]',
        xl: 'px-8 py-4 text-lg min-h-[52px]',
    };

    return (
        <button
            className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                </div>
            ) : (
                children
            )}
        </button>
    );
};

export default Button;