import { useState, useEffect } from 'react';

// Local API URL
const API_URL = 'http://localhost:3000';

interface ContractState {
  lastSecretHash: string;
  totalTransactions: number;
}

interface Transaction {
  txId: string;
  type: string;
  timestamp: string;
  secretHash?: string;
  success?: boolean;
}

export function ContractDeployment() {
  const [serverHealthy, setServerHealthy] = useState<boolean | null>(null);
  const [contractState, setContractState] = useState<ContractState | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state for creating/claiming envelopes
  const [secretHash, setSecretHash] = useState('');
  const [secret, setSecret] = useState('');
  const [expectedHash, setExpectedHash] = useState('');

  // Check server health on mount
  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const checkHealth = async () => {
    try {
      const response = await fetch(`${API_URL}/health`);
      if (response.ok) {
        setServerHealthy(true);
        // Also fetch current state
        fetchState();
      } else {
        setServerHealthy(false);
      }
    } catch (error) {
      setServerHealthy(false);
    }
  };

  const fetchState = async () => {
    try {
      const response = await fetch(`${API_URL}/state`);
      if (response.ok) {
        const data = await response.json();
        setContractState(data);
      }
    } catch (error) {
      console.error('Failed to fetch state:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${API_URL}/transactions`);
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
  };

  const generateSecret = async () => {
    try {
      const response = await fetch(`${API_URL}/generateSecret`);
      if (response.ok) {
        const data = await response.json();
        setSecret(data.secret);
        setSecretHash(data.hash);
        alert(`Secret generated!\n\nSecret: ${data.secret.substring(0, 32)}...\nHash: ${data.hash.substring(0, 32)}...\n\n${data.note}`);
      }
    } catch (error) {
      alert('Failed to generate secret: ' + (error as Error).message);
    }
  };

  const createEnvelope = async () => {
    if (!secretHash || secretHash.length !== 64) {
      alert('Please enter a valid 64-character hex secret hash (32 bytes)');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/createEnvelope`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secretHash })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert(`✅ Envelope Created!\n\nTransaction ID: ${data.txId}\nSecret Hash: ${data.secretHash.substring(0, 32)}...`);
        setSecretHash('');
        fetchState();
        fetchTransactions();
      } else {
        setError(data.error || 'Failed to create envelope');
      }
    } catch (error) {
      setError('Network error: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const claimEnvelope = async () => {
    if (!secret || secret.length !== 64) {
      alert('Please enter a valid 64-character hex secret (32 bytes)');
      return;
    }

    if (!expectedHash || expectedHash.length !== 64) {
      alert('Please enter a valid 64-character hex expected hash (32 bytes)');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/claimEnvelope`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret, expectedHash })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert(`✅ Envelope Claimed Successfully!\n\nTransaction ID: ${data.txId}\nVerification: ${data.message}`);
        setSecret('');
        setExpectedHash('');
        fetchState();
        fetchTransactions();
      } else if (response.ok && !data.success) {
        alert(`❌ Claim Failed\n\n${data.message}\n\nThe secret does not match the expected hash.`);
      } else {
        setError(data.error || 'Failed to claim envelope');
      }
    } catch (error) {
      setError('Network error: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="deployment-container">
      {/* Header */}
      <div className="header">
        <h1>Midnight HTLC Contract</h1>
        <p className="subtitle">Hash Time-Locked Contract - Local Runtime Server</p>
      </div>

      {/* Server Status */}
      <div className="glass-card">
        <h2>🖥️ Server Status</h2>
        <div className="services-status">
          {serverHealthy ? (
            <p className="status-healthy">✅ Local runtime server is healthy</p>
          ) : (
            <p className="status-unhealthy">❌ Server is down - run: npm start</p>
          )}
          <button className="btn-secondary" onClick={checkHealth}>
            Refresh Status
          </button>
        </div>
      </div>

      {/* Contract State */}
      <div className="glass-card">
        <h2>📊 Contract State</h2>
        {contractState ? (
          <div className="info-section">
            <pre>{JSON.stringify(contractState, null, 2)}</pre>
          </div>
        ) : (
          <p className="muted">Loading state...</p>
        )}
        <button className="btn-secondary" onClick={fetchState}>
          Refresh State
        </button>
      </div>

      {/* Generate Secret */}
      <div className="glass-card">
        <h2>🎲 Step 1: Generate Secret</h2>
        <p className="small">Generate a random secret and its SHA256 hash</p>
        <button className="btn-primary" onClick={generateSecret} disabled={loading}>
          {loading ? 'Generating...' : 'Generate New Secret'}
        </button>
        
        {secret && (
          <div className="success-box" style={{marginTop: '1rem'}}>
            <div className="info-row">
              <span className="label">Secret (32 bytes hex):</span>
              <input 
                type="text" 
                readOnly 
                value={secret} 
                style={{width: '100%', fontSize: '0.75rem'}}
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
            </div>
            <div className="info-row">
              <span className="label">Hash (SHA256):</span>
              <input 
                type="text" 
                readOnly 
                value={secretHash} 
                style={{width: '100%', fontSize: '0.75rem'}}
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
            </div>
            <p className="small" style={{color: '#4ade80'}}>💾 Copy these values! You'll need the hash to create and the secret to claim.</p>
          </div>
        )}
      </div>

      {/* Create Envelope */}
      <div className="glass-card">
        <h2>🔒 Step 2: Create Envelope</h2>
        <p className="small">Lock an envelope with a secret hash</p>
        <div style={{marginBottom: '1rem'}}>
          <label>Secret Hash (64 hex chars):</label>
          <input
            type="text"
            placeholder="Enter 64-character hex hash"
            value={secretHash}
            onChange={(e) => setSecretHash(e.target.value)}
            style={{width: '100%', padding: '0.5rem', marginTop: '0.5rem'}}
          />
        </div>
        <button className="btn-primary" onClick={createEnvelope} disabled={loading}>
          {loading ? 'Creating...' : 'Create Envelope'}
        </button>
      </div>

      {/* Claim Envelope */}
      <div className="glass-card">
        <h2>🔓 Step 3: Claim Envelope</h2>
        <p className="small">Claim by revealing the secret that matches the hash</p>
        <div style={{marginBottom: '1rem'}}>
          <label>Secret (64 hex chars):</label>
          <input
            type="text"
            placeholder="Enter 64-character hex secret"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            style={{width: '100%', padding: '0.5rem', marginTop: '0.5rem'}}
          />
        </div>
        <div style={{marginBottom: '1rem'}}>
          <label>Expected Hash (64 hex chars):</label>
          <input
            type="text"
            placeholder="Enter expected 64-character hex hash"
            value={expectedHash}
            onChange={(e) => setExpectedHash(e.target.value)}
            style={{width: '100%', padding: '0.5rem', marginTop: '0.5rem'}}
          />
        </div>
        <button className="btn-primary" onClick={claimEnvelope} disabled={loading}>
          {loading ? 'Claiming...' : 'Claim Envelope'}
        </button>
      </div>

      {/* Transaction History */}
      <div className="glass-card">
        <h2>📜 Transaction History</h2>
        {transactions.length > 0 ? (
          <div className="info-section">
            {transactions.slice().reverse().map((tx: any) => (
              <div key={tx.txId} style={{
                padding: '0.75rem',
                marginBottom: '0.5rem',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '4px',
                borderLeft: '3px solid ' + (tx.type === 'createEnvelope' ? '#60a5fa' : '#4ade80')
              }}>
                <div><strong>{tx.type}</strong> - {tx.txId}</div>
                <div className="small" style={{opacity: 0.7}}>
                  {new Date(tx.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="muted">No transactions yet</p>
        )}
        <button className="btn-secondary" onClick={fetchTransactions}>
          Refresh History
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="glass-card error-box">
          <p>❌ Error: {error}</p>
        </div>
      )}

      {/* Contract Info */}
      <div className="glass-card">
        <h2>ℹ️ About HTLC</h2>
        <div className="info-section">
          <p>
            A Hash Time-Locked Contract enables secure peer-to-peer transactions
            protected by cryptographic hashes.
          </p>
          
          <h3>How to Use:</h3>
          <ol>
            <li><strong>Generate</strong> - Create a random secret and get its hash</li>
            <li><strong>Create</strong> - Lock an envelope using the hash</li>
            <li><strong>Claim</strong> - Reveal the secret to unlock and claim</li>
          </ol>

          <h3>Local Server:</h3>
          <ul>
            <li>🌐 API: http://localhost:3000</li>
            <li>⚡ No blockchain required</li>
            <li>🔒 Instant transactions</li>
            <li>💾 In-memory state</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
