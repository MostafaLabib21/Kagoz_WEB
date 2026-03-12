import React, { useState, useEffect } from 'react';
import { Package } from 'lucide-react';

const ProductImageGallery = ({ images, productName }) => {
  const [selectedImage, setSelectedImage] = useState(images?.[0]?.url);

  useEffect(() => {
    if (images && images.length > 0) {
      setSelectedImage(images[0].url);
    }
  }, [images]);

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-square bg-gray-100 rounded-sm flex items-center justify-center text-gray-400">
        <Package size={48} strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main Image */}
      <div className="w-full aspect-square overflow-hidden rounded-sm bg-gray-100">
        <img
          src={selectedImage}
          alt={productName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnail Strip */}
      <div className="flex flex-row gap-2 flex-wrap">
        {images.map((image, index) => (
          <div
            key={image.publicId || index}
            className={`w-16 h-16 rounded-sm overflow-hidden cursor-pointer border-2 transition-colors ${
              selectedImage === image.url
                ? 'border-gray-800'
                : 'border-transparent hover:border-gray-300'
            }`}
            onClick={() => setSelectedImage(image.url)}
          >
            <img
              src={image.url}
              alt={`${productName} thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;
