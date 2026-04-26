const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const pinataSDK = require('@pinata/sdk');
const { ethers } = require('ethers');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

// Pinata Initialization
const pinata = new pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_SECRET_API_KEY);

// Smart Contract Setup
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contractABI = [
    "function recordFile(string memory _cid, string memory _fileName) public",
    "function getAllRecords() public view returns (tuple(string cid, string fileName, uint256 timestamp, address uploader)[])",
    "event FileUploaded(string cid, string fileName, address indexed uploader, uint256 timestamp)"
];
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS || ethers.ZeroAddress, contractABI, wallet);

// Simulated records storage (in-memory for demo)
let simulatedRecords = [];

app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const filePath = req.file.path;
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        const options = {
            pinataMetadata: { name: `${req.file.originalname.split('.')[0]}.json` },
        };

        const result = await pinata.pinJSONToIPFS(jsonData, options);
        const cid = result.IpfsHash;

        // Record Logic
        let txHash = null;
        const isMock = String(req.body.isMock) === 'true' || process.env.MOCK_MODE === 'true';

        if (isMock) {
            txHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
            // Add to simulated memory
            simulatedRecords.push({
                cid,
                fileName: req.file.originalname,
                timestamp: Math.floor(Date.now() / 1000),
                uploader: '0xSIMULATED_USER'
            });
        } else if (process.env.CONTRACT_ADDRESS) {
            const tx = await contract.recordFile(cid, req.file.originalname);
            await tx.wait();
            txHash = tx.hash;
        }

        fs.unlinkSync(filePath);
        res.json({ success: true, cid, fileName: req.file.originalname, txHash, data: jsonData, isMock });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/records', async (req, res) => {
    try {
        let blockchainRecords = [];
        if (process.env.CONTRACT_ADDRESS && process.env.CONTRACT_ADDRESS !== '') {
            const records = await contract.getAllRecords();
            blockchainRecords = records.map(r => ({
                cid: r.cid,
                fileName: r.fileName,
                timestamp: Number(r.timestamp),
                uploader: r.uploader
            }));
        }
        
        // Combine real and simulated records
        const allRecords = [...simulatedRecords, ...blockchainRecords].sort((a, b) => b.timestamp - a.timestamp);
        res.json({ records: allRecords });
    } catch (error) {
        console.error('Fetch error:', error);
        res.json({ records: simulatedRecords }); // Fallback to simulated if blockchain fails
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
