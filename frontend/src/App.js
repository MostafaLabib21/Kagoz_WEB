import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import CustomerLayout from './layouts/CustomerLayout';
import HomePage from './pages/customer/HomePage';
import ProductPage from './pages/customer/ProductPage';
import ShopPage from './pages/customer/ShopPage';
import AboutPage from './pages/customer/AboutPage';
import ContactPage from './pages/customer/ContactPage';
import ShippingPage from './pages/customer/ShippingPage';
import ReturnsPage from './pages/customer/ReturnsPage';
import CartPage from './pages/customer/CartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import OrderConfirmationPage from './pages/customer/OrderConfirmationPage';
import MyOrdersPage from './pages/customer/MyOrdersPage';
import ProfilePage from './pages/customer/ProfilePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
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
import SettingsPage from './pages/admin/SettingsPage';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Customer routes */}
        <Route element={<CustomerLayout />}>
          <Route path="/product/:slug" element={<ProductPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          } />
          <Route path="/order-confirmation/:orderId" element={
            <ProtectedRoute>
              <OrderConfirmationPage />
            </ProtectedRoute>
          } />
          <Route path="/my-orders" element={
            <ProtectedRoute>
              <MyOrdersPage />
            </ProtectedRoute>
          } />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/shipping" element={<ShippingPage />} />
          <Route path="/returns" element={<ReturnsPage />} />
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
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
