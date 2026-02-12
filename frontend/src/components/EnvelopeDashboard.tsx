import { useState, useEffect, useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface Transaction {
  txId: string;
  type: string;
  timestamp: string;
  secretHash?: string;
  success?: boolean;
}

export function EnvelopeDashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('htlc_transactions');
    if (stored) {
      setTransactions(JSON.parse(stored));
    }
  }, []);

  const stats = useMemo(() => {
    const total = transactions.length;
    const created = transactions.filter(t => t.type === 'createEnvelope').length;
    const claimed = transactions.filter(t => t.type === 'claimEnvelope').length;
    const successRate = total > 0 ? ((created + claimed) / total) * 100 : 0;

    return { total, created, claimed, successRate };
  }, [transactions]);

  const doughnutData = {
    labels: ['Created', 'Claimed', 'Others'],
    datasets: [{
      data: [stats.created, stats.claimed, stats.total - stats.created - stats.claimed],
      backgroundColor: [
        'rgba(37, 99, 235, 0.8)',
        'rgba(8, 145, 178, 0.8)',
        'rgba(100, 116, 139, 0.6)',
      ],
      borderColor: [
        'rgb(37, 99, 235)',
        'rgb(8, 145, 178)',
        'rgb(100, 116, 139)',
      ],
      borderWidth: 2,
    }],
  };

  const barData = {
    labels: ['Total', 'Created', 'Claimed'],
    datasets: [{
      label: 'Transaction Count',
      data: [stats.total, stats.created, stats.claimed],
      backgroundColor: [
        'rgba(37, 99, 235, 0.7)',
        'rgba(8, 145, 178, 0.7)',
        'rgba(16, 185, 129, 0.7)',
      ],
      borderColor: [
        'rgb(37, 99, 235)',
        'rgb(8, 145, 178)',
        'rgb(16, 185, 129)',
      ],
      borderWidth: 1,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: 'var(--text-secondary)',
          font: { size: 12, family: "'Inter', sans-serif" },
        },
      },
    },
    scales: {
      y: {
        ticks: { color: 'var(--text-muted)' },
        grid: { color: 'var(--border-subtle)' }
      },
      x: {
        ticks: { color: 'var(--text-muted)' },
        grid: { color: 'var(--border-subtle)' }
      }
    }
  };

  return (
    <div style={{ display: 'grid', gap: 'var(--space-6)' }} className="slide-up">
      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="card" style={{ padding: 'var(--space-5)' }}>
          <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>📊</div>
          <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: 'var(--space-1)' }}>{stats.total}</div>
          <div className="text-muted text-xs" style={{ letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Total Transactions
          </div>
        </div>
        
        <div className="card" style={{ padding: 'var(--space-5)' }}>
          <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>✨</div>
          <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: 'var(--space-1)', color: 'var(--primary-500)' }}>
            {stats.created}
          </div>
          <div className="text-muted text-xs" style={{ letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Envelopes Created
          </div>
        </div>
        
        <div className="card" style={{ padding: 'var(--space-5)' }}>
          <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>🎁</div>
          <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: 'var(--space-1)', color: 'var(--accent-600)' }}>
            {stats.claimed}
          </div>
          <div className="text-muted text-xs" style={{ letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Envelopes Claimed
          </div>
        </div>
        
        <div className="card" style={{ padding: 'var(--space-5)' }}>
          <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>📈</div>
          <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: 'var(--space-1)', color: 'var(--success)' }}>
            {stats.successRate.toFixed(0)}%
          </div>
          <div className="text-muted text-xs" style={{ letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Activity Rate
          </div>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--space-6)' }}>
        <div className="card" style={{ padding: 'var(--space-5)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: 'var(--space-4)' }}>
            Transaction Distribution
          </h3>
          <div style={{ height: '300px' }}>
            <Doughnut data={doughnutData} options={chartOptions} />
          </div>
        </div>
        
        <div className="card" style={{ padding: 'var(--space-5)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: 'var(--space-4)' }}>
            Transaction Overview
          </h3>
          <div style={{ height: '300px' }}>
            <Bar data={barData} options={chartOptions as any} />
          </div>  
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card" style={{ padding: 'var(--space-5)' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: 'var(--space-4)' }}>
          Recent Activity
        </h3>
        {transactions.length > 0 ? (
          <div className="divide-y">
            {transactions.slice(-5).reverse().map((tx, idx) => (
              <div key={idx} style={{ 
                padding: 'var(--space-3) 0',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)'
              }}>
                <span style={{ fontSize: '1.5rem' }}>
                  {tx.type === 'createEnvelope' ? '✨' : '🎁'}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '2px' }}>
                    {tx.type === 'createEnvelope' ? 'Envelope Created' : 'Envelope Claimed'}
                  </div>
                  <div className="text-muted mono" style={{ fontSize: '0.75rem' }}>
                    {tx.txId.substring(0, 16)}...
                  </div>
                </div>
                <div className="text-muted text-xs">
                  {new Date(tx.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted text-sm">No transactions yet</p>
        )}
      </div>
    </div>
  );
}
