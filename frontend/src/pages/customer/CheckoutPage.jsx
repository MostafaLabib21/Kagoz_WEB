import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../../utils/axiosInstance';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import StepIndicator from '../../components/customer/checkout/StepIndicator';
import ShippingForm from '../../components/customer/checkout/ShippingForm';
import OrderReview from '../../components/customer/checkout/OrderReview';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, subtotal, shipping, tax, total, clearCart } = useCart();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [shippingData, setShippingData] = useState(null);

  const steps = ['Shipping', 'Review'];

  const placeOrderMutation = useMutation({
    mutationFn: async (orderData) => {
      const res = await axiosInstance.post('/api/orders', orderData);
      return res.data;
    },
    onSuccess: (data) => {
      clearCart();
      navigate(`/order-confirmation/${data.orderId}`);
    },
    onError: (error) => {
      const message =
        error.response?.data?.message ||
        'Failed to place order. Please try again.';
      alert(message);
    },
  });

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Your cart is empty
        </h2>
        <button
          onClick={() => navigate('/shop')}
          className="px-6 py-2 bg-gray-900 text-white rounded-sm hover:bg-gray-800 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  const handleShippingSubmit = (formData) => {
    setShippingData(formData);
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setCurrentStep(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = () => {
    if (!shippingData) return;

    const orderData = {
      items: cartItems.map((item) => ({
        productId: item.productId,
        name: item.name,
        image: item.image || '',
        price: item.price,
        variant: item.variant || '',
        quantity: item.quantity,
      })),
      shippingAddress: {
        name: shippingData.name,
        phone: shippingData.phone,
        district: shippingData.district,
        thana: shippingData.thana,
        street: shippingData.street,
        house: shippingData.house,
        zip: shippingData.zip,
        country: shippingData.country,
      },
      phone: shippingData.phone,
    };
    
    placeOrderMutation.mutate(orderData);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

      <StepIndicator steps={steps} currentStep={currentStep} />

      {currentStep === 0 && (
        <ShippingForm
          defaultValues={{
            name: user?.name || '',
            country: 'Bangladesh',
          }}
          onSubmit={handleShippingSubmit}
        />
      )}

      {currentStep === 1 && (
        <OrderReview
          cartItems={cartItems}
          shippingAddress={shippingData}
          subtotal={subtotal}
          shipping={shipping}
          tax={tax}
          total={total}
          onBack={handleBack}
          onPlaceOrder={handlePlaceOrder}
          loading={placeOrderMutation.isPending}
        />
      )}
    </div>
  );
};


export default CheckoutPage;
