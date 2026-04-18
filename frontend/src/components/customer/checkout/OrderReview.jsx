import React from 'react';
import { Truck, Loader } from 'lucide-react';

const OrderReview = ({
  cartItems,
  shippingAddress,
  subtotal,
  shipping,
  tax,
  total,
  onBack,
  onPlaceOrder,
  loading,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* LEFT COLUMN */}
      <div className="lg:col-span-2 space-y-4">
        {/* Card 1: Items in your order */}
        <div className="bg-white border border-gray-200 rounded-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-4">
            Items ({cartItems.length})
          </h3>

          <div className="space-y-3 divide-y divide-gray-100">
            {cartItems.map((item, index) => (
              <div
                key={`${item.productId}-${item.variant}-${index}`}
                className="flex items-center gap-3 py-2 pt-3 first:pt-0"
              >
                {/* Image */}
                <div className="h-12 w-12 flex-shrink-0 bg-gray-100 rounded-sm overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-200" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 line-clamp-1">
                    {item.name}
                  </p>
                  {item.variant && (
                    <p className="text-xs text-gray-500">{item.variant}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-0.5">
                    £{item.price.toFixed(2)} × {item.quantity}
                  </p>
                </div>

                {/* Line total */}
                <div className="flex-shrink-0 text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    £{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Delivery Address */}
        <div className="bg-white border border-gray-200 rounded-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-3">Delivering to</h3>
          <div className="text-sm text-gray-600 leading-relaxed space-y-0.5">
            <p className="font-medium text-gray-900">{shippingAddress.name}</p>
            <p>{shippingAddress.phone}</p>
            <p>{shippingAddress.house}, {shippingAddress.street}</p>
            <p>
              {shippingAddress.thana}, {shippingAddress.district}{' '}
              {shippingAddress.zip ? `- ${shippingAddress.zip}` : ''}
            </p>
            <p>{shippingAddress.country}</p>
          </div>
        </div>

        {/* Card 3: Payment Method */}
        <div className="bg-white border border-gray-200 rounded-sm p-5">
          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-gray-500" />
            <div>
              <p className="font-medium text-sm text-gray-900">
                Cash on Delivery
              </p>
              <p className="text-xs text-gray-500">
                Pay when your order arrives
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 bg-white border border-gray-200 rounded-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900">£{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              {shipping === 0 ? (
                <span className="text-green-600 font-medium">FREE</span>
              ) : (
                <span className="text-gray-900">£{shipping.toFixed(2)}</span>
              )}
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax (10%)</span>
              <span className="text-gray-900">£{tax.toFixed(2)}</span>
            </div>

            <div className="border-t border-gray-200 my-3"></div>

            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-900 text-base">Total</span>
              <span className="font-bold text-gray-900 text-lg">
                £{total.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            onClick={onPlaceOrder}
            disabled={loading}
            className={`w-full mt-5 py-3 rounded-sm font-medium flex items-center justify-center transition-colors ${
              loading
                ? 'bg-gray-900 opacity-60 cursor-not-allowed text-white'
                : 'bg-gray-900 hover:bg-gray-800 text-white'
            }`}
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Placing Order...
              </>
            ) : (
              'Place Order'
            )}
          </button>

          <button
            onClick={onBack}
            disabled={loading}
            className="w-full mt-2 py-2 rounded-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            &larr; Back to Shipping
          </button>

          <p className="text-center mt-3 text-xs text-gray-400">
            Cash on Delivery — pay when your order arrives
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderReview;
