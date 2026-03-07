import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './layouts/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import ProductsListPage from './pages/admin/ProductsListPage';
import ProductFormPage from './pages/admin/ProductFormPage';
import CategoriesPage from './pages/admin/CategoriesPage';
import OrdersListPage from './pages/admin/OrdersListPage';
import OrderDetailPage from './pages/admin/OrderDetailPage';
import HomepageManagerPage from './pages/admin/HomepageManagerPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public / Customer routes */}
        <Route path="/" element={<><Navbar /><div className="p-8 text-center text-gray-500">Home — coming soon</div></>} />
        <Route path="/register" element={<><Navbar /><RegisterPage /></>} />
        <Route path="/login" element={<><Navbar /><LoginPage /></>} />
        <Route path="/shop" element={<><Navbar /><div className="p-8 text-center text-gray-500">Shop — coming soon</div></>} />
        <Route path="/profile" element={<><Navbar /><ProtectedRoute><ProfilePage /></ProtectedRoute></>} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="products" element={<ProductsListPage />} />
          <Route path="products/new" element={<ProductFormPage />} />
          <Route path="products/:id/edit" element={<ProductFormPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="orders" element={<OrdersListPage />} />
          <Route path="orders/:id" element={<OrderDetailPage />} />
          <Route path="homepage" element={<HomepageManagerPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
