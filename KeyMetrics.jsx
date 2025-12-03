import React from 'react';
import { formatCurrency } from '../utils/calculations';

function KeyMetrics({ metrics, displayCurrency }) {
  return (
    <div className="card">
      <h2>📊 Key Metrics</h2>
      
      <div className="metric-card">
        <div className="metric-label">ARR (Recurring)</div>
        <div className="metric-value">{formatCurrency(metrics.arr, displayCurrency)}</div>
      </div>

      <div className="metric-card">
        <div className="metric-label">MRR (Recurring)</div>
        <div className="metric-value">{formatCurrency(metrics.mrr, displayCurrency)}</div>
      </div>

      <div className="metric-card">
        <div className="metric-label">Committed ARR</div>
        <div className="metric-value">{formatCurrency(metrics.committedARR, displayCurrency)}</div>
      </div>

      <div className="metric-card">
        <div className="metric-label">Total Revenue (Yr 1)</div>
        <div className="metric-value">{formatCurrency(metrics.totalRevenue, displayCurrency)}</div>
      </div>

      <div className="metric-card highlight">
        <div className="metric-label">Total Contract Value (TCV)</div>
        <div className="metric-value">{formatCurrency(metrics.tcv, displayCurrency)}</div>
      </div>
    </div>
  );
}

export default KeyMetrics;
