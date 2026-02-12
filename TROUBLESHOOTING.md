# 🔧 Troubleshooting Guide

Comprehensive solutions for common issues during Midnight HTLC setup and deployment.

## 🐛 WSL2 Issues

### WSL2 Not Installed

**Symptoms:**
- `wsl: command not found` in PowerShell
- Cannot open Ubuntu terminal

**Solution:**
```powershell
# Run as Administrator in PowerShell
wsl --install
# Restart computer
wsl --set-default-version 2
```

### WSL2 Ubuntu Not Starting

**Symptoms:**
- Ubuntu terminal crashes immediately
- Error: "The virtual machine could not be started"

**Solution:**
```powershell
# Restart WSL2
wsl --shutdown
wsl

# Reset WSL2 if needed
wsl --unregister Ubuntu
wsl --install -d Ubuntu
```

### Node.js Wrong Version in WSL2

**Symptoms:**
- `node --version` shows v18.x or v20.x
- Compilation errors in midnight-local-network

**Solution:**
```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc

# Install and use Node.js 22
nvm install 22
nvm use 22
nvm alias default 22

# Verify
node --version  # Should show v22.x.x
```

## 🐳 Docker Issues

### Docker Permission Denied

**Symptoms:**
- `docker ps` says "permission denied"
- Cannot run docker commands without sudo

**Solution:**
```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Apply changes
newgrp docker

# Or logout and login to WSL2
exit
# Then reopen WSL2

# Verify
docker ps  # Should work without sudo
```

### Docker Service Not Running

**Symptoms:**
- `docker ps` says "Cannot connect to Docker daemon"
- Services won't start

**Solution:**
```bash
# Start Docker service
sudo systemctl start docker

# Enable Docker to start on boot
sudo systemctl enable docker

# Check status
sudo systemctl status docker
```

### Port Already in Use

**Symptoms:**
- Error: "port 9944 already in use"
- Services fail to start

**Solution:**
```bash
# Find what's using the port
sudo lsof -i :9944
sudo lsof -i :8088
sudo lsof -i :6300

# Kill the process
sudo kill -9 <PID>

# Or stop all Docker containers
docker stop $(docker ps -aq)

# Try starting again
cd ~/midnight-examples/midnight-local-network
pnpm start
```

### Docker Containers Keep Restarting

**Symptoms:**
- `docker ps` shows containers restarting
- Services show as unhealthy

**Solution:**
```bash
# Check logs for specific container
docker logs midnight-node
docker logs indexer-standalone
docker logs proof-server

# Remove and restart containers
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)
cd ~/midnight-examples/midnight-local-network
pnpm start
```

## 📦 Backend Contract Issues

### Contract Won't Compile

**Symptoms:**
- `pnpm run build` fails
- Syntax errors in contract.compact

**Solution:**
```powershell
# Check Node.js version
node --version  # Should be v22.x.x

# Reinstall dependencies
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install

# Try compiling again
pnpm run build
```

### Contract Output Files Missing

**Symptoms:**
- `contracts/managed/htlc/` is empty
- `contract.js` doesn't exist

**Solution:**
```powershell
# Clean and rebuild
pnpm run clean
pnpm run build

# Check compact.json is correct
cat compact.json

# Verify output
dir contracts\managed\htlc\
```

### Compact CLI Not Found

**Symptoms:**
- Error: "compact: command not found"
- Build fails immediately

**Solution:**
```powershell
# Install Compact CLI
pnpm install @midnight-ntwrk/compact-cli

# Or reinstall everything
rm -rf node_modules
pnpm install
pnpm run build
```

## 🎨 Frontend Issues

### Frontend Won't Start

**Symptoms:**
- `pnpm run dev` fails
- Vite errors during startup

**Solution:**
```powershell
cd frontend

# Clear cache
rm -rf node_modules
rm -rf dist
rm -rf .vite
rm pnpm-lock.yaml

# Reinstall
pnpm install

# Try again
pnpm run dev
```

### Contract Not Found in Frontend

**Symptoms:**
- Error: "Contract module not found"
- Import fails for `../contracts/htlc/contract.js`

**Solution:**
```powershell
# Go to root and compile contract
cd C:\midnight-envelopes-final
pnpm run build

# Go to frontend and copy contract
cd frontend
pnpm run copy-contract

# Verify file exists
dir src\contracts\htlc\contract.js

# Restart dev server
pnpm run dev
```

### WASM/ZK Files Not Loading

