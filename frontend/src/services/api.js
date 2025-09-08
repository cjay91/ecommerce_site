const API_BASE_URL = 'http://localhost:8000';

// In a real application, you would implement actual API calls
// For now, we'll simulate API responses with mock data

export const api = {
  // Product endpoints
  getProducts: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock product data based on the backend models
    return [
      {
        id: 1,
        name: 'Premium Headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        price: 199.99,
        category: 'Electronics',
        stock: 15
      },
      {
        id: 2,
        name: 'Running Shoes',
        description: 'Comfortable running shoes for everyday use',
        price: 89.99,
        category: 'Footwear',
        stock: 25
      },
      {
        id: 3,
        name: 'Smart Watch',
        description: 'Feature-rich smartwatch with health monitoring',
        price: 249.99,
        category: 'Electronics',
        stock: 8
      },
      {
        id: 4,
        name: 'Backpack',
        description: 'Durable backpack with laptop compartment',
        price: 59.99,
        category: 'Accessories',
        stock: 30
      },
      {
        id: 5,
        name: 'Water Bottle',
        description: 'Insulated water bottle keeps drinks cold for 24 hours',
        price: 24.99,
        category: 'Accessories',
        stock: 50
      },
      {
        id: 6,
        name: 'Desk Lamp',
        description: 'Adjustable LED desk lamp with multiple brightness settings',
        price: 39.99,
        category: 'Home',
        stock: 20
      }
    ];
  },

  getProductById: async (id) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // In a real app, you would fetch the specific product
    const products = await api.getProducts();
    return products.find(product => product.id === parseInt(id));
  },

  // Order endpoints
  createOrder: async (orderData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate successful order creation
    return {
      id: Math.floor(Math.random() * 10000),
      ...orderData,
      status: 'confirmed',
      created_at: new Date().toISOString()
    };
  }
};

export default api;
