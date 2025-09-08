import React from 'react';
import { useCart } from '../hooks/useCart';
import CheckoutForm from '../components/checkout/CheckoutForm';
import CartSummary from '../components/cart/CartSummary';

const CheckoutPage = () => {
  const { cartItems, getCartTotalItems } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Checkout</h1>
          <p className="text-gray-600 mb-8">Your cart is empty. Add some items before checking out.</p>
          <a href="/" className="text-blue-600 hover:text-blue-800 font-medium">
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-medium text-gray-900 mb-6">Shipping and Payment Information</h2>
            <CheckoutForm />
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
            <h2 className="text-xl font-medium text-gray-900 mb-4">Order Summary</h2>
            <CartSummary />
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Items ({getCartTotalItems()})</h3>
              <div className="space-y-3">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between">
                    <p className="text-sm text-gray-600">
                      {item.name} <span className="text-gray-500">x {item.quantity}</span>
                    </p>
                    <p className="text-sm text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
