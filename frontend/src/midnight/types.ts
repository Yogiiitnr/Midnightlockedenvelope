// Type definitions for Midnight HTLC project

export interface WalletState {
  address: string | null;
  balance: string | null;
  isConnected: boolean;
}

export interface ContractDeploymentState {
  contractAddress: string | null;
  isDeploying: boolean;
  error: string | null;
  txHash: string | null;
}

export interface DeploymentResult {
  contractAddress: string;
  transactionHash: string;
  blockNumber: number;
  deployedAt: string;
  network: string;
  endpoints: {
    node: string;
    indexer: string;
    proofServer: string;
  };
}

// Lace Wallet API types
export interface LaceWalletAPI {
  state: () => Promise<{
    isEnabled: boolean;
    isConnected: boolean;
  }>;
  enable: () => Promise<void>;
  getCoinPublicKey: () => Promise<string>;
  getEncryptionPublicKey: () => Promise<string>;
  balanceUnsealedTransaction: (tx: string) => Promise<string>;
}

// Cardano Wallet API types (for adapter)
export interface CardanoWalletAPI {
  name: string;
  icon: string;
  apiVersion: string;
  enable: () => Promise<any>;
  isEnabled: () => Promise<boolean>;
}

declare global {
  interface Window {
    midnight?: {
      lace?: LaceWalletAPI;
    };
    cardano?: {
      lace?: CardanoWalletAPI;
      [key: string]: CardanoWalletAPI | undefined;
    };
  }
}

export {};
