import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useCart } from '../../hooks/useCart';
import { api } from '../../services/api';

const CheckoutForm = () => {
  const { cartItems, getCartTotalPrice, clearCart } = useCart();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    Object.keys(formData).forEach(key => {
      if (!formData[key].trim()) {
        newErrors[key] = 'This field is required';
      }
    });
    
    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Card number validation (simple)
    if (formData.cardNumber && !/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare order data
      const orderData = {
        items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        })),
        total: getCartTotalPrice(),
        user_id: 1 // In a real app, this would come from authentication
      };
      
      // Submit order
      const response = await api.createOrder(orderData);
      
      // Clear cart
      clearCart();
      
      // Show success
      setOrderId(response.id);
      setOrderSuccess(true);
    } catch (error) {
      console.error('Order submission failed:', error);
      // In a real app, you would show a proper error message
      alert('Failed to process order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-md p-6 text-center">
        <svg className="mx-auto h-12 w-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-green-800">Order Placed Successfully!</h3>
        <p className="mt-1 text-sm text-green-700">
          Your order has been placed successfully. Order ID: {orderId}
        </p>
        <div className="mt-6">
          <Button
            variant="primary"
            onClick={() => window.location.reload()}
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <Input
            label="First name"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
            required
          />
        </div>

        <div className="sm:col-span-3">
          <Input
            label="Last name"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
            required
          />
        </div>

        <div className="sm:col-span-4">
          <Input
            label="Email address"
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />
        </div>

        <div className="sm:col-span-6">
          <Input
            label="Street address"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            error={errors.address}
            required
          />
        </div>

        <div className="sm:col-span-2">
          <Input
            label="City"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            error={errors.city}
            required
          />
        </div>

        <div className="sm:col-span-2">
          <Input
            label="ZIP / Postal code"
            id="zipCode"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            error={errors.zipCode}
            required
          />
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900">Payment</h3>
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 mt-4">
          <div className="sm:col-span-6">
            <Input
              label="Name on card"
              id="cardName"
              name="cardName"
              value={formData.cardName}
              onChange={handleChange}
              error={errors.cardName}
              required
            />
          </div>

          <div className="sm:col-span-6">
            <Input
              label="Card number"
              id="cardNumber"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              error={errors.cardNumber}
              required
            />
          </div>

          <div className="sm:col-span-3">
            <Input
              label="Expiration date (MM/YY)"
              id="expiryDate"
              name="expiryDate"
              placeholder="MM/YY"
              value={formData.expiryDate}
              onChange={handleChange}
              error={errors.expiryDate}
              required
            />
          </div>

          <div className="sm:col-span-3">
            <Input
              label="CVV"
              id="cvv"
              name="cvv"
              value={formData.cvv}
              onChange={handleChange}
              error={errors.cvv}
              required
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? 'Processing...' : 'Place Order'}
        </Button>
      </div>
    </form>
  );
};

export default CheckoutForm;