**Symptoms:**
- 404 errors for `.zkir` or `.key` files
- Frontend loads but deployment fails

**Solution:**
```powershell
# Verify contract files exist
dir ..\contracts\managed\htlc\zkir\
dir ..\contracts\managed\htlc\keys\

# Rebuild frontend to copy files
pnpm run build

# Check public folder
dir dist\contract\managed\htlc\zkir\
dir dist\contract\managed\htlc\keys\

# Run dev server (Vite copies files automatically)
pnpm run dev
```

### Frontend Build Errors

**Symptoms:**
- TypeScript errors
- Vite build fails

**Solution:**
```powershell
# Check TypeScript
npx tsc --noEmit

# Update dependencies
pnpm update

# Check vite.config.ts exists and is valid
cat vite.config.ts

# Rebuild
pnpm run build
```

## 👛 Lace Wallet Issues

### Wallet Extension Not Detected

**Symptoms:**
- "Lace Wallet not detected" in UI
- `window.midnight` is undefined

**Solution:**
1. Install Lace Wallet extension from browser store
2. Enable the extension in browser settings
3. Refresh the page (F5)
4. Check browser console for errors

### Wallet Won't Connect

**Symptoms:**
- "Connect Wallet" button does nothing
- Connection fails

**Solution:**
1. Check Lace Wallet is unlocked
2. Check network is set to "undeployed"
3. Clear browser cache and cookies
4. Restart browser
5. Try incognito/private mode

### Wrong Network

**Symptoms:**
- Wallet connects but deployment fails
- Balance shows 0

**Solution:**
1. Open Lace Wallet extension
2. Go to Settings → Network
3. Select **"undeployed"** network
4. Refresh the page
5. Reconnect wallet

### Insufficient Balance

**Symptoms:**
- Deployment fails with "insufficient funds"
- Balance shows <30,000 tokens

**Solution:**
```bash
# In WSL2
cd ~/midnight-examples/midnight-local-network

# Get your address from frontend UI
yarn fund 0xYOUR_ADDRESS_HERE

# Wait a few seconds and check wallet
# Balance should update
```

### Funding Fails

**Symptoms:**
- `yarn fund` returns error
- Tokens don't appear

**Solution:**
```bash
# Ensure network is running
docker ps  # Should show 3 containers

# Wait 30 seconds after starting network
sleep 30

# Try funding again
yarn fund <address>

# Check indexer logs
docker logs indexer-standalone
```

## 🚀 Deployment Issues

### Deployment Hangs Forever

**Symptoms:**
- "Deploying..." for >10 minutes
- No progress or errors

**Solution:**
1. **Check Docker logs:**
   ```bash
   docker logs -f midnight-node
   docker logs -f proof-server
   ```

2. **Check browser console** for stuck requests

3. **Restart services:**
   ```bash
   cd ~/midnight-examples/midnight-local-network
   pnpm stop
   pnpm start
   ```

4. **Try deployment again**

### Deployment Fails Immediately

**Symptoms:**
- Error appears right away
- No transaction sent

**Solution:**
1. Check all services are healthy (in UI)
2. Verify wallet is connected
3. Check browser console for specific error
4. Verify contract files copied correctly
5. Try refreshing the page

### "Failed to fetch ZKIR" Error

**Symptoms:**
- 404 error for `.zkir` files
- Deployment fails during ZK setup

**Solution:**
```powershell
# Check files exist in backend
dir ..\contracts\managed\htlc\zkir\

# Stop dev server (Ctrl+C)

# Rebuild frontend
pnpm run build

# Restart dev server
pnpm run dev

# Verify files are accessible
# Open: http://localhost:5173/contract/managed/htlc/zkir/
```

### "Failed to fetch keys" Error

**Symptoms:**
- 404 error for `.key` files
- Deployment fails during proving key load

**Solution:**
```powershell
# Verify keys exist
dir ..\contracts\managed\htlc\keys\

# Check vite.config.ts has viteStaticCopy configured

# Rebuild
pnpm run build
pnpm run dev
```

### "WebSocket connection failed" Error

**Symptoms:**
- Cannot connect to ws://localhost:9944
- Network unreachable error

**Solution:**
```bash
# In WSL2 - Check midnight-node is running
docker ps | grep midnight-node

# Check logs
docker logs midnight-node

# Restart if needed
docker restart midnight-node

# Test connection from Windows
# Install wscat: npm i -g wscat
wscat -c ws://localhost:9944
```

