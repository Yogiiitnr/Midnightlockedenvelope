# Docker Setup Guide for Midnight HTLC

This guide will help you set up the Midnight local network in WSL2 Ubuntu for contract deployment.

## Prerequisites

### 1. Enable WSL2 on Windows

```powershell
# Run in PowerShell as Administrator
wsl --install
wsl --set-default-version 2
```

Restart your computer after installation.

### 2. Install Ubuntu in WSL2

```powershell
wsl --install -d Ubuntu
```

Set up your username and password when prompted.

## Install Dependencies in WSL2

Open WSL2 Ubuntu terminal and run the following commands:

### 1. Update System

```bash
sudo apt-get update
sudo apt-get upgrade -y
```

### 2. Install Node.js 22 (Required!)

```bash
# Install NVM (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Reload shell configuration
source ~/.bashrc

# Install Node.js 22
nvm install 22
nvm use 22
nvm alias default 22

# Verify installation
node --version  # Should show v22.x.x
npm --version
```

### 3. Install pnpm

```bash
npm install -g pnpm
pnpm --version
```

### 4. Install Docker

```bash
# Install Docker
sudo apt-get install -y docker.io docker-compose

# Add your user to docker group (to run docker without sudo)
sudo usermod -aG docker $USER

# Apply the group change
newgrp docker

# Enable Docker service
sudo systemctl enable docker
sudo systemctl start docker

# Verify Docker installation
docker --version
docker ps
```

If `docker ps` shows permission denied, logout and login again to WSL2.

### 5. Install Git

```bash
sudo apt-get install -y git
```

## Setup Midnight Local Network

### 1. Clone midnight-examples Repository

```bash
cd ~
git clone https://github.com/midnight-ntwrk/midnight-examples.git
cd midnight-examples/midnight-local-network
```

### 2. Install Dependencies

```bash
pnpm install
```

This may take several minutes.

### 3. Start the Network

```bash
pnpm start
```

This command will:
- Start **midnight-node** on `ws://localhost:9944`
- Start **indexer-standalone** on `http://localhost:8088/api/v3/graphql`
- Start **proof-server** on `http://localhost:6300`

**Important:** Keep this terminal open! The network must remain running.

### 4. Verify Services (in a new WSL2 terminal)

```bash
# Check if all containers are running
docker ps

# You should see:
# - midnight-node
# - indexer-standalone
# - proof-server
```

### 5. Check Service Logs (if needed)

```bash
# Check midnight-node logs
docker logs midnight-node

# Check indexer logs
docker logs indexer-standalone

# Check proof-server logs
docker logs proof-server
```

## Fund Your Wallet

### 1. Get Your Wallet Address

1. Open the frontend application (http://localhost:5173)
2. Connect your Lace Wallet
3. Copy your shielded address

### 2. Fund the Wallet

In WSL2 terminal (in midnight-local-network directory):

```bash
yarn fund <your-shielded-address>
```

Example:
```bash
yarn fund 0x1234567890abcdef1234567890abcdef12345678
```

This will fund your wallet with tokens from the genesis wallet.

### 3. Verify Balance

Check your Lace Wallet - you should see the tokens appear (may take a few seconds).

## Troubleshooting

### Services Not Starting

**Problem:** `pnpm start` fails or containers don't start

**Solutions:**
1. Check Docker is running: `sudo systemctl status docker`
2. Restart Docker: `sudo systemctl restart docker`
3. Clean up old containers: `docker system prune -a`
4. Try again: `pnpm start`

### Node.js Version Issues

**Problem:** Wrong Node.js version or compilation errors

**Solutions:**
```bash
nvm install 22
nvm use 22
nvm alias default 22
node --version  # Verify it shows v22.x.x
```

### Port Already in Use

**Problem:** Port 9944, 8088, or 6300 already in use

**Solutions:**
```bash
# Find what's using the port (example for 9944)
sudo lsof -i :9944

# Kill the process
sudo kill -9 <PID>

# Or stop all docker containers
docker stop $(docker ps -aq)
```

### Docker Permission Denied

**Problem:** Cannot run docker commands

**Solutions:**
```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Logout and login again to WSL2
exit
# Then open WSL2 again

# Verify
docker ps
```

### Funding Fails

**Problem:** `yarn fund` command fails

**Solutions:**
1. Make sure network is running: `docker ps`
2. Wait 30 seconds after starting network
3. Check address format is correct (starts with "0x")
4. Try with a different address

### Frontend Cannot Connect

**Problem:** Frontend shows services unavailable

**Solutions:**
1. Make sure Docker services are running: `docker ps`
2. Check WSL2 IP is accessible from Windows:
   ```powershell
   # In PowerShell
   wsl hostname -I
   # Try accessing http://<wsl-ip>:8088
   ```
3. Use localhost instead: All services should be accessible via localhost on Windows

## Stopping the Network

### Stop Services

```bash
# In midnight-local-network directory
pnpm stop

# Or stop all docker containers
docker stop $(docker ps -aq)
```

### Clean Up (Optional)

```bash
# Remove all containers
docker rm $(docker ps -aq)

# Remove all images (if you want to start fresh)
docker system prune -a
```

## Restarting the Network

```bash
cd ~/midnight-examples/midnight-local-network
pnpm start
```

## Network Configuration

The network uses these endpoints:
- **Midnight Node (WebSocket):** `ws://localhost:9944`
- **Indexer (GraphQL):** `http://localhost:8088/api/v3/graphql`
- **Proof Server:** `http://localhost:6300`

These are accessible from both WSL2 and Windows.

## Useful Commands

```bash
# Check Docker status
docker ps

# View logs for a specific service
docker logs -f midnight-node
docker logs -f indexer-standalone
docker logs -f proof-server

# Check Docker resource usage
docker stats

# Restart a specific container
docker restart midnight-node

# Check network connectivity
curl http://localhost:8088/api/v3/graphql
```

## Next Steps

Once your network is running and wallet is funded:

1. Go back to Windows
2. Open the frontend application
3. Connect your Lace Wallet
4. Deploy the contract!

## Getting Help

If you encounter issues:
1. Check Docker logs: `docker logs <container-name>`
2. Check WSL2 logs: `dmesg | tail -50`
3. Restart Docker: `sudo systemctl restart docker`
4. Restart WSL2: `wsl --shutdown` (in PowerShell), then reopen
5. Check Midnight documentation: https://docs.midnight.network/

## Performance Tips

- Allocate more resources to WSL2 in `.wslconfig` (in Windows user directory):
  ```ini
  [wsl2]
  memory=8GB
  processors=4
  ```
- Restart WSL2 after changing: `wsl --shutdown`
