/**
 * Lace Wallet Adapter for Midnight
 * 
 * This adapter bridges the gap between Cardano Lace API and Midnight requirements.
 * Since Lace Wallet doesn't have native Midnight support yet, we adapt the Cardano API.
 */

import type { LaceWalletAPI } from './types';
// Import types to extend window interface
import './types';

/**
 * Inject a Midnight-compatible wallet API using Cardano Lace
 * This creates window.midnight.lace from window.cardano.lace
 */
export function injectMidnightWalletAdapter(): boolean {
  // Check if already injected
  if (typeof window !== 'undefined' && window.midnight?.lace) {
    console.log('✅ Midnight Lace API already exists');
    return true;
  }

  // Check if Cardano Lace exists
  if (typeof window === 'undefined' || !window.cardano?.lace) {
    console.warn('⚠️ Cardano Lace Wallet not found - cannot create adapter');
    return false;
  }

  console.log('🔌 Creating Midnight adapter for Cardano Lace Wallet...');

  try {
    // Create window.midnight if it doesn't exist
    if (!window.midnight) {
      (window as any).midnight = {};
    }

    // Create the Midnight-compatible API adapter
    const cardanoLace = window.cardano.lace;
    let cardanoApi: any = null;

    const midnightLaceAdapter: LaceWalletAPI = {
      // Check if wallet is enabled and connected
      state: async () => {
        try {
          const isEnabled = await cardanoLace.isEnabled();
          return {
            isEnabled,
            isConnected: isEnabled // For Cardano wallets, enabled = connected
          };
        } catch (error) {
          console.error('Error checking Lace state:', error);
          return {
            isEnabled: false,
            isConnected: false
          };
        }
      },

      // Enable the wallet (request permission)
      enable: async () => {
        try {
          cardanoApi = await cardanoLace.enable();
          console.log('✅ Lace Wallet enabled via adapter');
        } catch (error) {
          console.error('❌ Failed to enable Lace Wallet:', error);
          throw error;
        }
      },

      // Get coin public key (used as address)
      getCoinPublicKey: async () => {
        if (!cardanoApi) {
          // Try to enable first
          cardanoApi = await cardanoLace.enable();
        }

        try {
          // Get addresses from Cardano API
          const addresses = await cardanoApi.getUsedAddresses();
          
          if (addresses && addresses.length > 0) {
            // Return first address (it's in hex format)
            const address = addresses[0];
            console.log('📬 Got address from Lace:', address.substring(0, 20) + '...');
            return address;
          }

          // Fallback to unused addresses
          const unusedAddresses = await cardanoApi.getUnusedAddresses();
          if (unusedAddresses && unusedAddresses.length > 0) {
            return unusedAddresses[0];
          }

          // If no addresses, return a placeholder
          console.warn('⚠️ No addresses found in wallet');
          return 'No address found - wallet may be empty';
        } catch (error) {
          console.error('❌ Error getting address:', error);
          throw new Error('Failed to get wallet address: ' + (error as Error).message);
        }
      },

      // Get encryption public key (not directly available in Cardano API)
      getEncryptionPublicKey: async () => {
        console.warn('⚠️ Encryption key not available via Cardano API - using placeholder');
        // In real Midnight integration, this would come from Midnight-specific wallet API
        return 'encryption-key-placeholder-' + Date.now();
      },

      // Balance transaction (not available in standard Cardano API)
      balanceUnsealedTransaction: async (tx: string) => {
        console.warn('⚠️ Transaction balancing via wallet adapter not fully implemented');
        console.log('📝 Transaction to balance:', tx.substring(0, 50) + '...');
        
        // In real implementation, this would:
        // 1. Parse the transaction
        // 2. Calculate required inputs/outputs
        // 3. Use Cardano API to balance it
        
        // For now, return the transaction as-is
        return tx;
      }
    };

    // Inject the adapter
    (window.midnight as any).lace = midnightLaceAdapter;
    
    console.log('✅ Midnight Lace Wallet adapter created successfully!');
    console.log('🔗 window.midnight.lace is now available');
    
    return true;
  } catch (error) {
    console.error('❌ Failed to create Midnight wallet adapter:', error);
    return false;
  }
}

/**
 * Remove the injected adapter (for cleanup/testing)
 */
export function removeWalletAdapter() {
  if (typeof window !== 'undefined' && window.midnight?.lace) {
    delete (window.midnight as any).lace;
    console.log('🗑️ Wallet adapter removed');
  }
}

// Auto-inject on module load if in browser and Cardano Lace is available
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => injectMidnightWalletAdapter(), 100);
    });
  } else {
    // DOM already loaded
    setTimeout(() => injectMidnightWalletAdapter(), 100);
  }
}
