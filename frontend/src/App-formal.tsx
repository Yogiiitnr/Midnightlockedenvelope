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
import { celebrateSuccess } from './utils/confetti';
import { notificationManager } from './utils/notifications';

const API_URL = 'http://localhost:3000';

type ActiveTab = 'create' | 'claim' | 'templates' | 'batch' | 'search' | 'dashboard' | 'qr' | 'export';

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
    try {
      const response = await axios.get(`${API_URL}/generateSecret`);
      setSecret(response.data.secret);
      setSecretHash(response.data.hash);
      toast.success('Secret generated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to generate secret');
    }
  };

  const createEnvelope = async () => {
    if (!secretHash || secretHash.length !== 64) {
      toast.error('Please provide a valid 64-character hex hash');
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
      toast.success('Envelope created successfully!');
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
      toast.error('Please provide a valid 64-character hex secret');
      return;
    }
    if (!expectedHash || expectedHash.length !== 64) {
      toast.error('Please provide a valid 64-character hex expected hash');
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
      toast.success('Envelope claimed successfully!');
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
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, var(--primary-600), var(--primary-700))',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-md)',
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: '600'
              }}>
                M
              </div>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '2px' }}>
                  Midnight HTLC
                </h1>
                <p className="text-xs text-muted" style={{ letterSpacing: '0.05em' }}>
                  HASH TIME-LOCKED CONTRACTS
                </p>
              </div>
            </div>

            {/* Server Status */}
            <div className={`badge ${serverHealthy ? 'badge-success' : 'badge-error'}`}>
              <span className={`status-dot ${serverHealthy ? 'success pulse' : 'error'}`} />
              {serverHealthy ? 'Server Online' : 'Server Offline'}
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
            <div className="slide-up">
              {activeTab === 'create' && (
                <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
                  {/* Create Envelope Card */}
                  <div className="card" style={{ padding: 'var(--space-6)' }}>
                    <div style={{ marginBottom: 'var(--space-6)' }}>
                      <h2 style={{ marginBottom: 'var(--space-2)' }}>Create Envelope</h2>
                      <p className="text-secondary text-sm">
                        Generate a secret hash and create a new hash time-locked envelope
                      </p>
                    </div>

                    <div style={{ display: 'grid', gap: 'var(--space-5)' }}>
                      {/* Generate Secret Button */}
                      <div>
                        <button onClick={generateSecret} className="btn btn-secondary w-full btn-lg">
                          Generate New Secret & Hash
                        </button>
                      </div>

                      {/* Secret Display */}
                      {secret && secretHash && (
                        <div className="card" style={{ 
                          padding: 'var(--space-4)',
                          background: 'var(--success-bg)',
                          border: '1px solid var(--success)'
                        }}>
                          <div style={{ marginBottom: 'var(--space-3)' }}>
                            <label className="label">Secret (save this securely)</label>
                            <input
                              type="text"
                              readOnly
                              value={secret}
                              onClick={(e) => (e.target as HTMLInputElement).select()}
                              className="input mono"
                            />
                          </div>
                          <div>
                            <label className="label">Hash</label>
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
                        {loading ? 'Creating Envelope...' : 'Create Envelope'}
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
                <div className="card" style={{ padding: 'var(--space-6)', maxWidth: '800px', margin: '0 auto' }}>
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
                      {loading ? 'Claiming Envelope...' : 'Claim Envelope'}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'dashboard' && <EnvelopeDashboard />}
              {activeTab === 'templates' && (
                <TemplateSelector 
                  onSelectTemplate={() => {
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
        marginTop: 'auto'
      }}>
        <div style={{ 
          maxWidth: '1400px',
          margin: '0 auto',
          padding: 'var(--space-4) var(--space-6)',
          textAlign: 'center'
        }}>
          <p className="text-muted text-xs" style={{ letterSpacing: '0.05em' }}>
            POWERED BY MIDNIGHT NETWORK • LOCAL RUNTIME SERVER
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
