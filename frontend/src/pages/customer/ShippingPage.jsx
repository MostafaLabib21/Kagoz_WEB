import React from 'react';

const ShippingPage = () => {
  return (
    <div>
      <section className="bg-gray-50 py-12 text-center px-4">
        <h1 className="text-3xl font-bold text-gray-900">Shipping Information</h1>
        <p className="mt-2 text-gray-500">Everything you need to know about delivery</p>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-12 space-y-10">
        <section>
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Delivery Times</h2>
          <div className="space-y-3">
            <div className="rounded-sm border border-gray-200 p-4 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">Standard Delivery</span>
              <span className="text-sm text-gray-600">3-5 business days</span>
            </div>
            <div className="rounded-sm border border-gray-200 p-4 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">Express Delivery</span>
              <span className="text-sm text-gray-600">1-2 business days (coming soon)</span>
            </div>
            <div className="rounded-sm border border-gray-200 p-4 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">International</span>
              <span className="text-sm text-gray-600">7-14 business days</span>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Shipping Costs</h2>
          <div className="space-y-2 text-gray-600 text-sm leading-relaxed">
            <p>Orders under £30: £4.99 flat rate</p>
            <p>Orders £30 and over: FREE shipping</p>
          </div>
          <div className="mt-4 rounded-sm border border-green-200 bg-green-50 p-4">
            <p className="text-sm font-medium text-green-800">Free shipping on all orders over £30!</p>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Order Processing</h2>
          <div className="space-y-2 text-gray-600 text-sm leading-relaxed">
            <p>Orders are processed within 1-2 business days.</p>
            <p>Orders placed on weekends are processed on Monday.</p>
            <p>You will receive a confirmation email when your order is shipped.</p>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Tracking</h2>
          <div className="space-y-2 text-gray-600 text-sm leading-relaxed">
            <p>Once shipped, you will receive tracking information via email.</p>
            <p>Contact us if you have not received tracking after 3 days.</p>
          </div>
        </section>
      </section>
    </div>
  );
};

export default ShippingPage;
