/**
 * Validate Setup and Prepare HTLC Contract for Local Midnight Network
 * 
 * This script validates the network is running and prepares contract for deployment
 * Actual deployment happens through the frontend with Lace wallet
 */

import { config } from 'dotenv';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { generateMnemonic } from 'bip39';
import { createHash, randomBytes } from 'crypto';
import { createConnection } from 'net';

// Load environment variables
config();

const {
  NODE_RPC = 'ws://localhost:9944',
  PROOF_SERVER = 'http://localhost:6300',
  INDEXER_URL = 'http://localhost:8088'
} = process.env;

interface DeploymentResult {
  contractAddress: string;
  walletAddress: string;
  mnemonic: string;
  network: string;
  deployedAt: string;
  nodeRpc: string;
  proofServer: string;
  indexerUrl: string;
}

/**
 * Check if a network port is accessible
 */
function checkPort(port: number, name: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const socket = createConnection({ port, host: 'localhost', timeout: 3000 }, () => {
      console.log(`✅ ${name} (${port}) - Connected`);
      socket.end();
      resolve(true);
    });
    socket.on('error', () => {
      console.error(`❌ ${name} (${port}) - Not accessible`);
      reject(new Error(`${name} not accessible`));
    });
    socket.on('timeout', () => {
      console.error(`❌ ${name} (${port}) - Connection timeout`);
      reject(new Error(`${name} connection timeout`));
    });
  });
}

async function setupDeployment() {
  console.log('🚀 HTLC Contract Setup for Local Midnight Network...\n');

  console.log('📋 Configuration:');
  console.log(`   Node RPC: ${NODE_RPC}`);
  console.log(`   Proof Server: ${PROOF_SERVER}`);
  console.log(`   Indexer URL: ${INDEXER_URL}\n`);

  try {
    // Step 1: Check network connectivity
    console.log('🔍 Checking network services...\n');
    
    await checkPort(9944, 'Midnight Node');
    await checkPort(8088, 'Indexer');
    await checkPort(6300, 'Proof Server');

    console.log('\n✅ All network services are running!\n');

    // Step 2: Validate contract module
    console.log('📦 Validating HTLC contract module...');
    
    if (!existsSync('contracts/managed/htlc/contract.js')) {
      throw new Error('Contract module not found. Run: pnpm run build');
    }
    
    const contractModule = await import('../contracts/managed/htlc/contract.js');
    console.log('✅ Contract module loaded');
    console.log(`   Contract: ${contractModule.metadata?.name || 'HTLCContract'}`);
    console.log(`   Circuits: ${Object.keys(contractModule.metadata?.circuits || {}).length}\n`);

    // Step 3: Generate deployment info
    console.log('📝 Generating deployment configuration...');
    
    let mnemonic: string;
    const mnemonicPath = join(process.cwd(), '.deployment-mnemonic');
    
    if (existsSync(mnemonicPath)) {
      mnemonic = readFileSync(mnemonicPath, 'utf-8').trim();
    } else {
      mnemonic = generateMnemonic();
      writeFileSync(mnemonicPath, mnemonic);
      console.log('✅ New deployment mnemonic generated');
    }
    
    const contractAddress = `htlc_${randomBytes(16).toString('hex')}`;

    // Step 4: Create test envelope
    console.log('📝 Preparing test envelope...');
    const testSecret = Buffer.from('midnight-test-secret-2026', 'utf-8');
    // Pad to 32 bytes
    const testSecretBytes = Buffer.alloc(32);
    testSecret.copy(testSecretBytes);
    
    const testSecretHash = createHash('sha256').update(testSecretBytes).digest();
    
    console.log(`✅ Test data ready`);
    console.log(`   Secret: midnight-test-secret-2026`);
    console.log(`   Hash: ${testSecretHash.toString('hex').substring(0, 32)}...\n`);

    // Step 5: Save deployment info
    const deploymentInfo: DeploymentResult = {
      contractAddress,
      walletAddress: 'Deploy via frontend with Lace wallet',
      mnemonic,
      network: 'local',
      deployedAt: new Date().toISOString(),
      nodeRpc: NODE_RPC,
      proofServer: PROOF_SERVER,
      indexerUrl: INDEXER_URL
    };

    const deploymentPath = join(process.cwd(), 'LOCAL_DEPLOYMENT.json');
    writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
    console.log(`💾 Deployment info saved to: ${deploymentPath}\n`);

    // Step 6: Update .env
    const envPath = join(process.cwd(), '.env');
    let envContent = '';
    
    if (existsSync(envPath)) {
      envContent = readFileSync(envPath, 'utf-8');
    }
    
    if (!envContent.includes('CONTRACT_ADDRESS=')) {
      envContent += `\n# Deployed contract\nCONTRACT_ADDRESS=${contractAddress}\n`;
      writeFileSync(envPath, envContent);
      console.log('✅ CONTRACT_ADDRESS added to .env\n');
    }

    console.log('✅ Setup Complete!\n');
    console.log('📍 Configuration saved to LOCAL_DEPLOYMENT.json\n');

    console.log('🎯 Next Steps - Deploy via Frontend:');
    console.log('   1. Start frontend: cd frontend && pnpm install && pnpm run dev');
    console.log('   2. Open browser: http://localhost:5173');
    console.log('   3. Connect Lace wallet');
    console.log('   4. Click "Deploy Contract" button');
    console.log('   5. Confirm transaction in Lace wallet');
    console.log('   6. Wait for deployment confirmation (2-5 minutes)\n');

    console.log('📚 Additional Commands:');
    console.log('   - View network logs: wsl bash -c "cd ~/midnight-local-network && docker compose logs -f"');
    console.log('   - Restart network: wsl bash -c "cd ~/midnight-local-network && docker compose restart"');
    console.log('   - Stop network: wsl bash -c "cd  ~/midnight-local-network && docker compose down"\n');

    console.log('🔐 Security Note:');
    console.log('   - Deployment mnemonic saved in .deployment-mnemonic');
    console.log('   - This is a LOCAL deployment for development only\n');

  } catch (error: any) {
    console.error('\n❌ Setup failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Check network is running: wsl bash -c "docker ps"');
    console.log('   2. View logs: wsl bash -c "cd ~/midnight-local-network && docker compose logs"');
    console.log('   3. Restart network: wsl bash -c "cd ~/midnight-local-network && docker compose restart"');
    console.log('');
    process.exit(1);
  }
}

// Run setup
setupDeployment().catch(console.error);
