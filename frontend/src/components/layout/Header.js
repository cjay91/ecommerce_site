import React, { useState } from 'react';
import { useCart } from '../../hooks/useCart';
import Modal from '../ui/Modal';
import CartItem from '../cart/CartItem';
import CartSummary from '../cart/CartSummary';
import Button from '../ui/Button';
import Input from '../ui/Input';

const Header = () => {
  const { cartItems, getCartTotalItems, clearCart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleCheckout = () => {
    // In a real app, this would navigate to the checkout page
    console.log('Proceeding to checkout');
    setIsCartOpen(false);
    // For now, we'll just log the cart items
    console.log('Cart items:', cartItems);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // In a real app, this would trigger a search
    console.log('Searching for:', searchQuery);
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar with logo, search, and auth buttons */}
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">E-Commerce Store</h1>
          </div>
          
          {/* Search bar */}
          <div className="flex-1 mx-8">
            <form onSubmit={handleSearch} className="max-w-md w-full">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </form>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Auth buttons */}
            <Button variant="outline" size="sm">Login</Button>
            <Button variant="primary" size="sm">Sign Up</Button>
            
            {/* Cart button */}
            <button
              onClick={toggleCart}
              className="relative p-2 text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {getCartTotalItems() > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                  {getCartTotalItems()}
                </span>
              )}
            </button>
          </div>
        </div>
        
        {/* Navigation menu */}
        <nav className="border-t border-gray-200">
          <div className="flex space-x-8 py-2">
            <a href="/" className="text-gray-900 font-medium hover:text-blue-600">Home</a>
            <a href="#" className="text-gray-500 hover:text-gray-900 hover:border-gray-300">Products</a>
            <a href="#" className="text-gray-500 hover:text-gray-900 hover:border-gray-300">Categories</a>
            <a href="#" className="text-gray-500 hover:text-gray-900 hover:border-gray-300">Deals</a>
            <a href="#" className="text-gray-500 hover:text-gray-900 hover:border-gray-300">About</a>
            <a href="#" className="text-gray-500 hover:text-gray-900 hover:border-gray-300">Contact</a>
          </div>
        </nav>
      </div>

      {/* Cart Modal */}
      <Modal
        isOpen={isCartOpen}
        onClose={toggleCart}
        title="Your Cart"
        size="md"
      >
        <div className="max-h-96 overflow-y-auto">
          {cartItems.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Your cart is empty</p>
          ) : (
            <>
              <div className="space-y-4">
                {cartItems.map(item => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
              <div className="mt-6">
                <CartSummary />
                <div className="flex space-x-3 mt-4">
                  <Button
                    variant="secondary"
                    onClick={clearCart}
                    className="flex-1"
                  >
                    Clear Cart
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleCheckout}
                    className="flex-1"
                  >
                    Checkout
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </Modal>
    </header>
  );
};

export default Header;
