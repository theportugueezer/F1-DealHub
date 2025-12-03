import React, { useState } from 'react';
import '../styles/HubSpotModal.css';

function HubSpotModal({ quoteData, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [deals, setDeals] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [status, setStatus] = useState({ message: '', type: '' });

  const searchDeals = (query) => {
    setSearchQuery(query);
    
    if (query.length < 2) {
      setShowResults(false);
      return;
    }

    // Mock deals for demonstration
    const mockDeals = [
      { id: '123', name: 'ABC Corp Deal', stage: 'Negotiation', amount: 50000 },
      { id: '456', name: 'XYZ Company Deal', stage: 'Proposal', amount: 75000 },
      { id: '789', name: 'DEF Ltd Deal', stage: 'Closed Won', amount: 100000 }
    ].filter(d => d.name.toLowerCase().includes(query.toLowerCase()));

    setDeals(mockDeals);
    setShowResults(true);
  };

  const selectDeal = (deal) => {
    setSelectedDeal(deal);
    setShowResults(false);
    setSearchQuery('');
  };

  const sendToHubSpot = async () => {
    if (!selectedDeal) {
      setStatus({ message: 'Please select a deal first.', type: 'error' });
      return;
    }

    setStatus({ message: 'Sending...', type: '' });

    // Simulate API call
    setTimeout(() => {
      setStatus({
        message: 'Quote successfully sent to HubSpot and associated with deal!',
        type: 'success'
      });

      setTimeout(() => {
        onClose();
      }, 3000);
    }, 1500);
  };

  return (
    <div className="hubspot-modal">
      <div className="hubspot-modal-content">
        <div className="hubspot-header">
          <h2>🔗 Connect to HubSpot</h2>
          <span className="hubspot-close" onClick={onClose}>&times;</span>
        </div>

        <div className="hubspot-deal-section">
          <div className="deal-search-container">
            <label style={{ fontWeight: 500, marginBottom: '5px', display: 'block' }}>
              Search for Deal:
            </label>
            <input
              type="text"
              className="deal-search-input"
              placeholder="Start typing deal name..."
              value={searchQuery}
              onChange={(e) => searchDeals(e.target.value)}
            />
            {showResults && (
              <div className="deal-results">
                {deals.length === 0 ? (
                  <div className="deal-item">No deals found</div>
                ) : (
                  deals.map(deal => (
                    <div
                      key={deal.id}
                      className="deal-item"
                      onClick={() => selectDeal(deal)}
                    >
                      <strong>{deal.name}</strong><br />
                      <small>
                        Stage: {deal.stage} | Amount: ${deal.amount?.toLocaleString() || 'N/A'}
                      </small>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {selectedDeal && (
            <div className="selected-deal-info">
              <p style={{ fontWeight: 500 }}>Selected Deal:</p>
              <div className="selected-deal-details">
                <strong>{selectedDeal.name}</strong><br />
                <small>
                  Stage: {selectedDeal.stage} | Amount: ${selectedDeal.amount ? parseFloat(selectedDeal.amount).toLocaleString() : 'N/A'}
                </small>
              </div>
            </div>
          )}

          <div className="hubspot-actions">
            <button
              className="btn btn-success"
              onClick={sendToHubSpot}
              disabled={!selectedDeal}
            >
              🐦 Send Quote to HubSpot
            </button>
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>

        {status.message && (
          <div className={`hubspot-status ${status.type}`}>
            {status.message}
          </div>
        )}
      </div>
    </div>
  );
}

export default HubSpotModal;
