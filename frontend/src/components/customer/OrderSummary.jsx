import React from 'react';

const OrderSummary = ({ subtotal, shipping, tax, total, itemCount, onCheckout, loading }) => {
  return (
    <div className="bg-white px-6 py-6 border border-gray-200 rounded-sm">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
          <span>৳{subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-sm text-gray-600">
          <span>Shipping</span>
          <span>Calculated at checkout</span>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-4 mb-6">
        <div className="flex justify-between items-center font-bold text-lg text-gray-900">
          <span>Total</span>
          <span>৳{total.toFixed(2)}</span>
        </div>
      </div>
      
      <button
        onClick={onCheckout}
        disabled={loading}
        className={`w-full py-3 px-4 text-center text-sm font-bold uppercase tracking-wider text-white transition-colors rounded-sm ${
          loading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-gray-900 hover:bg-gray-800'
        }`}
      >
        {loading ? 'Processing...' : 'Proceed to Checkout'}
      </button>
      
      <p className="text-xs text-center text-gray-400 mt-4">
        Shipping & taxes calculated at checkout
      </p>
    </div>
  );
};

export default OrderSummary;
