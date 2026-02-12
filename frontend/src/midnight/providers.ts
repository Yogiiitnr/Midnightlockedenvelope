/**
 * Wallet and ZK Config Providers for Midnight HTLC
 * 
 * Browser-compatible providers that:
 * - Use Lace Wallet for coin and encryption keys
 * - Use fetch API to load ZK circuits and keys
 * - Handle transaction balancing via wallet
 * 
 * 🎭 CURRENTLY USING MOCK TYPES
 * Replace with real @midnight-ntwrk types when SDK is available
 */

// 🎭 MOCK TYPES - Replace these imports when real SDK is available
import type { WalletProvider, ZKConfigProvider } from './mock-sdk';
import type { LaceWalletAPI } from './types';

/**
 * Get the Lace Wallet API from window object
 */
function getLaceWallet(): LaceWalletAPI | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return window.midnight?.lace || null;
}

/**
 * Check if Lace Wallet is installed
 */
export function isLaceWalletInstalled(): boolean {
  return getLaceWallet() !== null;
}

/**
 * Connect to Lace Wallet
 * 🎭 DEMO MODE: Returns mock connection if Lace not installed
 */
export async function connectLaceWallet(): Promise<boolean> {
  const wallet = getLaceWallet();
  
  // 🎭 DEMO MODE: Simulate connection without Lace
  if (!wallet) {
    console.warn('⚠️  Lace Wallet not installed - using DEMO mode');
    console.log('🎭 Mock wallet connection successful');
    return true;
  }

  try {
    // Check current state
    const state = await wallet.state();
    
    if (!state.isEnabled) {
      // Request permission to connect
      await wallet.enable();
      console.log('✅ Lace Wallet enabled');
    }
    
    if (!state.isConnected) {
      console.log('⚠️  Wallet not connected');
      return false;
    }
    
    console.log('✅ Lace Wallet connected');
    return true;
  } catch (error) {
    console.error('❌ Failed to connect to Lace Wallet:', error);
    return false;
  }
}

/**
 * Get wallet address from Lace Wallet
 * This returns the coin public key as the address
 * 🎭 DEMO MODE: Returns mock address if Lace not installed
 */
export async function getWalletAddress(): Promise<string | null> {
  const wallet = getLaceWallet();
  
  // 🎭 DEMO MODE: Return mock address
  if (!wallet) {
    const mockAddress = '0x' + Array.from(
      { length: 64 },
      () => Math.floor(Math.random() * 16).toString(16)
    ).join('');
    console.log('🎭 Using mock wallet address');
    return mockAddress;
  }

  try {
    const coinPublicKey = await wallet.getCoinPublicKey();
    return coinPublicKey;
  } catch (error) {
    console.error('❌ Failed to get wallet address:', error);
    return null;
  }
}

/**
 * Create a Wallet Provider for contract deployment
 * 
 * Based on KYC-Midnight pattern:
 * - getCoinPublicKey: returns from Lace wallet
 * - getEncryptionPublicKey: returns from Lace wallet
 * - balanceTx: calls wallet.balanceUnsealedTransaction
 * 
 * 🎭 DEMO MODE: If Lace Wallet is not installed, uses mock wallet
 */
export function createWalletProvider(): WalletProvider {
  const wallet = getLaceWallet();
  
  // 🎭 DEMO MODE: Use mock wallet if Lace not installed
  if (!wallet) {
    console.warn('⚠️  Lace Wallet not found - using DEMO mode');
    return createMockWalletProvider();
  }

  return {
    getCoinPublicKey: async () => {
      console.log('🔑 Getting coin public key from Lace Wallet...');
      const key = await wallet.getCoinPublicKey();
      console.log('✅ Got coin public key');
      return key;
    },

    getEncryptionPublicKey: async () => {
      console.log('🔑 Getting encryption public key from Lace Wallet...');
      const key = await wallet.getEncryptionPublicKey();
      console.log('✅ Got encryption public key');
      return key;
    },

    balanceTx: async (tx: string) => {
      console.log('⚖️  Balancing transaction via Lace Wallet...');
      const balancedTx = await wallet.balanceUnsealedTransaction(tx);
      console.log('✅ Transaction balanced');
      return balancedTx;
    }
  };
}

