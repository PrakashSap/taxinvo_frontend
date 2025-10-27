// App.js
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from "./components/common/Layout";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Sales from "./pages/Sales";
import Purchases from "./pages/Purchases";
import Customers from "./pages/Customers";
import Login from "./components/auth/Login";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./hooks/useAuth";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public route - without Layout */}
                    <Route path="/login" element={<Login />} />

                    {/* Protected routes - with Layout */}
                    <Route path="/" element={
                        <ProtectedRoute>
                            <Layout>
                                <Dashboard />
                            </Layout>
                        </ProtectedRoute>
                    } />

                    <Route path="/products" element={
                        <ProtectedRoute>
                            <Layout>
                                <Products />
                            </Layout>
                        </ProtectedRoute>
                    } />

                    <Route path="/sales" element={
                        <ProtectedRoute>
                            <Layout>
                                <Sales />
                            </Layout>
                        </ProtectedRoute>
                    } />

                    <Route path="/customers" element={
                        <ProtectedRoute>
                            <Layout>
                                <Customers />
                            </Layout>
                        </ProtectedRoute>
                    } />

                    <Route path="/purchases" element={
                        <ProtectedRoute>
                            <Layout>
                                <Purchases />
                            </Layout>
                        </ProtectedRoute>
                    } />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;