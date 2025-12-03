import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DealInputs from './components/DealInputs';
import LicenseFees from './components/LicenseFees';
import ProductManager from './components/ProductManager';
import KeyMetrics from './components/KeyMetrics';
import Profitability from './components/Profitability';
import Actions from './components/Actions';
import HubSpotModal from './components/HubSpotModal';
import { PRODUCTS, PORTAL_PRICING, EXCHANGE_RATES, PLAN_PRICING } from './data/constants';
import { convertCurrency, calculateMetrics, getQuoteData } from './utils/calculations';
import './App.css';

function App() {
  // Deal Inputs State
  const [customerName, setCustomerName] = useState('');
  const [preparedBy, setPreparedBy] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [customerPlan, setCustomerPlan] = useState('Basic');
  const [platformFees, setPlatformFees] = useState(3000);
  const [implementationFee, setImplementationFee] = useState(2499);
  const [minimumCommitment, setMinimumCommitment] = useState(0);
  const [childAccounts, setChildAccounts] = useState(0);
  const [contractTermMonths, setContractTermMonths] = useState(24);
  const [paymentFrequency, setPaymentFrequency] = useState('Annual');
  const [autoRenew, setAutoRenew] = useState('Yes');
  const [partnerCommission, setPartnerCommission] = useState(0);

  // License Fees State
  const [portalSeats, setPortalSeats] = useState(5);
  const [supportLevel, setSupportLevel] = useState(0);
  const [implementationSupport, setImplementationSupport] = useState(24375);
  const [hostedOneSDK, setHostedOneSDK] = useState(0);

  // Display Settings
  const [displayCurrency, setDisplayCurrency] = useState('AUD');

  // Product State
  const [selectedProducts, setSelectedProducts] = useState([]);

  // Original values for discount calculation
  const [originalPlatformFees, setOriginalPlatformFees] = useState(3000);
  const [originalImplementationFee, setOriginalImplementationFee] = useState(2499);

  // Modal State
  const [showHubSpotModal, setShowHubSpotModal] = useState(false);

  // Metrics State
  const [metrics, setMetrics] = useState({
    arr: 0,
    mrr: 0,
    committedARR: 0,
    totalRevenue: 0,
    tcv: 0,
    grossProfit: 0,
    grossMargin: 0,
    ltvCac: 0,
    payback: 0,
    pc3: 0,
    assessment: 'Poor'
  });

  // Update plan fees when customer plan changes
  useEffect(() => {
    const pricing = PLAN_PRICING[customerPlan];
    setPlatformFees(pricing.platformFees);
    setImplementationFee(pricing.implementationFee);
    setOriginalPlatformFees(pricing.platformFees);
    setOriginalImplementationFee(pricing.implementationFee);
  }, [customerPlan]);

  // Recalculate metrics whenever relevant state changes
  useEffect(() => {
    const calculatedMetrics = calculateMetrics({
      platformFees,
      implementationFee,
      contractTermMonths,
      childAccounts,
      portalSeats,
      supportLevel,
      implementationSupport,
      hostedOneSDK,
      minimumCommitment,
      selectedProducts,
      displayCurrency,
      customerPlan
    });
    setMetrics(calculatedMetrics);
  }, [
    platformFees,
    implementationFee,
    contractTermMonths,
    childAccounts,
    portalSeats,
    supportLevel,
    implementationSupport,
    hostedOneSDK,
    minimumCommitment,
    selectedProducts,
    displayCurrency,
    customerPlan
  ]);

  const dealInputsProps = {
    customerName,
    setCustomerName,
    preparedBy,
    setPreparedBy,
    startDate,
    setStartDate,
    customerPlan,
    setCustomerPlan,
    platformFees,
    setPlatformFees,
    implementationFee,
    setImplementationFee,
    minimumCommitment,
    setMinimumCommitment,
    childAccounts,
    setChildAccounts,
    contractTermMonths,
    setContractTermMonths,
    paymentFrequency,
    setPaymentFrequency,
    autoRenew,
    setAutoRenew,
    partnerCommission,
    setPartnerCommission
  };

  const licenseFeeProps = {
    portalSeats,
    setPortalSeats,
    supportLevel,
    setSupportLevel,
    implementationSupport,
    setImplementationSupport,
    hostedOneSDK,
    setHostedOneSDK
  };

  const productManagerProps = {
    selectedProducts,
    setSelectedProducts,
    customerPlan,
    displayCurrency
  };

  const resetCalculator = () => {
    if (window.confirm('Reset all fields to default values?')) {
      setCustomerName('');
      setPreparedBy('');
      setStartDate(new Date().toISOString().split('T')[0]);
      setCustomerPlan('Basic');
      setPlatformFees(3000);
      setImplementationFee(2499);
      setMinimumCommitment(0);
      setChildAccounts(0);
      setContractTermMonths(24);
      setPaymentFrequency('Annual');
      setAutoRenew('Yes');
      setPartnerCommission(0);
      setPortalSeats(5);
      setSupportLevel(0);
      setImplementationSupport(24375);
      setHostedOneSDK(0);
      setSelectedProducts([]);
      setOriginalPlatformFees(3000);
      setOriginalImplementationFee(2499);
    }
  };

  const quoteData = getQuoteData({
    customerName,
    preparedBy,
    startDate,
    customerPlan,
    contractTermMonths,
    paymentFrequency,
    autoRenew,
    platformFees,
    implementationFee,
    minimumCommitment,
    childAccounts,
    portalSeats,
    supportLevel,
    implementationSupport,
    hostedOneSDK,
    selectedProducts,
    displayCurrency,
    originalPlatformFees,
    originalImplementationFee
  });

  return (
    <div className="app">
      <div className="container">
        <Header
          displayCurrency={displayCurrency}
          setDisplayCurrency={setDisplayCurrency}
          assessment={metrics.assessment}
          ltvCac={metrics.ltvCac}
        />

        <div className="main-grid">
          {/* Left Column */}
          <div className="left-column">
            <DealInputs {...dealInputsProps} />
            <LicenseFees {...licenseFeeProps} />
          </div>

          {/* Middle Column */}
          <div className="middle-column">
            <ProductManager {...productManagerProps} />
          </div>

          {/* Right Column */}
          <div className="right-column">
            <KeyMetrics metrics={metrics} displayCurrency={displayCurrency} />
            <Profitability metrics={metrics} displayCurrency={displayCurrency} />
            <Actions
              quoteData={quoteData}
              selectedProducts={selectedProducts}
              displayCurrency={displayCurrency}
              resetCalculator={resetCalculator}
              setShowHubSpotModal={setShowHubSpotModal}
              originalPlatformFees={originalPlatformFees}
              originalImplementationFee={originalImplementationFee}
            />
          </div>
        </div>
      </div>

      {showHubSpotModal && (
        <HubSpotModal
          quoteData={quoteData}
          onClose={() => setShowHubSpotModal(false)}
        />
      )}
    </div>
  );
}

export default App;
