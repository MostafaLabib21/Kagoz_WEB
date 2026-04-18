import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import CartItemRow from '../../components/customer/CartItemRow';
import OrderSummary from '../../components/customer/OrderSummary';
import EmptyCart from '../../components/customer/EmptyCart';

const CartPage = () => {
  const {
    cartItems,
    cartCount,
    subtotal,
    shipping,
    tax,
    total,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const [navigating, setNavigating] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const handleCheckout = () => {
    setNavigating(true);
    // Simulate navigation delay or process
    setTimeout(() => {
      if (user) {
        navigate('/checkout');
      } else {
        navigate('/login?redirect=checkout');
      }
      setNavigating(false);
    }, 500);
  };

  const handleClearCart = () => {
    clearCart();
    setConfirmClear(false);
  };

  if (cartItems.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Cart</h1>
          <p className="text-sm text-gray-500 mt-1">
            {cartCount} {cartCount === 1 ? 'item' : 'items'}
          </p>
        </div>

        {confirmClear ? (
          <div className="flex items-center gap-4 bg-red-50 px-4 py-2 rounded-sm border border-red-100">
            <span className="text-sm text-gray-700">Are you sure?</span>
            <button
              onClick={handleClearCart}
              className="text-sm font-medium text-red-600 hover:text-red-800 underline"
            >
              Yes, clear
            </button>
            <button
              onClick={() => setConfirmClear(false)}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmClear(true)}
            className="text-sm text-red-500 hover:text-red-700 underline transition-colors"
          >
            Clear Cart
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
        {/* Cart Items List */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-sm px-6 py-2">
            {cartItems.map((item) => (
              <CartItemRow
                key={`${item.productId}-${item.variant}`}
                item={item}
                onRemove={removeFromCart}
                onUpdateQuantity={updateQuantity}
              />
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <OrderSummary
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              total={total}
              itemCount={cartCount}
              onCheckout={handleCheckout}
              loading={navigating}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
