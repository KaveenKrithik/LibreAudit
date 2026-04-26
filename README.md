# ChainSheet 🚀

A decentralized pipeline to convert Excel data to JSON, upload to IPFS, and anchor the reference on the Polygon blockchain.

## 🌟 Features
- **Excel Processing**: Seamlessly converts `.xlsx` to JSON on the fly.
- **Decentralized Storage**: Automatically pins data to IPFS via Pinata.
- **On-Chain Registry**: Records the IPFS CID and metadata on a Polygon smart contract.
- **Premium UI**: Modern dashboard with glassmorphism and real-time status tracking.

## 🏗️ Architecture
1. **Frontend**: React (Vite) + Framer Motion + Lucide Icons.
2. **Backend**: Node.js (Express) + Multer + XLSX.
3. **Blockchain**: Solidity Smart Contract (Deployed with Hardhat).
4. **Storage**: IPFS (Pinata SDK).

---

## 🛠️ Setup Instructions

### 1. Smart Contract Deployment
1. Navigate to the `contracts` folder:
   ```bash
   cd contracts
   ```
2. Create a `.env` file:
   ```env
   AMOY_RPC_URL=https://rpc-amoy.polygon.technology
   PRIVATE_KEY=your_wallet_private_key
   ```
3. Compile and deploy:
   ```bash
   npx hardhat compile
   npx hardhat run scripts/deploy.js --network polygon_amoy
   ```
4. **Copy the deployed address.**

### 2. Backend Configuration
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Update your `.env` file with Pinata credentials and the contract address:
   ```env
   PINATA_API_KEY=your_key
   PINATA_SECRET_API_KEY=your_secret
   RPC_URL=https://rpc-amoy.polygon.technology
   PRIVATE_KEY=your_wallet_private_key
   CONTRACT_ADDRESS=your_deployed_contract_address
   ```
3. Start the server:
   ```bash
   node server.js
   ```

### 3. Frontend Execution
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

---

## 📂 Folder Structure
```text
ChainSheet/
├── backend/            # Express server & Excel logic
│   ├── uploads/        # Temporary storage
│   ├── server.js       # Main API
│   └── .env            # Backend config
├── frontend/           # React dashboard
│   ├── src/
│   │   ├── App.jsx     # Main UI logic
│   │   └── index.css   # Premium styling
│   └── package.json
└── contracts/          # Hardhat project
    ├── contracts/      # Registry.sol
    └── scripts/        # Deploy scripts
```

## 🧪 Testing
- Use the provided `sample.xlsx` in the `backend/` folder for your first upload.
- Ensure your wallet has some **Amoy MATIC** for gas fees.

---

## 🔐 Security & Optimization
- **Low Gas**: The contract only stores strings (CIDs) and basic metadata, minimizing storage costs.
- **Validation**: Backend validates file types and cleans data before IPFS upload.
- **Environment Safety**: Sensitive keys are managed via `.env` (ensure these are never committed).

---
*Created with ❤️ by Antigravity*
