import React from 'react';
import ProductList from '../components/product/ProductList';

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Our Store</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover our amazing collection of products at great prices. 
          Shop with confidence and enjoy fast delivery.
        </p>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Products</h2>
        <ProductList />
      </div>
    </div>
  );
};

export default Home;
