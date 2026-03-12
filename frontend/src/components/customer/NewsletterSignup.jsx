import React, { useState } from 'react';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Simple email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Simulate API call
    setSubmitted(true);
    setEmail('');
  };

  return (
    <section className="bg-gray-900 py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="mb-3 text-2xl font-bold text-white md:text-3xl">
          Join the Kagoj Community
        </h2>
        <p className="mb-8 text-gray-400">
          Subscribe to our newsletter for new arrivals, stories, and exclusive offers.
        </p>

        {submitted ? (
          <div className="mx-auto max-w-md rounded-lg bg-green-900/50 p-6 text-green-200 border border-green-800">
            <p className="font-semibold">Thank you for subscribing!</p>
            <p className="mt-1 text-sm">You've been added to our list.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto max-w-md">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full flex-1 rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="submit"
                className="rounded-lg bg-white px-6 py-3 font-semibold text-gray-900 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                Subscribe
              </button>
            </div>
            {error && (
              <p className="mt-2 text-left text-sm text-red-400">{error}</p>
            )}
            <p className="mt-3 text-xs text-gray-500">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </form>
        )}
      </div>
    </section>
  );
};

export default NewsletterSignup;
