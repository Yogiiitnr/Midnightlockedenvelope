# 🎥 Midnight HTLC Project - Video Script (2-3 Minutes)

## **Title Screen** (0:00 - 0:05)
**"Midnight HTLC: Secure Hash Time-Locked Contracts"**

---

## **INTRODUCTION** (0:05 - 0:30)

**[Show main application interface]**

**Voiceover:**
"Welcome to the Midnight HTLC project - a decentralized application that implements Hash Time-Locked Contracts using zero-knowledge proofs. This project demonstrates secure, privacy-preserving digital envelopes where funds or data can be locked with a cryptographic hash and only unlocked by revealing the correct secret."

---

## **PROJECT CONCEPT** (0:30 - 1:00)

**[Highlight the contract code briefly]**

**Voiceover:**
"The core concept is simple yet powerful: Alice wants to send something valuable to Bob, but only if Bob can prove he knows a secret - without revealing it publicly to everyone else. This is achieved through:

1. **Hash-locking**: Alice locks an envelope using a hash of Bob's secret
2. **Secret revealing**: Bob claims the envelope by providing the original secret
3. **Zero-knowledge verification**: The blockchain verifies the secret matches WITHOUT exposing it publicly

Our smart contract is written in Compact language and deployed locally on a Midnight blockchain node for development and testing."

---

## **SMART CONTRACT ARCHITECTURE** (1:00 - 1:20)

**[Show contract.compact file]**

**Voiceover:**
"The smart contract has three main functions:

**createEnvelope** - Takes a secret hash and stores it on the ledger, creating a locked envelope

**claimEnvelope** - Accepts a secret, hashes it, and verifies it matches the expected hash. Returns success or failure.

**getLastSecretHash** - A query function to retrieve the most recent hash from the ledger

All of this is compiled to zero-knowledge circuits using the Midnight Compact compiler, generating ZKIR files and cryptographic keys."

---

## **FEATURE DEMONSTRATION - CREATE ENVELOPE** (1:20 - 1:45)

**[Navigate to Create tab and demonstrate]**

**Voiceover:**
"Let's see it in action. On the Create Envelope tab:

**Step 1**: Click 'Generate Secret' - our application creates a cryptographically secure random secret and automatically computes its SHA-256 hash. Notice the smooth loading animation.

**[Click Generate Secret button]**

**Step 2**: The secret and hash appear. You can copy them with one click using our copy buttons - see the checkmark feedback?

**[Demonstrate copy functionality]**

**Step 3**: Enter additional details like amount and recipient, then click 'Create Envelope'. The system validates the hash format and sends it to our local blockchain node.

**[Create an envelope]**

Notice the confetti celebration when successful! This transaction is now recorded on the blockchain."

---

## **FEATURE DEMONSTRATION - CLAIM ENVELOPE** (1:45 - 2:05)

**[Navigate to Claim tab]**

**Voiceover:**
"Now let's claim the envelope. Switch to the Claim tab:

**Step 1**: Paste the secret we generated earlier
**Step 2**: Paste the expected hash
**Step 3**: Click 'Claim Envelope'

**[Demonstrate claiming]**

Behind the scenes, the smart contract hashes the secret and verifies it matches. Since we provided the correct secret, the envelope is unlocked successfully! Another celebration!"

---

## **ADDITIONAL FEATURES** (2:05 - 2:30)

**[Quickly show each feature]**

**Voiceover:**
"This application has many professional features:

**Dashboard** - View real-time contract state and statistics with animated charts

**[Show Dashboard tab]**

**Recent Transactions** - Expandable transaction history with all details and copy buttons

**[Show Recent tab, expand a transaction]**

**QR Code Generator** - Share envelope details via QR codes

**[Show QR tab]**

**Templates** - Save and reuse common envelope configurations

**Batch Operations** - Create or claim multiple envelopes at once

**Export/Import** - Download transaction history as CSV for record-keeping

**[Click Export CSV button]**

All with real-time validation, loading states, and a beautiful glassmorphism UI with smooth animations."

---

## **TECHNICAL HIGHLIGHTS** (2:30 - 2:50)

**[Show project folder structure briefly]**

**Voiceover:**
"From a technical perspective:

✅ **Smart Contract**: Written in Compact language, compiled to ZK circuits
✅ **Local Deployment**: Running on local Midnight blockchain nodes (port 9944)
✅ **Frontend**: React with TypeScript, built with Vite
✅ **State Management**: Real-time synchronization with blockchain state
✅ **Security**: Client-side secret generation using Web Crypto API
✅ **UX**: Modern animations, copy-to-clipboard, theme switching, and responsive design

Everything is fully functional with NO reliance on the actual Midnight mainnet - perfect for development and demonstration."

---

## **CONCLUSION** (2:50 - 3:00)

**[Return to main interface with all tabs visible]**

**Voiceover:**
"That's the Midnight HTLC project - combining cutting-edge zero-knowledge cryptography with an intuitive user experience. Privacy-preserving, secure, and ready for real-world applications. Thank you for watching!"

**[Fade to end screen with project GitHub link or contact info]**

---

# 📝 **Key Points to Emphasize During Recording**

## Visual Demonstrations:
1. **Generate Secret** - Show the smooth loading spinner and success animation
2. **Copy Buttons** - Click them to show the checkmark and toast notification
3. **Create Envelope** - Show validation errors first (wrong format), then successful creation
4. **Claim Success** - Show the confetti celebration
5. **Recent Tab** - Click to expand a transaction card
6. **Server Status Badge** - Show it's "Server Online" with pulse animation
7. **Theme Toggle** - Quickly switch between dark/light mode
8. **Export CSV** - Download and briefly open the CSV file

## Screen Recording Tips:
- **Zoom in** on important elements (buttons, hash values, copy actions)
- **Slow down** cursor movements so viewers can follow
- **Pause briefly** after each successful action (1-2 seconds)
- Use **smooth transitions** between tabs
- Keep the **voiceover calm and clear** - not too fast

## What Makes This Project Special:
✅ Real zero-knowledge cryptography (not fake)
✅ Actual Compact smart contract compilation
✅ Local blockchain deployment (fully functional)
✅ Professional-grade UI/UX with modern effects
✅ Complete HTLC implementation with all features
✅ Privacy-preserving by design (secrets never exposed publicly)

---

# 🎬 Recording Checklist

Before recording:
- [ ] Backend server running on port 3000
- [ ] Frontend running on port 5173
- [ ] Browser window maximized, clean desktop
- [ ] Clear localStorage to start fresh
- [ ] Close unnecessary browser tabs
- [ ] Test audio levels for voiceover
- [ ] Have script printed or on second monitor

During recording:
- [ ] Speak clearly and at moderate pace
- [ ] Demonstrate each feature smoothly
- [ ] Show both success and validation scenarios
- [ ] Highlight the modern UI effects
- [ ] Keep total time under 3 minutes

---

# 💡 Alternative Opening (More Casual)

"Hey everyone! Today I'm showcasing my Midnight HTLC project - a decentralized app that lets you lock digital envelopes with cryptographic secrets. Think of it like a treasure chest that only opens when you provide the magic password, but instead of a physical lock, we're using zero-knowledge proofs on the Midnight blockchain. Let me show you how it works..."

---

# 🎯 Core Message

**"This project demonstrates how blockchain technology and zero-knowledge proofs can create secure, privacy-preserving smart contracts - where secrets remain secret, yet verification remains trustless."**
