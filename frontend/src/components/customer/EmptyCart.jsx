import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

const EmptyCart = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-50">
        <ShoppingBag className="h-12 w-12 text-gray-300" strokeWidth={1.5} />
      </div>

      <h2 className="mb-2 text-xl font-semibold text-gray-700">
        Your cart is empty
      </h2>

      <p className="mb-8 text-sm text-gray-500">
        Looks like you haven't added anything yet.
      </p>

      <Link
        to="/shop"
        className="inline-block rounded-sm bg-gray-900 px-8 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-gray-800"
      >
        Start Shopping
      </Link>
    </div>
  );
};

export default EmptyCart;
