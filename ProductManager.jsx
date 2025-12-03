import React, { useState } from 'react';
import { PRODUCTS } from '../data/constants';
import { getPriceForPlan, convertCurrency, formatCurrency } from '../utils/calculations';
import ProductRow from './ProductRow';

function ProductManager({ selectedProducts, setSelectedProducts, customerPlan, displayCurrency }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');

  const filteredProducts = searchTerm
    ? PRODUCTS.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : PRODUCTS;

  const addSelectedProduct = () => {
    const productId = parseInt(selectedProductId);
    if (!productId && productId !== 0) return;

    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const planPrice = getPriceForPlan(product, customerPlan);

    setSelectedProducts([...selectedProducts, {
      ...product,
      uniqueId: Date.now() + Math.random(),
      volume: 0,
      planPrice: planPrice,
      discountType: 'none',
      discountValue: 0,
      effectivePrice: planPrice,
      customCostPrice: null
    }]);
  };

  const addAllProducts = () => {
    if (selectedProducts.length > 0) {
      if (!window.confirm('This will add all products. Any existing products will remain. Continue?')) {
        return;
      }
    }

    let addedCount = 0;
    const newProducts = [];

    PRODUCTS.forEach(product => {
      const alreadyAdded = selectedProducts.some(p => p.id === product.id);

      if (!alreadyAdded) {
        const planPrice = getPriceForPlan(product, customerPlan);

        newProducts.push({
          ...product,
          uniqueId: Date.now() + Math.random() + addedCount,
          volume: 0,
          planPrice: planPrice,
          discountType: 'none',
          discountValue: 0,
          effectivePrice: planPrice,
          customCostPrice: null
        });

        addedCount++;
      }
    });

    if (addedCount > 0) {
      setSelectedProducts([...selectedProducts, ...newProducts]);
      alert(`Successfully added ${addedCount} products!`);
    } else {
      alert('All products are already in the list!');
    }
  };

  const clearAllProducts = () => {
    if (selectedProducts.length === 0) {
      alert('No products to clear!');
      return;
    }

    if (window.confirm(`Remove all ${selectedProducts.length} products?`)) {
      setSelectedProducts([]);
    }
  };

  return (
    <div className="card">
      <h2>📦 Transaction Products</h2>
      
      <div className="form-group" style={{ marginBottom: '15px' }}>
        <label>Add Product (Search or Select)</label>
        <input
          type="text"
          className="product-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Type to search products (e.g., 'eKYC', 'Onfido', 'AML')..."
        />
        
        <div className="product-count">
          {searchTerm 
            ? `Found ${filteredProducts.length} product${filteredProducts.length === 1 ? '' : 's'} matching "${searchTerm}"`
            : `Showing ${PRODUCTS.length} products`
          }
        </div>

        <select
          className="product-select"
          size="8"
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
        >
          {filteredProducts.map(p => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.currency})
            </option>
          ))}
        </select>

        <div className="product-actions">
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={addSelectedProduct}>
            Add Selected Product
          </button>
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={addAllProducts}>
            Select All Products
          </button>
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={clearAllProducts}>
            Clear All Products
          </button>
        </div>
      </div>

      <div id="productList">
        {selectedProducts.length === 0 ? (
          <div className="empty-state">No products selected. Add products above.</div>
        ) : (
          selectedProducts.map(product => (
            <ProductRow
              key={product.uniqueId}
              product={product}
              selectedProducts={selectedProducts}
              setSelectedProducts={setSelectedProducts}
              displayCurrency={displayCurrency}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default ProductManager;
