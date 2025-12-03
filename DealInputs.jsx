import React from 'react';

function DealInputs(props) {
  const {
    customerName, setCustomerName,
    preparedBy, setPreparedBy,
    startDate, setStartDate,
    customerPlan, setCustomerPlan,
    platformFees, setPlatformFees,
    implementationFee, setImplementationFee,
    minimumCommitment, setMinimumCommitment,
    childAccounts, setChildAccounts,
    contractTermMonths, setContractTermMonths,
    paymentFrequency, setPaymentFrequency,
    autoRenew, setAutoRenew,
    partnerCommission, setPartnerCommission
  } = props;

  return (
    <div className="card">
      <h2>⌨️ Deal Inputs</h2>
      <div className="form-grid">
        <div className="form-group">
          <label>Customer Name</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Enter customer name"
          />
        </div>

        <div className="form-group">
          <label>Prepared By</label>
          <select value={preparedBy} onChange={(e) => setPreparedBy(e.target.value)}>
            <option value="">Select sales person</option>
            <option>Lindsay Hatton</option>
            <option>Manjunath Raju</option>
            <option>Conor Buckley</option>
            <option>Kim Wrobel</option>
            <option>Junya Ichinose</option>
            <option>Patrick Lynch</option>
          </select>
        </div>

        <div className="form-group">
          <label>Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Customer Plan</label>
          <select value={customerPlan} onChange={(e) => setCustomerPlan(e.target.value)}>
            <option value="Enterprise">Enterprise</option>
            <option value="Professional">Professional</option>
            <option value="Basic">Basic</option>
          </select>
        </div>

        <div className="form-group">
          <label>Platform Fees (Annual)</label>
          <input
            type="number"
            value={platformFees}
            onChange={(e) => setPlatformFees(parseFloat(e.target.value) || 0)}
          />
        </div>

        <div className="form-group">
          <label>Implementation Fee</label>
          <input
            type="number"
            value={implementationFee}
            onChange={(e) => setImplementationFee(parseFloat(e.target.value) || 0)}
          />
        </div>

        <div className="form-group">
          <label>Minimum Commitment (Annual)</label>
          <input
            type="number"
            value={minimumCommitment}
            onChange={(e) => setMinimumCommitment(parseFloat(e.target.value) || 0)}
            min="0"
            step="1"
          />
        </div>

        <div className="form-group">
          <label>Child Accounts</label>
          <input
            type="number"
            value={childAccounts}
            onChange={(e) => setChildAccounts(parseInt(e.target.value) || 0)}
            min="0"
            placeholder="# of child accounts"
          />
        </div>

        <div className="form-group">
          <label>Contract Term (months)</label>
          <input
            type="number"
            value={contractTermMonths}
            onChange={(e) => setContractTermMonths(parseInt(e.target.value) || 24)}
          />
        </div>

        <div className="form-group">
          <label>Payment Frequency</label>
          <select value={paymentFrequency} onChange={(e) => setPaymentFrequency(e.target.value)}>
            <option>Annual</option>
            <option>Quarterly</option>
            <option>Monthly</option>
          </select>
        </div>

        <div className="form-group">
          <label>Auto Renew</label>
          <select value={autoRenew} onChange={(e) => setAutoRenew(e.target.value)}>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div className="form-group">
          <label>Partner Commission (%)</label>
          <input
            type="number"
            value={partnerCommission}
            onChange={(e) => setPartnerCommission(parseFloat(e.target.value) || 0)}
            step="0.1"
          />
        </div>
      </div>
    </div>
  );
}

export default DealInputs;
