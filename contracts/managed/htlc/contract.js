/**
 * HTLC Contract Module - Direct JavaScript Implementation
 * Uses Midnight SDK Runtime APIs
 * Based on the Compact specification in src/contract.compact
 */

import { createHash } from 'crypto';

// Ledger state structure
class HTLCLedger {
  constructor() {
    this.state = {
      lastSecretHash: new Uint8Array(32)
    };
  }
}

// Contract implementation
export class HTLCContract {
  constructor() {
    this.ledger = new HTLCLedger();
  }

  /**
   * Create a new hash-locked envelope with a secret hash
   * @transaction
   */
  async createEnvelope(context, secretHash) {
    if (!(secretHash instanceof Uint8Array) || secretHash.length !== 32) {
      throw new Error('Secret hash must be 32 bytes');
    }

    // Store the secret hash in the ledger
    this.ledger.state.lastSecretHash = secretHash;
    
    console.log('✅ Envelope created with hash:', 
      Buffer.from(secretHash).toString('hex').substring(0, 16) + '...'
    );
    
    return { success: true };
  }

  /**
   * Claim an envelope by revealing the secret
   * @transaction
   */
  async claimEnvelope(context, secret, expectedHash) {
    if (!(secret instanceof Uint8Array) || secret.length !== 32) {
      throw new Error('Secret must be 32 bytes');
    }
    
    if (!(expectedHash instanceof Uint8Array) || expectedHash.length !== 32) {
      throw new Error('Expected hash must be 32 bytes');
    }

    // Hash the revealed secret using SHA-256
    const actualHash = createHash('sha256').update(secret).digest();
    
    // Verify the hash matches the expected hash
    const hashMatches = Buffer.compare(actualHash, expectedHash) === 0;
    
    if (hashMatches) {
      // Update ledger with the revealed secret hash
      this.ledger.state.lastSecretHash = actualHash;
      
      console.log('✅ Envelope claimed successfully!');
      
      // Return success (0x01)
      return new Uint8Array([0x01]);
    } else {
      console.log('❌ Hash mismatch - claim failed');
      
      // Return failure (0x00)
      return new Uint8Array([0x00]);
    }
  }

  /**
   * Query to get the last secret hash from ledger (read-only)
   * @query
   */
  async getLastSecretHash(context) {
    return this.ledger.state.lastSecretHash;
  }
}

// Contract metadata
export const metadata = {
  name: 'HTLCContract',
  version: '1.0.0',
  circuits: {
    createEnvelope: {
      type: 'transaction',
      params: ['Bytes<32>'], // secretHash
      returns: 'Void'
    },
    claimEnvelope: {
      type: 'transaction',
      params: ['Bytes<32>', 'Bytes<32>'], // secret, expectedHash
      returns: 'Bytes<1>'
    },
    getLastSecretHash: {
      type: 'query',
      params: [],
      returns: 'Bytes<32>'
    }
  },
  ledger: {
    HTLCLedger: {
      lastSecretHash: 'Bytes<32>'
    }
  }
};

export default HTLCContract;
