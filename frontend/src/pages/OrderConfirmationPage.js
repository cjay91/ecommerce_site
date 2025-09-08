import React from 'react';
import Button from '../components/ui/Button';

const OrderConfirmationPage = () => {
  // In a real application, you would get this data from the order creation response
  // For now, we'll use mock data
  const orderData = {
    id: "12345",
    date: "2025-09-08",
    total: 149.99,
    items: [
      { id: 1, name: "Premium Headphones", quantity: 1, price: 199.99 },
      { id: 2, name: "Running Shoes", quantity: 1, price: 89.99 }
    ]
  };

  const handleContinueShopping = () => {
    window.location.href = '/';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
            <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Order Confirmed!</h1>
          <p className="mt-2 text-lg text-gray-600">
            Thank you for your order. We've sent a confirmation email to your inbox.
          </p>
        </div>
        
        <div className="mt-10">
          <div className="border-t border-gray-200 py-6">
            <h2 className="text-lg font-medium text-gray-900">Order Details</h2>
            <div className="mt-4">
              <p className="text-gray-600">Order Number: <span className="font-medium">{orderData.id}</span></p>
              <p className="text-gray-600">Order Date: <span className="font-medium">{orderData.date}</span></p>
            </div>
          </div>
          
          <div className="border-t border-gray-200 py-6">
            <h2 className="text-lg font-medium text-gray-900">Items</h2>
            <div className="mt-4 space-y-4">
              {orderData.items.map(item => (
                <div key={item.id} className="flex justify-between">
                  <div>
                    <p className="text-gray-900">{item.name}</p>
                    <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                  </div>
                  <p className="text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="border-t border-gray-200 py-6">
            <div className="flex justify-between text-lg font-medium text-gray-900">
              <p>Total</p>
              <p>${orderData.total.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-10 text-center">
          <Button onClick={handleContinueShopping} variant="primary">
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
