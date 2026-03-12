import React from 'react';

const QuantitySelector = ({
  quantity,
  onChange,
  min = 1,
  max,
  disabled = false,
}) => {
  const handleDecrease = () => {
    if (quantity > min && !disabled) {
      onChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if ((max === undefined || quantity < max) && !disabled) {
      onChange(quantity + 1);
    }
  };

  const isDecreaseDisabled = disabled || quantity <= min;
  const isIncreaseDisabled = disabled || (max !== undefined && quantity >= max);

  return (
    <div className="flex items-center">
      <button
        type="button"
        onClick={handleDecrease}
        disabled={isDecreaseDisabled}
        aria-label="Decrease quantity"
        className={`px-4 py-2 border border-gray-300 bg-white transition-colors rounded-l-sm ${
          isDecreaseDisabled
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-gray-50'
        }`}
      >
        &minus;
      </button>

      <div className="w-12 py-2 text-center font-medium text-lg border-y border-gray-300 bg-white select-none">
        {quantity}
      </div>

      <button
        type="button"
        onClick={handleIncrease}
        disabled={isIncreaseDisabled}
        aria-label="Increase quantity"
        className={`px-4 py-2 border border-gray-300 bg-white transition-colors rounded-r-sm ${
          isIncreaseDisabled
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-gray-50'
        }`}
      >
        &#43;
      </button>
    </div>
  );
};

export default QuantitySelector;
