import React from 'react';

function LicenseFees(props) {
  const {
    portalSeats, setPortalSeats,
    supportLevel, setSupportLevel,
    implementationSupport, setImplementationSupport,
    hostedOneSDK, setHostedOneSDK
  } = props;

  return (
    <div className="card">
      <h2>💵 License Fees</h2>
      <div className="form-grid">
        <div className="form-group">
          <label>Portal Seats</label>
          <select value={portalSeats} onChange={(e) => setPortalSeats(parseInt(e.target.value))}>
            <option value="0">0 seats - Free</option>
            <option value="5">5 seats - $1,500/year</option>
            <option value="10">10 seats - $3,000/year</option>
            <option value="30">30 seats - $9,000/year</option>
          </select>
        </div>

        <div className="form-group">
          <label>Support Level</label>
          <select value={supportLevel} onChange={(e) => setSupportLevel(parseFloat(e.target.value))}>
            <option value="0">Basic (Access + Ticketing) - Free</option>
            <option value="9000">Enhanced (Allocated CSM + TechOps) - $9,000/year</option>
          </select>
        </div>

        <div className="form-group">
          <label>Implementation Support</label>
          <select value={implementationSupport} onChange={(e) => setImplementationSupport(parseFloat(e.target.value))}>
            <option value="0">No</option>
            <option value="24375">Standard (130 hrs) - $24,375</option>
          </select>
        </div>

        <div className="form-group">
          <label>Hosted OneSDK</label>
          <select value={hostedOneSDK} onChange={(e) => setHostedOneSDK(parseFloat(e.target.value))}>
            <option value="0">No</option>
            <option value="6000">Yes - $6,000/year</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default LicenseFees;
