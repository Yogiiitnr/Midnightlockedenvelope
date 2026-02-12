/**
 * Simplified HTLC Contract for Midnight Protocol
 * 
 * This is a runtime-based contract implementation that demonstrates
 * HTLC (Hash Time-Locked Contract) functionality without needing
 * the Compact compiler.
 */

import { createHash } from 'crypto';

// Contract state interface
export interface HTLCEnvelope {
  id: number;
  secretHash: string;
  sender: string;
  recipient: string;
  amount: bigint;
  timelock: number;
  claimed: boolean;
  createdAt: number;
}

// Contract state
export class HTLCContract {
  private envelopes: Map<number, HTLCEnvelope> = new Map();
  private nextEnvelopeId: number = 1;
  private lastSecretHash: string = '';

  /**
   * Create a new HTLC envelope
   */
  createEnvelope(
    secretHash: string,
    recipient: string,
    amount: bigint,
    timelock: number,
    sender: string
  ): number {
    const envelopeId = this.nextEnvelopeId++;
    
    const envelope: HTLCEnvelope = {
      id: envelopeId,
      secretHash,
      sender,
      recipient,
      amount,
      timelock,
      claimed: false,
      createdAt: Date.now()
    };

    this.envelopes.set(envelopeId, envelope);
    this.lastSecretHash = secretHash;

    return envelopeId;
  }

  /**
   * Claim an HTLC envelope with the secret
   */
  claimEnvelope(envelopeId: number, secret: string, claimant: string): boolean {
    const envelope = this.envelopes.get(envelopeId);
    
    if (!envelope) {
      throw new Error(`Envelope ${envelopeId} not found`);
    }

    if (envelope.claimed) {
      throw new Error(`Envelope ${envelopeId} already claimed`);
    }

    if (claimant !== envelope.recipient) {
      throw new Error('Only the recipient can claim this envelope');
    }

    // Verify the secret matches the hash
    const computedHash = this.hashSecret(secret);
    if (computedHash !== envelope.secretHash) {
      throw new Error('Invalid secret');
    }

    // Check if timelock has expired
    const currentTime = Date.now();
    if (currentTime > envelope.timelock) {
      throw new Error('Timelock has expired');
    }

    envelope.claimed = true;
    return true;
  }

  /**
   * Get the last secret hash used
   */
  getLastSecretHash(): string {
    return this.lastSecretHash;
  }

  /**
   * Get envelope details
   */
  getEnvelope(envelopeId: number): HTLCEnvelope | undefined {
    return this.envelopes.get(envelopeId);
  }

  /**
   * Get all envelopes
   */
  getAllEnvelopes(): HTLCEnvelope[] {
    return Array.from(this.envelopes.values());
  }

  /**
   * Hash a secret using SHA-256
   */
  private hashSecret(secret: string): string {
    return createHash('sha256').update(secret).digest('hex');
  }

  /**
   * Export contract state
   */
  exportState(): string {
    const state = {
      envelopes: Array.from(this.envelopes.entries()).map(([id, env]) => [
        id,
        {
          ...env,
          amount: env.amount.toString() // Convert BigInt to string
        }
      ]),
      nextEnvelopeId: this.nextEnvelopeId,
      lastSecretHash: this.lastSecretHash
    };
    return JSON.stringify(state, null, 2);
  }

  /**
   * Import contract state
   */
  importState(stateJson: string): void {
    const state = JSON.parse(stateJson);
    this.envelopes = new Map(
      state.envelopes.map(([id, env]: [number, any]) => [
        id,
        {
          ...env,
          amount: BigInt(env.amount) // Convert string back to BigInt
        }
      ])
    );
    this.nextEnvelopeId = state.nextEnvelopeId;
    this.lastSecretHash = state.lastSecretHash;
  }
}

/**
 * Create a contract instance
 */
export function createHTLCContract(): HTLCContract {
  return new HTLCContract();
}

/**
 * Generate a secret hash for envelope creation
 */
export function generateSecretHash(secret: string): string {
  return createHash('sha256').update(secret).digest('hex');
}
