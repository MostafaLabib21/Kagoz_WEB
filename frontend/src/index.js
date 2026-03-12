import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from './context/ToastContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ''}>
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
