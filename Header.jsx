import React from 'react';

function Header({ displayCurrency, setDisplayCurrency, assessment, ltvCac }) {
  const getAssessmentText = () => {
    if (assessment === 'Great') return 'Jacqui says Great, hit the Gong!';
    if (assessment === 'Good') return 'Jacqui says Good';
    if (assessment === 'Average') return 'Jacqui says this is Average';
    return 'Jacqui is speechless at how poor this is, please consult the Finance Team.';
  };

  return (
    <div className="header">
      <div>
        <h1>🧮 Deal Return Calculator</h1>
        <p>Generate accurate quotes and analyse deal profitability</p>
      </div>
      <div className="header-right">
        <div className="currency-selector">
          <label>Display Currency</label>
          <select 
            value={displayCurrency} 
            onChange={(e) => setDisplayCurrency(e.target.value)}
          >
            <option value="AUD">🇦🇺 AUD</option>
            <option value="USD">🇺🇸 USD</option>
            <option value="NZD">🇳🇿 NZD</option>
            <option value="EUR">🇪🇺 EUR</option>
            <option value="CAD">🇨🇦 CAD</option>
          </select>
        </div>
        <div className={`assessment ${assessment.toLowerCase()}`}>
          <div className="assessment-label">Overall Assessment</div>
          <div className="assessment-value">{getAssessmentText()}</div>
        </div>
      </div>
    </div>
  );
}

export default Header;
