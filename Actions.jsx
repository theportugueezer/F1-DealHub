import React from 'react';
import { exportToPDF, exportUsageToPDF, exportToCSV } from '../utils/exports';

function Actions({
  quoteData,
  selectedProducts,
  displayCurrency,
  resetCalculator,
  setShowHubSpotModal,
  originalPlatformFees,
  originalImplementationFee
}) {

  const handlePDFQuote = () => {
    exportToPDF(quoteData, originalPlatformFees, originalImplementationFee);
  };

  const handlePDFUsage = () => {
    if (selectedProducts.length === 0) {
      alert('No products added to generate usage report!');
      return;
    }
    exportUsageToPDF(quoteData, displayCurrency);
  };

  const handleCSVExport = () => {
    exportToCSV(quoteData, originalPlatformFees, originalImplementationFee);
  };

  return (
    <div className="card">
      <h2>🎬 Actions</h2>
      <button className="btn btn-primary" onClick={handlePDFQuote}>
        📄 PDF Quote
      </button>
      <button className="btn btn-primary" onClick={handleCSVExport}>
        📊 Export CSV
      </button>
      <button className="btn btn-secondary" onClick={handlePDFUsage}>
        PDF Usage
      </button>
      <button className="btn btn-success" onClick={() => setShowHubSpotModal(true)}>
        ✓ Send to HubSpot
      </button>
      <button className="btn btn-secondary" onClick={resetCalculator}>
        ↺ Reset Calculator
      </button>
    </div>
  );
}

export default Actions;
