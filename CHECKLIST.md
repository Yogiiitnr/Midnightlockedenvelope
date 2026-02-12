# 🚀 Pre-Deployment Checklist

Use this checklist before attempting contract deployment to ensure everything is properly configured.

## ✅ WSL2 Ubuntu Environment

- [ ] WSL2 is installed and running
  ```powershell
  # In PowerShell
  wsl --status
  ```

- [ ] Ubuntu is installed in WSL2
  ```powershell
  wsl -l -v
  # Should show Ubuntu with Version 2
  ```

- [ ] Node.js 22.x is installed in WSL2
  ```bash
  # In WSL2
  node --version
  # Should show v22.x.x
  ```

- [ ] pnpm is installed in WSL2
  ```bash
  # In WSL2
  pnpm --version
  ```

- [ ] Docker is installed and running in WSL2
  ```bash
  # In WSL2
  docker --version
  docker ps  # Should not show permission errors
  ```

## ✅ Midnight Network Services

- [ ] midnight-examples repository is cloned
  ```bash
  # In WSL2
  ls ~/midnight-examples/midnight-local-network
  ```

- [ ] Dependencies installed in midnight-local-network
  ```bash
  # In WSL2
  cd ~/midnight-examples/midnight-local-network
  ls node_modules/  # Should show packages
  ```

- [ ] Network is running
  ```bash
  # In WSL2
  docker ps
  # Should show 3 containers:
  # - midnight-node
  # - indexer-standalone  
  # - proof-server
  ```

- [ ] midnight-node is accessible
  ```bash
  # Test WebSocket connection (install wscat: npm i -g wscat)
  wscat -c ws://localhost:9944
  # Should connect without errors
  ```

- [ ] indexer-standalone is accessible
  ```bash
  curl -X POST http://localhost:8088/api/v3/graphql \
    -H "Content-Type: application/json" \
    -d '{"query":"{ __typename }"}'
  # Should return JSON
  ```

- [ ] proof-server is accessible
  ```bash
  curl http://localhost:6300/health
  # Should return status
  ```

## ✅ Backend Contract

- [ ] Backend dependencies installed
  ```powershell
  # In Windows at C:\midnight-envelopes-final
  dir node_modules
  ```

- [ ] Contract compiles successfully
  ```powershell
  pnpm run build
  # Should complete without errors
  ```

- [ ] Contract output files exist
  ```powershell
  dir contracts\managed\htlc\contract.js
  dir contracts\managed\htlc\zkir\
  dir contracts\managed\htlc\keys\
  # All should exist
  ```

- [ ] Contract.js is valid JavaScript
  ```powershell
  # Check file size
  Get-Item contracts\managed\htlc\contract.js
  # Should be >1KB
  ```

## ✅ Frontend Setup

- [ ] Frontend dependencies installed
  ```powershell
  cd frontend
  dir node_modules
  ```

- [ ] Contract copied to frontend
  ```powershell
  pnpm run copy-contract
  # Should succeed
  ```

- [ ] Contract exists in frontend
  ```powershell
  dir src\contracts\htlc\contract.js
  # Should exist
  ```

- [ ] Frontend builds without errors
  ```powershell
  pnpm run build
  # Should complete successfully
  ```

- [ ] Frontend dev server starts
  ```powershell
  pnpm run dev
  # Should start on http://localhost:5173
  ```

- [ ] Frontend loads in browser
  - Open http://localhost:5173
  - No console errors
  - UI is visible

## ✅ Lace Wallet

- [ ] Lace Wallet extension installed
  - Check browser extensions
  - Should see Lace Wallet icon

- [ ] Lace Wallet is configured
  - Open Lace Wallet
  - Network is set to "undeployed"
  - Wallet is unlocked

- [ ] Wallet connects to frontend
  - Click "Connect Wallet" in frontend
  - Lace Wallet popup appears
  - Connection succeeds

- [ ] Wallet address is showing
  - Frontend displays your address
  - Address starts with "0x" or similar

- [ ] Wallet is funded (>30,000 tokens)
  ```bash
  # In WSL2
  cd ~/midnight-examples/midnight-local-network
  yarn fund <your-address>
  ```
  - Check Lace Wallet balance
  - Should show >30,000 tokens

## ✅ Network Connectivity

Test from Windows PowerShell:

- [ ] Can reach Midnight Node
  ```powershell
  Test-NetConnection -ComputerName localhost -Port 9944
  # TcpTestSucceeded : True
  ```

- [ ] Can reach Indexer
  ```powershell
  curl http://localhost:8088/api/v3/graphql
  # Should not error
  ```

- [ ] Can reach Proof Server
  ```powershell
  curl http://localhost:6300/health
  # Should return response
  ```

## ✅ Final Checks Before Deployment

- [ ] All Docker services are healthy
  ```bash
  docker ps --format "table {{.Names}}\t{{.Status}}"
  # All should say "Up" or "healthy"
  ```

- [ ] Frontend services check passes
  - Frontend UI shows "✅ All services healthy"

- [ ] Wallet is connected
  - Frontend shows "✅ Wallet Connected"
  - Address is displayed

- [ ] Sufficient balance
  - Wallet shows >30,000 tokens
  - Frontend shows estimated cost

- [ ] No errors in browser console
  - Open Developer Tools (F12)
  - Console should be clean

## 🎬 Ready to Deploy!

If all boxes are checked, you're ready to deploy:

1. Click **"Deploy Contract"** in the frontend
2. **Confirm** transaction in Lace Wallet
3. **Wait patiently** (2-10 minutes)
4. **Success!** Contract address will appear

## ⚠️ Common Issues and Quick Fixes

### Missing contract.js
```powershell
cd C:\midnight-envelopes-final
pnpm run build
cd frontend
pnpm run copy-contract
```

### Services not running
```bash
cd ~/midnight-examples/midnight-local-network
pnpm start
```

### Wallet not funded
```bash
cd ~/midnight-examples/midnight-local-network
yarn fund <your-address>
```

### Port conflicts
```bash
docker stop $(docker ps -aq)
pnpm start
```

### Node version wrong
```bash
nvm use 22
node --version
```

## 📊 Deployment Timeline

Expected times:
- ⚡ Wallet connection: **5 seconds**
- ⚡ Service checks: **3 seconds**
- 🐌 Contract deployment: **2-10 minutes**
- ⚡ Confirmation: **10 seconds**

**Total: ~3-11 minutes from click to deployed**

## 💡 Pro Tips

1. **Keep WSL2 terminal visible** - Watch for errors
2. **Keep browser console open** - Monitor progress
3. **Don't refresh during deployment** - You'll lose progress
4. **Check Docker logs if stuck** - `docker logs midnight-node`
5. **Try Chrome** - Best compatibility with Lace Wallet

---

**Ready?** Head to http://localhost:5173 and click **"Deploy Contract"**! 🚀
