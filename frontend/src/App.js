import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import CustomerLayout from './layouts/CustomerLayout';
import HomePage from './pages/customer/HomePage';
import ProductPage from './pages/customer/ProductPage';
import PlaceholderPage from './components/PlaceholderPage';
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
      <ScrollToTop />
      <Routes>
        {/* Customer routes */}
        <Route element={<CustomerLayout />}>
          <Route path="/product/:slug" element={<ProductPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<PlaceholderPage title="Shop — Coming Soon" />} />
          <Route path="/cart" element={<PlaceholderPage title="Cart — Coming Soon" />} />
          <Route path="/about" element={<PlaceholderPage title="About — Coming Soon" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        </Route>

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
