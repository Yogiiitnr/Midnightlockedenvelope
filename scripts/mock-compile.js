// Mock Compiler for HTLC Contract
// Generates placeholder outputs until real Midnight SDK is available

import { mkdirSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';

console.log('🔨 Mock Compiler - Generating placeholder contract outputs...');
console.log('   (Replace with real compilation when Midnight SDK is available)');
console.log('');

const outputDir = 'contracts/managed/htlc';
const zkirDir = join(outputDir, 'zkir');
const keysDir = join(outputDir, 'keys');

// Create directories
[outputDir, zkirDir, keysDir].forEach(dir => {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
});

// Generate mock contract.js
const contractJs = `// Mock HTLC Contract Module
// This is a placeholder until the real Midnight SDK is available

export default {
  name: 'HTLCContract',
  version: '0.1.0',
  
  // Mock circuit definitions
  circuits: {
    createEnvelope: {
      name: 'createEnvelope',
      params: ['secretHash'],
      returns: 'Void'
    },
    claimEnvelope: {
      name: 'claimEnvelope',
      params: ['secret', 'expectedHash'],
      returns: 'Bytes<1>'
    },
    getLastSecretHash: {
      name: 'getLastSecretHash',
      params: [],
      returns: 'Bytes<32>'
    }
  },
  
  // Mock ledger definition
  ledger: {
    HTLCLedger: {
      lastSecretHash: 'Bytes<32>'
    }
  },
  
  // Mock metadata
  metadata: {
    compiler: 'mock-compiler',
    compiledAt: new Date().toISOString(),
    sourceFile: 'src/contract.compact'
  }
};

console.log('✅ Mock contract module loaded');
`;

writeFileSync(join(outputDir, 'contract.js'), contractJs);
console.log('✅ Created contract.js');

// Generate mock ZKIR files
const mockZkir = new Uint8Array([
  0x5A, 0x4B, 0x49, 0x52, // "ZKIR" magic bytes
  0x01, 0x00, 0x00, 0x00, // Version
  ...Array(100).fill(0).map(() => Math.floor(Math.random() * 256))
]);

['createEnvelope', 'claimEnvelope', 'getLastSecretHash'].forEach(circuit => {
  writeFileSync(join(zkirDir, `${circuit}.zkir`), mockZkir);
  console.log(`✅ Created zkir/${circuit}.zkir`);
});

// Generate mock key files
const mockKey = new Uint8Array(Array(500).fill(0).map(() => Math.floor(Math.random() * 256)));

['createEnvelope', 'claimEnvelope', 'getLastSecretHash'].forEach(circuit => {
  writeFileSync(join(keysDir, `${circuit}.prover.key`), mockKey);
  writeFileSync(join(keysDir, `${circuit}.verifier.key`), mockKey);
  console.log(`✅ Created keys/${circuit}.{prover,verifier}.key`);
});

console.log('');
console.log('✅ Mock compilation complete!');
console.log('');
console.log('📁 Generated files:');
console.log('   contracts/managed/htlc/contract.js');
console.log('   contracts/managed/htlc/zkir/*.zkir (3 files)');
console.log('   contracts/managed/htlc/keys/*.key (6 files)');
console.log('');
console.log('⚠️  Note: These are placeholder files for development.');
console.log('   Replace with real Midnight SDK compilation when available.');
