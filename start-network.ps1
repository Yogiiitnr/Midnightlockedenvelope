# Start Midnight Local Network in WSL2
# This script starts the Docker-based Midnight local network

Write-Host "🚀 Starting Midnight Local Network..." -ForegroundColor Cyan
Write-Host ""

# Check WSL2 is running
Write-Host "✓ Checking WSL2..." -ForegroundColor Yellow
$wslStatus = wsl --status
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ WSL2 is not running. Please install WSL2 first." -ForegroundColor Red
    exit 1
}
Write-Host "✓ WSL2 is running" -ForegroundColor Green
Write-Host ""

# Check if network directory exists
Write-Host "✓ Checking midnight-local-network directory..." -ForegroundColor Yellow
$dirCheck = wsl bash -c "test -d ~/midnight-local-network && echo 'exists' || echo 'missing'"
if ($dirCheck -ne "exists") {
    Write-Host "❌ ~/midnight-local-network directory not found" -ForegroundColor Red
    Write-Host "Please clone it first:" -ForegroundColor Yellow
    Write-Host "wsl bash -c 'git clone https://github.com/midnight-ntwrk/midnight-examples.git ~/ && cd ~/midnight-examples/midnight-local-network && npm install'" -ForegroundColor Cyan
    exit 1
}
Write-Host "✓ Network directory found" -ForegroundColor Green
Write-Host ""

# Stop any existing containers
Write-Host "🛑 Stopping any existing containers..." -ForegroundColor Yellow
wsl bash -c "cd ~/midnight-local-network && docker compose down 2>&1"
Write-Host ""

# Start the network
Write-Host "🐳 Starting Midnight Network with Docker Compose..." -ForegroundColor Cyan
Write-Host "This will start 3 services:" -ForegroundColor White
Write-Host "  - midnight-node (port 9944)" -ForegroundColor Gray
Write-Host "  - indexer-standalone (port 8088)" -ForegroundColor Gray
Write-Host "  - proof-server (port 6300)" -ForegroundColor Gray
Write-Host ""

# Start in background
wsl bash -c "cd ~/midnight-local-network && docker compose up -d 2>&1"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to start network" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "⏳ Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check container status
Write-Host ""
Write-Host "📊 Container Status:" -ForegroundColor Cyan
wsl bash -c "docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'"

Write-Host ""
Write-Host "✅ Network started successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "🔗 Service Endpoints:" -ForegroundColor Cyan
Write-Host "  Node RPC:     ws://localhost:9944" -ForegroundColor White
Write-Host "  Indexer:      http://localhost:8088" -ForegroundColor White
Write-Host "  Proof Server: http://localhost:6300" -ForegroundColor White
Write-Host ""
Write-Host "📝 Useful Commands:" -ForegroundColor Cyan
Write-Host "  View logs:    wsl bash -c 'cd ~/midnight-local-network && docker compose logs -f'" -ForegroundColor Gray
Write-Host "  Stop network: wsl bash -c 'cd ~/midnight-local-network && docker compose down'" -ForegroundColor Gray
Write-Host "  Restart:      .\start-network.ps1" -ForegroundColor Gray
Write-Host ""
Write-Host "👉 Next: Build and deploy your contract with: .\deploy-contract.ps1" -ForegroundColor Yellow
Write-Host ""
