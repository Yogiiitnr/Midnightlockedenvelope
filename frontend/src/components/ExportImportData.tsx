import { useState } from 'react';
import toast from 'react-hot-toast';

export function ExportImportData() {
  const [importing, setImporting] = useState(false);

  const exportData = () => {
    try {
      const transactions = localStorage.getItem('htlc_transactions') || '[]';
      const data = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        transactions: JSON.parse(transactions),
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `htlc-backup-${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);

      toast.success('💾 Data exported successfully!');
    } catch (error) {
      toast.error('Export failed: ' + (error as Error).message);
    }
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);

        if (!data.transactions || !Array.isArray(data.transactions)) {
          throw new Error('Invalid data format');
        }

        // Merge with existing data
        const existing = JSON.parse(localStorage.getItem('htlc_transactions') || '[]');
        const merged = [...existing, ...data.transactions];
        
        // Remove duplicates by txId
        const unique = Array.from(new Map(merged.map(tx => [tx.txId, tx])).values());
        
        localStorage.setItem('htlc_transactions', JSON.stringify(unique));
        
        toast.success(`✅ Imported ${data.transactions.length} transactions!`);
        setTimeout(() => window.location.reload(), 1500);
      } catch (error) {
        toast.error('Import failed: ' + (error as Error).message);
      } finally {
        setImporting(false);
      }
    };

    reader.readAsText(file);
  };

  const clearAllData = () => {
    if (confirm('⚠️ Are you sure? This will delete ALL transaction data permanently!')) {
      localStorage.removeItem('htlc_transactions');
      toast.success('🗑️ All data cleared');
      setTimeout(() => window.location.reload(), 1500);
    }
  };

  return (
    <div className="space-y-6 scale-in">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold aurora-text mb-2">💾 Export & Import Data</h2>
        <p className="opacity-80">Backup and restore your transaction history</p>
      </div>

      {/* Export Section */}
      <div className="glass rounded-2xl p-6 holographic space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">📤</span>
          <div>
            <h3 className="text-lg font-bold">Export Data</h3>
            <p className="text-sm opacity-80">Download your transaction history as JSON</p>
          </div>
        </div>

        <button
          onClick={exportData}
          className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 font-bold hover-scale magnetic-button"
        >
          💾 Export All Transactions
        </button>

        <div className="text-xs opacity-70 p-3 rounded-lg glass">
          Your data is stored locally in your browser. Export regularly to keep backups.
        </div>
      </div>

      {/* Import Section */}
      <div className="glass rounded-2xl p-6 holographic space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">📥</span>
          <div>
            <h3 className="text-lg font-bold">Import Data</h3>
            <p className="text-sm opacity-80">Restore transactions from a backup file</p>
          </div>
        </div>

        <label className="block w-full py-3 px-6 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 font-bold text-center cursor-pointer hover-scale magnetic-button">
          {importing ? '⏳ Importing...' : '📂 Select Backup File'}
          <input
            type="file"
            accept=".json"
            onChange={importData}
            disabled={importing}
            className="hidden"
          />
        </label>

        <div className="text-xs opacity-70 p-3 rounded-lg glass">
          Imported data will be merged with your existing transactions. Duplicates are automatically removed.
        </div>
      </div>

      {/* Clear Data Section */}
      <div className="glass rounded-2xl p-6 holographic border border-red-500/30 space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">🗑️</span>
          <div>
            <h3 className="text-lg font-bold text-red-400">Clear All Data</h3>
            <p className="text-sm opacity-80">Permanently delete all transaction history</p>
          </div>
        </div>

        <button
          onClick={clearAllData}
          className="w-full py-3 px-6 rounded-lg bg-red-500/20 border border-red-500/50 font-bold hover:bg-red-500/30 transition-all"
        >
          🗑️ Clear All Data (Irreversible!)
        </button>

        <div className="text-xs opacity-70 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          ⚠️ Warning: This action cannot be undone. Make sure to export your data first!
        </div>
      </div>

      <div className="glass rounded-2xl p-4 holographic text-sm opacity-80">
        <div className="flex items-start gap-2">
          <span>💡</span>
          <div>
            <strong>Data Storage:</strong> All data is stored locally in your browser's LocalStorage.
            No data is sent to any server. Export regularly to prevent data loss if you clear browser data.
          </div>
        </div>
      </div>
    </div>
  );
}
