# 🌙 Midnight HTLC - Privacy-Preserving Hash Time-Locked Contracts

Link of the Demo Video    https://drive.google.com/drive/folders/1LiCRKPeUqDwpVdPtUsF5wlxNXowqBLqx?usp=drive_link
Contract Address -     htlc_edff3c023440ffa02ef2c0e72df13410



Website screenshots   <img width="1888" height="818" alt="image" src="https://github.com/user-attachments/assets/64d8f177-e42d-4a1d-8358-7a7b036b02f6" />












![Midnight Network](https://img.shields.io/badge/Built%20on-Midnight%20Network-6366f1)
![Compact Language](https://img.shields.io/badge/Smart%20Contract-Compact-10b981)
![React](https://img.shields.io/badge/Frontend-React%2018-61dafb)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178c6)

A decentralized application implementing **Hash Time-Locked Contracts (HTLC)** using zero-knowledge proofs on the Midnight blockchain. This project demonstrates secure, privacy-preserving digital envelopes where funds or data can be locked with a cryptographic hash and only unlocked by revealing the correct secret.

---

## 🎯 What is HTLC?

**Hash Time-Locked Contracts** enable trustless conditional payments:

- **Alice** wants to send something valuable to **Bob**
- **Bob** must prove he knows a secret (without revealing it publicly)
- The contract locks the envelope with a **hash** of Bob's secret
- Bob claims it by providing the **original secret**
- The blockchain **verifies** the secret matches using **zero-knowledge proofs**

### Real-World Use Cases:
✅ **Cross-chain atomic swaps** - Exchange assets between blockchains without intermediaries  
✅ **Payment channels** - Lightning Network-style instant payments  
✅ **Escrow services** - Conditional fund release based on secret knowledge  
✅ **Privacy-preserving crowdfunding** - Unlock funds only when conditions are met  

---

## ✨ Features

### 🔐 Core Functionality
- **Generate Secrets**: Cryptographically secure random secrets with SHA-256 hashing
- **Create Envelopes**: Lock digital envelopes with secret hashes on-chain
- **Claim Envelopes**: Unlock envelopes by revealing the correct secret
- **Zero-Knowledge Verification**: Secrets are verified without public exposure

### 📊 Dashboard & Analytics
- Real-time contract state visualization
- Transaction history with expandable details
- Animated charts and statistics
- Server health monitoring with live status badge

### 🎨 Modern UI/UX
- **Glassmorphism Design**: Frosted glass effects with backdrop blur
- **Mesh Gradient Background**: Animated multi-layer gradients
- **Smooth Animations**: Floating logos, pulse effects, confetti celebrations
- **Dark/Light Theme**: Toggle between themes with smooth transitions
- **Responsive Design**: Mobile-friendly interface

### 🛠️ Advanced Tools
- **QR Code Generator**: Share envelope details via QR codes
- **Batch Operations**: Create/claim multiple envelopes at once
- **Template System**: Save and reuse common configurations
- **Export/Import**: Download transaction history as CSV
- **Copy-to-Clipboard**: One-click copying with visual feedback
- **Real-time Validation**: Instant feedback on hash formats and inputs

---

## 🏗️ Architecture

### Smart Contract (`src/contract.compact`)
Written in **Compact language** - Midnight's domain-specific language for zero-knowledge smart contracts.

```compact
circuit createEnvelope(secretHash: Digest<Bytes<32>>): Void
circuit claimEnvelope(secret: Bytes<32>, expectedHash: Digest<Bytes<32>>): Void
query getLastSecretHash(): Digest<Bytes<32>>
```

**Compilation Process:**
1. Compact source → ZK circuits (ZKIR files)
2. Generate cryptographic keys (proving/verifying)
3. Compile to JavaScript module for deployment

### Frontend Stack
- **React 18** with TypeScript
- **Vite** for blazing-fast builds
- **Axios** for API communication
- **CSS3** animations and glassmorphism effects
- **Web Crypto API** for client-side secret generation

### Backend Runtime (`local-runtime/server.js`)
- **Express.js** REST API on port 3000
- **In-memory state** management for local development
- **SHA-256** hashing with Node.js crypto module
- **Transaction history** tracking and export

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18.x or higher
- **pnpm** (or npm/yarn)
- **Git** for version control

### 1️⃣ Clone Repository
```bash
git clone https://github.com/Yogiiitnr/Midnightlockedenvelope.git
cd Midnightlockedenvelope
```

### 2️⃣ Install Dependencies
```bash
# Install root dependencies
pnpm install

# Install frontend dependencies
cd frontend
pnpm install
cd ..
```

### 3️⃣ Compile Smart Contract
```bash
pnpm run build
```
This generates:
- `contracts/managed/htlc/contract.js` - Compiled contract module
- `contracts/managed/htlc/zkir/*.zkir` - Zero-knowledge circuits
- `contracts/managed/htlc/keys/` - Cryptographic keys

### 4️⃣ Start Backend Server
```bash
# In project root
node local-runtime/server.js
```
Backend runs on **http://localhost:3000**

### 5️⃣ Start Frontend (New Terminal)
```bash
cd frontend
pnpm run dev
```
Frontend runs on **http://localhost:5173**

### 6️⃣ Open Browser
Navigate to **http://localhost:5173** and start using the application!

---

## 📖 Usage Guide

### Creating an Envelope

1. **Navigate to "Create Envelope" tab**
2. **Click "Generate Secret"** - Creates a random 64-character hex secret and its SHA-256 hash
3. **Copy the secret** (store it securely!) and the hash
4. **Fill in details**:
   - Amount (optional)
   - Recipient address (optional)
   - Notes (optional)
5. **Click "Create Envelope"** 
6. **Celebrate!** 🎉 - Confetti animation on success

### Claiming an Envelope

1. **Navigate to "Claim Envelope" tab**
2. **Paste the secret** you received
3. **Paste the expected hash** 
4. **Click "Claim Envelope"**
5. **Verification happens** - Backend hashes the secret and compares
6. **Success!** 🎊 - Envelope unlocked

### Dashboard Overview

- **Contract State**: View current secret hash and total transactions
- **Server Status**: Real-time health monitoring with pulse animation
- **Transaction Stats**: Visualize envelope activity

### Recent Transactions

- Expandable transaction cards with full details
- Copy buttons for all hashes and secrets
- Timestamps and status indicators
- Export to CSV for record-keeping

### QR Code Sharing

- Generate QR codes for envelope details
- Share secrets securely via QR scanning
- Customize QR code size and format

### Batch Operations

- Create multiple envelopes at once
- Claim multiple envelopes in one transaction
- Progress tracking and error handling

---

## 📁 Project Structure

```
Midnightlockedenvelope/
├── src/
│   ├── contract.compact              # Compact smart contract source
│   ├── htlc-contract.ts              # Contract TypeScript interface
│   └── deploy-local.ts               # Local deployment script
│
├── contracts/managed/htlc/
│   ├── contract.js                   # Compiled contract module
│   ├── zkir/                         # Zero-knowledge circuits
│   │   ├── createEnvelope.zkir
│   │   ├── claimEnvelope.zkir
│   │   └── getLastSecretHash.zkir
│   └── keys/                         # Cryptographic keys
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx                   # Main application
│   │   ├── index.css                 # Styling with animations
│   │   ├── components/               # React components
│   │   │   ├── ContractDeployment.tsx
│   │   │   ├── EnvelopeDashboard.tsx
│   │   │   ├── QRCodeGenerator.tsx
│   │   │   ├── RecentTransactions.tsx
│   │   │   ├── BatchOperations.tsx
│   │   │   ├── TemplateSelector.tsx
│   │   │   ├── ThemeToggle.tsx
│   │   │   └── CopyButton.tsx
│   │   ├── midnight/                 # Midnight SDK utilities
│   │   │   ├── api.ts
│   │   │   ├── providers.ts
│   │   │   └── types.ts
│   │   └── utils/                    # Helper functions
│   └── public/
│       └── LOCAL_DEPLOYMENT.json     # Deployment configuration
│
├── local-runtime/
│   └── server.js                     # Express API server
│
├── scripts/
│   └── mock-compile.js               # Mock compilation script
│
├── compact.json                      # Compact compiler config
├── package.json                      # Project dependencies
├── tsconfig.json                     # TypeScript configuration
├── VIDEO_SCRIPT.md                   # Video recording script
├── PROJECT_CONCEPT.md                # Technical documentation
└── README.md                         # This file
```

---

## 🔧 API Endpoints

### Backend Server (Port 3000)

#### `GET /health`
Returns server health status and statistics
```json
{
  "status": "healthy",
  "contract": "HTLC",
  "uptime": 25330.32,
  "transactions": 8
}
```

#### `GET /generateSecret`
Generates a random secret and its SHA-256 hash
```json
{
  "secret": "e6531821d3b8430299ef...",
  "hash": "73b5b08433cb84a21806...",
  "note": "Store the secret securely!"
}
```

#### `POST /createEnvelope`
Creates a new envelope with a secret hash
```json
// Request
{
  "secretHash": "73b5b08433cb84a21806..."
}

// Response
{
  "success": true,
  "txId": "local-tx-1770920511370-7",
  "secretHash": "73b5b08433cb84a21806...",
  "message": "Envelope created successfully"
}
```

#### `POST /claimEnvelope`
Claims an envelope by revealing the secret
```json
// Request
{
  "secret": "e6531821d3b8430299ef...",
  "expectedHash": "73b5b08433cb84a21806..."
}

// Response
{
  "success": true,
  "txId": "local-tx-1770920522704-8",
  "message": "Envelope claimed successfully",
  "verified": true
}
```

#### `GET /state`
Returns current contract state
```json
{
  "lastSecretHash": "17f239506bd597eb...",
  "totalTransactions": 8
}
```

#### `GET /transactions`
Returns transaction history
```json
[
  {
    "txId": "local-tx-...",
    "type": "create",
    "secretHash": "...",
    "timestamp": "2026-02-13T10:30:00.000Z"
  }
]
```

---

## 🎨 Visual Features

### Animated Background
- **Multi-layer mesh gradient** with 4 radial gradients (teal, blue, indigo, purple)
- **20-second animation loop** with smooth translate and scale transforms
- **GPU-accelerated** for optimal performance

### Glassmorphism Effects
- **Backdrop blur** (12px) with 180% saturation
- **75% opacity** for frosted glass appearance
- **Smooth transitions** on all interactive elements

### Animations
- **🌙 Floating Midnight logo** - Continuous float animation
- **✅ Pulsing server status** - Live health indicator
- **🎊 Confetti celebration** - Success feedback
- **✨ Glow effects** - Hover interactions on buttons

### Branding
- **Midnight Network logo** - Custom SVG with crescent moon and stars
- **"Built with Compact" badge** - Green gradient with checkmark
- **Enhanced footer** - Three-section layout with logos and status

---

## 🛠️ Technical Details

### Smart Contract Compilation

The Compact compiler transforms high-level contract code into zero-knowledge circuits:

```bash
# Compile with Compact compiler
pnpm run build

# Generates:
# - contracts/managed/htlc/contract.js     (JavaScript module)
# - contracts/managed/htlc/zkir/*.zkir    (ZK circuits)
# - contracts/managed/htlc/keys/*         (Proving/verifying keys)
```

### Zero-Knowledge Proofs

- **Circuit Generation**: Compact → ZKIR (Zero-Knowledge Intermediate Representation)
- **Proof Generation**: Client-side proof generation with privacy preservation
- **Verification**: On-chain verification without revealing secrets
- **Hash Function**: SHA-256 for secret hashing

### Security Features

✅ **Client-side secret generation** - Secrets never leave your browser  
✅ **Cryptographically secure randomness** - Web Crypto API  
✅ **Zero-knowledge verification** - Secrets verified without public exposure  
✅ **Hash validation** - 64-character hex format enforced  
✅ **CORS protection** - API security headers  
✅ **Input sanitization** - XSS prevention  

---

## 🚢 Deployment Options

### Option 1: Local Development (Current Setup)
- ✅ **No blockchain required** - Runs on local Express server
- ✅ **Instant testing** - No transaction delays
- ✅ **Free** - No gas fees or tokens needed
- ✅ **Perfect for development** - Fast iteration

**Start Local Server:**
```bash
node local-runtime/server.js
```

### Option 2: Midnight Local Network (Docker)
- Requires Docker Desktop with WSL2
- Full blockchain simulation
- Indexer and proof server
- Wallet integration with Lace

**Setup Instructions:** See [DOCKER_SETUP.md](DOCKER_SETUP.md)

### Option 3: Midnight Testnet
- Real blockchain deployment
- Requires testnet tokens
- Full ZK proof generation
- Production-like environment

**Setup Instructions:** See [SIMPLIFIED_DEPLOYMENT_GUIDE.md](SIMPLIFIED_DEPLOYMENT_GUIDE.md)

---

## 🐛 Troubleshooting

### Frontend Not Starting

**Problem:** Port 5173 already in use  
**Solution:**
```powershell
# Find and kill process on port 5173
Get-NetTCPConnection -LocalPort 5173 | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force }

# Restart frontend
cd frontend
pnpm run dev
```

### Backend API Errors

**Problem:** "Cannot POST /generateSecret"  
**Solution:** Change `axios.post` to `axios.get` - `/generateSecret` is a GET endpoint

**Problem:** Server not responding  
**Solution:**
```bash
# Verify server is running
Test-NetConnection -ComputerName localhost -Port 3000

# Restart server
node local-runtime/server.js
```

### Hash Validation Errors

**Problem:** "Invalid hash format"  
**Solution:** Ensure hash is 64-character hexadecimal (SHA-256 output)

**Problem:** "Hash not found"  
**Solution:** Verify backend is running and accessible

### Compilation Errors

**Problem:** Contract compilation fails  
**Solution:**
```bash
# Clean and rebuild
rm -rf contracts/managed
pnpm run build

# Check Node.js version
node --version  # Should be 18.x or higher
```

---

## 📚 Additional Documentation

- **[VIDEO_SCRIPT.md](VIDEO_SCRIPT.md)** - Complete video recording script (2-3 minutes)
- **[PROJECT_CONCEPT.md](PROJECT_CONCEPT.md)** - Deep dive into HTLC concept and architecture
- **[VISUAL_ENHANCEMENTS.md](VISUAL_ENHANCEMENTS.md)** - UI/UX design documentation
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Comprehensive troubleshooting guide
- **[QUICKSTART.md](QUICKSTART.md)** - Quick setup guide for developers
- **[DOCKER_SETUP.md](DOCKER_SETUP.md)** - Docker deployment instructions

---

## 🧪 Testing

### Test Backend Endpoints

```powershell
# Test health endpoint
Invoke-WebRequest -Uri http://localhost:3000/health -Method GET

# Test secret generation
Invoke-WebRequest -Uri http://localhost:3000/generateSecret -Method GET

# Test envelope creation
$body = @{secretHash = "73b5b08433cb84a21806628a7030960434342a869fdfbeec561f034da2509788"} | ConvertTo-Json
Invoke-WebRequest -Uri http://localhost:3000/createEnvelope -Method POST -Body $body -ContentType "application/json"

# Test state retrieval
Invoke-WebRequest -Uri http://localhost:3000/state -Method GET
```

### Manual Testing Checklist

- [ ] Generate secret successfully
- [ ] Copy buttons work with visual feedback
- [ ] Create envelope with valid hash
- [ ] Claim envelope with correct secret
- [ ] Dashboard shows updated state
- [ ] Recent transactions display correctly
- [ ] QR code generation works
- [ ] Export CSV functionality
- [ ] Theme toggle switches correctly
- [ ] Animations perform smoothly

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Maintain existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all endpoints are tested

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🌟 Acknowledgments

- **[Midnight Network](https://midnight.network/)** - Privacy-focused blockchain platform
- **[Compact Language](https://docs.midnight.network/develop/compact)** - ZK smart contract language
- **React Team** - Frontend framework
- **Vite Team** - Build tool
- **Community Contributors** - Thank you for your support!

---

## 📞 Contact & Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/Yogiiitnr/Midnightlockedenvelope/issues)
- **Documentation**: [Midnight Docs](https://docs.midnight.network/)
- **Community**: [Midnight Discord](https://discord.gg/midnight)

---

## 🎬 Demo Video

Watch the full demo video showcasing all features: [Coming Soon]

---

## 🔮 Future Enhancements

- [ ] Multi-signature envelope support
- [ ] Time-lock functionality (release after specific time)
- [ ] NFT-based envelope identifiers
- [ ] Mobile app version
- [ ] Integration with other Midnight dApps
- [ ] Mainnet deployment
- [ ] Advanced analytics dashboard
- [ ] Email notifications for claims

---

## ⚡ Performance Optimizations

- **GPU Acceleration**: CSS transforms use `translateZ(0)` and `backface-visibility: hidden`
- **Smooth Scrolling**: Optimized scroll behavior with `scroll-behavior: smooth`
- **Will-change Properties**: Strategic use for animated elements
- **Code Splitting**: Lazy loading of components with React.lazy()
- **Memoization**: React.memo() for expensive components
- **Debouncing**: Input validation debounced for better UX

---

<div align="center">

### Built with ❤️ using Midnight Network & Compact Language

**⭐ Star this repository if you find it helpful!**

[Report Bug](https://github.com/Yogiiitnr/Midnightlockedenvelope/issues) · [Request Feature](https://github.com/Yogiiitnr/Midnightlockedenvelope/issues) · [Documentation](https://docs.midnight.network/)

</div>
