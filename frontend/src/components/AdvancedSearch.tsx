import { useState, useEffect } from 'react';

interface Transaction {
  txId: string;
  type: string;
  timestamp: string;
  secretHash?: string;
  success?: boolean;
}

export function AdvancedSearch() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'timestamp' | 'type'>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const stored = localStorage.getItem('htlc_transactions');
    if (stored) {
      setTransactions(JSON.parse(stored));
    }
  }, []);

  const filteredAndSorted = transactions
    .filter(tx => {
      // Filter by type
      if (filterType !== 'all' && tx.type !== filterType) return false;
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          tx.txId.toLowerCase().includes(query) ||
          tx.type.toLowerCase().includes(query) ||
          tx.secretHash?.toLowerCase().includes(query)
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'timestamp') {
        const timeA = new Date(a.timestamp).getTime();
        const timeB = new Date(b.timestamp).getTime();
        return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
      } else {
        return sortOrder === 'asc' 
          ? a.type.localeCompare(b.type)
          : b.type.localeCompare(a.type);
      }
    });

  return (
    <div className="space-y-5 scale-in">
      <div className="text-center mb-5">
        <h2 className="text-2xl font-bold aurora-text mb-1.5">Advanced Search</h2>
        <p className="opacity-60 text-sm">Filter and search your transactions</p>
      </div>

      {/* Search and Filter Controls */}
      <div className="glass rounded-xl p-5 space-y-3.5">
        <div>
          <label className="block text-xs font-semibold mb-2 opacity-70">Search:</label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by TX ID, hash, or type..."
            className="w-full p-2.5 rounded-lg glass border border-purple-500/20 focus:border-purple-500 outline-none text-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold mb-2 opacity-70">Filter by Type:</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full p-2.5 rounded-lg glass border border-purple-500/20 focus:border-purple-500 outline-none text-sm"
            >
              <option value="all">All Types</option>
              <option value="createEnvelope">Create Envelope</option>
              <option value="claimEnvelope">Claim Envelope</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-2 opacity-70">Sort By:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'timestamp' | 'type')}
              className="w-full p-2.5 rounded-lg glass border border-purple-500/20 focus:border-purple-500 outline-none text-sm"
            >
              <option value="timestamp">Timestamp</option>
              <option value="type">Type</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-2 opacity-70">Order:</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="w-full p-2.5 rounded-lg glass border border-purple-500/20 focus:border-purple-500 outline-none text-sm"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="text-sm opacity-80">
            Showing {filteredAndSorted.length} of {transactions.length} transactions
          </div>
          {(searchQuery || filterType !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterType('all');
              }}
              className="py-2 px-4 rounded-lg glass border border-purple-500/30 text-sm font-semibold hover-scale"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="space-y-3">
        {filteredAndSorted.length === 0 ? (
          <div className="glass rounded-2xl p-8 holographic text-center">
            <div className="text-5xl mb-4">🔍</div>
            <div className="opacity-70">No transactions found matching your criteria</div>
          </div>
        ) : (
          filteredAndSorted.map((tx) => (
            <div key={tx.txId} className="glass rounded-2xl p-4 holographic hover-scale ripple-effect">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">
                      {tx.type === 'createEnvelope' ? '✨' : '🎁'}
                    </span>
                    <span className="aurora-text font-bold">{tx.type === 'createEnvelope' ? 'CREATED' : 'CLAIMED'}</span>
                    <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 border border-green-500/30">
                      Success
                    </span>
                  </div>
                  <div className="text-sm opacity-70 space-y-1">
                    <div>📋 TX: <span className="font-mono">{tx.txId}</span></div>
                    {tx.secretHash && (
                      <div>🔑 Hash: <span className="font-mono">{tx.secretHash.substring(0, 20)}...</span></div>
                    )}
                    <div>🕐 {new Date(tx.timestamp).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
