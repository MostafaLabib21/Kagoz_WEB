import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../utils/axiosInstance';
import { useCart } from '../../context/CartContext';

// Components
import ProductImageGallery from '../../components/customer/ProductImageGallery';
import VariantSelector from '../../components/customer/VariantSelector';
import QuantitySelector from '../../components/customer/QuantitySelector';
import Breadcrumb from '../../components/customer/Breadcrumb';
import ProductCard from '../../components/customer/ProductCard';
import ProductCardSkeleton from '../../components/customer/skeletons/ProductCardSkeleton';

const ProductPage = () => {
  const { slug } = useParams();
  const { addToCart } = useCart();

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [addedToCartFeedback, setAddedToCartFeedback] = useState(false);

  // Query 1: Product
  const {
    data: productData,
    isLoading: productLoading,
    isError: productError,
  } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const response = await axiosInstance.get(`/api/public/products/${slug}`);
      return response.data;
    },
    retry: false, // Don't retry on 404
  });

  const product = productData?.product;

  // Query 2: Related Products
  const { data: relatedData, isLoading: relatedLoading } = useQuery({
    queryKey: ['related-products', product?.category?._id],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/api/public/products/related/${product.category._id}`,
        { params: { exclude: product._id, limit: 4 } }
      );
      return response.data;
    },
    enabled: !!product?.category?._id,
  });

  const relatedProducts = relatedData?.products || [];

  // Reset state on product change
  useEffect(() => {
    if (product) {
      setQuantity(1);
      setSelectedVariant(null);
      if (product.variants && product.variants.length > 0) {
        setSelectedVariant(product.variants[0]);
      }
    }
  }, [product]);

  // Handle Add to Cart
  const handleAddToCart = () => {
    if (!product) return;

    const itemToAdd = {
      productId: product.productId,
      name: product.name,
      image: product.images?.[0]?.url || '',
      price: selectedVariant
        ? product.price + (selectedVariant.priceModifier || 0)
        : product.price,
      variant: selectedVariant
        ? `${selectedVariant.label}: ${selectedVariant.value}`
        : '',
      slug: product.slug,
      quantity: quantity,
    };

    addToCart(itemToAdd);
    setAddedToCartFeedback(true);
    setQuantity(1);

    setTimeout(() => {
      setAddedToCartFeedback(false);
    }, 2000);
  };

  // Loading State
  if (productLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb Skeleton */}
        <div className="w-64 h-4 bg-gray-200 animate-pulse rounded mb-6"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-6">
          {/* Left Column Skeleton */}
          <div className="flex flex-col gap-3">
            <div className="w-full aspect-square bg-gray-200 animate-pulse rounded-sm"></div>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-16 h-16 bg-gray-200 animate-pulse rounded-sm"
                ></div>
              ))}
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div>
            <div className="w-3/4 h-6 bg-gray-200 animate-pulse mb-4"></div>
            <div className="w-1/4 h-8 bg-gray-200 animate-pulse mb-8"></div>
            <div className="w-full h-10 bg-gray-200 animate-pulse mt-4"></div>
          </div>
        </div>
      </div>
    );
  }

  // 404 State
  if (!product || productError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Product Not Found
        </h1>
        <p className="text-gray-600 mb-6">
          This product may no longer be available.
        </p>
        <Link
          to="/shop"
          className="px-6 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors"
        >
          ← Continue Shopping
        </Link>
      </div>
    );
  }

  // Loaded State
  const currentPrice = selectedVariant
    ? product.price + (selectedVariant.priceModifier || 0)
    : product.price;

  const comparePrice = product.compareAtPrice;
  const isSale = comparePrice && comparePrice > currentPrice;
  const discountPercentage = isSale
    ? Math.round(((comparePrice - currentPrice) / comparePrice) * 100)
    : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          {
            label: product.category?.name || 'Shop',
            href: `/shop?category=${product.category?.slug}`,
          },
          { label: product.name, href: null },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-6">
        {/* Left Column - Gallery */}
        <div>
          <ProductImageGallery
            images={product.images}
            productName={product.name}
          />
        </div>

        {/* Right Column - Details */}
        <div>
          {/* Category Link */}
          <Link
            to={`/shop?category=${product.category?.slug}`}
            className="text-xs font-bold uppercase text-gray-500 hover:text-gray-800 mb-1 block tracking-wide"
          >
            {product.category?.name}
          </Link>

          {/* Product Name */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {product.name}
          </h1>

          {/* SKU */}
          {product.productId && (
            <p className="text-xs text-gray-500 mb-4">
              SKU: {product.productId}
            </p>
          )}

          <div className="border-t border-gray-200 my-4"></div>

          {/* Price */}
          <div className="flex items-center flex-wrap gap-3 mb-4">
            {isSale ? (
              <>
                <span className="text-lg text-gray-400 line-through">
                  ৳{comparePrice.toFixed(2)}
                </span>
                <span className="text-2xl font-bold text-gray-900">
                  ৳{currentPrice.toFixed(2)}
                </span>
                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">
                  Save {discountPercentage}%
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-gray-900">
                ৳{currentPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="mb-6">
            {product.stock === 0 ? (
              <span className="text-red-600 font-medium">Out of Stock</span>
            ) : (
              <span className={`${product.stock <= 5 ? 'text-amber-600' : 'text-green-600'} font-medium`}>
                {product.stock <= 5 ? 'Low Stock — ' : ''}
                {product.stock} available
              </span>
            )}
          </div>

          <div className="border-t border-gray-200 my-4"></div>

          {/* Variant Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-6">
              <VariantSelector
                variants={product.variants}
                selectedVariant={selectedVariant}
                onChange={(v) => {
                  setSelectedVariant(v);
                  setQuantity(1);
                }}
              />
            </div>
          )}

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase text-gray-900 mb-2">
              Quantity
            </label>
            <QuantitySelector
              quantity={quantity}
              onChange={setQuantity}
              min={1}
              max={product.stock}
              disabled={product.stock === 0}
            />
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`w-full py-4 px-6 text-center font-bold uppercase tracking-wider transition-all rounded-sm ${
              product.stock === 0
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : addedToCartFeedback
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
          >
            {product.stock === 0
              ? 'Out of Stock'
              : addedToCartFeedback
              ? 'Added to Cart ✓'
              : 'Add to Cart'}
          </button>

          {/* Short Description */}
          {product.shortDescription && (
            <p className="mt-6 text-gray-600 leading-relaxed">
              {product.shortDescription}
            </p>
          )}
        </div>
      </div>

      {/* Description / Details Tabs */}
      <div className="border-t border-gray-200 mt-12 mb-8"></div>

      <div className="flex gap-8 border-b border-gray-200 mb-6">
        <button
          className={`pb-4 text-sm font-medium transition-colors border-b-2 -mb-[2px] ${
            activeTab === 'description'
              ? 'border-gray-900 text-gray-900'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('description')}
        >
          Description
        </button>
        <button
          className={`pb-4 text-sm font-medium transition-colors border-b-2 -mb-[2px] ${
            activeTab === 'details'
              ? 'border-gray-900 text-gray-900'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('details')}
        >
          Details
        </button>
      </div>

      <div className="min-h-[200px]">
        {activeTab === 'description' && (
          <div className="prose max-w-3xl text-gray-700 leading-relaxed whitespace-pre-line">
            {product.description || 'No description available.'}
          </div>
        )}

        {activeTab === 'details' && (
          <div className="space-y-4 max-w-2xl text-sm text-gray-700">
            {product.sku && (
              <div className="flex border-b border-gray-100 pb-2">
                <span className="font-bold w-32">SKU</span>
                <span>{product.sku}</span>
              </div>
            )}
            {product.category && (
              <div className="flex border-b border-gray-100 pb-2">
                <span className="font-bold w-32">Category</span>
                <span>{product.category.name}</span>
              </div>
            )}
            {product.tags && product.tags.length > 0 && (
              <div className="flex border-b border-gray-100 pb-2">
                <span className="font-bold w-32">Tags</span>
                <span>{product.tags.join(', ')}</span>
              </div>
            )}
            {product.variants && product.variants.length > 0 && (
              <div className="flex border-b border-gray-100 pb-2">
                <span className="font-bold w-32">Available in</span>
                <span>
                  {[...new Set(product.variants.map((v) => v.label))].join(
                    ', '
                  )}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <div className="border-t border-gray-200 mb-8"></div>
          <h2 className="text-xl font-bold mb-6 text-gray-900">
            You Might Also Like
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedLoading
              ? [1, 2, 3, 4].map((key) => <ProductCardSkeleton key={key} />)
              : relatedProducts.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
