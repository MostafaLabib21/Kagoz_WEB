import React from 'react';
import { Link } from 'react-router-dom';

const PlaceholderPage = ({ title }) => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-5xl">
        {title}
      </h1>
      <p className="mb-8 text-lg text-gray-500">
        This page is coming soon
      </p>
      <Link
        to="/"
        className="rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
      >
        ← Back to Home
      </Link>
    </div>
  );
};

export default PlaceholderPage;
