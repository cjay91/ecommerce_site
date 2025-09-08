import React from 'react';
import { useCart } from '../../hooks/useCart';

const CartSummary = () => {
  const { getCartTotalItems, getCartTotalPrice } = useCart();

  return (
    <div className="border-t border-b border-gray-200 py-4">
      <div className="flex justify-between text-base font-medium text-gray-900">
        <p>Subtotal</p>
        <p>${getCartTotalPrice().toFixed(2)}</p>
      </div>
      <p className="mt-1 text-sm text-gray-500">
        {getCartTotalItems()} items
      </p>
      <p className="mt-4 text-sm text-gray-500">
        Shipping and taxes calculated at checkout.
      </p>
    </div>
  );
};

export default CartSummary;
