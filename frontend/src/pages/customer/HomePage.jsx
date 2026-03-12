import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from '../../utils/axiosInstance';

// Components
import HeroSlider from '../../components/customer/HeroSlider';
import CategoryHighlights from '../../components/customer/CategoryHighlights';
import FeaturedProducts from '../../components/customer/FeaturedProducts';
import NewArrivals from '../../components/customer/NewArrivals';
import BrandStory from '../../components/customer/BrandStory';
import NewsletterSignup from '../../components/customer/NewsletterSignup';

// Skeletons
import HeroSkeleton from '../../components/customer/skeletons/HeroSkeleton';
import CategorySkeleton from '../../components/customer/skeletons/CategorySkeleton';
import ProductCardSkeleton from '../../components/customer/skeletons/ProductCardSkeleton';

const HomePage = () => {
  // Query 1: Homepage Config
  const {
    data: config,
    isLoading: configLoading,
    isError: configError,
    refetch: refetchConfig,
  } = useQuery({
    queryKey: ['homepage-config'],
    queryFn: async () => {
      const { data } = await axios.get('/api/public/homepage');
      return data;
    },
  });

  // Query 2: New Arrivals
  const {
    data: newArrivalsData,
    isLoading: arrivalsLoading,
    isError: arrivalsError,
    refetch: refetchArrivals,
  } = useQuery({
    queryKey: ['new-arrivals'],
    queryFn: async () => {
      const { data } = await axios.get('/api/public/products/new-arrivals');
      return data;
    },
  });

  const isLoading = configLoading || arrivalsLoading;
  const isError = configError || arrivalsError;

  const handleRetry = () => {
    refetchConfig();
    refetchArrivals();
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <HeroSkeleton />
        <div className="grid grid-cols-2 gap-4 p-8 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <CategorySkeleton key={i} />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-6 p-8 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-96 flex-col items-center justify-center text-center">
        <h2 className="mb-2 text-xl font-semibold text-gray-900">
          Something went wrong
        </h2>
        <p className="mb-6 text-gray-600">
          We couldn't load the homepage content. Please try again.
        </p>
        <button
          onClick={handleRetry}
          className="rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <HeroSlider slides={config?.heroSlides} />

      <CategoryHighlights
        categories={config?.categoryHighlights?.map((h) => h.category)}
      />

      <FeaturedProducts
        title={config?.featuredSection?.title}
        subtitle={config?.featuredSection?.subtitle}
        products={config?.featuredSection?.productIds}
      />

      <NewArrivals products={newArrivalsData?.products} />

      <BrandStory />

      <NewsletterSignup />
    </div>
  );
};

export default HomePage;
