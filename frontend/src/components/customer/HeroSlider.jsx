import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HeroSlider = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  const hasSlides = slides && slides.length > 0;

  useEffect(() => {
    if (!hasSlides || isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [hasSlides, isPaused, slides?.length]);

  if (!hasSlides) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center bg-gray-100 px-4 text-center md:h-[500px]">
        <h1 className="mb-2 text-4xl font-bold text-gray-900 md:text-6xl">Kagoj</h1>
        <p className="mb-6 text-lg text-gray-600 md:text-xl">
          Natural Stationery, Beautifully Made
        </p>
        <Link
          to="/shop"
          className="rounded-lg bg-gray-900 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
        >
          Shop Now
        </Link>
      </div>
    );
  }

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div
      className="group relative h-64 w-full overflow-hidden bg-gray-900 md:h-[500px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <img
            src={slide.image?.url || slide.image || 'https://images.unsplash.com/photo-1586075010999-9bc984756bab?auto=format&fit=crop&q=80&w=1920'}
            alt={slide.title}
            className="h-full w-full object-cover"
          />
          {/* Gradient Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/40 to-transparent" />

          <div className="absolute inset-0 flex items-center justify-start px-8 md:px-16 lg:px-24">
            <div className="max-w-2xl space-y-6 text-white">
              <h2 className="text-4xl font-bold leading-tight tracking-tight md:text-6xl drop-shadow-sm">
                {slide.title}
              </h2>
              {slide.subtitle && (
                <p className="max-w-lg text-lg font-medium text-gray-100 md:text-xl md:leading-relaxed">
                  {slide.subtitle}
                </p>
              )}
              {slide.buttonText && (slide.link || slide.buttonLink) && (
                <div className="pt-2">
                  <Link
                    to={slide.link || slide.buttonLink}
                    className="inline-block border-2 border-white bg-transparent px-8 py-3 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-white hover:text-gray-900"
                  >
                    {slide.buttonText}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Controls */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white opacity-0 backdrop-blur-sm transition-all hover:bg-white/40 group-hover:opacity-100"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white opacity-0 backdrop-blur-sm transition-all hover:bg-white/40 group-hover:opacity-100"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 w-2 rounded-full transition-all ${
              index === currentSlide ? 'w-6 bg-white' : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
