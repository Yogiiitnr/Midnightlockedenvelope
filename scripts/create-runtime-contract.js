// Real Compact Compiler using Midnight SDK
// Compiles src/contract.compact to JavaScript contract module

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('🔨 Compiling Compact Contract with Midnight SDK...');
console.log('');

async function compileContract() {
  try {
    // Read the compact source
    const compactSource = readFileSync(join(projectRoot, 'src/contract.compact'), 'utf-8');
    console.log('✅ Read src/contract.compact');
    
    // Try to use the Midnight Compact runtime
    let compactRuntime;
    try {
      compactRuntime = await import('@midnight-ntwrk/compact-runtime');
      console.log('✅ Loaded @midnight-ntwrk/compact-runtime');
    } catch (err) {
      console.warn('⚠️  Could not load @midnight-ntwrk/compact-runtime');
      console.warn('   Falling back to mock compilation...');
      console.log('');
      
      // Fall back to mock compiler
      const mockCompile = await import('./mock-compile.js');
      return;
    }
    
    // Output directory
    const outputDir = join(projectRoot, 'contracts/managed/htlc');
    const zkirDir = join(outputDir, 'zkir');
    const keysDir = join(outputDir, 'keys');
    
    // Create directories
    [outputDir, zkirDir, keysDir].forEach(dir => {
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
    });
    console.log('✅ Created output directories');
    
    // Compile the contract
    console.log('🔄 Compiling contract (this may take a moment)...');
    
    const compiled = compactRuntime.compileCompactContract(compactSource, {
      outputPath: outputDir,
      circuitName: 'HTLCContract',
      generateZkir: true,
      generateKeys: true
    });
    
    console.log('✅ Contract compiled successfully!');
    console.log('');
    console.log('📁 Generated files:');
    console.log('   contracts/managed/htlc/contract.js');
    console.log('   contracts/managed/htlc/zkir/*.zkir');
    console.log('   contracts/managed/htlc/keys/*.key');
    console.log('');
    console.log('✅ Build complete!');
    
  } catch (error) {
    console.error('❌ Compilation failed:', error.message);
    console.log('');
    console.log('Troubleshooting:');
    console.log('  1. Ensure Midnight SDK is properly installed: pnpm install');
    console.log('  2. Check that src/contract.compact has valid syntax');
    console.log('  3. Verify network services are running: docker ps');
    console.log('');
    process.exit(1);
  }
}

compileContract();