/**
 * Create a mock wallet provider for demo purposes
 * 🎭 DEMO MODE ONLY - Do not use in production
 */
function createMockWalletProvider(): WalletProvider {
  const mockAddress = '0x' + Array.from(
    { length: 64 },
    () => Math.floor(Math.random() * 16).toString(16)
  ).join('');

  return {
    getCoinPublicKey: async () => {
      console.log('🎭 Using mock coin public key');
      return mockAddress;
    },

    getEncryptionPublicKey: async () => {
      console.log('🎭 Using mock encryption public key');
      return mockAddress;
    },

    balanceTx: async (tx: string) => {
      console.log('🎭 Mock transaction balancing');
      return tx; // Pass through in demo mode
    }
  };
}

/**
 * Create a ZK Config Provider for browser environment
 * 
 * Uses fetch API to load ZK circuits and keys from public folder
 * Based on KYC-Midnight pattern
 */
export function createZKConfigProvider(contractName: string = 'htlc'): ZKConfigProvider {
  const basePath = `/contract/managed/${contractName}`;

  return {
    getZKIR: async (circuitName: string) => {
      const url = `${basePath}/zkir/${circuitName}.zkir`;
      console.log(`📥 Fetching ZKIR: ${url}`);
      
      try {
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch ZKIR: ${response.status} ${response.statusText}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        const zkir = new Uint8Array(arrayBuffer);
        
        console.log(`✅ Loaded ZKIR for ${circuitName} (${zkir.length} bytes)`);
        return zkir;
      } catch (error) {
        console.error(`❌ Failed to load ZKIR for ${circuitName}:`, error);
        throw error;
      }
    },

    getProverKey: async (circuitName: string) => {
      const url = `${basePath}/keys/${circuitName}.prover.key`;
      console.log(`📥 Fetching Prover Key: ${url}`);
      
      try {
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch prover key: ${response.status} ${response.statusText}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        const proverKey = new Uint8Array(arrayBuffer);
        
        console.log(`✅ Loaded prover key for ${circuitName} (${proverKey.length} bytes)`);
        return proverKey;
      } catch (error) {
        console.error(`❌ Failed to load prover key for ${circuitName}:`, error);
        throw error;
      }
    },

    getVerifierKey: async (circuitName: string) => {
      const url = `${basePath}/keys/${circuitName}.verifier.key`;
      console.log(`📥 Fetching Verifier Key: ${url}`);
      
      try {
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch verifier key: ${response.status} ${response.statusText}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        const verifierKey = new Uint8Array(arrayBuffer);
        
        console.log(`✅ Loaded verifier key for ${circuitName} (${verifierKey.length} bytes)`);
        return verifierKey;
      } catch (error) {
        console.error(`❌ Failed to load verifier key for ${circuitName}:`, error);
        throw error;
      }
    }
  };
}

/**
 * Test connection to all services
 */
export async function testServiceConnections(): Promise<{
  node: boolean;
  indexer: boolean;
  proofServer: boolean;
}> {
  const results = {
    node: false,
    indexer: false,
    proofServer: false
  };

  // Test Midnight Node (WebSocket)
  try {
    const ws = new WebSocket('ws://localhost:9944');
    await new Promise<void>((resolve, reject) => {
      ws.onopen = () => {
        results.node = true;
        ws.close();
        resolve();
      };
      ws.onerror = () => reject();
      setTimeout(() => reject(), 2000);
    });
  } catch {
    console.warn('⚠️  Cannot connect to Midnight Node at ws://localhost:9944');
  }

  // Test Indexer
  try {
    const response = await fetch('http://localhost:8088/api/v3/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '{ __typename }' })
    });
    results.indexer = response.ok;
  } catch {
    console.warn('⚠️  Cannot connect to Indexer at http://localhost:8088');
  }

  // Test Proof Server
  try {
    const response = await fetch('http://localhost:6300/health');
    results.proofServer = response.ok;
  } catch {
    console.warn('⚠️  Cannot connect to Proof Server at http://localhost:6300');
  }

  return results;
}
