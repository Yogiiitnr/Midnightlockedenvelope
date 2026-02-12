// Script to copy compiled contract from backend to frontend
import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { dirname } from 'path';

const sourceFile = '../contracts/managed/htlc/contract.js';
const targetFile = './src/contracts/htlc/contract.js';

// Create target directory if it doesn't exist
const targetDir = dirname(targetFile);
if (!existsSync(targetDir)) {
  mkdirSync(targetDir, { recursive: true });
}

// Check if source file exists
if (!existsSync(sourceFile)) {
  console.error('❌ Contract not compiled yet! Run "pnpm run build" in the backend first.');
  process.exit(1);
}

// Copy the file
try {
  copyFileSync(sourceFile, targetFile);
  console.log('✅ Contract copied successfully from backend to frontend!');
  console.log(`   Source: ${sourceFile}`);
  console.log(`   Target: ${targetFile}`);
} catch (error) {
  console.error('❌ Error copying contract:', error);
  process.exit(1);
}
