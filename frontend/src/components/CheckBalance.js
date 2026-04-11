import React, { useState } from 'react';
import './CheckBalance.css';

// Dummy data for 5 farmers
const dummyFarmers = [
  { 
    name: "ramesh kumar", 
    accountNumber: "123456789", 
    balance: "45,500.00", 
    currency: "₹",
    farmerId: "K-001",
    lastUpdated: "Today, 10:30 AM",
    transactions: [
      { id: 1, type: "credit", desc: "PM-Kisan Installment", amount: "+ ₹ 2,000" },
      { id: 2, type: "debit", desc: "Fertilizer Purchase", amount: "- ₹ 1,500" },
      { id: 3, type: "credit", desc: "Crop Subsidy", amount: "+ ₹ 5,000" }
    ]
  },
  { 
    name: "suresh singh", 
    accountNumber: "987654321", 
    balance: "12,200.00", 
    currency: "₹",
    farmerId: "K-002",
    lastUpdated: "Yesterday, 04:15 PM",
    transactions: [
      { id: 1, type: "credit", desc: "Mandi Crop Sale", amount: "+ ₹ 10,000" },
      { id: 2, type: "debit", desc: "Tractor Rent", amount: "- ₹ 3,000" }
    ]
  },
  { 
    name: "mohan das", 
    accountNumber: "112233445", 
    balance: "1,05,000.00", 
    currency: "₹",
    farmerId: "K-003",
    lastUpdated: "Today, 08:00 AM",
    transactions: [
      { id: 1, type: "credit", desc: "KCC Loan Approved", amount: "+ ₹ 1,00,000" },
      { id: 2, type: "debit", desc: "Seeds Purchase", amount: "- ₹ 5,000" }
    ]
  },
  { 
    name: "gita devi", 
    accountNumber: "554433221", 
    balance: "8,400.00", 
    currency: "₹",
    farmerId: "K-004",
    lastUpdated: "2 Days ago",
    transactions: [
      { id: 1, type: "credit", desc: "Crop Insurance Claim", amount: "+ ₹ 4,000" }
    ]
  },
  { 
    name: "hari om", 
    accountNumber: "998877665", 
    balance: "35,100.00", 
    currency: "₹",
    farmerId: "K-005",
    lastUpdated: "Today, 01:20 PM",
    transactions: [
      { id: 1, type: "credit", desc: "Grain Sale", amount: "+ ₹ 20,000" },
      { id: 2, type: "debit", desc: "Electricity Bill", amount: "- ₹ 1,200" },
      { id: 3, type: "credit", desc: "PM-Kisan Installment", amount: "+ ₹ 2,000" }
    ]
  }
];

export default function CheckBalance() {
  const [nameInput, setNameInput] = useState('');
  const [accountInput, setAccountInput] = useState('');
  const [error, setError] = useState('');
  const [walletData, setWalletData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showWallet, setShowWallet] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!nameInput.trim() || !accountInput.trim()) {
      setError('Please enter both name and account number.');
      return;
    }

    setIsLoading(true);

    // Simulate API delay for animation effect
    setTimeout(() => {
      const foundFarmer = dummyFarmers.find(
        f => f.name.toLowerCase() === nameInput.toLowerCase().trim() && 
             f.accountNumber === accountInput.trim()
      );

      if (foundFarmer) {
        setWalletData(foundFarmer);
        setShowWallet(true);
      } else {
        setError('No account found with this Name and Account Number.');
      }
      setIsLoading(false);
    }, 1200);
  };

  const handleBack = () => {
    setShowWallet(false);
    setTimeout(() => {
      setWalletData(null);
      setNameInput('');
      setAccountInput('');
    }, 400); // Wait for transition out
  };

  return (
    <div className="balance-container">
      {!showWallet ? (
        <div className="balance-card login-view slide-in">
          <div className="card-header">
            <h2>💳 Kisan Wallet</h2>
            <p>Access your agricultural digital balance</p>
          </div>
          
          <form onSubmit={handleSubmit} className="balance-form">
            <div className="input-group">
              <label>Farmer Name</label>
              <input 
                type="text" 
                placeholder="e.g. Ramesh Kumar"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                autoComplete="off"
              />
            </div>
            <div className="input-group">
              <label>Account Number</label>
              <input 
                type="password" 
                placeholder="Enter your account number"
                value={accountInput}
                onChange={(e) => setAccountInput(e.target.value)}
                autoComplete="off"
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button 
              type="submit" 
              className={`submit-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="spinner"></span>
              ) : (
                'Check Balance / बैलेंस देखें'
              )}
            </button>
          </form>
          
          <div className="helper-text">
            Hint for testing: Name <strong>"ramesh kumar"</strong>, A/C <strong>"123456789"</strong>
          </div>
        </div>
      ) : (
        <div className="wallet-view zoom-in">
          <div className="wallet-header">
            <button className="back-btn" onClick={handleBack}>
              ← Back
            </button>
            <span className="farmer-id">ID: {walletData.farmerId}</span>
          </div>

          <div className="credit-card-3d">
            <div className="card-chip"></div>
            <div className="card-balance-section">
              <p className="balance-label">Total Balance / कुल राशि</p>
              <h1 className="balance-amount">
                {walletData.currency} {walletData.balance}
              </h1>
            </div>
            <div className="card-details">
              <div className="card-holder">
                <p>Card Holder</p>
                <h4>{walletData.name.toUpperCase()}</h4>
              </div>
              <div className="card-account">
                <p>A/C Number</p>
                <h4>**** {walletData.accountNumber.slice(-4)}</h4>
              </div>
            </div>
            <div className="card-background-circle"></div>
            <div className="card-background-circle two"></div>
          </div>

          <div className="transactions-section fade-up">
            <h3>Recent Transactions</h3>
            <p className="last-updated">Last updated: {walletData.lastUpdated}</p>
            
            <div className="transactions-list">
              {walletData.transactions.length > 0 ? (
                walletData.transactions.map((tx) => (
                  <div className="transaction-item" key={tx.id}>
                    <div className="tx-icon">
                      {tx.type === 'credit' ? '↓' : '↑'}
                    </div>
                    <div className="tx-details">
                      <h4>{tx.desc}</h4>
                      <p>{tx.type === 'credit' ? 'Credit' : 'Debit'}</p>
                    </div>
                    <div className={`tx-amount ${tx.type}`}>
                      {tx.amount}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-transactions">No recent transactions</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
