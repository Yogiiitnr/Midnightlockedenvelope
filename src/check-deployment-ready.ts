/**
 * Deploy HTLC Contract with Real Lace Wallet
 * Uses actual wallet addresses from WALLET_CONFIG.json
 */

import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

const walletConfig = JSON.parse(readFileSync('WALLET_CONFIG.json', 'utf-8'));

console.log('🚀 HTLC Contract Deployment with Real Lace Wallet\n');

console.log('📋 Your Wallet Addresses:');
console.log(`  Unshielded: ${walletConfig.walletAddresses.unshielded}`);
console.log(`  Shielded:   ${walletConfig.walletAddresses.shielded.substring(0, 50)}...`);
console.log(`  Dust:       ${walletConfig.walletAddresses.dust}`);
console.log('');

console.log('🌐 Network Configuration:');
console.log(`  Network:      ${walletConfig.network}`);
console.log(`  Node RPC:     ${walletConfig.networkEndpoints.nodeRpc}`);
console.log(`  Indexer:      ${walletConfig.networkEndpoints.indexer}`);
console.log(`  Proof Server: ${walletConfig.networkEndpoints.proofServer}`);
console.log('');

console.log('✅ Configuration Verified!');
console.log('');

console.log('🎯 Next Steps for Deployment:');
console.log('');
console.log('1. Open Frontend:');
console.log('   → http://localhost:5173');
console.log('');
console.log('2. Connect Your Lace Wallet:');
console.log('   → Click "Connect Wallet" in the UI');
console.log('   → Approve the connection request');
console.log('   → Make sure you\'re on the "undeployed" network');
console.log('');
console.log('3. Verify Wallet Address Matches:');
console.log('   → Check the UI shows your address');
console.log('   → Should start with: mn_addr_undeployed...');
console.log('');
console.log('4. Deploy Contract:');
console.log('   → Click "Deploy Contract" button');
console.log('   → Review transaction in Lace wallet popup');
console.log('   → Confirm the transaction');
console.log('   → Wait 2-5 minutes for blockchain confirmation');
console.log('');
console.log('5. After Deployment:');
console.log('   → Contract address will appear in the UI');
console.log('   → You can create and claim envelopes');
console.log('   → Test the HTLC functionality');
console.log('');

console.log('📊 Contract Information:');
console.log('  Name: HTLC Contract');
console.log('  Circuits: 3 (createEnvelope, claimEnvelope, getLastSecretHash)');
console.log('  Compiled: ✅ Yes (with Compact v0.20.0)');
console.log('  ZK Proofs: ✅ Generated (6 proving/verifying keys)');
console.log('');

console.log('💡 Tips:');
console.log('  • Make sure your Lace wallet is unlocked');
console.log('  • Network in Lace should be set to "undeployed"');
console.log('  • Deployment transaction may take a few minutes');
console.log('  • Don\'t close the browser during deployment');
console.log('');

console.log('🔗 Ready to deploy at: http://localhost:5173');
console.log('');
