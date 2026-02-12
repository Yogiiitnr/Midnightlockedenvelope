# Midnight HTLC Frontend

React frontend for deploying and interacting with the HTLC contract via Lace Wallet.

## Prerequisites

1. **Backend Contract Compiled**: Run `pnpm run build` in the root directory first
2. **Docker Services Running**: Ensure midnight-local-network is running in WSL2
3. **Lace Wallet**: Install Lace Wallet browser extension
4. **Funded Wallet**: Fund your wallet address (>30,000 tokens)

## Installation

```bash
# Install dependencies
pnpm install

# Copy compiled contract from backend
pnpm run copy-contract
```

## Development

```bash
# Start development server
pnpm run dev
```

Open http://localhost:5173 in your browser.

## Build for Production

```bash
pnpm run build
```

## Project Structure

```
frontend/
├── src/
│   ├── contracts/
│   │   └── htlc/
│   │       └── contract.js        # Compiled contract (copied from backend)
│   ├── midnight/
│   │   ├── types.ts               # TypeScript types
│   │   ├── memoryProvider.ts      # Memory-based private state provider
│   │   ├── providers.ts           # Wallet and ZK providers
│   │   └── api.ts                 # Contract deployment API
│   ├── components/
│   │   └── ContractDeployment.tsx # Main deployment component
│   ├── App.tsx                    # Main app component
│   ├── main.tsx                   # Entry point
│   └── index.css                  # Styles
├── public/
│   └── contract/
│       └── managed/
│           └── htlc/
│               ├── zkir/          # ZK circuits (copied by Vite)
│               └── keys/          # Proving/verifying keys (copied by Vite)
├── scripts/
│   └── copy-contract.js           # Script to copy contract from backend
├── vite.config.ts                 # Vite configuration
├── package.json
└── tsconfig.json
```

## Features

- ✅ Browser-based contract deployment (no CLI)
- ✅ Lace Wallet integration
- ✅ Memory-based private state provider
- ✅ Glass-morphism modern UI
- ✅ Real-time deployment status
- ✅ Transaction confirmation

## Usage

1. **Connect Wallet**: Click "Connect Wallet" and approve in Lace extension
2. **Deploy Contract**: Click "Deploy Contract" and confirm transaction
3. **Verify Deployment**: Contract address will be displayed on success

## Troubleshooting

### "Contract not found" error
- Ensure you've run `pnpm run build` in the backend directory
- Run `pnpm run copy-contract` to copy the compiled contract

### Wallet connection fails
- Check Lace Wallet extension is installed
- Ensure network is set to "undeployed" in Lace settings
- Refresh the page and try again

### Deployment fails
- Check Docker services are running: `docker ps`
- Verify wallet balance (>30,000 tokens)
- Check browser console for detailed errors

## Environment

The app connects to:
- **Midnight Node**: ws://localhost:9944
- **Indexer**: http://localhost:8088/api/v3/graphql
- **Proof Server**: http://localhost:6300

Make sure all services are running before deploying.
