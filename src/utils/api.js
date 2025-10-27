import axios from 'axios';

// const API_BASE_URL = 'http://localhost:8080/api';
// 💡 CRITICAL CHANGE: Determine BASE_URL conditionally
let API_BASE_URL;

// Check if the application is running in the local development environment
if (process.env.NODE_ENV === 'development') {
    // Use the local URL for development
    // Note: The dev server (e.g., create-react-app) handles proxying or uses this directly
    API_BASE_URL = 'http://localhost:8080/api';
} else {
    // Use the URL specified in the .env file for production builds
    API_BASE_URL = process.env.REACT_APP_API_URL;
}

// Ensure BASE_URL is available
if (!API_BASE_URL) {
    console.error("BASE_URL is not defined! Check your .env setup.");
}

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds timeout
});

// Add request interceptor to include user ID
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    // Remove the user ID interceptor if not needed, or keep it if your backend requires it
    const userId = localStorage.getItem('userId') || '1';
    if (userId && (config.method === 'post' || config.method === 'put' || config.method === 'delete')) {
        config.headers['X-User-Id'] = userId;
    }

    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        console.log(`Response received: ${response.status}`, response.data);
        return response;
    },
    (error) => {
        console.error('API Error:', {
            message: error.message,
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            data: error.response?.data
        });

        // Handle 401 Unauthorized - redirect to login
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Only redirect if not already on login page
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        } else if (error.code === 'ECONNREFUSED') {
            error.message = 'Unable to connect to the server. Please make sure the backend is running.';
        } else if (error.response?.status === 404) {
            error.message = 'Requested resource not found.';
        } else if (error.response?.status >= 500) {
            error.message = 'Server error. Please try again later.';
        }

        return Promise.reject(error);
    }
);

export default api;