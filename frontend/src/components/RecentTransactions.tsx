import { useState, useEffect } from 'react';
import { CopyButton } from './CopyButton';
import { formatDateTime, truncateHash } from '../utils/helpers';

interface Transaction {
  txId: string;
  type: string;
  timestamp: string;
  secretHash?: string;
  secret?: string;
  expectedHash?: string;
  success?: boolean;
}

export function RecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  useEffect(() => {
    const loadTransactions = () => {
      const stored = localStorage.getItem('htlc_transactions');
      if (stored) {
        const all = JSON.parse(stored);
        setTransactions(all.slice(-10).reverse());
      }
    };

    loadTransactions();
    const interval = setInterval(loadTransactions, 2000);
    return () => clearInterval(interval);
  }, []);

  if (transactions.length === 0) {
    return (
      <div className="card" style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
        <div style={{
          width: '64px',
          height: '64px',
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-xl)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto var(--space-4)',
          fontSize: '2rem',
          opacity: 0.5
        }}>
          📋
        </div>
        <h3 style={{ marginBottom: 'var(--space-2)', fontSize: '1rem' }}>No Transactions Yet</h3>
        <p className="text-muted text-sm">
          Create or claim your first envelope to see transaction history
        </p>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: 'var(--space-5)' }}>
      <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: 'var(--space-4)' }}>
        Recent Transactions
      </h3>
      
      <div className="divide-y">
        {transactions.map((tx, idx) => {
          const time = formatDateTime(tx.timestamp);
          const isCreate = tx.type === 'createEnvelope';
          
          return (
            <div
              key={idx}
              style={{
                padding: 'var(--space-3) 0',
                cursor: 'pointer',
                transition: 'background var(--transition-fast)',
              }}
              className="card-interactive"
              onClick={() => setSelectedTx(selectedTx?.txId === tx.txId ? null : tx)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-lg)',
                  background: isCreate ? 'var(--primary-600)' : 'var(--accent-600)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  flexShrink: 0
                }}>
                  {isCreate ? '✨' : '🎁'}
                </div>
                
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    marginBottom: '2px'
                  }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                      {isCreate ? 'Envelope Created' : 'Envelope Claimed'}
                    </span>
                    <span className={`badge ${tx.success ? 'badge-success' : 'badge-error'}`}>
                      {tx.success ? 'Success' : 'Failed'}
                    </span>
                  </div>
                  <div className="text-muted mono" style={{ fontSize: '0.75rem' }}>
                    {truncateHash(tx.txId, 12, 12)}
                  </div>
                </div>
                
                <div className="text-muted text-xs" style={{ textAlign: 'right' }}>
                  <div>{time.relative}</div>
                  <div style={{ opacity: 0.6 }}>{time.time}</div>
                </div>
              </div>

              {/* Expanded Details */}
              {selectedTx?.txId === tx.txId && (
                <div style={{
                  marginTop: 'var(--space-3)',
                  padding: 'var(--space-3)',
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-lg)',
                  fontSize: '0.75rem'
                }} className="slide-up">
                  <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
                    <div>
                      <label className="label" style={{ marginBottom: '4px' }}>Transaction ID</label>
                      <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                        <code className="mono" style={{ flex: 1, padding: 'var(--space-1)', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', fontSize: '0.7rem' }}>
                          {tx.txId}
                        </code>
                        <CopyButton text={tx.txId} label="Transaction ID" />
                      </div>
                    </div>
                    
                    {tx.secretHash && (
                      <div>
                        <label className="label" style={{ marginBottom: '4px' }}>Secret Hash</label>
                        <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                          <code className="mono" style={{ flex: 1, padding: 'var(--space-1)', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', fontSize: '0.7rem' }}>
                            {tx.secretHash}
                          </code>
                          <CopyButton text={tx.secretHash} label="Hash" />
                        </div>
                      </div>
                    )}
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' }}>
                      <div>
                        <label className="label" style={{ marginBottom: '4px' }}>Type</label>
                        <div className="text-secondary">
                          {isCreate ? 'Create Envelope' : 'Claim Envelope'}
                        </div>
                      </div>
                      <div>
                        <label className="label" style={{ marginBottom: '4px' }}>Timestamp</label>
                        <div className="text-secondary">{time.full}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
