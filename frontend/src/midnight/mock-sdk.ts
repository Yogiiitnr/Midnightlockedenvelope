/**
 * Mock Midnight SDK Implementation
 * 
 * This provides placeholder implementations so the app can run without the real SDK.
 * When you get access to Midnight SDK, replace imports in api.ts to use real packages.
 */

// Mock Types
export interface PrivateStateKey {
  data: Uint8Array;
}

export interface PrivateStateProvider {
  get(key: PrivateStateKey): Promise<Uint8Array | null>;
  set(key: PrivateStateKey, value: Uint8Array): Promise<void>;
  delete(key: PrivateStateKey): Promise<void>;
  has(key: PrivateStateKey): Promise<boolean>;
  keys(): Promise<PrivateStateKey[]>;
}

export interface WalletProvider {
  getCoinPublicKey(): Promise<string>;
  getEncryptionPublicKey(): Promise<string>;
  balanceTx(tx: string): Promise<string>;
}

export interface ZKConfigProvider {
  getZKIR(circuitName: string): Promise<Uint8Array>;
  getProverKey(circuitName: string): Promise<Uint8Array>;
  getVerifierKey(circuitName: string): Promise<Uint8Array>;
}

export interface ContractConfig {
  compiledContract: any;
  args: any[];
  privateStateId: string;
}

export interface DeployedContract {
  address: string;
}

// Mock CompiledContract
export class CompiledContract {
  constructor(
    private contractModule: any,
    private zkConfig: ZKConfigProvider,
    private proofProvider: any
  ) {}

  static make(
    contractModule: any,
    zkConfig: ZKConfigProvider,
    proofProvider: any
  ): CompiledContract {
    return new CompiledContract(contractModule, zkConfig, proofProvider);
  }

  static withVacantWitnesses() {
    return (contract: CompiledContract) => contract;
  }

  pipe(fn: (c: CompiledContract) => CompiledContract): CompiledContract {
    return fn(this);
  }
}

// Mock deployContract
export async function deployContract(
  nodeUrl: string,
  indexerProvider: any,
  walletProvider: WalletProvider,
  privateStateProvider: PrivateStateProvider,
  contractConfig: ContractConfig
): Promise<DeployedContract> {
  console.log('🎭 MOCK DEPLOYMENT - Simulating contract deployment...');
  console.log('   In production, this would deploy to Midnight blockchain');
  
  // Simulate deployment delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Generate mock contract address
  const mockAddress = '0x' + Array.from(
    { length: 40 }, 
    () => Math.floor(Math.random() * 16).toString(16)
  ).join('');
  
  console.log('✅ Mock deployment complete!');
  console.log(`   Contract Address: ${mockAddress}`);
  
  return {
    address: mockAddress
  };
}

// Mock HttpClientProofProvider
export class HttpClientProofProvider {
  constructor(private url: string) {
    console.log(`🎭 Mock Proof Provider connected to ${url}`);
  }
}

// Mock IndexerPublicDataProvider
export class IndexerPublicDataProvider {
  constructor(private url: string) {
    console.log(`🎭 Mock Indexer Provider connected to ${url}`);
  }
}

console.log('⚠️  Using MOCK Midnight SDK - Replace with real SDK when available');
