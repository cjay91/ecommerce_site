import React from 'react';
import { useCart } from '../hooks/useCart';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { cartItems, getCartTotalItems, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart</h1>
          <p className="text-gray-600 mb-8">Your cart is currently empty.</p>
          <Button onClick={handleContinueShopping} variant="primary">
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flow-root">
              <ul className="-my-6 divide-y divide-gray-200">
                {cartItems.map(item => (
                  <li key={item.id}>
                    <CartItem item={item} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
            <CartSummary />
            <div className="mt-6 space-y-3">
              <Button
                onClick={handleCheckout}
                variant="primary"
                className="w-full"
              >
                Proceed to Checkout
              </Button>
              <Button
                onClick={clearCart}
                variant="secondary"
                className="w-full"
              >
                Clear Cart
              </Button>
              <Button
                onClick={handleContinueShopping}
                variant="outline"
                className="w-full"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
