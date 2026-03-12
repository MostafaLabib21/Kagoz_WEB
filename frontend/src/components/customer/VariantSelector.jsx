import React from 'react';

const VariantSelector = ({ variants, selectedVariant, onChange }) => {
  if (!variants || variants.length === 0) return null;

  // Group variants by label
  const groupedVariants = variants.reduce((acc, variant) => {
    const { label } = variant;
    if (!acc[label]) {
      acc[label] = [];
    }
    acc[label].push(variant);
    return acc;
  }, {});

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
    }).format(price).replace('BDT', '৳').trim();
  };

  return (
    <div className="flex flex-col gap-4">
      {Object.entries(groupedVariants).map(([label, groupVariants]) => (
        <div key={label}>
          <h4 className="text-xs font-bold uppercase mb-2 text-gray-900">
            {label}
          </h4>
          <div className="flex flex-wrap gap-2">
            {groupVariants.map((variant, index) => {
              const isSelected =
                selectedVariant &&
                selectedVariant.label === variant.label &&
                selectedVariant.value === variant.value;

              return (
                <button
                  key={`${variant.value}-${index}`}
                  onClick={() => onChange(variant)}
                  className={`
                    px-4 py-2 rounded-sm border transition-all text-sm min-w-[3rem]
                    flex flex-col items-center justify-center
                    ${
                      isSelected
                        ? 'bg-gray-800 text-white border-gray-800'
                        : 'bg-white text-gray-800 border-gray-300 hover:border-gray-500'
                    }
                  `}
                >
                  <span className="font-medium">{variant.value}</span>
                  {variant.priceModifier !== 0 && (
                    <span
                      className={`text-[10px] mt-0.5 ${
                        isSelected ? 'text-gray-300' : 'text-gray-500'
                      }`}
                    >
                      {variant.priceModifier > 0 ? '+' : ''}
                      {formatPrice(variant.priceModifier)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default VariantSelector;
