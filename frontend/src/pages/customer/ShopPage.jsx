import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  PackageSearch,
  Search,
  X,
  XCircle,
} from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import ProductCard from '../../components/customer/ProductCard';
import ProductCardSkeleton from '../../components/customer/skeletons/ProductCardSkeleton';
import FilterSidebar from '../../components/customer/shop/FilterSidebar';
import SortBar from '../../components/customer/shop/SortBar';
import MobileFilterDrawer from '../../components/customer/shop/MobileFilterDrawer';
import ShopPagination from '../../components/customer/shop/ShopPagination';

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const inStock = searchParams.get('inStock') === 'true';

  const [searchInput, setSearchInput] = useState(search);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const updateParams = (updates) => {
    const current = Object.fromEntries(searchParams.entries());
    const merged = { ...current, ...updates };

    if (!Object.prototype.hasOwnProperty.call(updates, 'page')) {
      merged.page = '1';
    }

    const cleanedParams = {};

    Object.entries(merged).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined && value !== false) {
        cleanedParams[key] = String(value);
      }
    });

    setSearchParams(cleanedParams);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateParams({ search: searchInput });
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const {
    data: productsData,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: [
      'shop-products',
      page,
      search,
      category,
      sort,
      minPrice,
      maxPrice,
      inStock,
    ],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/api/public/products', {
        params: {
          page,
          limit: 12,
          search,
          category,
          sort,
          minPrice,
          maxPrice,
          inStock: inStock ? 'true' : undefined,
        },
      });
      return data;
    },
    placeholderData: keepPreviousData,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['public-categories'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/api/public/categories');
      return data;
    },
    staleTime: 10 * 60 * 1000,
  });

  const activeFilterCount = useMemo(() => {
    return [category, minPrice, maxPrice, inStock].filter(Boolean).length;
  }, [category, minPrice, maxPrice, inStock]);

  const activeCategoryName = useMemo(() => {
    if (!category) {
      return '';
    }

    const categories = categoriesData?.categories || [];
    const found = categories.find((cat) => cat.slug === category);
    return found?.name || category;
  }, [category, categoriesData]);

  const activeFilterChips = useMemo(() => {
    const chips = [];

    if (category) {
      chips.push({ key: 'category', label: `Category: ${activeCategoryName}` });
    }

    if (minPrice && maxPrice) {
      chips.push({ key: 'price', label: `£${minPrice} — £${maxPrice}` });
    } else if (minPrice) {
      chips.push({ key: 'price', label: `From £${minPrice}` });
    } else if (maxPrice) {
      chips.push({ key: 'price', label: `Up to £${maxPrice}` });
    }

    if (inStock) {
      chips.push({ key: 'inStock', label: 'In Stock Only' });
    }

    return chips;
  }, [category, activeCategoryName, minPrice, maxPrice, inStock]);

  const handleFilterChange = (newFilters) => {
    updateParams({
      category: newFilters.category || '',
      minPrice: newFilters.minPrice || '',
      maxPrice: newFilters.maxPrice || '',
      inStock: newFilters.inStock ? 'true' : '',
    });
  };

  const handleClearAll = () => {
    setSearchParams({});
    setSearchInput('');
  };

  const handleSortChange = (value) => {
    updateParams({ sort: value });
  };

  const handlePageChange = (nextPage) => {
    updateParams({ page: String(nextPage) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRemoveChip = (key) => {
    if (key === 'category') {
      updateParams({ category: '' });
    }

    if (key === 'price') {
      updateParams({ minPrice: '', maxPrice: '' });
    }

    if (key === 'inStock') {
      updateParams({ inStock: '' });
    }
  };

  const products = productsData?.products || [];
  const hasFilterOrSearch = Boolean(search || category || minPrice || maxPrice || inStock);
  const showSkeletons = isLoading && !productsData;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Shop</h1>
        {search ? (
          <p className="mt-1 text-sm text-gray-500">Results for "{search}"</p>
        ) : category ? (
          <p className="mt-1 text-sm text-gray-500">Browsing: {activeCategoryName}</p>
        ) : null}
      </div>

      <div className="relative mb-6">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Search products..."
          className="w-full rounded-md border border-gray-300 py-2.5 pl-10 pr-10 text-sm focus:border-gray-900 focus:outline-none"
        />
        {searchInput && (
          <button
            type="button"
            onClick={handleClearAll}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
            aria-label="Clear search"
          >
            <XCircle className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex gap-8">
        <aside className="hidden w-56 flex-shrink-0 md:block xl:w-64">
          <div className="sticky top-24">
            <FilterSidebar
              categories={categoriesData?.categories || []}
              filters={{ category, minPrice, maxPrice, inStock }}
              onFilterChange={handleFilterChange}
              onClearAll={handleClearAll}
            />
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <SortBar
            total={productsData?.total || 0}
            sort={sort}
            onSortChange={handleSortChange}
            onToggleMobileFilters={() => setMobileFiltersOpen(true)}
            activeFilterCount={activeFilterCount}
          />

          {activeFilterChips.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {activeFilterChips.map((chip) => (
                <div
                  key={chip.key}
                  className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1.5 text-xs text-gray-700"
                >
                  <span>{chip.label}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveChip(chip.key)}
                    className="text-gray-500 hover:text-gray-900"
                    aria-label={`Remove ${chip.label}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="relative">
            <div className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 ${isFetching && productsData ? 'opacity-50' : ''}`}>
              {showSkeletons &&
                Array.from({ length: 6 }).map((_, index) => (
                  <ProductCardSkeleton key={`shop-skeleton-${index}`} />
                ))}

              {!isLoading && products.length === 0 && (
                <div className="col-span-full py-16 text-center">
                  <PackageSearch className="mx-auto mb-4 h-16 w-16 text-gray-300" />
                  <h3 className="mb-2 text-lg font-semibold text-gray-700">No products found</h3>
                  {hasFilterOrSearch ? (
                    <>
                      <p className="mb-4 text-sm text-gray-500">Try adjusting your search or filters</p>
                      <button
                        type="button"
                        onClick={handleClearAll}
                        className="rounded-sm border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Clear all filters
                      </button>
                    </>
                  ) : (
                    <p className="text-sm text-gray-500">Check back soon for new products</p>
                  )}
                </div>
              )}

              {!showSkeletons &&
                products.length > 0 &&
                products.map((product) => <ProductCard key={product._id} product={product} />)}
            </div>

            {isFetching && productsData && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-900 border-t-transparent" />
              </div>
            )}
          </div>

          <ShopPagination
            page={page}
            pages={productsData?.pages || 1}
            onPageChange={handlePageChange}
          />
        </section>
      </div>

      <MobileFilterDrawer
        isOpen={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        categories={categoriesData?.categories || []}
        filters={{ category, minPrice, maxPrice, inStock }}
        onFilterChange={(newFilters) => {
          handleFilterChange(newFilters);
          setMobileFiltersOpen(false);
        }}
        onClearAll={() => {
          handleClearAll();
          setMobileFiltersOpen(false);
        }}
      />
    </div>
  );
};

export default ShopPage;
