import { useState } from 'react';
import toast from 'react-hot-toast';

interface BatchEnvelope {
  id: string;
  secretHash: string;
  note: string;
}

const API_URL = 'http://localhost:3000';

export function BatchOperations() {
  const [envelopes, setEnvelopes] = useState<BatchEnvelope[]>([
    { id: '1', secretHash: '', note: '' },
  ]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{id: string, success: boolean, txId?: string, error?: string}[]>([]);

  const addEnvelope = () => {
    const newId = (envelopes.length + 1).toString();
    setEnvelopes([...envelopes, { id: newId, secretHash: '', note: '' }]);
  };

  const removeEnvelope = (id: string) => {
    if (envelopes.length === 1) {
      toast.error('You must have at least one envelope');
      return;
    }
    setEnvelopes(envelopes.filter(e => e.id !== id));
  };

  const updateEnvelope = (id: string, field: keyof BatchEnvelope, value: string) => {
    setEnvelopes(envelopes.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const generateAllSecrets = async () => {
    const updated = await Promise.all(envelopes.map(async (env) => {
      try {
        const response = await fetch(`${API_URL}/generateSecret`);
        const data = await response.json();
        return { ...env, secretHash: data.hash };
      } catch (error) {
        return env;
      }
    }));
    setEnvelopes(updated);
    toast.success('🎲 All secrets generated!');
  };

  const createAllEnvelopes = async () => {
    const validEnvelopes = envelopes.filter(e => e.secretHash.length === 64);
    
    if (validEnvelopes.length === 0) {
      toast.error('No valid envelopes to create');
      return;
    }

    setLoading(true);
    setResults([]);

    const batchResults = [];

    for (const envelope of validEnvelopes) {
      try {
        const response = await fetch(`${API_URL}/createEnvelope`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ secretHash: envelope.secretHash }),
        });

        const data = await response.json();
        
        if (response.ok && data.success) {
          batchResults.push({ id: envelope.id, success: true, txId: data.txId });
        } else {
          batchResults.push({ id: envelope.id, success: false, error: data.error || 'Failed' });
        }
      } catch (error) {
        batchResults.push({ id: envelope.id, success: false, error: (error as Error).message });
      }
    }

    setResults(batchResults);
    setLoading(false);

    const successCount = batchResults.filter(r => r.success).length;
    toast.success(`✨ Created ${successCount} of ${validEnvelopes.length} envelopes!`);
  };

  return (
    <div className="space-y-6 scale-in">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold aurora-text mb-2">📦 Batch Operations</h2>
        <p className="opacity-80">Create multiple envelopes at once</p>
      </div>

      {/* Quick Actions */}
      <div className="glass rounded-2xl p-4 holographic flex flex-wrap gap-3 justify-center">
        <button
          onClick={generateAllSecrets}
          className="py-2 px-4 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 font-semibold magnetic-button"
        >
          🎲 Generate All Secrets
        </button>
        <button
          onClick={addEnvelope}
          className="py-2 px-4 rounded-lg bg-green-500/20 hover:bg-green-500/30 font-semibold magnetic-button"
        >
          ➕ Add Envelope
        </button>
        <button
          onClick={createAllEnvelopes}
          disabled={loading}
          className="py-2 px-4 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 font-bold magnetic-button disabled:opacity-50"
        >
          {loading ? '⏳ Creating...' : '✨ Create All Envelopes'}
        </button>
      </div>

      {/* Envelopes List */}
      <div className="space-y-4">
        {envelopes.map((envelope, index) => (
          <div key={envelope.id} className="glass rounded-2xl p-6 holographic space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">Envelope #{index + 1}</h3>
              {envelopes.length > 1 && (
                <button
                  onClick={() => removeEnvelope(envelope.id)}
                  className="py-1 px-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-sm font-semibold"
                >
                  ❌ Remove
                </button>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Secret Hash:</label>
              <input
                type="text"
                value={envelope.secretHash}
                onChange={(e) => updateEnvelope(envelope.id, 'secretHash', e.target.value)}
                placeholder="64-character hex hash"
                className="w-full p-3 rounded-lg glass border border-purple-500/30 focus:border-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Note (optional):</label>
              <input
                type="text"
                value={envelope.note}
                onChange={(e) => updateEnvelope(envelope.id, 'note', e.target.value)}
                placeholder="e.g., Gift for Alice"
                className="w-full p-3 rounded-lg glass border border-purple-500/30 focus:border-purple-500 outline-none"
              />
            </div>

            {results.find(r => r.id === envelope.id) && (
              <div className={`p-3 rounded-lg ${
                results.find(r => r.id === envelope.id)?.success 
                  ? 'bg-green-500/20 border border-green-500/30' 
                  : 'bg-red-500/20 border border-red-500/30'
              }`}>
                {results.find(r => r.id === envelope.id)?.success ? (
                  <div>
                    ✅ Success! TX: {results.find(r => r.id === envelope.id)?.txId}
                  </div>
                ) : (
                  <div>
                    ❌ Failed: {results.find(r => r.id === envelope.id)?.error}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl p-4 holographic text-sm opacity-80">
        <div className="flex items-start gap-2">
          <span>💡</span>
          <div>
            <strong>Batch Mode:</strong> Create multiple envelopes efficiently. Use "Generate All Secrets"
            to auto-fill hashes, then customize each envelope before creating.
          </div>
        </div>
      </div>
    </div>
  );
}
