# Deploy Compact Contract to Midnight Local Network
# This script compiles and deploys the HTLC contract

param(
    [switch]$SkipBuild,
    [switch]$SkipNetworkCheck
)

Write-Host "🚀 Midnight HTLC Contract Deployment" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    pnpm install
    Write-Host ""
}

# Check network is running (unless skipped)
if (-not $SkipNetworkCheck) {
    Write-Host "🔍 Checking network services..." -ForegroundColor Yellow
    
    # Check Node RPC
    try {
        $nodeTest = Test-NetConnection -ComputerName localhost -Port 9944 -WarningAction SilentlyContinue
        if ($nodeTest.TcpTestSucceeded) {
            Write-Host "  ✓ Node RPC (9944)" -ForegroundColor Green
        } else {
            throw "Node not accessible"
        }
    } catch {
        Write-Host "  ❌ Node RPC (9944) not responding" -ForegroundColor Red
        Write-Host ""
        Write-Host "Please start the network first:" -ForegroundColor Yellow
        Write-Host "  .\start-network.ps1" -ForegroundColor Cyan
        exit 1
    }
    
    # Check Indexer
    try {
        $indexerTest = Test-NetConnection -ComputerName localhost -Port 8088 -WarningAction SilentlyContinue
        if ($indexerTest.TcpTestSucceeded) {
            Write-Host "  ✓ Indexer (8088)" -ForegroundColor Green
        }
    } catch {
        Write-Host "  ⚠ Indexer (8088) not responding" -ForegroundColor Yellow
    }
    
    # Check Proof Server
    try {
        $proofTest = Test-NetConnection -ComputerName localhost -Port 6300 -WarningAction SilentlyContinue
        if ($proofTest.TcpTestSucceeded) {
            Write-Host "  ✓ Proof Server (6300)" -ForegroundColor Green
        }
    } catch {
        Write-Host "  ⚠ Proof Server (6300) not responding" -ForegroundColor Yellow
    }
    
    Write-Host ""
}

# Build contract
if (-not $SkipBuild) {
    Write-Host "🔨 Building Compact contract..." -ForegroundColor Cyan
    
    # Check if compact file exists
    if (-not (Test-Path "src/contract.compact")) {
        Write-Host "❌ src/contract.compact not found!" -ForegroundColor Red
        exit 1
    }
    
    # Run build
    Write-Host "  Compiling: src/contract.compact" -ForegroundColor Gray
    pnpm run build
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Build failed!" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✓ Build successful" -ForegroundColor Green
    Write-Host ""
    
    # Check outputs
    Write-Host "📦 Build artifacts:" -ForegroundColor Cyan
    if (Test-Path "contracts/managed/htlc/contract.js") {
        $contractSize = (Get-Item "contracts/managed/htlc/contract.js").Length
        Write-Host "  ✓ contract.js ($([math]::Round($contractSize/1024, 2)) KB)" -ForegroundColor Green
    } else {
        Write-Host "  ❌ contract.js not found" -ForegroundColor Red
    }
    
    if (Test-Path "contracts/managed/htlc/zkir") {
        $zkirFiles = Get-ChildItem "contracts/managed/htlc/zkir" -Filter "*.zkir"
        Write-Host "  ✓ ZKIR files: $($zkirFiles.Count)" -ForegroundColor Green
        foreach ($file in $zkirFiles) {
            Write-Host "    - $($file.Name)" -ForegroundColor Gray
        }
    }
    Write-Host ""
}

# Deploy contract
Write-Host "🚀 Deploying contract to local network..." -ForegroundColor Cyan
Write-Host ""

# Run deployment script
pnpm run deploy

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "═══════════════════════════════════" -ForegroundColor Green
    Write-Host "✅ Deployment Complete!" -ForegroundColor Green
    Write-Host "═══════════════════════════════════" -ForegroundColor Green
    Write-Host ""
    
    # Check for deployment output
    if (Test-Path "LOCAL_DEPLOYMENT.json") {
        Write-Host "📄 Deployment details saved to: LOCAL_DEPLOYMENT.json" -ForegroundColor Cyan
        $deployment = Get-Content "LOCAL_DEPLOYMENT.json" | ConvertFrom-Json
        Write-Host ""
        Write-Host "📝 Contract Details:" -ForegroundColor Cyan
        Write-Host "  Address: $($deployment.contractAddress)" -ForegroundColor White
        Write-Host "  Network: $($deployment.network)" -ForegroundColor White
        Write-Host ""
    }
    
    Write-Host "👉 Next steps:" -ForegroundColor Yellow
    Write-Host "  1. Start frontend: cd frontend && pnpm run dev" -ForegroundColor Gray
    Write-Host "  2. Open browser: http://localhost:5173" -ForegroundColor Gray
    Write-Host "  3. Connect Lace wallet and interact with contract" -ForegroundColor Gray
} else {
    Write-Host ""
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Troubleshooting:" -ForegroundColor Yellow
    Write-Host "  1. Check network is running: docker ps" -ForegroundColor Gray
    Write-Host "  2. View network logs: wsl bash -c 'cd ~/midnight-local-network && docker compose logs'" -ForegroundColor Gray
    Write-Host "  3. Restart network: .\start-network.ps1" -ForegroundColor Gray
}

Write-Host ""
