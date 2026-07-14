import React, { useState, useRef } from 'react';
import { X, UploadSimple, FileCsv, CheckCircle, Warning, Table } from 'phosphor-react';
import { useToast } from '../context/ToastContext';
import { searchCards } from '../services/api';
import { addToVault } from '../services/vault';
import { useAuth } from '../context/AuthContext';

const BulkImportModal = ({ isOpen, onClose, onImportComplete }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, successful: 0, failed: 0 });
  const [results, setResults] = useState(null);
  const fileInputRef = useRef(null);
  const { addToast } = useToast();
  const { user } = useAuth();

  if (!isOpen) return null;

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'text/csv' || droppedFile.name.endsWith('.csv')) {
        setFile(droppedFile);
      } else {
        addToast('Please upload a valid CSV file', 'error');
      }
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const processCsvLine = (line) => {
    const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
    if (!matches) return [];
    return matches.map(m => m.replace(/^"|"$/g, '').trim());
  };

  const processFile = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const text = e.target.result;
        const lines = text.split('\n').filter(line => line.trim() !== '');
        
        if (lines.length < 2) {
          throw new Error('CSV file appears to be empty or missing headers');
        }

        const headers = processCsvLine(lines[0].toLowerCase());
        const nameIdx = headers.findIndex(h => h.includes('name') || h.includes('card'));
        const setIdx = headers.findIndex(h => h.includes('set') || h.includes('expansion'));
        const idIdx = headers.findIndex(h => h.includes('id'));
        
        if (nameIdx === -1 && idIdx === -1) {
          throw new Error('Could not find "Name" or "ID" column in CSV headers');
        }

        const itemsToProcess = lines.slice(1);
        setProgress({ current: 0, total: itemsToProcess.length, successful: 0, failed: 0 });
        
        const addedCards = [];
        const failedCards = [];

        for (let i = 0; i < itemsToProcess.length; i++) {
          const row = processCsvLine(itemsToProcess[i]);
          if (row.length === 0) continue;

          let cardToAdd = null;
          let searchTerm = '';

          if (idIdx !== -1 && row[idIdx]) {
             cardToAdd = { id: row[idIdx] };
          } 
          else if (nameIdx !== -1 && row[nameIdx]) {
            searchTerm = row[nameIdx];
            if (setIdx !== -1 && row[setIdx]) {
              searchTerm += ` ${row[setIdx]}`;
            }
            
            await new Promise(r => setTimeout(r, 400));
            
            const results = await searchCards(searchTerm);
            if (results && results.length > 0) {
              cardToAdd = results[0];
            }
          }

          if (cardToAdd) {
            try {
              await addToVault(cardToAdd.id, user?.uid, true);
              addedCards.push(searchTerm || cardToAdd.id);
              setProgress(p => ({ ...p, current: i + 1, successful: p.successful + 1 }));
            } catch (err) {
              failedCards.push({ name: searchTerm, reason: 'Failed to save to vault' });
              setProgress(p => ({ ...p, current: i + 1, failed: p.failed + 1 }));
            }
          } else {
            failedCards.push({ name: searchTerm, reason: 'Card not found in database' });
            setProgress(p => ({ ...p, current: i + 1, failed: p.failed + 1 }));
          }
        }

        setResults({ added: addedCards, failed: failedCards });
        if (onImportComplete) onImportComplete();
        addToast(`Import complete! Added ${addedCards.length} cards.`, 'success');
      } catch (err) {
        addToast(err.message, 'error');
      } finally {
        setIsProcessing(false);
      }
    };
    
    reader.onerror = () => {
      addToast('Error reading file', 'error');
      setIsProcessing(false);
    };
    
    reader.readAsText(file);
  };

  const resetState = () => {
    setFile(null);
    setResults(null);
    setProgress({ current: 0, total: 0, successful: 0, failed: 0 });
  };

  return (
    <>
      <div
        onClick={!isProcessing ? onClose : undefined}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(31, 36, 33, 0.7)',
          backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
          zIndex: 1000, animation: 'fadeIn 0.2s ease-out',
        }}
      />
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)', zIndex: 1001,
        background: 'var(--bg-white)', borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-warm)',
        boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
        width: '100%', maxWidth: '600px',
        overflow: 'hidden', animation: 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        <div style={{
          padding: '24px 32px',
          borderBottom: '1px solid var(--border-warm)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <h2 style={{ fontSize: '1.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Table size={28} color="var(--accent-terracotta)" weight="duotone" />
            Bulk Import Collection
          </h2>
          {!isProcessing && (
            <button onClick={onClose} style={{
              background: 'var(--bg-secondary)', border: 'none', borderRadius: '50%',
              width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--text-secondary)'
            }}>
              <X size={16} weight="bold" />
            </button>
          )}
        </div>

        <div style={{ padding: '32px' }}>
          {!results && !isProcessing && (
            <>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${isDragging ? 'var(--accent-terracotta)' : 'var(--border-warm)'}`,
                  background: isDragging ? 'var(--accent-terracotta-tint)' : 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '60px 20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '16px'
                }}
              >
                <input
                  type="file"
                  accept=".csv"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileSelect}
                />
                
                {file ? (
                  <>
                    <FileCsv size={48} color="var(--accent-terracotta)" weight="duotone" />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '4px' }}>{file.name}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{(file.size / 1024).toFixed(1)} KB</div>
                    </div>
                  </>
                ) : (
                  <>
                    <UploadSimple size={48} color="var(--text-muted)" weight="duotone" />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '4px' }}>
                        Click or drag CSV file to upload
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        Required columns: "Name" or "ID". Optional: "Set"
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '32px' }}>
                <button onClick={onClose} className="btn-outline">Cancel</button>
                <button 
                  onClick={processFile} 
                  className="btn-primary"
                  disabled={!file}
                  style={{ opacity: !file ? 0.5 : 1 }}
                >
                  Start Import
                </button>
              </div>
            </>
          )}

          {isProcessing && (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{
                width: '64px', height: '64px', margin: '0 auto 24px',
                border: '3px solid var(--border-warm)', borderTopColor: 'var(--accent-terracotta)',
                borderRadius: '50%', animation: 'spin 1s linear infinite'
              }} />
              <h3 style={{ marginBottom: '8px' }}>Processing Cards</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                Analyzing and importing your collection...
              </p>
              
              <div style={{ 
                height: '8px', background: 'var(--bg-secondary)', 
                borderRadius: '4px', overflow: 'hidden', marginBottom: '12px'
              }}>
                <div style={{
                  height: '100%', background: 'var(--accent-terracotta)',
                  width: `${(progress.current / progress.total) * 100}%`,
                  transition: 'width 0.3s ease'
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <span>{progress.current} of {progress.total} processed</span>
                <span>{Math.round((progress.current / progress.total) * 100)}%</span>
              </div>
            </div>
          )}

          {results && !isProcessing && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <CheckCircle size={64} color="var(--success, #2e7d32)" weight="duotone" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Import Finished</h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Successfully added {results.added.length} cards to your portfolio.
                </p>
              </div>

              {results.failed.length > 0 && (
                <div style={{
                  background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)',
                  padding: '20px', maxHeight: '200px', overflowY: 'auto', marginBottom: '24px'
                }}>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--warning, #ed6c02)', marginBottom: '16px' }}>
                    <Warning size={20} weight="fill" />
                    {results.failed.length} cards could not be imported
                  </h4>
                  <ul style={{ margin: 0, padding: '0 0 0 24px', color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {results.failed.map((fail, i) => (
                      <li key={i}><strong>{fail.name || 'Unknown Row'}</strong> - {fail.reason}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                <button onClick={resetState} className="btn-outline">Import Another</button>
                <button onClick={onClose} className="btn-primary">View Portfolio</button>
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: translate(-50%, -45%) scale(0.95); } to { opacity: 1; transform: translate(-50%, -50%) scale(1); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
};

export default BulkImportModal;
