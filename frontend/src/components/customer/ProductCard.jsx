import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  // Destructure product properties
  const {
    _id, // assuming _id exists if passed from mongoose
    name,
    slug,
    price,
    compareAtPrice,
    images = [],
    stock,
    category,
    createdAt,
  } = product;

  // Ensure price is a number for calculations
  const currentPrice = Number(price);
  const originalPrice = compareAtPrice ? Number(compareAtPrice) : 0;
  
  // Calculate potential badges
  const isOutOfStock = stock === 0;
  const isOnSale = originalPrice > currentPrice;
  const isNew = (() => {
    if (!createdAt) return false;
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - createdDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 14;
  })();

  const discountPercentage = isOnSale
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    addToCart({
      productId: _id || product.productId || product.id, // Fallback for ID depending on object structure
      name,
      image: images[0]?.url,
      price: currentPrice,
      slug,
      quantity: 1,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Link
      to={`/product/${slug}`}
      className="group flex flex-col overflow-hidden rounded-lg bg-white transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {images && images.length > 0 && images[0]?.url ? (
          <img
            src={images[0].url}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400">
            <ShoppingBag size={48} />
          </div>
        )}

        {/* Badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {isOutOfStock && (
            <span className="rounded-full bg-gray-900 px-2 py-1 text-xs font-semibold text-white shadow-sm">
              Out of Stock
            </span>
          )}
          {!isOutOfStock && isOnSale && (
            <span className="rounded-full bg-red-600 px-2 py-1 text-xs font-semibold text-white shadow-sm">
              Sale
            </span>
          )}
          {!isOutOfStock && isNew && (
            <span className="rounded-full bg-blue-600 px-2 py-1 text-xs font-semibold text-white shadow-sm">
              New
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        {/* Category */}
        {category && (
          <p className="mb-1 text-xs uppercase tracking-wider text-gray-500">
            {typeof category === 'object' ? category.name : category}
          </p>
        )}

        {/* Product Name */}
        <h3 className="mb-2 flex-grow text-base font-medium leading-snug text-gray-900 line-clamp-2">
          {name}
        </h3>

        {/* Price Row */}
        <div className="mb-4 flex items-baseline gap-2">
          <span className="text-lg font-bold text-gray-900">
            ৳{currentPrice.toFixed(2)}
          </span>
          {isOnSale && (
            <>
              <span className="text-sm text-gray-500 line-through">
                ৳{originalPrice.toFixed(2)}
              </span>
              <span className="text-xs font-semibold text-green-600">
                Save {discountPercentage}%
              </span>
            </>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`mt-auto flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isOutOfStock
              ? 'cursor-not-allowed bg-gray-100 text-gray-400'
              : added
              ? 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
              : 'bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-900'
          }`}
        >
          {isOutOfStock ? (
            'Out of Stock'
          ) : added ? (
            <>
              Added <span className="ml-1">✓</span>
            </>
          ) : (
            'Add to Cart'
          )}
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
