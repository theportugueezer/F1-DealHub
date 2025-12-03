import React from 'react';
import { convertCurrency, formatCurrency } from '../utils/calculations';

function ProductRow({ product, selectedProducts, setSelectedProducts, displayCurrency }) {
  
  const updateProduct = (updates) => {
    setSelectedProducts(selectedProducts.map(p =>
      p.uniqueId === product.uniqueId ? { ...p, ...updates } : p
    ));
  };

  const removeProduct = () => {
    setSelectedProducts(selectedProducts.filter(p => p.uniqueId !== product.uniqueId));
  };

  const updateVolume = (volume) => {
    updateProduct({ volume: parseInt(volume) || 0 });
  };

  const updateDiscountType = (type) => {
    if (type === 'none') {
      updateProduct({
        discountType: type,
        discountValue: 0,
        effectivePrice: product.planPrice
      });
    } else {
      updateProduct({ discountType: type });
    }
  };

  const updateDiscountValue = (value) => {
    const discountValue = parseFloat(value) || 0;
    let effectivePrice = product.planPrice;

    if (product.discountType === 'absolute') {
      effectivePrice = Math.max(0, product.planPrice - discountValue);
    } else if (product.discountType === 'percent') {
      const discount = (product.planPrice * discountValue) / 100;
      effectivePrice = Math.max(0, product.planPrice - discount);
    }

    updateProduct({ discountValue, effectivePrice });
  };

  const updateCustomCostPrice = (value) => {
    updateProduct({ customCostPrice: value ? parseFloat(value) : null });
  };

  const hasDiscount = product.discountType !== 'none';
  const showOriginalPrice = hasDiscount && product.effectivePrice < product.planPrice;

  const originalTotal = product.volume * product.effectivePrice;
  const convertedTotal = convertCurrency(originalTotal, product.currency, displayCurrency);

  return (
    <div className="product-row">
      <div className="product-row-header">
        <div className="product-info">
          <div className="product-name">{product.name}</div>
          <div className={`product-price ${showOriginalPrice ? 'discounted' : ''}`}>
            {showOriginalPrice ? (
              <>
                Original: {product.planPrice.toFixed(2)} {product.currency} → 
                Discounted: {product.effectivePrice.toFixed(2)} {product.currency}
              </>
            ) : (
              `${product.planPrice.toFixed(2)} ${product.currency} per transaction`
            )}
          </div>
        </div>
        <button className="remove-btn" onClick={removeProduct}>×</button>
      </div>

      <div className="product-controls">
        <div className="control-group">
          <span className="control-label">Volume:</span>
          <input
            type="number"
            className="product-volume"
            value={product.volume}
            placeholder="0"
            onChange={(e) => updateVolume(e.target.value)}
          />
        </div>

        <div className="control-group">
          <span className="control-label">Discount:</span>
          <div className="discount-toggle">
            <label>
              <input
                type="radio"
                name={`discount_${product.uniqueId}`}
                value="none"
                checked={product.discountType === 'none'}
                onChange={() => updateDiscountType('none')}
              />
              None
            </label>
            <label>
              <input
                type="radio"
                name={`discount_${product.uniqueId}`}
                value="absolute"
                checked={product.discountType === 'absolute'}
                onChange={() => updateDiscountType('absolute')}
              />
              $ Amount
            </label>
            <label>
              <input
                type="radio"
                name={`discount_${product.uniqueId}`}
                value="percent"
                checked={product.discountType === 'percent'}
                onChange={() => updateDiscountType('percent')}
              />
              % Off
            </label>
          </div>
        </div>

        <div className="control-group">
          <input
            type="number"
            className="discount-input"
            value={product.discountValue || ''}
            placeholder={product.discountType === 'absolute' ? '$' : product.discountType === 'percent' ? '%' : 'N/A'}
            step={product.discountType === 'absolute' ? '0.01' : '0.1'}
            disabled={product.discountType === 'none'}
            onChange={(e) => updateDiscountValue(e.target.value)}
          />
        </div>

        <div className="control-group">
          <span className="control-label">Cost Price:</span>
          <input
            type="number"
            className="discount-input"
            value={product.customCostPrice || ''}
            placeholder={product.costPrice.toFixed(2)}
            step="0.01"
            onChange={(e) => updateCustomCostPrice(e.target.value)}
          />
        </div>

        <div className="product-total">
          {product.currency === displayCurrency ? (
            formatCurrency(convertedTotal, displayCurrency)
          ) : (
            <>
              {formatCurrency(originalTotal, product.currency)}
              <br />
              <small style={{ color: '#666' }}>
                ({formatCurrency(convertedTotal, displayCurrency)})
              </small>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductRow;
