import React from 'react';
import { formatCurrency } from '../utils/calculations';

function Profitability({ metrics, displayCurrency }) {
  return (
    <div className="card">
      <h2>🩺 Profitability</h2>

      <div className="metric-card">
        <div className="metric-label">Gross Profit</div>
        <div className="metric-value">{formatCurrency(metrics.grossProfit, displayCurrency)}</div>
      </div>

      <div className="metric-card">
        <div className="metric-label">Gross Profit Margin</div>
        <div className="metric-value">{metrics.grossMargin.toFixed(1)}%</div>
      </div>

      <div className="metric-card highlight">
        <div className="metric-label">LTV/CAC Ratio</div>
        <div className="metric-value">{metrics.ltvCac.toFixed(1)}x</div>
      </div>

      <div className="metric-card">
        <div className="metric-label">Payback Period</div>
        <div className="metric-value">{metrics.payback.toFixed(1)} months</div>
      </div>

      <div className="metric-card">
        <div className="metric-label">PC3</div>
        <div className="metric-value">{formatCurrency(metrics.pc3, displayCurrency)}</div>
      </div>
    </div>
  );
}

export default Profitability;
