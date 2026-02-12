# 🔍 Wallet Detection Issue - Investigation Report

## Problem
Frontend shows "Lace Wallet not detected" even though you have Lace installed.

## Root Cause
The code is checking for `window.midnight.lace` API, but **Lace Wallet currently only exposes a Cardano API** (`window.cardano.lace`), not a Midnight-specific API yet.

## Why This Happens

### What the code expects:
```typescript
// Looking for Midnight-specific API
window.midnight?.lace
```

### What Lace actually provides:
```typescript
// Cardano wallet API
window.cardano.lace
```

### The Issue
Lace Wallet for **Cardano** ≠ Lace Wallet for **Midnight**

Midnight is a different blockchain (privacy-focused L2), and Lace needs special Midnight support to expose the `window.midnight` API.

## Current Status of Your Wallet

### ✅ What You Have
- Lace Wallet extension installed (for Cardano)
- Wallet is funded (you mentioned)

### ❌ What's Missing
- Midnight-specific Lace API (`window.midnight.lace`)
- This API doesn't exist in standard Lace yet

## Solutions

### Option 1: Check for Midnight Mode in Lace (RECOMMENDED - Try First)

1. Open Lace Wallet extension
2. Look for Settings → Developer Mode / Advanced / Network
3. Check if there's an option for "Midnight Network" or "Test Networks"
4. If you see "undeployed" network option, select it
5. Reload the frontend page

### Option 2: Use Test Tool to Diagnose

I've created a diagnostic tool. Open this in your browser:

```
http://localhost:5173/check-wallet.html
```

This will show you:
- What wallet APIs are actually available
- Whether `window.midnight` exists
- What wallets are detected
- Exact error messages

### Option 3: Update Code to Support Cardano Lace API (if Midnight API doesn't exist)

The wallet detection needs to be updated to either:
1. Check for `window.cardano.lace` as fallback, OR
2. Wait for Midnight SDK to inject the `window.midnight` API

Would you like me to:
- **A)** Update the code to work with standard Cardano Lace as a temporary solution
- **B)** Create a provider that injects the `window.midnight` API from the frontend
- **C)** First run the diagnostic tool to see what's actually available

## Funding Status

### Cannot Verify Yet
The indexer API doesn't have standard REST endpoints for balance queries. Your wallet balance can only be verified once:
1. Wallet is connected  
2. The Midnight SDK is properly integrated

The funding script uses Midnight SDK methods that aren't accessible via HTTP API.

## Next Steps

1. **FIRST**: Run the diagnostic tool → `http://localhost:5173/check-wallet.html`
2. Share what it shows (screenshot or copy the results)
3. Based on results, we'll either:
   - Configure Lace for Midnight
   - Update the wallet detection code
   - Use an alternative connection method

## Technical Details

### Expected Lace Midnight API Structure:
```typescript
interface LaceWalletAPI {
  state: () => Promise<{ isEnabled: boolean; isConnected: boolean }>;
  enable: () => Promise<void>;
  getCoinPublicKey: () => Promise<string>;
  getEncryptionPublicKey: () => Promise<string>;
  balanceUnsealedTransaction: (tx: string) => Promise<string>;
}

window.midnight.lace // Should be LaceWalletAPI
```

### What Standard Lace Provides:
```typescript
window.cardano.lace = {
  name: "Lace",
  enable: async () => { /* Returns Cardano API */ },
  isEnabled: async () => { /* Boolean */ },
  apiVersion: "1.0.0"
}
```

These are **incompatible APIs** - that's why detection fails.
