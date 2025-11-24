import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Example list of product names
  const productNames = [
    "Wireless Headphones", "Smartphone", "LED TV", "Bluetooth Speaker", "Laptop",
    "Tablet", "Coffee Maker", "Microwave Oven", "Smart Watch", "Air Purifier",
    "Refrigerator", "Washing Machine", "Air Conditioner", "Electric Kettle", "Digital Camera",
    "Game Console", "Electric Toothbrush", "Cordless Vacuum Cleaner", "Smart Thermostat", "Hair Dryer",
    "Smart Light Bulb", "Portable Charger", "Noise Cancelling Headphones", "Smart Doorbell", "Fitness Tracker",
    "Electric Grill", "Dishwasher", "Electric Pressure Cooker", "Water Purifier", "Food Processor",
    "Electric Scooter", "Gaming Chair", "Projector", "Action Camera", "Robot Vacuum",
    "Standing Desk", "Electric Blanket", "Air Fryer", "Cordless Drill", "Induction Cooktop",
    "Mini Fridge", "Sewing Machine", "Blender", "Smart Scale", "Smart Plug",
    "Digital Thermometer", "Mini Camera", "Weather Station", "Smart Light Switch", "Digital Picture Frame"
  ];

  // Function to calculate reorder point
  const calculateReorderPoint = (avgSalesPerWeek, leadTime) => {
    return avgSalesPerWeek * leadTime;
  };

  // Function to check if a product needs to be reordered
  const needsReorder = (product) => {
    const reorderPoint = calculateReorderPoint(product.average_sales_per_week, product.lead_time);
    return product.inventory < reorderPoint;
  };

  // Load product data from localStorage or generate new data
  const loadProducts = () => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      return JSON.parse(savedProducts);
    } else {
      return generateMockData();
    }
  };

  // Generate mock data for 100 products with realistic product names
  const generateMockData = () => {
    let products = [];
    for (let i = 1; i <= 100; i++) {
      products.push({
        id: i,
        name: productNames[Math.floor(Math.random() * productNames.length)], // Random product name
        inventory: Math.floor(Math.random() * 100) + 1, // Random inventory between 1 and 100
        average_sales_per_week: Math.floor(Math.random() * 20) + 1, // Random sales between 1 and 20
        lead_time: Math.floor(Math.random() * 6) + 1, // Random lead time between 1 and 6 weeks
      });
    }
    // Save the generated data to localStorage
    localStorage.setItem('products', JSON.stringify(products));
    return products;
  };

  const [products, setProducts] = useState(loadProducts);
  const [loading, setLoading] = useState(false);

  // Separate products into two groups: those needing reorder (Yes) and those not needing reorder (No)
  const productsNeedingReorder = products.filter(needsReorder);
  const productsNotNeedingReorder = products.filter((product) => !needsReorder(product));

  // Sort each group by inventory in ascending order
  const sortedProductsNeedingReorder = productsNeedingReorder.sort((a, b) => a.inventory - b.inventory);
  const sortedProductsNotNeedingReorder = productsNotNeedingReorder.sort((a, b) => a.inventory - b.inventory);

  // Combine both groups: products needing reorder come first, followed by those not needing reorder
  const sortedProducts = [...sortedProductsNeedingReorder, ...sortedProductsNotNeedingReorder];

  // Dashboard: Calculate total products and products needing reorder
  const totalProducts = products.length;
  const productsToReorder = productsNeedingReorder.length;

  return (
    <div className="App">
      <div className="content-wrapper">
        {/* Header inside a card with black background and curved edges */}
        <div className="header-card">
          <h1 className="header">Product Reorder Dashboard</h1>
        </div>

        {/* Dashboard Stats Cards */}
        <div className="stats-cards">
          <div className="stat-card">
            <h3>Total Products</h3>
            <p>{totalProducts}</p>
          </div>
          <div className="stat-card">
            <h3>Products to Reorder</h3>
            <p>{productsToReorder}</p>
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="product-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Current Inventory</th>
                <th>Average Sales per Week</th>
                <th>Lead Time (Weeks)</th>
                <th>Reorder Suggestion</th>
              </tr>
            </thead>
            <tbody>
              {sortedProducts.map((product) => (
                <tr
                  key={product.id}
                  className={needsReorder(product) ? 'reorder' : ''}
                >
                  <td>{product.name}</td>
                  <td>{product.inventory}</td>
                  <td>{product.average_sales_per_week}</td>
                  <td>{product.lead_time}</td>
                  <td>{needsReorder(product) ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;
