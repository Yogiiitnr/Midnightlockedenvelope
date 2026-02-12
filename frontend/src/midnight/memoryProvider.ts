/**
 * Memory-based Private State Provider for browser environment
 * 
 * This uses a simple Map for storage instead of LevelDB, making it
 * compatible with browser environments. Based on KYC-Midnight patterns.
 * 
 * 🎭 CURRENTLY USING MOCK TYPES
 * Replace with real @midnight-ntwrk/midnight-js-contracts types when SDK is available
 */

// 🎭 MOCK TYPES - Replace these imports when real SDK is available
import type { PrivateStateKey, PrivateStateProvider } from './mock-sdk';

interface PrivateStateEntry {
  value: Uint8Array;
  metadata?: {
    timestamp: number;
    version: number;
  };
}

export class MemoryPrivateStateProvider implements PrivateStateProvider {
  private storage: Map<string, PrivateStateEntry>;
  private prefix: string;

  constructor(prefix: string = 'htlc-state') {
    this.storage = new Map();
    this.prefix = prefix;
    console.log('🗄️  Memory Private State Provider initialized');
  }

  /**
   * Get a value from private state
   */
  async get(key: PrivateStateKey): Promise<Uint8Array | null> {
    const fullKey = this.makeKey(key);
    const entry = this.storage.get(fullKey);
    
    if (entry) {
      console.log(`📖 Retrieved state for key: ${fullKey.substring(0, 20)}...`);
      return entry.value;
    }
    
    console.log(`📭 No state found for key: ${fullKey.substring(0, 20)}...`);
    return null;
  }

  /**
   * Set a value in private state
   */
  async set(key: PrivateStateKey, value: Uint8Array): Promise<void> {
    const fullKey = this.makeKey(key);
    
    const entry: PrivateStateEntry = {
      value,
      metadata: {
        timestamp: Date.now(),
        version: 1
      }
    };
    
    this.storage.set(fullKey, entry);
    console.log(`💾 Saved state for key: ${fullKey.substring(0, 20)}... (${value.length} bytes)`);
  }

  /**
   * Delete a value from private state
   */
  async delete(key: PrivateStateKey): Promise<void> {
    const fullKey = this.makeKey(key);
    const existed = this.storage.delete(fullKey);
    
    if (existed) {
      console.log(`🗑️  Deleted state for key: ${fullKey.substring(0, 20)}...`);
    }
  }

  /**
   * Check if a key exists in private state
   */
  async has(key: PrivateStateKey): Promise<boolean> {
    const fullKey = this.makeKey(key);
    return this.storage.has(fullKey);
  }

  /**
   * Get all keys in private state
   */
  async keys(): Promise<PrivateStateKey[]> {
    const keys: PrivateStateKey[] = [];
    
    for (const fullKey of this.storage.keys()) {
      if (fullKey.startsWith(this.prefix + ':')) {
        // Extract the original key
        const originalKey = fullKey.substring(this.prefix.length + 1);
        keys.push({ data: new TextEncoder().encode(originalKey) } as PrivateStateKey);
      }
    }
    
    return keys;
  }

  /**
   * Clear all private state (useful for testing)
   */
  async clear(): Promise<void> {
    const keysToDelete: string[] = [];
    
    for (const key of this.storage.keys()) {
      if (key.startsWith(this.prefix + ':')) {
        keysToDelete.push(key);
      }
    }
    
    keysToDelete.forEach(key => this.storage.delete(key));
    console.log(`🧹 Cleared ${keysToDelete.length} state entries`);
  }

  /**
   * Get storage statistics
   */
  getStats(): { count: number; totalBytes: number } {
    let count = 0;
    let totalBytes = 0;
    
    for (const [key, entry] of this.storage.entries()) {
      if (key.startsWith(this.prefix + ':')) {
        count++;
        totalBytes += entry.value.length;
      }
    }
    
    return { count, totalBytes };
  }

  /**
   * Create a full storage key from a PrivateStateKey
   */
  private makeKey(key: PrivateStateKey): string {
    // Convert the key data to a hex string for storage
    const keyHex = Array.from(key.data)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    return `${this.prefix}:${keyHex}`;
  }
}

/**
 * Create a new memory-based private state provider instance
 */
export function createMemoryPrivateStateProvider(prefix?: string): PrivateStateProvider {
  return new MemoryPrivateStateProvider(prefix);
}
