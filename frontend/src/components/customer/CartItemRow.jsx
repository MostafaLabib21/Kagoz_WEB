import React from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';

const CartItemRow = ({ item, onRemove, onUpdateQuantity }) => {
  const { productId, name, image, price, variant, slug, quantity } = item;

  const handleRemove = () => {
    onRemove(productId, variant);
  };

  const handleDecrease = () => {
    onUpdateQuantity(productId, variant, quantity - 1);
  };

  const handleIncrease = () => {
    onUpdateQuantity(productId, variant, quantity + 1);
  };

  return (
    <div className="flex items-start gap-4 py-4 border-b border-gray-200 last:border-0">
      {/* Left - Product Image */}
      <Link
        to={`/product/${slug}`}
        className="w-20 h-20 rounded-sm overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100"
      >
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <Package size={24} strokeWidth={1.5} />
          </div>
        )}
      </Link>

      {/* Center - Product Info */}
      <div className="flex-1 min-w-0">
        <Link
          to={`/product/${slug}`}
          className="font-medium text-gray-900 hover:underline line-clamp-2"
        >
          {name}
        </Link>

        {variant && (
          <p className="text-sm text-gray-500 mt-0.5">{variant}</p>
        )}

        <p className="text-sm text-gray-500 mt-1">
          ৳{price.toFixed(2)} each
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-3 mt-3">
          <button
            type="button"
            onClick={handleDecrease}
            className="w-7 h-7 border border-gray-300 rounded-sm flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600 select-none"
            aria-label="Decrease quantity"
          >
            &minus;
          </button>

          <span className="w-8 text-center font-medium text-sm text-gray-900">
            {quantity}
          </span>

          <button
            type="button"
            onClick={handleIncrease}
            className="w-7 h-7 border border-gray-300 rounded-sm flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600 select-none"
            aria-label="Increase quantity"
          >
            &#43;
          </button>
        </div>

        <button
          onClick={handleRemove}
          className="mt-2 text-xs text-red-500 hover:text-red-700 cursor-pointer underline"
        >
          Remove
        </button>
      </div>

      {/* Right - Line Total */}
      <div className="flex-shrink-0 text-right">
        <p className="font-semibold text-gray-900">
          ৳{(price * quantity).toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default CartItemRow;
