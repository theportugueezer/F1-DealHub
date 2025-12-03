import { EXCHANGE_RATES, PORTAL_PRICING } from '../data/constants';

export function convertCurrency(amount, fromCurrency, toCurrency) {
  if (fromCurrency === toCurrency) return amount;
  return amount * EXCHANGE_RATES[fromCurrency][toCurrency];
}

export function getPriceForPlan(product, plan) {
  switch(plan) {
    case 'Basic':
      return product.basePrice;
    case 'Professional':
      return product.proPrice;
    case 'Enterprise':
      return product.enterprisePrice;
    default:
      return product.enterprisePrice;
  }
}

export function calculateMetrics(data) {
  const {
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
    displayCurrency
  } = data;

  const childAccountsFee = childAccounts * 2400;
  const portalPrice = PORTAL_PRICING[portalSeats].price;

  // Calculate transaction revenue with currency conversion
  const transactionRevenue = selectedProducts.reduce((sum, p) => {
    const convertedPrice = convertCurrency(p.effectivePrice, p.currency, displayCurrency);
    return sum + (p.volume * convertedPrice);
  }, 0);

  const transactionCost = selectedProducts.reduce((sum, p) => {
    const costToUse = p.customCostPrice !== null ? p.customCostPrice : p.costPrice;
    const convertedCost = convertCurrency(costToUse, p.currency, displayCurrency);
    return sum + (p.volume * convertedCost);
  }, 0);

  // Annual Platform Fees
  const annualPlatformFees = platformFees + portalPrice + supportLevel + hostedOneSDK + childAccountsFee;

  // ARR
  const arr = annualPlatformFees;

  // MRR
  const mrr = arr / 12;

  // Committed ARR
  const committedARR = arr * (contractTermMonths / 12);

  // Total Revenue Year 1
  const totalRevenueYr1 = annualPlatformFees + implementationFee + implementationSupport + transactionRevenue;

  // TCV
  const tcv = committedARR + implementationFee + implementationSupport + (transactionRevenue * (contractTermMonths / 12));

  // Gross Profit
  const totalCosts = transactionCost * (contractTermMonths / 12);
  const grossProfit = tcv - totalCosts;
  const grossProfitMargin = tcv > 0 ? (grossProfit / tcv * 100) : 0;

  // LTV/CAC
  const cac = 79394;
  const ltv = grossProfit * 1.5;
  const ltvCacRatio = cac > 0 ? ltv / cac : 0;

  // Payback
  const monthlyGrossProfit = grossProfit / contractTermMonths;
  const paybackMonths = monthlyGrossProfit > 0 ? cac / monthlyGrossProfit : 0;

  // PC3
  const pc3 = grossProfit - cac - 6845;

  // Assessment
  let assessment = 'Poor';
  if (ltvCacRatio >= 4) {
    assessment = 'Great';
  } else if (ltvCacRatio >= 3) {
    assessment = 'Good';
  } else if (ltvCacRatio >= 2) {
    assessment = 'Average';
  }

  return {
    arr,
    mrr,
    committedARR,
    totalRevenue: totalRevenueYr1,
    tcv,
    grossProfit,
    grossMargin: grossProfitMargin,
    ltvCac: ltvCacRatio,
    payback: paybackMonths,
    pc3,
    assessment
  };
}

export function getQuoteData(data) {
  const {
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
  } = data;

  const childAccountsFee = childAccounts * 2400;
  const portalPrice = PORTAL_PRICING[portalSeats].price;

  const transactionRevenue = selectedProducts.reduce((sum, p) => {
    const convertedPrice = convertCurrency(p.effectivePrice, p.currency, displayCurrency);
    return sum + (p.volume * convertedPrice);
  }, 0);

  const annualPlatformFees = platformFees + portalPrice + supportLevel + hostedOneSDK;

  const upfrontPayment = platformFees + 
                         childAccountsFee + 
                         portalPrice + 
                         supportLevel + 
                         implementationFee + 
                         implementationSupport + 
                         hostedOneSDK + 
                         minimumCommitment;

  const totalAnnualSpend = annualPlatformFees + transactionRevenue;

  return {
    customerName: customerName || 'Customer Name',
    preparedBy: preparedBy || 'Sales Representative',
    startDate,
    customerPlan,
    contractTermMonths,
    paymentFrequency,
    autoRenew,
    platformFees,
    portalSeats,
    portalPrice,
    supportLevel,
    hostedOneSDK,
    implementationFee,
    childAccounts,
    childAccountsFee,
    implementationSupport,
    upfrontPayment,
    transactionRevenue,
    minimumCommitment,
    annualPlatformFees,
    totalAnnualSpend,
    products: selectedProducts,
    originalPlatformFees,
    originalImplementationFee
  };
}

export function formatCurrency(value, currency = 'AUD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}
