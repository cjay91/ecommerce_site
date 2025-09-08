import React from 'react';
import Button from '../ui/Button';
import { useCart } from '../../hooks/useCart';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    if (!isNaN(newQuantity)) {
      updateQuantity(item.id, newQuantity);
    }
  };

  const handleRemove = () => {
    removeFromCart(item.id);
  };

  return (
    <div className="flex items-center py-4 border-b border-gray-200">
      <div className="flex-shrink-0 w-24 h-24 bg-gray-200 border-2 border-dashed rounded-xl flex items-center justify-center text-gray-500">
        Image
      </div>
      
      <div className="ml-4 flex-1">
        <div className="flex justify-between">
          <h3 className="text-base font-medium text-gray-900">{item.name}</h3>
          <p className="ml-4 text-base font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
        </div>
        
        <p className="mt-1 text-sm text-gray-500">${item.price.toFixed(2)} each</p>
        
        <div className="mt-2 flex items-center">
          <label htmlFor={`quantity-${item.id}`} className="mr-2 text-sm text-gray-700">
            Qty:
          </label>
          <select
            id={`quantity-${item.id}`}
            value={item.quantity}
            onChange={handleQuantityChange}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            {[...Array(Math.min(10, item.stock)).keys()].map(i => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>
          
          <Button
            variant="danger"
            size="sm"
            onClick={handleRemove}
            className="ml-4"
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