### Transaction Never Confirms

**Symptoms:**
- Deployment sent but never completes
- Stuck "waiting for confirmation"

**Solution:**
```bash
# Check indexer logs
docker logs indexer-standalone | tail -50

# Check if indexer is syncing
curl -X POST http://localhost:8088/api/v3/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __typename }"}'

# Restart indexer if needed
docker restart indexer-standalone

# Wait a minute then try deployment again
```

## 🔍 Network Connectivity Issues

### Cannot Access Services from Windows

**Symptoms:**
- WSL2 services not reachable from Windows
- `localhost:9944` doesn't work

**Solution:**
```bash
# Get WSL2 IP address
wsl hostname -I
# Note the IP address

# Try accessing via WSL IP instead of localhost
# Example: ws://172.x.x.x:9944

# Or configure port forwarding in PowerShell (as Admin):
netsh interface portproxy add v4tov4 listenport=9944 listenaddress=0.0.0.0 connectport=9944 connectaddress=172.x.x.x
netsh interface portproxy add v4tov4 listenport=8088 listenaddress=0.0.0.0 connectport=8088 connectaddress=172.x.x.x
netsh interface portproxy add v4tov4 listenport=6300 listenaddress=0.0.0.0 connectport=6300 connectaddress=172.x.x.x
```

### Services Health Check Fails

**Symptoms:**
- UI shows "Some services are down"
- But `docker ps` shows all running

**Solution:**
1. Wait 30-60 seconds after starting services
2. Click "Recheck Services" in UI
3. Check Windows Firewall isn't blocking ports
4. Try accessing services manually:
   ```powershell
   curl http://localhost:8088/api/v3/graphql
   curl http://localhost:6300/health
   ```

## 🧹 Nuclear Options (Last Resort)

### Complete Backend Reset

```powershell
cd C:\midnight-envelopes-final

# Remove everything
rm -rf node_modules
rm -rf contracts
rm -rf dist
rm pnpm-lock.yaml

# Reinstall and rebuild
pnpm install
pnpm run build
```

### Complete Frontend Reset

```powershell
cd frontend

# Remove everything
rm -rf node_modules
rm -rf dist
rm -rf .vite
rm -rf src/contracts
rm pnpm-lock.yaml

# Reinstall
pnpm install

# Copy contract again
pnpm run copy-contract

# Start fresh
pnpm run dev
```

### Complete Docker Reset

```bash
# In WSL2
cd ~/midnight-examples/midnight-local-network

# Stop everything
pnpm stop

# Remove all containers
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)

# Clean Docker system
docker system prune -a
# Type 'y' to confirm

# Start fresh
pnpm start
```

### Complete WSL2 Reset

```powershell
# In PowerShell as Administrator
# WARNING: This deletes all WSL2 data!

# Backup any important files first!

wsl --shutdown
wsl --unregister Ubuntu
wsl --install -d Ubuntu

# Then redo all setup steps from DOCKER_SETUP.md
```

## 📞 Getting More Help

### Check Logs

```bash
# Docker container logs
docker logs midnight-node
docker logs indexer-standalone
docker logs proof-server

# Follow logs in real-time
docker logs -f midnight-node
```

### Check Browser Console

1. Open Developer Tools (F12)
2. Go to Console tab
3. Look for red errors
4. Check Network tab for failed requests

### Check Network Tab

1. Open Developer Tools (F12)
2. Go to Network tab
3. Look for failed (red) requests
4. Check request/response details

### Enable Verbose Logging

Update [api.ts](frontend/src/midnight/api.ts) to add more console logs for debugging.

## 📚 Additional Resources

- [Midnight Documentation](https://docs.midnight.network/)
- [Midnight Discord](https://discord.gg/midnight)
- [Lace Wallet Support](https://www.lace.io/support)
- [WSL2 Documentation](https://docs.microsoft.com/en-us/windows/wsl/)
- [Docker Documentation](https://docs.docker.com/)

## 💡 Prevention Tips

1. **Always check services before deploying**
2. **Keep WSL2 terminal visible** during deployment
3. **Don't refresh browser** during deployment
4. **Wait for network to fully start** (30-60 seconds)
5. **Fund wallet before connecting**
6. **Use Chrome or Edge** for best compatibility
7. **Keep Lace Wallet unlocked** during deployment
8. **Close other resource-intensive apps**

---

Still stuck? Check the specific error message in browser console and Docker logs - they usually point to the exact issue!
