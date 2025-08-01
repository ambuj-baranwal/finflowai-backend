import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import documentService from '../services/documentService';
import './AIFeaturePage.css';

const AIFeaturePage = ({ featureName, onGenerate }) => {
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    documentService.getDocuments()
      .then(res => setDocuments(res.data.documents))
      .catch(console.error);
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!selectedDoc) return;
    
    setLoading(true);
    setResult(null);
    try {
      const res = await onGenerate(selectedDoc);
      setResult(res.data);
    } catch (error) {
      console.error(`${featureName} generation failed:`, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-feature-page-container">
      <Sidebar />
      <main className="ai-feature-main-content">
        <header className="ai-feature-header">
          <h1>{featureName} Generator</h1>
        </header>
        
        <form onSubmit={handleGenerate} className="generation-form">
          <select 
            value={selectedDoc} 
            onChange={(e) => setSelectedDoc(e.target.value)}
            className="document-select"
            required
          >
            <option value="" disabled>Select a document</option>
            {documents.map(doc => (
              <option key={doc._id} value={doc._id}>{doc.title}</option>
            ))}
          </select>
          <button type="submit" className="generate-button" disabled={loading || !selectedDoc}>
            {loading ? 'Generating...' : `Generate ${featureName}`}
          </button>
        </form>

        <div className="result-viewer">
          {loading && <p>Generating your visualization...</p>}
          {result ? (
            <pre className="result-output">
              {JSON.stringify(result, null, 2)}
            </pre>
          ) : (
            <p className="placeholder-text">
              Your generated {featureName.toLowerCase()} will appear here.
              <br />
              (For now, we're just showing the raw JSON data.)
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default AIFeaturePage;