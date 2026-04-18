import React, { useState } from 'react';

const ShippingForm = ({ defaultValues, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    district: '',
    thana: '',
    street: '',
    house: '',
    zip: '',
    country: 'Bangladesh',
    ...defaultValues,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate fields
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.district.trim()) newErrors.district = 'District / City is required';
    if (!formData.thana.trim()) newErrors.thana = 'Thana / Upazila is required';
    if (!formData.street.trim()) newErrors.street = 'Street / Road is required';
    if (!formData.house.trim()) newErrors.house = 'House / Building is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-lg font-bold text-gray-900 mb-6">
        Shipping Information
      </h2>

      {/* Full Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full border rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
            errors.name
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-gray-900 focus:ring-gray-900'
          }`}
          placeholder="e.g. John Doe"
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name}</p>
        )}
      </div>

      {/* Phone Number */}
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Phone Number
        </label>
        <input
          type="text"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className={`w-full border rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
            errors.phone
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-gray-900 focus:ring-gray-900'
          }`}
          placeholder="e.g. +880 1xxxxxxxxx"
        />
        {errors.phone && (
          <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* District / City */}
        <div>
          <label
            htmlFor="district"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            District / City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="district"
            name="district"
            value={formData.district}
            onChange={handleChange}
            className={`w-full border rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
              errors.district
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-gray-900 focus:ring-gray-900'
            }`}
            placeholder="e.g. Dhaka"
          />
          {errors.district && (
            <p className="text-red-500 text-xs mt-1">{errors.district}</p>
          )}
        </div>

        {/* Thana / Upazila */}
        <div>
          <label
            htmlFor="thana"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Thana / Upazila <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="thana"
            name="thana"
            value={formData.thana}
            onChange={handleChange}
            className={`w-full border rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
              errors.thana
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-gray-900 focus:ring-gray-900'
            }`}
            placeholder="e.g. Dhanmondi"
          />
          {errors.thana && (
            <p className="text-red-500 text-xs mt-1">{errors.thana}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Street */}
        <div>
          <label
            htmlFor="street"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Street / Road <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="street"
            name="street"
            value={formData.street}
            onChange={handleChange}
            className={`w-full border rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
              errors.street
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-gray-900 focus:ring-gray-900'
            }`}
            placeholder="e.g. Road 5"
          />
          {errors.street && (
            <p className="text-red-500 text-xs mt-1">{errors.street}</p>
          )}
        </div>

        {/* House */}
        <div>
          <label
            htmlFor="house"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            House / Building <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="house"
            name="house"
            value={formData.house}
            onChange={handleChange}
            className={`w-full border rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
              errors.house
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-gray-900 focus:ring-gray-900'
            }`}
            placeholder="e.g. House 12/A"
          />
          {errors.house && (
            <p className="text-red-500 text-xs mt-1">{errors.house}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ZIP / Post Code */}
        <div>
          <label
            htmlFor="zip"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            ZIP / Post Code
          </label>
          <input
            type="text"
            id="zip"
            name="zip"
            value={formData.zip}
            onChange={handleChange}
            className={`w-full border rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
              errors.zip
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-gray-900 focus:ring-gray-900'
            }`}
            placeholder="e.g. 1205"
          />
          {errors.zip && (
            <p className="text-red-500 text-xs mt-1">{errors.zip}</p>
          )}
        </div>

        {/* Country */}
        <div>
          <label
            htmlFor="country"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Country
          </label>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className={`w-full border rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
              errors.country
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-gray-900 focus:ring-gray-900'
            }`}
            placeholder="e.g. Bangladesh"
          />
          {errors.country && (
            <p className="text-red-500 text-xs mt-1">{errors.country}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="w-full mt-6 py-3 bg-gray-900 text-white rounded-sm font-medium hover:bg-gray-800 transition-colors"
      >
        Continue to Review &rarr;
      </button>
    </form>
  );
};

export default ShippingForm;
