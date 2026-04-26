import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, FileText, Globe, Shield, ExternalLink, Loader2, List, ChevronRight, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [records, setRecords] = useState([]);
  const [uploadResult, setUploadResult] = useState(null);
  const [isMock, setIsMock] = useState(true);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await axios.get(`${API_URL}/records`);
      setRecords(response.data.records);
    } catch (err) {
      console.error("Failed to fetch records", err);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setStatus('Processing data...');
    const formData = new FormData();
    formData.append('isMock', isMock);
    formData.append('file', file);
    try {
      const response = await axios.post(`${API_URL}/upload`, formData);
      setUploadResult(response.data);
      setStatus('Success');
      fetchRecords();
    } catch (err) {
      console.error(err);
      setStatus('Error: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <header style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: '600', letterSpacing: '-0.02em' }}>LibreAudit</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Immutable RFID Access Ledger</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.25rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <button 
                onClick={() => setIsMock(false)}
                className="btn" 
                style={{ 
                  padding: '0.4rem 0.8rem', 
                  fontSize: '0.75rem', 
                  background: !isMock ? 'var(--accent)' : 'transparent',
                  color: !isMock ? '#000' : 'var(--text-muted)',
                  border: 'none',
                  fontWeight: '600'
                }}
              >
                Production
              </button>
              <button 
                onClick={() => setIsMock(true)}
                className="btn" 
                style={{ 
                  padding: '0.4rem 0.8rem', 
                  fontSize: '0.75rem', 
                  background: isMock ? 'var(--primary)' : 'transparent',
                  color: isMock ? 'var(--bg)' : 'var(--text-muted)',
                  border: 'none',
                  fontWeight: '600'
                }}
              >
                Simulation
              </button>
            </div>
          </div>
        </header>

        <main>
          <section style={{ marginBottom: '4rem' }}>
            <label className="upload-zone" style={{ display: 'block' }}>
              <input type="file" onChange={handleFileChange} accept=".xlsx, .xls" />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '1rem', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
                  <Database size={24} color={file ? 'var(--accent)' : 'var(--text-muted)'} />
                </div>
                <div>
                  {file ? (
                    <p style={{ fontWeight: '500' }}>{file.name}</p>
                  ) : (
                    <p style={{ color: 'var(--text-muted)' }}>Upload RFID Sheet for Blockchain Anchoring</p>
                  )}
                </div>
              </div>
            </label>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', gap: '1rem', alignItems: 'center' }}>
              {status && status !== 'Success' && (
                <span className="status-text" style={{ color: 'var(--accent)' }}>{status}</span>
              )}
              <button 
                className="btn btn-primary" 
                onClick={handleUpload} 
                disabled={!file || loading}
                style={{ background: isMock ? 'var(--primary)' : 'var(--accent)', color: isMock ? '#000' : '#000' }}
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : (isMock ? 'Simulate Audit' : 'Anchor to Blockchain')}
              </button>
            </div>
          </section>

          <AnimatePresence>
            {uploadResult && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="sleek-card"
                style={{ marginBottom: '4rem', background: 'rgba(255,255,255,0.02)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Latest {uploadResult.isMock ? 'Simulation' : 'Deployment'}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>Confirmed</span>
                </div>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>CID</span>
                    <a href={`https://gateway.pinata.cloud/ipfs/${uploadResult.cid}`} target="_blank" className="mono" style={{ color: '#fff', textDecoration: 'none', fontSize: '0.85rem' }}>
                      {uploadResult.cid.slice(0, 12)}...{uploadResult.cid.slice(-4)} <ExternalLink size={12} style={{ marginLeft: '4px' }} />
                    </a>
                  </div>
                  {uploadResult.txHash && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Transaction</span>
                      <a href={`https://amoy.polygonscan.com/tx/${uploadResult.txHash}`} target="_blank" className="mono" style={{ color: '#fff', textDecoration: 'none', fontSize: '0.85rem' }}>
                        {uploadResult.txHash.slice(0, 12)}... <ExternalLink size={12} style={{ marginLeft: '4px' }} />
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <section>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: '500' }}>Access Ledger</h2>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{records.length} logs secured</span>
            </div>

            <div className="sleek-card" style={{ padding: '0' }}>
              <div style={{ overflowX: 'auto' }}>
                <table>
                  <thead>
                    <tr>
                      <th>Log Batch</th>
                      <th>Integrity Hash</th>
                      <th>Audit Date</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((record, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: '500' }}>{record.fileName}</td>
                        <td className="mono" style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                          {record.cid.slice(0, 8)}...
                        </td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                          {new Date(record.timestamp * 1000).toLocaleDateString()}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <a href={`https://gateway.pinata.cloud/ipfs/${record.cid}`} target="_blank" className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>
                            View <ChevronRight size={14} />
                          </a>
                        </td>
                      </tr>
                    ))}
                    {records.length === 0 && (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                          No data recorded on-chain yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
