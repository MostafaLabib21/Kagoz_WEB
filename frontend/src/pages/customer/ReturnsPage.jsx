import React from 'react';

const ReturnsPage = () => {
  return (
    <div>
      <section className="bg-gray-50 py-12 text-center px-4">
        <h1 className="text-3xl font-bold text-gray-900">Returns & Refunds</h1>
        <p className="mt-2 text-gray-500">Everything you need to know about returns and refunds</p>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-12 space-y-10">
        <section>
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Return Policy</h2>
          <div className="space-y-2 text-gray-600 text-sm leading-relaxed">
            <p>We accept returns within 30 days of delivery.</p>
            <p>Items must be unused and in original packaging.</p>
            <p>Sale items are final sale and cannot be returned.</p>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-gray-900">How to Return</h2>
          <ol className="list-decimal pl-5 space-y-2 text-gray-600 text-sm leading-relaxed">
            <li>Contact us at info@kagoj.com with your order ID.</li>
            <li>We will send you return instructions.</li>
            <li>Package items securely and send them back.</li>
            <li>Refund is processed within 5-7 business days.</li>
          </ol>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Damaged Items</h2>
          <div className="rounded-sm border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-800">
              If your item arrived damaged, please contact us within 48 hours with photos and we will
              resolve it immediately.
            </p>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Refunds</h2>
          <div className="space-y-2 text-gray-600 text-sm leading-relaxed">
            <p>Refunds are issued to the original payment method.</p>
            <p>COD orders are refunded via bank transfer.</p>
            <p>Processing time: 5-7 business days.</p>
          </div>
        </section>
      </section>
    </div>
  );
};

export default ReturnsPage;
