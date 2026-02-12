# Quick Start Guide - Midnight HTLC

Get your Midnight HTLC contract deployed in minutes!

## Prerequisites Checklist

- [ ] Windows with WSL2 enabled
- [ ] Ubuntu installed in WSL2
- [ ] Node.js 22.x installed in WSL2
- [ ] Docker installed and running in WSL2
- [ ] Lace Wallet browser extension installed
- [ ] Lace Wallet configured for "undeployed" network

## Step-by-Step Deployment

### 1️⃣ Setup WSL2 and Docker (One-time setup)

See [DOCKER_SETUP.md](DOCKER_SETUP.md) for detailed instructions.

**Quick version:**
```bash
# In WSL2 Ubuntu
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 22
nvm use 22
npm install -g pnpm
sudo apt-get install docker.io docker-compose -y
sudo usermod -aG docker $USER
```

### 2️⃣ Start Midnight Network (Every session)

```bash
# In WSL2
cd ~
git clone https://github.com/midnight-ntwrk/midnight-examples.git
cd midnight-examples/midnight-local-network
pnpm install
pnpm start
```

✅ **Leave this running!** Open a new terminal for the next steps.

### 3️⃣ Compile the Contract (One-time)

**In Windows PowerShell at `C:\midnight-envelopes-final`:**

```powershell
# Install dependencies
pnpm install

# Compile contract
pnpm run build
```

You should see output files in `contracts/managed/htlc/`:
- `contract.js` - Contract module
- `zkir/` - ZK circuits
- `keys/` - Proving and verifying keys

### 4️⃣ Setup Frontend (One-time)

```powershell
# Navigate to frontend
cd frontend

# Install dependencies
pnpm install

# Copy compiled contract
pnpm run copy-contract
```

### 5️⃣ Fund Your Wallet

**Get your wallet address:**
1. Start the frontend: `pnpm run dev`
2. Open http://localhost:5173
3. Click "Connect Wallet"
4. Copy your address from the UI

**Fund it (in WSL2):**
```bash
cd ~/midnight-examples/midnight-local-network
yarn fund <your-wallet-address>
```

**Verify:** Check your Lace Wallet shows >30,000 tokens

### 6️⃣ Deploy Contract! 🚀

1. **Frontend should be running:** http://localhost:5173
2. **Backend services healthy:** Check UI shows "All services healthy"
3. **Wallet connected:** Shows your address
4. **Click "Deploy Contract"**
5. **Confirm in Lace Wallet**
6. **Wait 2-5 minutes** for deployment

## Success! 🎉

You should see:
```
✅ Contract Deployed Successfully!
Contract Address: 0x...
```

## Quick Troubleshooting

### ❌ "Lace Wallet not detected"
- Install Lace Wallet extension
- Refresh the page

### ❌ "Some services are down"
- Check WSL2 terminal shows services running
- Run `docker ps` in WSL2
- Restart: `pnpm stop` then `pnpm start`

### ❌ "Contract not found"
- Did you run `pnpm run build` in root?
- Did you run `pnpm run copy-contract` in frontend?
- Check `frontend/src/contracts/htlc/contract.js` exists

### ❌ "Insufficient balance"
- Fund wallet: `yarn fund <address>` in WSL2
- Check balance in Lace Wallet

### ❌ Deployment takes forever
- This is normal! Wait 5-10 minutes
- Check WSL2 terminal for errors
- Check browser console for errors

## Daily Workflow

**Start your dev session:**
```bash
# 1. Start network in WSL2
cd ~/midnight-examples/midnight-local-network
pnpm start

# 2. Start frontend in Windows
cd C:\midnight-envelopes-final\frontend
pnpm run dev
```

**Stop your dev session:**
```bash
# In WSL2
pnpm stop  # or Ctrl+C
```

## Important Notes

⚠️ **Keep WSL2 terminal open** while deploying
⚠️ **Network must be "undeployed"** in Lace Wallet settings
⚠️ **Don't close browser** during deployment
⚠️ **Deployment cost** is ~30,000 tokens

## Commands Reference

| Task | Command | Where |
|------|---------|-------|
| Start network | `pnpm start` | WSL2 (midnight-local-network) |
| Stop network | `pnpm stop` | WSL2 (midnight-local-network) |
| Compile contract | `pnpm run build` | Windows (root) |
| Copy contract | `pnpm run copy-contract` | Windows (frontend) |
| Start frontend | `pnpm run dev` | Windows (frontend) |
| Fund wallet | `yarn fund <address>` | WSL2 (midnight-local-network) |
| Check services | `docker ps` | WSL2 |

## Endpoints

- **Frontend:** http://localhost:5173
- **Midnight Node:** ws://localhost:9944
- **Indexer:** http://localhost:8088/api/v3/graphql
- **Proof Server:** http://localhost:6300

## Next Steps

After successful deployment:
1. Note your contract address
2. Enhance the UI to interact with contract
3. Implement `createEnvelope` and `claimEnvelope` functions
4. Add query functionality for `getLastSecretHash`

## Need Help?

1. Check [DOCKER_SETUP.md](DOCKER_SETUP.md) for detailed Docker setup
2. Check [README.md](README.md) for project overview
3. Check [frontend/README.md](frontend/README.md) for frontend details
4. Check browser console and WSL2 terminal for errors
5. Check Docker logs: `docker logs midnight-node`

Happy deploying! 🌙
