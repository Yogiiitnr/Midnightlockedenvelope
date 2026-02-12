# Clean up any existing containers
Write-Host "Cleaning up existing containers..."
docker rm -f node proof-server indexer 2>$null

# Pull images
Write-Host "`nPulling Midnight images..."
docker pull midnightntwrk/midnight-node:0.20.1
docker pull bricktowers/proof-server:7.0.0
docker pull midnightntwrk/indexer-standalone:3.0.0

# Start node
Write-Host "`nStarting Midnight node on port 9944..."
$nodeId = docker run -d --name node -p 9944:9944 -e CFG_PRESET=dev midnightntwrk/midnight-node:0.20.1
Write-Host "Node container ID: $nodeId"

# Start proof server
Write-Host "`nStarting proof server on port 6300..."
$proofId = docker run -d --name proof-server -p 6300:6300 bricktowers/proof-server:7.0.0
Write-Host "Proof server container ID: $proofId"

# Wait a bit for node to come up
Write-Host "`nWaiting for node to initialize..."
Start-Sleep -Seconds 10

# Start indexer (needs to connect to node)
Write-Host "`nStarting indexer on port 8088..."
$indexerId = docker run -d --name indexer -p 8088:8088 `
  -e RUST_LOG="indexer=info,chain_indexer=info,indexer_api=info,wallet_indexer=info" `
  -e APP__INFRA__SECRET="303132333435363738393031323334353637383930313233343536373839303132" `
  -e APP__INFRA__NODE__URL="ws://host.docker.internal:9944" `
  midnightntwrk/indexer-standalone:3.0.0
Write-Host "Indexer container ID: $indexerId"

# Check status
Write-Host "`n=== Container Status ==="
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

Write-Host "`n=== Testing Connectivity ==="
Write-Host "Node health endpoint: http://localhost:9944/health"
Write-Host "Proof server port: 6300"
Write-Host "Indexer API port: 8088"
