#!/usr/bin/env node

/**
 * LOCAL RUNTIME SERVER - HTLC Contract
 * Simple HTTP server to interact with the HTLC contract locally
 * No blockchain needed - runs entirely in memory
 */

import { createServer } from 'http';
import { HTLCContract } from '../contracts/managed/htlc/contract.js';
import crypto from 'crypto';

// Initialize contract
const contract = new HTLCContract();

// Transaction history
const transactionHistory = [];
let transactionCounter = 0;

// Helper to generate transaction ID
function generateTxId() {
  transactionCounter++;
  return `local-tx-${Date.now()}-${transactionCounter}`;
}

// Helper to parse JSON from request
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        reject(e);
      }
    });
  });
}

// Create HTTP server
const server = createServer(async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;

  try {
    // Health check
    if (path === '/health' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'healthy',
        contract: 'HTLC',
        uptime: process.uptime(),
        transactions: transactionCounter
      }));
      return;
    }

    // Get contract state
    if (path === '/state' && req.method === 'GET') {
      const lastHash = await contract.ledger.state.lastSecretHash;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        lastSecretHash: Buffer.from(lastHash).toString('hex'),
        totalTransactions: transactionCounter
      }));
      return;
    }

    // Get last secret hash (query)
    if (path === '/getLastSecretHash' && req.method === 'GET') {
      const lastHash = await contract.ledger.state.lastSecretHash;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        secretHash: Buffer.from(lastHash).toString('hex'),
        isEmpty: Buffer.from(lastHash).every(b => b === 0)
      }));
      return;
    }

    // Create envelope
    if (path === '/createEnvelope' && req.method === 'POST') {
      const body = await parseBody(req);
      const { secretHash } = body;

      if (!secretHash) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'secretHash required' }));
        return;
      }

      // Convert hex string to Uint8Array
      const hashBytes = Buffer.from(secretHash, 'hex');
      if (hashBytes.length !== 32) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'secretHash must be 32 bytes (64 hex chars)' }));
        return;
      }

      const result = await contract.createEnvelope({}, new Uint8Array(hashBytes));
      const txId = generateTxId();

      transactionHistory.push({
        txId,
        type: 'createEnvelope',
        secretHash,
        timestamp: new Date().toISOString(),
        result
      });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        txId,
        secretHash,
        message: 'Envelope created successfully'
      }));
      return;
    }

    // Claim envelope
    if (path === '/claimEnvelope' && req.method === 'POST') {
      const body = await parseBody(req);
      const { secret, expectedHash } = body;

      if (!secret || !expectedHash) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'secret and expectedHash required' }));
        return;
      }

      // Convert hex strings to Uint8Array
      const secretBytes = Buffer.from(secret, 'hex');
      const expectedHashBytes = Buffer.from(expectedHash, 'hex');

      if (secretBytes.length !== 32 || expectedHashBytes.length !== 32) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'secret and expectedHash must be 32 bytes each' }));
        return;
      }

      const result = await contract.claimEnvelope(
        {},
        new Uint8Array(secretBytes),
        new Uint8Array(expectedHashBytes)
      );

      const txId = generateTxId();
      const success = result[0] === 1;

      transactionHistory.push({
        txId,
        type: 'claimEnvelope',
        secret: secret.substring(0, 16) + '...', // Partial secret for privacy
        expectedHash,
        success,
        timestamp: new Date().toISOString()
      });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success,
        txId,
        message: success ? 'Envelope claimed successfully' : 'Invalid secret - hash mismatch',
        verified: success
      }));
      return;
    }

    // Get transaction history
    if (path === '/transactions' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        transactions: transactionHistory,
        total: transactionCounter
      }));
      return;
    }

    // Helper endpoint - generate random secret
    if (path === '/generateSecret' && req.method === 'GET') {
      const secret = crypto.randomBytes(32);
      const hash = crypto.createHash('sha256').update(secret).digest();
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        secret: secret.toString('hex'),
        hash: hash.toString('hex'),
        note: 'Store the secret securely! You need it to claim the envelope.'
      }));
      return;
    }

    // 404 Not Found
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      error: 'Not found',
      availableEndpoints: [
        'GET  /health',
        'GET  /state',
        'GET  /getLastSecretHash',
        'POST /createEnvelope',
        'POST /claimEnvelope',
        'GET  /transactions',
        'GET  /generateSecret'
      ]
    }));

  } catch (error) {
    console.error('Error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }));
  }
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log('\n🚀 HTLC Local Runtime Server');
  console.log('================================');
  console.log(`Server running at: http://localhost:${PORT}`);
  console.log('');
  console.log('📋 Available Endpoints:');
  console.log(`  GET  http://localhost:${PORT}/health`);
  console.log(`  GET  http://localhost:${PORT}/state`);
  console.log(`  GET  http://localhost:${PORT}/getLastSecretHash`);
  console.log(`  POST http://localhost:${PORT}/createEnvelope`);
  console.log(`  POST http://localhost:${PORT}/claimEnvelope`);
  console.log(`  GET  http://localhost:${PORT}/transactions`);
  console.log(`  GET  http://localhost:${PORT}/generateSecret`);
  console.log('');
  console.log('🎯 Contract: Time-Locked Hash Envelopes (HTLC)');
  console.log('💾 Storage: In-memory (no blockchain required)');
  console.log('');
  console.log('Ready to accept requests! 🎉\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n📴 Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
