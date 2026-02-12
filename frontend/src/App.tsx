import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { ThemeToggle } from './components/ThemeToggle';
import { EnvelopeDashboard } from './components/EnvelopeDashboard';
import { QRCodeGenerator } from './components/QRCodeGenerator';
import { TemplateSelector } from './components/TemplateSelector';
import { BatchOperations } from './components/BatchOperations';
import { AdvancedSearch } from './components/AdvancedSearch';
import { ExportImportData } from './components/ExportImportData';
import { RecentTransactions } from './components/RecentTransactions';
import { CopyButton } from './components/CopyButton';
import { celebrateSuccess } from './utils/confetti';
import { notificationManager } from './utils/notifications';
import { exportToCSV, isValidHex } from './utils/helpers';

const API_URL = 'http://localhost:3000';

type ActiveTab = 'create' | 'claim' | 'templates' | 'batch' | 'search' | 'dashboard' | 'qr' | 'export' | 'recent';

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('create');
  const [serverHealthy, setServerHealthy] = useState(false);
  const [contractState, setContractState] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [secret, setSecret] = useState('');
  const [secretHash, setSecretHash] = useState('');
  const [expectedHash, setExpectedHash] = useState('');

  // Check server health
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await axios.get(`${API_URL}/health`, { timeout: 2000 });
        setServerHealthy(response.status === 200);
      } catch (error) {
        setServerHealthy(false);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch contract state
  useEffect(() => {
    const fetchState = async () => {
      if (!serverHealthy) return;
      
      try {
        const response = await axios.get(`${API_URL}/state`);
        setContractState(response.data);
      } catch (error) {
        console.error('Failed to fetch contract state:', error);
      }
    };

    fetchState();
    const interval = setInterval(fetchState, 3000);
    return () => clearInterval(interval);
  }, [serverHealthy]);

  const generateSecret = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/generateSecret`);
      setSecret(response.data.secret);
      setSecretHash(response.data.hash);
      toast.success('🔑 Secret generated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to generate secret');
    } finally {
      setLoading(false);
    }
  };

  const exportTransactions = () => {
    const transactions = JSON.parse(localStorage.getItem('htlc_transactions') || '[]');
    if (transactions.length === 0) {
      toast.error('No transactions to export');
      return;
    }
    exportToCSV(transactions);
    toast.success(`✅ Exported ${transactions.length} transactions`);
  };

  const createEnvelope = async () => {
    if (!secretHash || secretHash.length !== 64) {
      toast.error('⚠️ Please provide a valid 64-character hex hash');
      return;
    }
    if (!isValidHex(secretHash)) {
      toast.error('⚠️ Hash must contain only hexadecimal characters');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/createEnvelope`, { secretHash });
      
      // Save to localStorage
      const transactions = JSON.parse(localStorage.getItem('htlc_transactions') || '[]');
      transactions.push({
        txId: response.data.txId,
        type: 'createEnvelope',
        timestamp: new Date().toISOString(),
        secretHash,
        success: true,
      });
      localStorage.setItem('htlc_transactions', JSON.stringify(transactions));

      celebrateSuccess();
      toast.success('✨ Envelope created successfully!');
      notificationManager.notifyEnvelopeCreated(response.data.txId);
      
      setSecretHash('');
      setSecret('');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create envelope');
    } finally {
      setLoading(false);
    }
  };

  const claimEnvelope = async () => {
    if (!secret || secret.length !== 64) {
      toast.error('⚠️ Please provide a valid 64-character hex secret');
      return;
    }
    if (!isValidHex(secret)) {
      toast.error('⚠️ Secret must contain only hexadecimal characters');
      return;
    }
    if (!expectedHash || expectedHash.length !== 64) {
      toast.error('⚠️ Please provide a valid 64-character hex expected hash');
      return;
    }
    if (!isValidHex(expectedHash)) {
      toast.error('⚠️ Hash must contain only hexadecimal characters');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/claimEnvelope`, { secret, expectedHash });
      
      // Save to localStorage
      const transactions = JSON.parse(localStorage.getItem('htlc_transactions') || '[]');
      transactions.push({
        txId: response.data.txId,
        type: 'claimEnvelope',
        timestamp: new Date().toISOString(),
        secret,
        expectedHash,
        success: true,
      });
      localStorage.setItem('htlc_transactions', JSON.stringify(transactions));

      celebrateSuccess();
      toast.success('🎁 Envelope claimed successfully!');
      notificationManager.notifyEnvelopeClaimed(response.data.txId);
      
      setSecret('');
      setExpectedHash('');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to claim envelope');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <ThemeToggle />
      
      {/* Professional Header */}
      <header className="card" style={{ 
        borderRadius: 0, 
        borderBottom: '1px solid var(--border-default)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: 'var(--space-4) var(--space-6)' }}>
          <div className="flex items-center justify-between">
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              {/* Midnight Logo */}
              <div className="float" style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #1a1f3a, #2d3561)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3), 0 0 30px rgba(59, 130, 246, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid rgba(96, 165, 250, 0.2)'
              }}>
                {/* Midnight Moon Logo */}
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14c2.8 0 5.4-0.8 7.6-2.2-1.4 0.4-2.8 0.6-4.3 0.6-7.7 0-14-6.3-14-14 0-5.8 3.5-10.8 8.5-12.9C12.6 2.2 11.3 2 10 2H16z" fill="#60a5fa" opacity="0.9"/>
                  <circle cx="20" cy="10" r="1.5" fill="#93c5fd" opacity="0.6"/>
                  <circle cx="24" cy="14" r="1" fill="#93c5fd" opacity="0.4"/>
                  <circle cx="18" cy="6" r="0.8" fill="#dbeafe" opacity="0.5"/>
                </svg>
              </div>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Midnight HTLC
                  {/* Built with Compact Badge */}
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: '500',
                    padding: '3px 8px',
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.15))',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '4px',
                    color: 'var(--success-light)',
                    letterSpacing: '0.05em',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    COMPACT
                  </span>
                </h1>
                <p className="text-xs text-muted" style={{ letterSpacing: '0.05em' }}>
                  HASH TIME-LOCKED CONTRACTS
                </p>
              </div>
            </div>

            {/* Server Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <button
                onClick={exportTransactions}
                className="btn btn-ghost btn-sm scale-hover"
                title="Export transactions to CSV"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export CSV
              </button>
              <div className={`badge ${serverHealthy ? 'badge-success' : 'badge-error'}`}>
                <span className={`status-dot ${serverHealthy ? 'success pulse' : 'error'}`} />
                {serverHealthy ? 'Server Online' : 'Server Offline'}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, maxWidth: '1400px', margin: '0 auto', padding: 'var(--space-8) var(--space-6)', width: '100%' }}>
        {!serverHealthy ? (
          <div className="card" style={{ maxWidth: '600px', margin: '0 auto', padding: 'var(--space-8)', textAlign: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: 'var(--error-bg)',
              border: '2px solid var(--error)',
              borderRadius: 'var(--radius-xl)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--space-6)',
              fontSize: '2rem'
            }}>
              ⚠️
            </div>
            <h2 style={{ marginBottom: 'var(--space-3)' }}>Server Not Running</h2>
            <p className="text-secondary" style={{ marginBottom: 'var(--space-4)' }}>
              The local HTLC runtime server is not responding. Please start the server to continue.
            </p>
            <code className="card" style={{ 
              display: 'inline-block',
              padding: 'var(--space-2) var(--space-4)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-default)'
            }}>
              npm start
            </code>
          </div>
        ) : (
          <div className="fade-in">
            {/* Tab Navigation */}
            <div className="tabs" style={{ marginBottom: 'var(--space-6)' }}>
              <button onClick={() => setActiveTab('create')} className={`tab ${activeTab === 'create' ? 'active' : ''}`}>
                Create Envelope
              </button>
              <button onClick={() => setActiveTab('claim')} className={`tab ${activeTab === 'claim' ? 'active' : ''}`}>
                Claim Envelope
              </button>
              <button onClick={() => setActiveTab('dashboard')} className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}>
                Dashboard
              </button>
              <button onClick={() => setActiveTab('recent')} className={`tab ${activeTab === 'recent' ? 'active' : ''}`}>
                Recent
              </button>
              <button onClick={() => setActiveTab('templates')} className={`tab ${activeTab === 'templates' ? 'active' : ''}`}>
                Templates
              </button>
              <button onClick={() => setActiveTab('batch')} className={`tab ${activeTab === 'batch' ? 'active' : ''}`}>
                Batch Operations
              </button>
              <button onClick={() => setActiveTab('search')} className={`tab ${activeTab === 'search' ? 'active' : ''}`}>
                Search
              </button>
              <button onClick={() => setActiveTab('qr')} className={`tab ${activeTab === 'qr' ? 'active' : ''}`}>
                QR Code
              </button>
              <button onClick={() => setActiveTab('export')} className={`tab ${activeTab === 'export' ? 'active' : ''}`}>
                Export/Import
              </button>
            </div>

            {/* Tab Content */}
            <div className="slide-up fade-in-scale">
              {activeTab === 'create' && (
                <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
                  {/* Create Envelope Card */}
                  <div className="card glow" style={{ padding: 'var(--space-6)' }}>
                    <div style={{ marginBottom: 'var(--space-6)' }}>
                      <h2 style={{ marginBottom: 'var(--space-2)' }}>Create Envelope</h2>
                      <p className="text-secondary text-sm">
                        Generate a secret hash and create a new hash time-locked envelope
                      </p>
                    </div>

                    <div style={{ display: 'grid', gap: 'var(--space-5)' }}>
                      {/* Generate Secret Button */}
                      <div>
                        <button 
                          onClick={generateSecret} 
                          className="btn btn-secondary w-full btn-lg"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <div className="spinner" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                              </svg>
                              Generate New Secret & Hash
                            </>
                          )}
                        </button>
                      </div>

                      {/* Secret Display */}
                      {secret && secretHash && (
                        <div className="card pulse" style={{ 
                          padding: 'var(--space-4)',
                          background: 'var(--success-bg)',
                          border: '1px solid var(--success)'
                        }}>
                          <div style={{ marginBottom: 'var(--space-3)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                              <label className="label">Secret (save this securely)</label>
                              <CopyButton text={secret} label="Secret" />
                            </div>
                            <input
                              type="text"
                              readOnly
                              value={secret}
                              onClick={(e) => (e.target as HTMLInputElement).select()}
                              className="input mono"
                            />
                          </div>
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                              <label className="label">Hash</label>
                              <CopyButton text={secretHash} label="Hash" />
                            </div>
                            <input
                              type="text"
                              readOnly
                              value={secretHash}
                              onClick={(e) => (e.target as HTMLInputElement).select()}
                              className="input mono"
                            />
                          </div>
                          <p className="text-xs text-muted" style={{ marginTop: 'var(--space-2)' }}>
                            💾 Keep your secret safe - you'll need it to claim the envelope
                          </p>
                        </div>
                      )}

                      {/* Hash Input */}
                      <div>
                        <label className="label">Secret Hash (64 hex characters)</label>
                        <input
                          type="text"
                          value={secretHash}
                          onChange={(e) => setSecretHash(e.target.value)}
                          placeholder="Enter or generate a 64-character hex hash..."
                          className="input mono"
                        />
                      </div>

                      {/* Create Button */}
                      <button
                        onClick={createEnvelope}
                        disabled={loading || !secretHash}
                        className="btn btn-primary w-full btn-lg"
                      >
                        {loading ? (
                          <>
                            <div className="spinner" />
                            Creating Envelope...
                          </>
                        ) : (
                          <>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                            Create Envelope
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Contract State Card */}
                  <div className="card" style={{ padding: 'var(--space-5)' }}>
                    <h3 style={{ marginBottom: 'var(--space-4)', fontSize: '1rem', fontWeight: '600' }}>
                      Contract State
                    </h3>
                    {contractState ? (
                      <pre className="card" style={{
                        padding: 'var(--space-3)',
                        background: 'var(--bg-secondary)',
                        fontSize: '0.75rem',
                        overflow: 'auto',
                        maxHeight: '300px'
                      }}>
                        {JSON.stringify(contractState, null, 2)}
                      </pre>
                    ) : (
                      <p className="text-muted text-sm">Loading contract state...</p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'claim' && (
                <div className="card glow" style={{ padding: 'var(--space-6)', maxWidth: '800px', margin: '0 auto' }}>
                  <div style={{ marginBottom: 'var(--space-6)' }}>
                    <h2 style={{ marginBottom: 'var(--space-2)' }}>Claim Envelope</h2>
                    <p className="text-secondary text-sm">
                      Reveal the secret to claim your hash time-locked envelope
                    </p>
                  </div>

                  <div style={{ display: 'grid', gap: 'var(--space-5)' }}>
                    <div>
                      <label className="label">Secret (64 hex characters)</label>
                      <input
                        type="text"
                        value={secret}
                        onChange={(e) => setSecret(e.target.value)}
                        placeholder="Enter your 64-character hex secret..."
                        className="input mono"
                      />
                    </div>

                    <div>
                      <label className="label">Expected Hash (64 hex characters)</label>
                      <input
                        type="text"
                        value={expectedHash}
                        onChange={(e) => setExpectedHash(e.target.value)}
                        placeholder="Enter the expected 64-character hash..."
                        className="input mono"
                      />
                    </div>

                    <button
                      onClick={claimEnvelope}
                      disabled={loading || !secret || !expectedHash}
                      className="btn btn-primary w-full btn-lg"
                    >
                      {loading ? (
                        <>
                          <div className="spinner" />
                          Claiming Envelope...
                        </>
                      ) : (
                        <>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Claim Envelope
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'dashboard' && <EnvelopeDashboard />}
              {activeTab === 'recent' && <RecentTransactions />}
              {activeTab === 'templates' && (
                <TemplateSelector 
                  onSelectTemplate={(defaults) => {
                    setActiveTab('create');
                  }}
                />
              )}
              {activeTab === 'batch' && <BatchOperations />}
              {activeTab === 'search' && <AdvancedSearch />}
              {activeTab === 'qr' && <QRCodeGenerator data={secret || secretHash} />}
              {activeTab === 'export' && <ExportImportData />}
            </div>
          </div>
        )}
      </main>

      {/* Professional Footer */}
      <footer className="card" style={{
        borderRadius: 0,
        borderTop: '1px solid var(--border-default)',
        boxShadow: 'none',
        marginTop: 'auto',
        background: 'rgba(15, 23, 42, 0.5)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ 
          maxWidth: '1400px',
          margin: '0 auto',
          padding: 'var(--space-5) var(--space-6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-4)'
        }}>
          {/* Left: Midnight Network */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14c2.8 0 5.4-0.8 7.6-2.2-1.4 0.4-2.8 0.6-4.3 0.6-7.7 0-14-6.3-14-14 0-5.8 3.5-10.8 8.5-12.9C12.6 2.2 11.3 2 10 2H16z" fill="#60a5fa" opacity="0.8"/>
              <circle cx="20" cy="10" r="1.5" fill="#93c5fd" opacity="0.5"/>
              <circle cx="24" cy="14" r="1" fill="#93c5fd" opacity="0.3"/>
            </svg>
            <span className="text-muted text-xs" style={{ letterSpacing: '0.05em', fontWeight: '500' }}>
              POWERED BY MIDNIGHT NETWORK
            </span>
          </div>

          {/* Center: Local Runtime */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <div style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: serverHealthy ? 'var(--success)' : 'var(--error)',
              boxShadow: serverHealthy ? '0 0 10px var(--success)' : 'none'
            }} className={serverHealthy ? 'pulse' : ''} />
            <span className="text-muted text-xs" style={{ letterSpacing: '0.05em' }}>
              LOCAL RUNTIME • PORT {serverHealthy ? '3000' : 'OFFLINE'}
            </span>
          </div>

          {/* Right: Built with Compact */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            padding: 'var(--space-1) var(--space-3)',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: 'var(--radius-md)'
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success-light)" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1"/>
              <rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="14" y="14" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/>
            </svg>
            <span className="text-xs" style={{ 
              color: 'var(--success-light)', 
              letterSpacing: '0.05em',
              fontWeight: '600'
            }}>
              BUILT WITH COMPACT
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
